from uuid import UUID
from fastapi import APIRouter, Depends
from app.modules.notifications import repository as repo
from app.modules.notifications import service
from app.modules.notifications.permissions import require_authenticated
from app.modules.notifications.schemas import NotificationPublic

router = APIRouter(tags=["Notifications"])


@router.get("/notifications", response_model=list[NotificationPublic])
def list_notifications(unread_only: bool = False, limit: int = 50, offset: int = 0,
                       user=Depends(require_authenticated)):
    return repo.list_for_user(user["id"], unread_only=unread_only,
                              limit=limit, offset=offset)


@router.post("/notifications/{notification_id}/read", response_model=NotificationPublic)
def mark_read(notification_id: UUID, user=Depends(require_authenticated)):
    return service.mark_read(str(notification_id), user["id"])


@router.post("/notifications/read-all")
def mark_all_read(user=Depends(require_authenticated)):
    count = repo.mark_all_read(user["id"])
    return {"marked": count}
