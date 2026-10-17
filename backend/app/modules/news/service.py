from datetime import datetime, timezone
from typing import Any
from fastapi import HTTPException, status
from app.modules.audit import service as audit
from app.modules.news import repository as repo
from app.modules.news.schemas import NewsCreate, NewsUpdate


def create_article(payload: NewsCreate, author_id: str) -> dict[str, Any]:
    if repo.get_by_slug(payload.slug):
        raise HTTPException(status.HTTP_409_CONFLICT, "Slug already exists")
    data = payload.model_dump()
    data["author_id"] = author_id
    data["status"] = "draft"
    article = repo.insert_article(data)
    audit.log_action(actor={"id": author_id}, action="news.create",
                     resource_type="news_article", resource_id=article["id"])
    return article


def update_article(article_id: str, payload: NewsUpdate, actor_id: str) -> dict[str, Any]:
    existing = repo.get_article(article_id)
    if not existing:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Article not found")
    updated = repo.update_article(article_id, payload.model_dump(exclude_none=True)) or existing
    audit.log_action(actor={"id": actor_id}, action="news.update",
                     resource_type="news_article", resource_id=article_id)
    return updated


def publish_article(article_id: str, actor_id: str) -> dict[str, Any]:
    existing = repo.get_article(article_id)
    if not existing:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Article not found")
    updated = repo.update_article(article_id, {
        "status": "published",
        "published_at": datetime.now(timezone.utc).isoformat(),
    }) or existing
    audit.log_action(actor={"id": actor_id}, action="news.publish",
                     resource_type="news_article", resource_id=article_id)
    return updated
