"""
Leagues router
==============

Manages leagues, seasons, participating teams, and standings.

Endpoints:
    POST   /leagues                         create league (admin)
    GET    /leagues                         list leagues (public)
    GET    /leagues/{league_id}             get one league
    PUT    /leagues/{league_id}             update league (admin)
    DELETE /leagues/{league_id}             deactivate league (admin)

    POST   /leagues/{league_id}/seasons     create season (admin)
    GET    /leagues/{league_id}/seasons     list seasons (public)

    POST   /leagues/{league_id}/teams       add team to current season (admin)
    DELETE /leagues/{league_id}/teams/{id}  remove team (admin)
    GET    /leagues/{league_id}/teams       list teams in current season

    GET    /leagues/{league_id}/standings   standings for current season (public)
    GET    /leagues/{league_id}/fixtures    fixtures (public)
    GET    /leagues/{league_id}/results     completed matches (public)
    GET    /leagues/{league_id}/statistics  aggregated stats (public)
"""

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.core.dependencies import require_admin
from app.database.supabase import get_supabase_admin
from app.schemas.league import (
    LeagueCreate,
    LeagueListResponse,
    LeagueResponse,
    LeagueTeamAdd,
    LeagueUpdate,
    SeasonCreate,
    SeasonResponse,
    SeasonUpdate,
    StandingsResponse,
)
from app.services.standings import recalculate_standings

router = APIRouter(prefix="/leagues", tags=["Leagues"])


# ============================================================
# Helper: current season of a league
# ============================================================
def _current_season(league_id: str) -> dict | None:
    sb = get_supabase_admin()
    resp = (
        sb.table("seasons")
        .select("*")
        .eq("league_id", league_id)
        .eq("is_current", True)
        .limit(1)
        .execute()
    )
    if resp.data:
        return resp.data[0]
    # fall back to latest season
    resp = (
        sb.table("seasons")
        .select("*")
        .eq("league_id", league_id)
        .order("start_date", desc=True)
        .limit(1)
        .execute()
    )
    return resp.data[0] if resp.data else None


# ============================================================
# LEAGUES — CRUD
# ============================================================
@router.post(
    "",
    response_model=LeagueResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a league (admin only)",
)
def create_league(payload: LeagueCreate, _admin: dict = Depends(require_admin)):
    sb = get_supabase_admin()
    created = sb.table("leagues").insert(payload.model_dump(exclude_unset=True)).execute()
    return created.data[0]


@router.get("", response_model=LeagueListResponse, summary="List leagues")
def list_leagues(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    q: str | None = Query(None),
):
    sb = get_supabase_admin()
    offset = (page - 1) * page_size
    query = sb.table("leagues").select("*", count="exact").eq("is_active", True)
    if q:
        query = query.ilike("name", f"%{q}%")
    result = query.order("name").range(offset, offset + page_size - 1).execute()
    return {
        "total": result.count or 0,
        "page": page,
        "page_size": page_size,
        "items": result.data or [],
    }


@router.get("/{league_id}", response_model=LeagueResponse, summary="Get a league")
def get_league(league_id: str):
    sb = get_supabase_admin()
    resp = sb.table("leagues").select("*").eq("id", league_id).limit(1).execute()
    if not resp.data:
        raise HTTPException(status_code=404, detail="League not found")
    return resp.data[0]


@router.put("/{league_id}", response_model=LeagueResponse, summary="Update league (admin)")
def update_league(
    league_id: str,
    payload: LeagueUpdate,
    _admin: dict = Depends(require_admin),
):
    sb = get_supabase_admin()
    data = payload.model_dump(exclude_unset=True)
    if not data:
        raise HTTPException(status_code=400, detail="No fields to update")
    sb.table("leagues").update(data).eq("id", league_id).execute()
    updated = sb.table("leagues").select("*").eq("id", league_id).limit(1).execute()
    if not updated.data:
        raise HTTPException(status_code=404, detail="League not found")
    return updated.data[0]


@router.delete("/{league_id}", summary="Deactivate league (admin)")
def delete_league(league_id: str, _admin: dict = Depends(require_admin)):
    sb = get_supabase_admin()
    sb.table("leagues").update({"is_active": False}).eq("id", league_id).execute()
    return {"success": True}


# ============================================================
# SEASONS
# ============================================================
@router.post(
    "/{league_id}/seasons",
    response_model=SeasonResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a season (admin)",
)
def create_season(
    league_id: str,
    payload: SeasonCreate,
    _admin: dict = Depends(require_admin),
):
    sb = get_supabase_admin()

    # Verify league exists
    league = sb.table("leagues").select("id").eq("id", league_id).limit(1).execute()
    if not league.data:
        raise HTTPException(status_code=404, detail="League not found")

    data = payload.model_dump(exclude_unset=True)
    data["league_id"] = league_id

    # If this is current, unset others
    if data.get("is_current"):
        sb.table("seasons").update({"is_current": False}).eq(
            "league_id", league_id
        ).execute()

    created = sb.table("seasons").insert(data).execute()
    return created.data[0]


@router.get(
    "/{league_id}/seasons",
    response_model=list[SeasonResponse],
    summary="List seasons for a league",
)
def list_seasons(league_id: str):
    sb = get_supabase_admin()
    resp = (
        sb.table("seasons")
        .select("*")
        .eq("league_id", league_id)
        .order("start_date", desc=True)
        .execute()
    )
    return resp.data or []


@router.put(
    "/{league_id}/seasons/{season_id}",
    response_model=SeasonResponse,
    summary="Update a season (admin)",
)
def update_season(
    league_id: str,
    season_id: str,
    payload: SeasonUpdate,
    _admin: dict = Depends(require_admin),
):
    sb = get_supabase_admin()
    data = payload.model_dump(exclude_unset=True)
    if not data:
        raise HTTPException(status_code=400, detail="No fields to update")

    if data.get("is_current"):
        sb.table("seasons").update({"is_current": False}).eq(
            "league_id", league_id
        ).execute()

    sb.table("seasons").update(data).eq("id", season_id).eq("league_id", league_id).execute()
    updated = sb.table("seasons").select("*").eq("id", season_id).limit(1).execute()
    if not updated.data:
        raise HTTPException(status_code=404, detail="Season not found")
    return updated.data[0]


# ============================================================
# TEAMS IN LEAGUE (via current season)
# ============================================================
@router.post(
    "/{league_id}/teams",
    status_code=status.HTTP_201_CREATED,
    summary="Add team to league's current season (admin)",
)
def add_team_to_league(
    league_id: str,
    payload: LeagueTeamAdd,
    _admin: dict = Depends(require_admin),
):
    sb = get_supabase_admin()
    season = _current_season(league_id)
    if not season:
        raise HTTPException(status_code=400, detail="No season found. Create a season first.")

    team = sb.table("teams").select("id").eq("id", payload.team_id).limit(1).execute()
    if not team.data:
        raise HTTPException(status_code=404, detail="Team not found")

    try:
        created = sb.table("league_teams").insert(
            {"season_id": season["id"], "team_id": payload.team_id}
        ).execute()
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Could not add team: {exc}")

    return created.data[0]


@router.delete(
    "/{league_id}/teams/{team_id}",
    summary="Remove a team from league's current season (admin)",
)
def remove_team_from_league(
    league_id: str,
    team_id: str,
    _admin: dict = Depends(require_admin),
):
    sb = get_supabase_admin()
    season = _current_season(league_id)
    if not season:
        raise HTTPException(status_code=400, detail="No season found")
    sb.table("league_teams").delete().eq("season_id", season["id"]).eq(
        "team_id", team_id
    ).execute()
    return {"success": True}


@router.get(
    "/{league_id}/teams",
    summary="List teams in league's current season",
)
def list_teams_in_league(league_id: str):
    sb = get_supabase_admin()
    season = _current_season(league_id)
    if not season:
        return []
    resp = (
        sb.table("league_teams")
        .select("team_id, teams(*)")
        .eq("season_id", season["id"])
        .execute()
    )
    return resp.data or []


# ============================================================
# STANDINGS
# ============================================================
@router.get(
    "/{league_id}/standings",
    response_model=StandingsResponse,
    summary="Get standings for the current season",
)
def get_standings(
    league_id: str,
    refresh: bool = Query(False, description="Force recalculation"),
):
    sb = get_supabase_admin()
    season = _current_season(league_id)
    if not season:
        raise HTTPException(status_code=404, detail="No season found for this league")

    if refresh:
        rows = recalculate_standings(season["id"])
    else:
        # Read from team_statistics
        stats = (
            sb.table("team_statistics")
            .select("*, teams(name)")
            .eq("season_id", season["id"])
            .execute()
        ).data or []

        # Sort + assign positions
        rows = [
            {
                "team_id": r["team_id"],
                "team_name": (r.get("teams") or {}).get("name") or "Unknown",
                "played": r.get("played", 0),
                "won": r.get("won", 0),
                "drawn": r.get("drawn", 0),
                "lost": r.get("lost", 0),
                "goals_for": r.get("goals_for", 0),
                "goals_against": r.get("goals_against", 0),
                "goal_difference": r.get("goal_difference", 0),
                "points": r.get("points", 0),
            }
            for r in stats
        ]
        rows.sort(key=lambda r: (-r["points"], -r["goal_difference"], -r["goals_for"], r["team_name"].lower()))
        for i, r in enumerate(rows, start=1):
            r["position"] = i

    return {
        "season_id": season["id"],
        "league_id": league_id,
        "table": rows,
    }


# ============================================================
# FIXTURES / RESULTS / STATISTICS
# ============================================================
@router.get("/{league_id}/fixtures", summary="Upcoming fixtures in current season")
def get_fixtures(league_id: str):
    sb = get_supabase_admin()
    season = _current_season(league_id)
    if not season:
        return []
    resp = (
        sb.table("matches")
        .select("*")
        .eq("season_id", season["id"])
        .eq("status", "scheduled")
        .order("match_date")
        .execute()
    )
    return resp.data or []


@router.get("/{league_id}/results", summary="Completed matches in current season")
def get_results(league_id: str):
    sb = get_supabase_admin()
    season = _current_season(league_id)
    if not season:
        return []
    resp = (
        sb.table("matches")
        .select("*")
        .eq("season_id", season["id"])
        .eq("status", "completed")
        .order("match_date", desc=True)
        .execute()
    )
    return resp.data or []


@router.get("/{league_id}/statistics", summary="League aggregate statistics")
def get_league_statistics(league_id: str):
    sb = get_supabase_admin()
    season = _current_season(league_id)
    if not season:
        return {"season_id": None, "teams": [], "top_scorers": []}

    teams = (
        sb.table("team_statistics")
        .select("*, teams(name)")
        .eq("season_id", season["id"])
        .execute()
    ).data or []

    top_scorers = (
        sb.table("player_statistics")
        .select("*, players(full_name)")
        .eq("season_id", season["id"])
        .order("goals", desc=True)
        .limit(10)
        .execute()
    ).data or []

    return {
        "season_id": season["id"],
        "teams": teams,
        "top_scorers": top_scorers,
    }