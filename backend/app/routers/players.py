"""
Players router
==============

Player CRUD, statistics, team assignment.
"""

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.core.dependencies import (
    get_current_user,
    require_admin,
    require_team_manager,
)
from app.database.supabase import get_supabase_admin
from app.schemas.player import (
    PlayerCreate,
    PlayerListResponse,
    PlayerResponse,
    PlayerStatLine,
    PlayerTeamAssign,
    PlayerUpdate,
)

router = APIRouter(prefix="/players", tags=["Players"])


# ============================================================
# POST /players
# ============================================================
@router.post(
    "",
    response_model=PlayerResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a player",
)
def create_player(
    payload: PlayerCreate,
    user: dict = Depends(get_current_user),
):
    """
    A player can register themselves (user_id = self).
    Admins can register anyone by passing user_id.
    """
    sb = get_supabase_admin()
    data = payload.model_dump(exclude_unset=True)

    if "user_id" not in data or not data["user_id"]:
        data["user_id"] = user["id"]
    elif data["user_id"] != user["id"] and user["role"] not in ("admin", "super_admin"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can register players for other users",
        )

    created = sb.table("players").insert(data).execute()
    return created.data[0]


# ============================================================
# GET /players
# ============================================================
@router.get(
    "",
    response_model=PlayerListResponse,
    summary="List players",
)
def list_players(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    position: str | None = Query(None),
    q: str | None = Query(None, description="Search by name"),
):
    sb = get_supabase_admin()
    offset = (page - 1) * page_size

    query = sb.table("players").select("*", count="exact").eq("is_active", True)
    if position:
        query = query.eq("position", position)
    if q:
        query = query.ilike("full_name", f"%{q}%")

    result = query.order("full_name").range(offset, offset + page_size - 1).execute()

    return {
        "total": result.count or 0,
        "page": page,
        "page_size": page_size,
        "items": result.data or [],
    }


# ============================================================
# GET /players/{player_id}
# ============================================================
@router.get("/{player_id}", response_model=PlayerResponse, summary="Get a player")
def get_player(player_id: str):
    sb = get_supabase_admin()
    resp = sb.table("players").select("*").eq("id", player_id).limit(1).execute()
    if not resp.data:
        raise HTTPException(status_code=404, detail="Player not found")
    return resp.data[0]


# ============================================================
# PUT /players/{player_id}
# ============================================================
@router.put("/{player_id}", response_model=PlayerResponse, summary="Update player")
def update_player(
    player_id: str,
    payload: PlayerUpdate,
    user: dict = Depends(get_current_user),
):
    sb = get_supabase_admin()
    resp = sb.table("players").select("*").eq("id", player_id).limit(1).execute()
    if not resp.data:
        raise HTTPException(status_code=404, detail="Player not found")
    player = resp.data[0]

    if user["role"] not in ("admin", "super_admin") and player.get("user_id") != user["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update your own player profile",
        )

    data = payload.model_dump(exclude_unset=True)
    if not data:
        raise HTTPException(status_code=400, detail="No fields to update")

    sb.table("players").update(data).eq("id", player_id).execute()
    updated = sb.table("players").select("*").eq("id", player_id).limit(1).execute()
    return updated.data[0]


# ============================================================
# DELETE /players/{player_id}  — admin only
# ============================================================
@router.delete("/{player_id}", summary="Deactivate a player (admin only)")
def delete_player(
    player_id: str,
    _admin: dict = Depends(require_admin),
):
    sb = get_supabase_admin()
    sb.table("players").update({"is_active": False}).eq("id", player_id).execute()
    return {"success": True}


# ============================================================
# GET /players/{player_id}/statistics
# ============================================================
@router.get(
    "/{player_id}/statistics",
    response_model=list[PlayerStatLine],
    summary="Get player statistics",
)
def get_player_stats(player_id: str):
    sb = get_supabase_admin()
    resp = sb.table("player_statistics").select("*").eq("player_id", player_id).execute()
    return resp.data or []


# ============================================================
# GET /players/{player_id}/matches
# ============================================================
@router.get("/{player_id}/matches", summary="Matches a player featured in")
def get_player_matches(player_id: str):
    sb = get_supabase_admin()
    # Find match_ids from match_events, then fetch the matches
    events = (
        sb.table("match_events").select("match_id").eq("player_id", player_id).execute()
    ).data or []
    match_ids = list({e["match_id"] for e in events})
    if not match_ids:
        return []
    matches = (
        sb.table("matches").select("*").in_("id", match_ids).order("match_date", desc=True).execute()
    )
    return matches.data or []


# ============================================================
# PATCH /players/{player_id}/team
# ============================================================
@router.patch(
    "/{player_id}/team",
    summary="Assign or change a player's team (admin or team manager)",
)
def assign_player_team(
    player_id: str,
    payload: PlayerTeamAssign,
    user: dict = Depends(require_team_manager),
):
    sb = get_supabase_admin()

    # Deactivate all existing memberships
    sb.table("team_players").update({"is_active": False}).eq(
        "player_id", player_id
    ).eq("is_active", True).execute()

    if payload.team_id is None:
        return {"success": True, "message": "Removed from all teams"}

    # Validate new team
    team_resp = (
        sb.table("teams").select("*").eq("id", payload.team_id).limit(1).execute()
    )
    if not team_resp.data:
        raise HTTPException(status_code=404, detail="Team not found")
    team = team_resp.data[0]

    if user["role"] not in ("admin", "super_admin") and team.get("manager_id") != user["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only assign players to teams you manage",
        )

    created = sb.table("team_players").insert(
        {"team_id": payload.team_id, "player_id": player_id, "is_active": True}
    ).execute()
    return created.data[0]