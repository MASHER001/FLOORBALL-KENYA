"""
Matches router
==============

Fixture CRUD + the critical "record result" endpoint.

Recording a result:
    POST /matches/{match_id}/result
        ↓
    services.statistics.record_match_result()
        ↓
    - Update match (score, status=completed)
    - Reset + insert match_events
    - Refresh player_statistics
    - Recalculate team_statistics (standings)
"""

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.core.dependencies import get_current_user, require_admin
from app.database.supabase import get_supabase_admin
from app.schemas.match import (
    MatchCreate,
    MatchListResponse,
    MatchResponse,
    MatchResultCreate,
    MatchResultResponse,
    MatchUpdate,
)
from app.services.statistics import (
    InvalidResultError,
    MatchNotFoundError,
    record_match_result,
)

router = APIRouter(prefix="/matches", tags=["Matches"])


# ============================================================
# POST /matches — create fixture (admin only)
# ============================================================
@router.post(
    "",
    response_model=MatchResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a fixture (admin only)",
)
def create_match(payload: MatchCreate, admin: dict = Depends(require_admin)):
    if payload.home_team_id == payload.away_team_id:
        raise HTTPException(status_code=400, detail="Home and away teams must differ")

    if not payload.season_id and not payload.tournament_id:
        raise HTTPException(
            status_code=400,
            detail="Match must belong to either a season or a tournament",
        )

    sb = get_supabase_admin()
    data = payload.model_dump(exclude_unset=True)
    # Coerce datetime to ISO
    if "match_date" in data and data["match_date"] is not None:
        data["match_date"] = data["match_date"].isoformat()
    data["created_by"] = admin["id"]

    try:
        created = sb.table("matches").insert(data).execute()
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Could not create match: {exc}")
    return created.data[0]


# ============================================================
# GET /matches — list
# ============================================================
@router.get("", response_model=MatchListResponse, summary="List matches")
def list_matches(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    season_id: str | None = Query(None),
    tournament_id: str | None = Query(None),
    status_: str | None = Query(None, alias="status"),
    team_id: str | None = Query(None),
):
    sb = get_supabase_admin()
    offset = (page - 1) * page_size

    query = sb.table("matches").select("*", count="exact")
    if season_id:
        query = query.eq("season_id", season_id)
    if tournament_id:
        query = query.eq("tournament_id", tournament_id)
    if status_:
        query = query.eq("status", status_)
    if team_id:
        query = query.or_(f"home_team_id.eq.{team_id},away_team_id.eq.{team_id}")

    result = (
        query.order("match_date", desc=True)
        .range(offset, offset + page_size - 1)
        .execute()
    )

    return {
        "total": result.count or 0,
        "page": page,
        "page_size": page_size,
        "items": result.data or [],
    }


# ============================================================
# GET /matches/{match_id}
# ============================================================
@router.get("/{match_id}", response_model=MatchResponse, summary="Get a match")
def get_match(match_id: str):
    sb = get_supabase_admin()
    resp = sb.table("matches").select("*").eq("id", match_id).limit(1).execute()
    if not resp.data:
        raise HTTPException(status_code=404, detail="Match not found")
    return resp.data[0]


# ============================================================
# PUT /matches/{match_id} — update fixture (admin)
# ============================================================
@router.put(
    "/{match_id}",
    response_model=MatchResponse,
    summary="Update fixture (admin only)",
)
def update_match(
    match_id: str,
    payload: MatchUpdate,
    _admin: dict = Depends(require_admin),
):
    sb = get_supabase_admin()
    data = payload.model_dump(exclude_unset=True)
    if not data:
        raise HTTPException(status_code=400, detail="No fields to update")
    if "match_date" in data and data["match_date"] is not None:
        data["match_date"] = data["match_date"].isoformat()
    if "status" in data and data["status"] is not None:
        data["status"] = data["status"].value

    sb.table("matches").update(data).eq("id", match_id).execute()
    updated = sb.table("matches").select("*").eq("id", match_id).limit(1).execute()
    if not updated.data:
        raise HTTPException(status_code=404, detail="Match not found")
    return updated.data[0]


# ============================================================
# DELETE /matches/{match_id} — cancel (admin)
# ============================================================
@router.delete("/{match_id}", summary="Cancel a fixture (admin only)")
def cancel_match(match_id: str, _admin: dict = Depends(require_admin)):
    sb = get_supabase_admin()
    sb.table("matches").update({"status": "cancelled"}).eq("id", match_id).execute()
    return {"success": True}


# ============================================================
# POST /matches/{match_id}/result — RECORD RESULT (admin)
# ============================================================
@router.post(
    "/{match_id}/result",
    response_model=MatchResultResponse,
    summary="Record match result (admin only)",
    description=(
        "Records the score and goal scorers. Automatically:\n"
        "- Marks the match as completed\n"
        "- Inserts goal events\n"
        "- Recalculates player statistics\n"
        "- Recalculates league standings\n"
    ),
)
def record_result(
    match_id: str,
    payload: MatchResultCreate,
    _admin: dict = Depends(require_admin),
):
    try:
        summary = record_match_result(match_id, payload.model_dump())
    except MatchNotFoundError:
        raise HTTPException(status_code=404, detail="Match not found")
    except InvalidResultError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    # Return the updated match + events
    sb = get_supabase_admin()
    match = sb.table("matches").select("*").eq("id", match_id).limit(1).execute().data[0]
    events = (
        sb.table("match_events").select("*").eq("match_id", match_id).execute()
    ).data or []

    return {"match": match, "events": events}


# ============================================================
# GET /matches/{match_id}/result
# ============================================================
@router.get(
    "/{match_id}/result",
    response_model=MatchResultResponse,
    summary="Get match result + events",
)
def get_result(match_id: str):
    sb = get_supabase_admin()
    match = sb.table("matches").select("*").eq("id", match_id).limit(1).execute()
    if not match.data:
        raise HTTPException(status_code=404, detail="Match not found")
    events = (
        sb.table("match_events").select("*").eq("match_id", match_id).execute()
    ).data or []
    return {"match": match.data[0], "events": events}


# ============================================================
# GET /matches/{match_id}/events
# ============================================================
@router.get("/{match_id}/events", summary="Match events (goals, cards)")
def get_events(match_id: str):
    sb = get_supabase_admin()
    resp = (
        sb.table("match_events")
        .select("*, players(full_name)")
        .eq("match_id", match_id)
        .order("minute")
        .execute()
    )
    return resp.data or []