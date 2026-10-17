"""
News router
===========

Public read for published articles; admin write.
"""

from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field

from app.core.dependencies import get_optional_user, require_admin
from app.database.supabase import get_supabase_admin

router = APIRouter(prefix="/news", tags=["News"])


# ---------- Inline schemas ----------
class NewsCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=200)
    slug: str = Field(..., min_length=3, max_length=200)
    excerpt: str | None = None
    content: str = Field(..., min_length=10)
    cover_image: str | None = None
    is_published: bool = False


class NewsUpdate(BaseModel):
    title: str | None = None
    slug: str | None = None
    excerpt: str | None = None
    content: str | None = None
    cover_image: str | None = None
    is_published: bool | None = None


class NewsResponse(BaseModel):
    id: str
    title: str
    slug: str
    excerpt: str | None = None
    content: str | None = None
    cover_image: str | None = None
    author_id: str | None = None
    is_published: bool
    published_at: datetime | None = None
    created_at: datetime
    updated_at: datetime | None = None

    model_config = {"from_attributes": True}


# ============================================================
# POST /news (admin)
# ============================================================
@router.post(
    "",
    response_model=NewsResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a news article (admin)",
)
def create_news(payload: NewsCreate, admin: dict = Depends(require_admin)):
    sb = get_supabase_admin()
    data = payload.model_dump(exclude_unset=True)
    data["author_id"] = admin["id"]
    if data.get("is_published"):
        data["published_at"] = datetime.utcnow().isoformat()
    created = sb.table("news").insert(data).execute()
    return created.data[0]


# ============================================================
# GET /news
# ============================================================
@router.get("", response_model=list[NewsResponse], summary="List news articles")
def list_news(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=50),
    user: dict | None = Depends(get_optional_user),
):
    sb = get_supabase_admin()
    offset = (page - 1) * page_size

    query = sb.table("news").select("*")
    # Non-admins only see published
    is_admin = user and user.get("role") in ("admin", "super_admin")
    if not is_admin:
        query = query.eq("is_published", True)

    resp = (
        query.order("published_at", desc=True, nullsfirst=False)
        .range(offset, offset + page_size - 1)
        .execute()
    )
    return resp.data or []


# ============================================================
# GET /news/{news_id}
# ============================================================
@router.get("/{news_id}", response_model=NewsResponse, summary="Get a news article")
def get_news(news_id: str, user: dict | None = Depends(get_optional_user)):
    sb = get_supabase_admin()
    resp = sb.table("news").select("*").eq("id", news_id).limit(1).execute()
    if not resp.data:
        raise HTTPException(status_code=404, detail="News article not found")
    article = resp.data[0]
    is_admin = user and user.get("role") in ("admin", "super_admin")
    if not article.get("is_published") and not is_admin:
        raise HTTPException(status_code=404, detail="News article not found")
    return article


# ============================================================
# PUT /