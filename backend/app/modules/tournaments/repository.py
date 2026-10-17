from typing import Any, Optional
from app.database.supabase import get_supabase_admin


def list_tournaments(status: Optional[str] = None, limit: int = 100,
                     offset: int = 0) -> list[dict[str, Any]]:
    q = get_supabase_admin().table("tournaments").select("*")
    if status:
        q = q.eq("status", status)
    res = q.order("starts_on", desc=True).range(offset, offset + limit - 1).execute()
    return res.data or []


def get_tournament(tournament_id: str) -> Optional[dict[str, Any]]:
    res = (
        get_supabase_admin().table("tournaments").select("*")
        .eq("id", tournament_id).limit(1).execute()
    )
    return res.data[0] if res.data else None


def get_by_slug(slug: str) -> Optional[dict[str, Any]]:
    res = (
        get_supabase_admin().table("tournaments").select("*")
        .eq("slug", slug).limit(1).execute()
    )
    return res.data[0] if res.data else None


def insert_tournament(payload: dict[str, Any]) -> dict[str, Any]:
    res = get_supabase_admin().table("tournaments").insert(payload).execute()
    return res.data[0]


def update_tournament(tournament_id: str, patch: dict[str, Any]) -> Optional[dict[str, Any]]:
    res = (
        get_supabase_admin().table("tournaments").update(patch)
        .eq("id", tournament_id).execute()
    )
    return res.data[0] if res.data else None


def list_registrations(tournament_id: str) -> list[dict[str, Any]]:
    res = (
        get_supabase_admin().table("tournament_registrations").select("*")
        .eq("tournament_id", tournament_id).order("registered_at").execute()
    )
    return res.data or []


def get_registration(reg_id: str) -> Optional[dict[str, Any]]:
    res = (
        get_supabase_admin().table("tournament_registrations").select("*")
        .eq("id", reg_id).limit(1).execute()
    )
    return res.data[0] if res.data else None


def insert_registration(payload: dict[str, Any]) -> dict[str, Any]:
    res = (
        get_supabase_admin().table("tournament_registrations")
        .insert(payload).execute()
    )
    return res.data[0]


def update_registration(reg_id: str, patch: dict[str, Any]) -> Optional[dict[str, Any]]:
    res = (
        get_supabase_admin().table("tournament_registrations").update(patch)
        .eq("id", reg_id).execute()
    )
    return res.data[0] if res.data else None


def get_team(team_id: str) -> Optional[dict[str, Any]]:
    res = (
        get_supabase_admin().table("teams").select("*")
        .eq("id", team_id).limit(1).execute()
    )
    return res.data[0] if res.data else None
