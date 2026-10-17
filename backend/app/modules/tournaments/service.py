from typing import Any
from fastapi import HTTPException, status
from app.modules.audit import service as audit
from app.modules.tournaments import repository as repo
from app.modules.tournaments.schemas import (
    RegistrationCreate, RegistrationModerate, TournamentCreate, TournamentUpdate,
)


def create_tournament(payload: TournamentCreate, created_by: str) -> dict[str, Any]:
    if repo.get_by_slug(payload.slug):
        raise HTTPException(status.HTTP_409_CONFLICT, "Slug already exists")
    data = payload.model_dump()
    for k in ("starts_on", "ends_on"):
        if data.get(k):
            data[k] = data[k].isoformat()
    data["created_by"] = created_by
    t = repo.insert_tournament(data)
    audit.log_action(actor={"id": created_by}, action="tournament.create",
                     resource_type="tournament", resource_id=t["id"])
    return t


def update_tournament(tournament_id: str, payload: TournamentUpdate,
                      actor_id: str) -> dict[str, Any]:
    existing = repo.get_tournament(tournament_id)
    if not existing:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Tournament not found")
    patch = payload.model_dump(exclude_none=True)
    for k in ("starts_on", "ends_on"):
        if patch.get(k):
            patch[k] = patch[k].isoformat()
    updated = repo.update_tournament(tournament_id, patch) or existing
    audit.log_action(actor={"id": actor_id}, action="tournament.update",
                     resource_type="tournament", resource_id=tournament_id)
    return updated


def register_team(tournament_id: str, payload: RegistrationCreate,
                  actor_id: str) -> dict[str, Any]:
    t = repo.get_tournament(tournament_id)
    if not t:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Tournament not found")
    if not repo.get_team(str(payload.team_id)):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Team not found")
    reg = repo.insert_registration({
        "tournament_id": tournament_id,
        "team_id": str(payload.team_id),
        "status": "pending",
    })
    audit.log_action(actor={"id": actor_id}, action="tournament.register_team",
                     resource_type="tournament", resource_id=tournament_id,
                     metadata={"team_id": str(payload.team_id)})
    return reg


def moderate_registration(reg_id: str, payload: RegistrationModerate,
                          actor_id: str) -> dict[str, Any]:
    existing = repo.get_registration(reg_id)
    if not existing:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Registration not found")
    updated = repo.update_registration(reg_id, {"status": payload.status}) or existing
    audit.log_action(actor={"id": actor_id}, action=f"tournament.reg_{payload.status}",
                     resource_type="tournament_registration", resource_id=reg_id)
    return updated
