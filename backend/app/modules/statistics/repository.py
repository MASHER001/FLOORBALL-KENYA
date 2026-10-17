from typing import Any
from app.database.supabase import get_supabase_admin


def completed_fixtures(tournament_id: str) -> list[dict[str, Any]]:
    res = (
        get_supabase_admin().table("fixtures").select("*")
        .eq("tournament_id", tournament_id).eq("status", "completed")
        .execute()
    )
    return res.data or []


def match_events(match_ids: list[str]) -> list[dict[str, Any]]:
    if not match_ids:
        return []
    res = (
        get_supabase_admin().table("match_events").select("*")
        .in_("match_id", match_ids).execute()
    )
    return res.data or []
