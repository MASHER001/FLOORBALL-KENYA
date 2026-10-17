from uuid import UUID
from fastapi import APIRouter, Depends, Query
from app.modules.users import repository as repo
from app.modules.users import service
from app.modules.users.permissions import require_authenticated, require_user_admin
from app.modules.users.schemas import (
    ProfilePublic, ProfileUpdate, RoleUpdate, UserStatusUpdate,
)

router = APIRouter(tags=["Users"])


@router.get("/users/me", response_model=ProfilePublic)
def get_me(user=Depends(require_authenticated)):
    return user


@router.patch("/users/me", response_model=ProfilePublic)
def update_me(payload: ProfileUpdate, user=Depends(require_authenticated)):
    return service.update_me(user["id"], payload)


@router.get("/admin/users", response_model=list[ProfilePublic])
def list_users(search: str | None = Query(None), limit: int = 50, offset: int = 0,
               user=Depends(require_user_admin)):
    return repo.list_users(search=search, limit=limit, offset=offset)


@router.patch("/admin/users/{user_id}/status", response_model=ProfilePublic)
def set_status(user_id: UUID, payload: UserStatusUpdate,
               actor=Depends(require_user_admin)):
    return service.set_status(str(user_id), payload, actor_id=actor["id"])


@router.put("/admin/users/{user_id}/roles", response_model=ProfilePublic)
def set_role(user_id: UUID, payload: RoleUpdate,
             actor=Depends(require_user_admin)):
    return service.set_role(str(user_id), payload, actor_id=actor["id"])
