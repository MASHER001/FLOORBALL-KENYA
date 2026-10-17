from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from app.modules.news import repository as repo
from app.modules.news import service
from app.modules.news.permissions import require_news_manager
from app.modules.news.schemas import NewsCreate, NewsPublic, NewsUpdate

router = APIRouter(tags=["News"])


@router.get("/news", response_model=list[NewsPublic])
def list_news(limit: int = 50, offset: int = 0):
    return repo.list_published(limit=limit, offset=offset)


@router.get("/news/{slug}", response_model=NewsPublic)
def get_article(slug: str):
    row = repo.get_by_slug(slug)
    if not row or row["status"] != "published":
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Article not found")
    return row


@router.post("/admin/news", response_model=NewsPublic,
             status_code=status.HTTP_201_CREATED)
def create_article(payload: NewsCreate, user=Depends(require_news_manager)):
    return service.create_article(payload, author_id=user["id"])


@router.patch("/admin/news/{article_id}", response_model=NewsPublic)
def update_article(article_id: UUID, payload: NewsUpdate,
                   user=Depends(require_news_manager)):
    return service.update_article(str(article_id), payload, actor_id=user["id"])


@router.post("/admin/news/{article_id}/publish", response_model=NewsPublic)
def publish_article(article_id: UUID, user=Depends(require_news_manager)):
    return service.publish_article(str(article_id), actor_id=user["id"])
