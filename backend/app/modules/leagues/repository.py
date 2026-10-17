from typing import Any, Optional
from app.database.supabase import get_supabase_admin


def list_leagues(limit: int = 100, offset: int = 0) -> list[dict[str, Any]]:
    res = (
        get_supabase_admin().table("leagues")
        .select("*").eq("is_active", True)
        .order("name").range(offset, offset + limit - 1).execute()
    )
    return res.data or []


def get_league(league_id: str) -> Optional[dict[str, Any]]:
    res = (
        get_supabase_admin().table("leagues")
        .select("*").eq("id", league_id).limit(1).execute()
    )
    return res.data[0] if res.data else None


def get_league_by_slug(slug: str) -> Optional[dict[str, Any]]:
    res = (
        get_supabase_admin().table("leagues")
        .select("*").eq("slug", slug).limit(1).execute()
    )
    return res.data[0] if res.data else None


def insert_league(payload: dict[str, Any]) -> dict[str, Any]:
    res = get_supabase_admin().table("leagues").insert(payload).execute()
    return res.data[0]


def update_league(league_id: str, patch: dict[str, Any]) -> Optional[dict[str, Any]]:
    res = (
        get_supabase_admin().table("leagues")
        .update(patch).eq("id", league_id).execute()
    )
    return res.data[0] if res.data else None


def list_seasons(league_id: str) -> list[dict[str, Any]]:
    res = (
        get_supabase_admin().table("seasons")
        .select("*").eq("league_id", league_id)
        .order("starts_on", desc=True).execute()
    )
    return res.data or []


def insert_season(payload: dict[str, Any]) -> dict[str, Any]:
    res = get_supabase_admin().table("seasons").insert(payload).execute()
    return res.data[0]
