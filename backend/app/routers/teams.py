"""
Teams router
============

Team CRUD, roster management, fixtures, statistics.
"""

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.core.dependencies import (
    get_current_user,
    get_optional_user,
    require_admin,
    require_team_manager,
)
from app.database.supabase import get_supabase_admin
from app.schemas.team import (
    RosterAddRequest,
    RosterEntry,
    TeamCreate,
    TeamListResponse,
    TeamResponse,
    TeamUpdate,
)

router = APIRouter(prefix="/teams", tags=["Teams"])


def _assert_can_manage_team(team: dict, user: dict) -> None:
    """Allow: admin/super_admin, or the team's manager."""
    if user["role"] in ("admin", "super_admin"):
        return
    if team.get("manager_id") == user["id"]:
        return
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="You do not have permission to manage this team",
    )


# ============================================================
# POST /teams
# ============================================================
@router.post(
    "",
    response_model=TeamResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a team (team_manager or admin)",
)
def create_team(
    payload: TeamCreate,
    user: dict = Depends(require_team_manager),
):
    sb = get_supabase_admin()
    data = payload.model_dump(exclude_unset=True)
    data["manager_id"] = user["id"]
    created = sb.table("teams").insert(data).execute()
    return created.data[0]


# ============================================================
# GET /teams
# ============================================================
@router.get(
    "",
    response_model=TeamListResponse,
    summary="List all active teams",
)
def list_teams(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    county: str | None = Query(None),
    q: str | None = Query(None, description="Search by name"),
    _user: dict | None = Depends(get_optional_user),
):
    sb = get_supabase_admin()
    offset = (page - 1) * page_size

    query = sb.table("teams").select("*", count="exact").eq("is_active", True)
    if county:
        query = query.eq("county", county)
    if q:
        query = query.ilike("name", f"%{q}%")

    result = query.order("name").range(offset, offset + page_size - 1).execute()

    return {
        "total": result.count or 0,
        "page": page,
        "page_size": page_size,
        "items": result.data or [],
    }


# ============================================================
# GET /teams/{team_id}
# ============================================================
@router.get("/{team_id}", response_model=TeamResponse, summary="Get one team")
def get_team(team_id: str):
    sb = get_supabase_admin()
    resp = sb.table("teams").select("*").eq("id", team_id).limit(1).execute()
    if not resp.data:
        raise HTTPException(status_code=404, detail="Team not found")
    return resp.data[0]


# ============================================================
# PUT /teams/{team_id}
# ============================================================
@router.put("/{team_id}", response_model=TeamResponse, summary="Update team")
def update_team(
    team_id: str,
    payload: TeamUpdate,
    user: dict = Depends(require_team_manager),
):
    sb = get_supabase_admin()
    team = sb.table("teams").select("*").eq("id", team_id).limit(1).execute()
    if not team.data:
        raise HTTPException(status_code=404, detail="Team not found")
    _assert_can_manage_team(team.data[0], user)

    data = payload.model_dump(exclude_unset=True)
    if not data:
        raise HTTPException(status_code=400, detail="No fields to update")

    sb.table("teams").update(data).eq("id", team_id).execute()
    updated = sb.table("teams").select("*").eq("id", team_id).limit(1).execute()
    return updated.data[0]


# ============================================================
# DELETE /teams/{team_id}
# ============================================================
@router.delete("/{team_id}", summary="Delete/deactivate a team")
def delete_team(
    team_id: str,
    user: dict = Depends(require_team_manager),
):
    sb = get_supabase_admin()
    team = sb.table("teams").select("*").eq("id", team_id).limit(1).execute()
    if not team.data:
        raise HTTPException(status_code=404, detail="Team not found")
    _assert_can_manage_team(team.data[0], user)

    # Admins hard-delete; team managers soft-delete
    if user["role"] in ("admin", "super_admin"):
        sb.table("teams").delete().eq("id", team_id).execute()
        return {"success": True, "mode": "hard_delete"}
    sb.table("teams").update({"is_active": False}).eq("id", team_id).execute()
    return {"success": True, "mode": "soft_delete"}


# ============================================================
# GET /teams/{team_id}/players
# ============================================================
@router.get(
    "/{team_id}/players",
    response_model=list[RosterEntry],
    summary="Get team roster",
)
def get_roster(team_id: str):
    sb = get_supabase_admin()
    resp = (
        sb.table("team_players")
        .select("*")
        .eq("team_id", team_id)
        .eq("is_active", True)
        .execute()
    )
    return resp.data or []


# ============================================================
# POST /teams/{team_id}/players
# ============================================================
@router.post(
    "/{team_id}/players",
    response_model=RosterEntry,
    status_code=status.HTTP_201_CREATED,
    summary="Add a player to a team",
)
def add_player_to_team(
    team_id: str,
    payload: RosterAddRequest,
    user: dict = Depends(require_team_manager),
):
    sb = get_supabase_admin()
    team = sb.table("teams").select("*").eq("id", team_id).limit(1).execute()
    if not team.data:
        raise HTTPException(status_code=404, detail="Team not found")
    _assert_can_manage_team(team.data[0], user)

    data = {"team_id": team_id, "player_id": payload.player_id}
    if payload.joined_at:
        data["joined_at"] = payload.joined_at.isoformat()

    try:
        created = sb.table("team_players").insert(data).execute()
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Could not add player: {exc}")
    return created.data[0]


# ============================================================
# DELETE /teams/{team_id}/players/{player_id}
# ============================================================
@router.delete(
    "/{team_id}/players/{player_id}",
    summary="Remove a player from a team",
)
def remove_player_from_team(
    team_id: str,
    player_id: str,
    user: dict = Depends(require_team_manager),
):
    sb = get_supabase_admin()
    team = sb.table("teams").select("*").eq("id", team_id).limit(1).execute()
    if not team.data:
        raise HTTPException(status_code=404, detail="Team not found")
    _assert_can_manage_team(team.data[0], user)

    sb.table("team_players").update({"is_active": False}).eq(
        "team_id", team_id
    ).eq("player_id", player_id).execute()
    return {"success": True}


# ============================================================
# GET /teams/{team_id}/matches
# ============================================================
@router.get(
    "/{team_id}/matches",
    summary="Get fixtures + results for a team",
)
def get_team_matches(team_id: str):
    sb = get_supabase_admin()
    resp = (
        sb.table("matches")
        .select("*")
        .or_(f"home_team_id.eq.{team_id},away_team_id.eq.{team_id}")
        .order("match_date", desc=True)
        .execute()
    )
    return resp.data or []


# ============================================================
# GET /teams/{team_id}/statistics
# ============================================================
@router.get(
    "/{team_id}/statistics",
    summary="Get team statistics (all seasons)",
)
def get_team_statistics(team_id: str):
    sb = get_supabase_admin()
    resp = (
        sb.table("team_statistics")
        .select("*")
        .eq("team_id", team_id)
        .execute()
    )
    return resp.data or []