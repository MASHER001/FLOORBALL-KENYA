from datetime import date
from typing import Any
from fastapi import HTTPException, status
from app.modules.audit import service as audit
from app.modules.teams import repository as repo
from app.modules.teams.schemas import MembershipCreate, TeamCreate, TeamUpdate


def create_team(payload: TeamCreate, created_by: str) -> dict[str, Any]:
    if repo.get_team_by_slug(payload.slug):
        raise HTTPException(status.HTTP_409_CONFLICT, "Slug already exists")
    data = payload.model_dump()
    data["created_by"] = created_by
    team = repo.insert_team(data)
    audit.log_action(actor={"id": created_by}, action="team.create",
                     resource_type="team", resource_id=team["id"])
    return team


def update_team(team_id: str, payload: TeamUpdate, actor_id: str) -> dict[str, Any]:
    existing = repo.get_team(team_id)
    if not existing:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Team not found")
    updated = repo.update_team(team_id, payload.model_dump(exclude_none=True)) or existing
    audit.log_action(actor={"id": actor_id}, action="team.update",
                     resource_type="team", resource_id=team_id)
    return updated


def add_member(team_id: str, payload: MembershipCreate, actor_id: str) -> dict[str, Any]:
    if not repo.get_team(team_id):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Team not found")
    data = payload.model_dump()
    data["team_id"] = team_id
    data["user_id"] = str(data["user_id"])
    if data.get("joined_on"):
        data["joined_on"] = data["joined_on"].isoformat()
    member = repo.insert_membership(data)
    audit.log_action(actor={"id": actor_id}, action="team.member_add",
                     resource_type="team", resource_id=team_id,
                     metadata={"user_id": data["user_id"], "role": data["role"]})
    return member


def remove_member(membership_id: str, actor_id: str) -> dict[str, Any]:
    updated = repo.end_membership(membership_id, date.today().isoformat())
    if not updated:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Membership not found")
    audit.log_action(actor={"id": actor_id}, action="team.member_remove",
                     resource_type="team_membership", resource_id=membership_id)
    return updated
