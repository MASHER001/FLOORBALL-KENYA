from typing import Any
from fastapi import HTTPException, status
from app.modules.audit import service as audit
from app.modules.leagues import repository as repo
from app.modules.leagues.schemas import LeagueCreate, LeagueUpdate, SeasonCreate


def create_league(payload: LeagueCreate, created_by: str) -> dict[str, Any]:
    if repo.get_league_by_slug(payload.slug):
        raise HTTPException(status.HTTP_409_CONFLICT, f"Slug '{payload.slug}' already exists")
    data = payload.model_dump()
    data["created_by"] = created_by
    league = repo.insert_league(data)
    audit.log_action(actor={"id": created_by}, action="league.create",
                     resource_type="league", resource_id=league["id"],
                     metadata={"slug": league["slug"]})
    return league


def update_league(league_id: str, payload: LeagueUpdate, actor_id: str) -> dict[str, Any]:
    existing = repo.get_league(league_id)
    if not existing:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "League not found")
    updated = repo.update_league(league_id, payload.model_dump(exclude_none=True)) or existing
    audit.log_action(actor={"id": actor_id}, action="league.update",
                     resource_type="league", resource_id=league_id)
    return updated


def create_season(league_id: str, payload: SeasonCreate, created_by: str) -> dict[str, Any]:
    if not repo.get_league(league_id):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "League not found")
    data = payload.model_dump()
    data["league_id"] = league_id
    season = repo.insert_season(data)
    audit.log_action(actor={"id": created_by}, action="season.create",
                     resource_type="season", resource_id=season["id"],
                     metadata={"league_id": league_id})
    return season
