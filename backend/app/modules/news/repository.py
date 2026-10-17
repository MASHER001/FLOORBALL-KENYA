from typing import Any, Optional
from app.database.supabase import get_supabase_admin


def list_published(limit: int = 50, offset: int = 0) -> list[dict[str, Any]]:
    res = (
        get_supabase_admin().table("news_articles")
        .select("*").eq("status", "published")
        .order("published_at", desc=True)
        .range(offset, offset + limit - 1).execute()
    )
    return res.data or []


def get_by_slug(slug: str) -> Optional[dict[str, Any]]:
    res = (
        get_supabase_admin().table("news_articles")
        .select("*").eq("slug", slug).limit(1).execute()
    )
    return res.data[0] if res.data else None


def get_article(article_id: str) -> Optional[dict[str, Any]]:
    res = (
        get_supabase_admin().table("news_articles")
        .select("*").eq("id", article_id).limit(1).execute()
    )
    return res.data[0] if res.data else None


def insert_article(payload: dict[str, Any]) -> dict[str, Any]:
    res = get_supabase_admin().table("news_articles").insert(payload).execute()
    return res.data[0]


def update_article(article_id: str, patch: dict[str, Any]) -> Optional[dict[str, Any]]:
    res = (
        get_supabase_admin().table("news_articles")
        .update(patch).eq("id", article_id).execute()
    )
    return res.data[0] if res.data else None
