from typing import Any
from app.database.supabase import get_supabase_admin


def list_for_tournament(tournament_id: str,
                        group_id: str | None = None) -> list[dict[str, Any]]:
    q = (
        get_supabase_admin().table("standings").select("*")
        .eq("tournament_id", tournament_id)
        .order("points", desc=True).order("goal_diff", desc=True)
    )
    if group_id:
        q = q.eq("group_id", group_id)
    res = q.execute()
    return res.data or []


def upsert_rows(rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
    if not rows:
        return []
    res = (
        get_supabase_admin().table("standings")
        .upsert(rows, on_conflict="tournament_id,group_id,team_id").execute()
    )
    return res.data or []


def list_completed_fixtures(tournament_id: str) -> list[dict[str, Any]]:
    res = (
        get_supabase_admin().table("fixtures").select("*")
        .eq("tournament_id", tournament_id).eq("status", "completed")
        .execute()
    )
    return res.data or []
