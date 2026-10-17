from typing import Any
from fastapi import HTTPException, status
from app.modules.audit import service as audit
from app.modules.users import repository as repo
from app.modules.users.schemas import ProfileUpdate, RoleUpdate, UserStatusUpdate


def update_me(user_id: str, payload: ProfileUpdate) -> dict[str, Any]:
    existing = repo.get_profile(user_id)
    if not existing:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Profile not found")
    updated = repo.update_profile(user_id, payload.model_dump(exclude_none=True)) or existing
    audit.log_action(actor={"id": user_id}, action="user.update_self",
                     resource_type="profile", resource_id=user_id)
    return updated


def set_status(user_id: str, payload: UserStatusUpdate, actor_id: str) -> dict[str, Any]:
    existing = repo.get_profile(user_id)
    if not existing:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")
    updated = repo.update_profile(user_id, {"is_active": payload.is_active}) or existing
    audit.log_action(actor={"id": actor_id},
                     action="user.activate" if payload.is_active else "user.deactivate",
                     resource_type="profile", resource_id=user_id)
    return updated


def set_role(user_id: str, payload: RoleUpdate, actor_id: str) -> dict[str, Any]:
    existing = repo.get_profile(user_id)
    if not existing:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")
    updated = repo.update_profile(user_id, {"role": payload.role}) or existing
    audit.log_action(actor={"id": actor_id}, action="user.role_change",
                     resource_type="profile", resource_id=user_id,
                     metadata={"from_role": existing["role"], "to_role": payload.role})
    return updated
