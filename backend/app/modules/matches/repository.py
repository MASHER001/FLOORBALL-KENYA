from typing import Any, Optional
from app.database.supabase import get_supabase_admin


def list_events(match_id: str) -> list[dict[str, Any]]:
    res = (
        get_supabase_admin().table("match_events")
        .select("*").eq("match_id", match_id)
        .order("minute").execute()
    )
    return res.data or []


def insert_event(payload: dict[str, Any]) -> dict[str, Any]:
    res = get_supabase_admin().table("match_events").insert(payload).execute()
    return res.data[0]


def insert_submission(payload: dict[str, Any]) -> dict[str, Any]:
    res = get_supabase_admin().table("match_result_submissions").insert(payload).execute()
    return res.data[0]


def get_submission(submission_id: str) -> Optional[dict[str, Any]]:
    res = (
        get_supabase_admin().table("match_result_submissions")
        .select("*").eq("id", submission_id).limit(1).execute()
    )
    return res.data[0] if res.data else None


def list_submissions(match_id: str) -> list[dict[str, Any]]:
    res = (
        get_supabase_admin().table("match_result_submissions")
        .select("*").eq("match_id", match_id)
        .order("created_at", desc=True).execute()
    )
    return res.data or []


def update_submission(submission_id: str, patch: dict[str, Any]) -> Optional[dict[str, Any]]:
    res = (
        get_supabase_admin().table("match_result_submissions")
        .update(patch).eq("id", submission_id).execute()
    )
    return res.data[0] if res.data else None


def get_fixture(fixture_id: str) -> Optional[dict[str, Any]]:
    res = (
        get_supabase_admin().table("fixtures")
        .select("*").eq("id", fixture_id).limit(1).execute()
    )
    return res.data[0] if res.data else None


def update_fixture(fixture_id: str, patch: dict[str, Any]) -> Optional[dict[str, Any]]:
    res = (
        get_supabase_admin().table("fixtures")
        .update(patch).eq("id", fixture_id).execute()
    )
    return res.data[0] if res.data else None
def search_matches(
    tournament_id: Optional[str] = None,
    team_id: Optional[str] = None,
    status_filter: Optional[str] = None,
    from_date: Optional[str] = None,
    to_date: Optional[str] = None,
    limit: int = 50,
    offset: int = 0,
) -> list[dict[str, Any]]:
    q = get_supabase_admin().table("fixtures").select("*")

    if tournament_id:
        q = q.eq("tournament_id", tournament_id)
    if team_id:
        # matches where the team is home OR away
        q = q.or_(f"home_team_id.eq.{team_id},away_team_id.eq.{team_id}")
    if status_filter:
        q = q.eq("status", status_filter)
    if from_date:
        q = q.gte("kickoff_at", from_date)
    if to_date:
        q = q.lte("kickoff_at", to_date)

    res = q.order("kickoff_at").range(offset, offset + limit - 1).execute()
    return res.data or []