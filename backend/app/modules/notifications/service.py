from typing import Any
from fastapi import HTTPException, status
from app.modules.notifications import repository as repo
from app.modules.notifications.schemas import NotificationCreate


def create_notification(payload: NotificationCreate) -> dict[str, Any]:
    data = payload.model_dump()
    data["user_id"] = str(data["user_id"])
    return repo.insert(data)


def mark_read(notification_id: str, user_id: str) -> dict[str, Any]:
    existing = repo.get(notification_id, user_id)
    if not existing:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Notification not found")
    return repo.mark_read(notification_id, user_id) or existing
