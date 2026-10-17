from typing import Any
from fastapi import HTTPException, status
from app.modules.audit import service as audit
from app.modules.players import repository as repo
from app.modules.players.schemas import PlayerCreate, PlayerUpdate


def create_profile(user_id: str, payload: PlayerCreate) -> dict[str, Any]:
    if repo.get_by_user(user_id):
        raise HTTPException(status.HTTP_409_CONFLICT, "Player profile already exists")
    data = payload.model_dump()
    data["user_id"] = user_id
    if data.get("date_of_birth"):
        data["date_of_birth"] = data["date_of_birth"].isoformat()
    profile = repo.insert(data)
    audit.log_action(actor={"id": user_id}, action="player.create",
                     resource_type="player", resource_id=profile["id"])
    return profile


def update_profile(player_id: str, payload: PlayerUpdate, actor_id: str) -> dict[str, Any]:
    existing = repo.get(player_id)
    if not existing:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Player not found")
    if existing["user_id"] != actor_id:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Not your profile")
    updated = repo.update(player_id, payload.model_dump(exclude_none=True)) or existing
    audit.log_action(actor={"id": actor_id}, action="player.update",
                     resource_type="player", resource_id=player_id)
    return updated
