"""
Tournaments router
==================

Tournament CRUD + team registration workflow.

Registration states:
    pending  → approved | rejected
    approved → withdrawn (by manager)
"""

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.core.dependencies import (
    get_current_user,
    get_optional_user,
    require_admin,
)
from app.database.supabase import get_supabase_admin
from app.schemas.tournament import (
    RegistrationCreate,
    RegistrationDecision,
    RegistrationResponse,
    TournamentCreate,
    TournamentListResponse,
    TournamentResponse,
    TournamentUpdate,
)

router = APIRouter(prefix="/tournaments", tags=["Tournaments"])


# ============================================================
# TOURNAMENTS — CRUD
# ============================================================
@router.post(
    "",
    response_model=TournamentResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a tournament (admin only)",
)
def create_tournament(
    payload: TournamentCreate,
    _admin: dict = Depends(require_admin),
):
    sb = get_supabase_admin()
    data = payload.model_dump(exclude_unset=True)
    if "format" in data and data["format"] is not None:
        data["format"] = data["format"].value
    if "start_date" in data and data["start_date"] is not None:
        data["start_date"] = data["start_date"].isoformat()
    if "end_date" in data and data["end_date"] is not None:
        data["end_date"] = data["end_date"].isoformat()

    created = sb.table("tournaments").insert(data).execute()
    return created.data[0]


@router.get("", response_model=TournamentListResponse, summary="List tournaments")
def list_tournaments(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    active_only: bool = Query(True),
    q: str | None = Query(None),
):
    sb = get_supabase_admin()
    offset = (page - 1) * page_size
    query = sb.table("tournaments").select("*", count="exact")
    if active_only:
        query = query.eq("is_active", True)
    if q:
        query = query.ilike("name", f"%{q}%")
    result = query.order("start_date", desc=True).range(offset, offset + page_size - 1).execute()
    return {
        "total": result.count or 0,
        "page": page,
        "page_size": page_size,
        "items": result.data or [],
    }


@router.get("/{tournament_id}", response_model=TournamentResponse, summary="Get a tournament")
def get_tournament(tournament_id: str):
    sb = get_supabase_admin()
    resp = sb.table("tournaments").select("*").eq("id", tournament_id).limit(1).execute()
    if not resp.data:
        raise HTTPException(status_code=404, detail="Tournament not found")
    return resp.data[0]


@router.put(
    "/{tournament_id}",
    response_model=TournamentResponse,
    summary="Update a tournament (admin)",
)
def update_tournament(
    tournament_id: str,
    payload: TournamentUpdate,
    _admin: dict = Depends(require_admin),
):
    sb = get_supabase_admin()
    data = payload.model_dump(exclude_unset=True)
    if not data:
        raise HTTPException(status_code=400, detail="No fields to update")
    if "format" in data and data["format"] is not None:
        data["format"] = data["format"].value
    for f in ("start_date", "end_date"):
        if f in data and data[f] is not None:
            data[f] = data[f].isoformat()

    sb.table("tournaments").update(data).eq("id", tournament_id).execute()
    updated = sb.table("tournaments").select("*").eq("id", tournament_id).limit(1).execute()
    if not updated.data:
        raise HTTPException(status_code=404, detail="Tournament not found")
    return updated.data[0]


@router.delete("/{tournament_id}", summary="Deactivate a tournament (admin)")
def delete_tournament(tournament_id: str, _admin: dict = Depends(require_admin)):
    sb = get_supabase_admin()
    sb.table("tournaments").update({"is_active": False}).eq("id", tournament_id).execute()
    return {"success": True}


# ============================================================
# REGISTRATIONS
# ============================================================
@router.post(
    "/{tournament_id}/register",
    response_model=RegistrationResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a team for a tournament",
    description="The team manager registers their own team (team_id must belong to them).",
)
def register_team(
    tournament_id: str,
    payload: RegistrationCreate,
    user: dict = Depends(get_current_user),
):
    sb = get_supabase_admin()

    # Verify tournament active
    tour = sb.table("tournaments").select("*").eq("id", tournament_id).limit(1).execute()
    if not tour.data:
        raise HTTPException(status_code=404, detail="Tournament not found")
    if not tour.data[0].get("is_active"):
        raise HTTPException(status_code=400, detail="Tournament is not active")

    # Verify team belongs to user (unless admin)
    team = sb.table("teams").select("*").eq("id", payload.team_id).limit(1).execute()
    if not team.data:
        raise HTTPException(status_code=404, detail="Team not found")
    if user["role"] not in ("admin", "super_admin") and team.data[0].get("manager_id") != user["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only register your own team",
        )

    # Enforce max_teams
    max_teams = tour.data[0].get("max_teams")
    if max_teams:
        count_resp = (
            sb.table("tournament_registrations")
            .select("id", count="exact")
            .eq("tournament_id", tournament_id)
            .eq("status", "approved")
            .execute()
        )
        if (count_resp.count or 0) >= max_teams:
            raise HTTPException(status_code=400, detail="Tournament is full")

    try:
        created = sb.table("tournament_registrations").insert(
            {
                "tournament_id": tournament_id,
                "team_id": payload.team_id,
                "notes": payload.notes,
                "status": "pending",
            }
        ).execute()
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Registration failed: {exc}")

    return created.data[0]


@router.get(
    "/{tournament_id}/teams",
    response_model=list[RegistrationResponse],
    summary="List registered teams",
)
def list_registrations(
    tournament_id: str,
    status_: str | None = Query(None, alias="status"),
    _user: dict | None = Depends(get_optional_user),
):
    sb = get_supabase_admin()
    query = sb.table("tournament_registrations").select("*").eq("tournament_id", tournament_id)
    if status_:
        query = query.eq("status", status_)
    return query.execute().data or []


@router.patch(
    "/{tournament_id}/registrations/{registration_id}",
    response_model=RegistrationResponse,
    summary="Approve/reject a registration (admin)",
)
def decide_registration(
    tournament_id: str,
    registration_id: str,
    payload: RegistrationDecision,
    admin: dict = Depends(require_admin),
):
    sb = get_supabase_admin()
    if payload.status.value not in ("approved", "rejected", "withdrawn"):
        raise HTTPException(status_code=400, detail="Invalid decision status")

    sb.table("tournament_registrations").update(
        {
            "status": payload.status.value,
            "notes": payload.notes,
            "reviewed_by": admin["id"],
            "reviewed_at": "now()",
        }
    ).eq("id", registration_id).eq("tournament_id", tournament_id).execute()

    updated = (
        sb.table("tournament_registrations")
        .select("*")
        .eq("id", registration_id)
        .limit(1)
        .execute()
    )
    if not updated.data:
        raise HTTPException(status_code=404, detail="Registration not found")
    return updated.data[0]


@router.get(
    "/{tournament_id}/matches",
    summary="Matches in a tournament",
)
def list_tournament_matches(tournament_id: str):
    sb = get_supabase_admin()
    resp = (
        sb.table("matches")
        .select("*")
        .eq("tournament_id", tournament_id)
        .order("match_date")
        .execute()
    )
    return resp.data or []