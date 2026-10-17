from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from app.modules.leagues import repository as repo
from app.modules.leagues import service
from app.modules.leagues.permissions import require_league_manager
from app.modules.leagues.schemas import (
    LeagueCreate, LeaguePublic, LeagueUpdate, SeasonCreate, SeasonPublic,
)
from fastapi import Query

router = APIRouter(tags=["Leagues"])


@router.get("/leagues", response_model=list[LeaguePublic], summary="List leagues")
def list_leagues(limit: int = 100, offset: int = 0):
    return repo.list_leagues(limit=limit, offset=offset)


@router.get("/leagues/{league_id}", response_model=LeaguePublic, summary="Get a league")
def get_league(league_id: UUID):
    row = repo.get_league(str(league_id))
    if not row:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "League not found")
    return row


@router.get("/leagues/{league_id}/seasons", response_model=list[SeasonPublic], summary="List seasons")
def list_seasons(league_id: UUID):
    return repo.list_seasons(str(league_id))


@router.post("/admin/leagues", response_model=LeaguePublic,
             status_code=status.HTTP_201_CREATED, summary="Create a league (admin)")
def create_league(payload: LeagueCreate, user=Depends(require_league_manager)):
    return service.create_league(payload, created_by=user["id"])


@router.patch("/admin/leagues/{league_id}", response_model=LeaguePublic,
              summary="Update a league (admin)")
def update_league(league_id: UUID, payload: LeagueUpdate,
                  user=Depends(require_league_manager)):
    return service.update_league(str(league_id), payload, actor_id=user["id"])


@router.post("/admin/leagues/{league_id}/seasons", response_model=SeasonPublic,
             status_code=status.HTTP_201_CREATED, summary="Create a season (admin)")
def create_season(league_id: UUID, payload: SeasonCreate,
                  user=Depends(require_league_manager)):
    return service.create_season(str(league_id), payload, created_by=user["id"])
@router.get("/leagues/{league_id}/standings")
def league_standings(league_id: UUID, season_id: UUID | None = None):
    """
    Return standings for a league. If season_id is omitted, uses the
    most recent active season. Reads from the `standings` table populated
    by the standings recompute service.
    """
    from app.database.supabase import get_supabase_admin
    sb = get_supabase_admin()

    # Resolve target season
    if season_id:
        target_season = str(season_id)
    else:
        season_res = (
            sb.table("seasons")
            .select("id")
            .eq("league_id", str(league_id))
            .eq("status", "active")
            .order("starts_on", desc=True)
            .limit(1)
            .execute()
        )
        if not season_res.data:
            return []
        target_season = season_res.data[0]["id"]

    # Standings are keyed by tournament_id; for leagues we assume the season id
    res = (
        sb.table("standings")
        .select("*")
        .eq("tournament_id", target_season)
        .order("points", desc=True)
        .order("goal_diff", desc=True)
        .execute()
    )
    return res.data or []