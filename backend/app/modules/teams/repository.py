from typing import Any, Optional
from app.database.supabase import get_supabase_admin


def list_teams(limit: int = 100, offset: int = 0) -> list[dict[str, Any]]:
    res = (
        get_supabase_admin().table("teams").select("*")
        .eq("is_active", True).order("name")
        .range(offset, offset + limit - 1).execute()
    )
    return res.data or []


def get_team(team_id: str) -> Optional[dict[str, Any]]:
    res = (
        get_supabase_admin().table("teams").select("*")
        .eq("id", team_id).limit(1).execute()
    )
    return res.data[0] if res.data else None


def get_team_by_slug(slug: str) -> Optional[dict[str, Any]]:
    res = (
        get_supabase_admin().table("teams").select("*")
        .eq("slug", slug).limit(1).execute()
    )
    return res.data[0] if res.data else None


def insert_team(payload: dict[str, Any]) -> dict[str, Any]:
    res = get_supabase_admin().table("teams").insert(payload).execute()
    return res.data[0]


def update_team(team_id: str, patch: dict[str, Any]) -> Optional[dict[str, Any]]:
    res = (
        get_supabase_admin().table("teams").update(patch)
        .eq("id", team_id).execute()
    )
    return res.data[0] if res.data else None


def list_memberships(team_id: str) -> list[dict[str, Any]]:
    res = (
        get_supabase_admin().table("team_memberships").select("*")
        .eq("team_id", team_id).eq("is_active", True)
        .order("joined_on", desc=True).execute()
    )
    return res.data or []


def insert_membership(payload: dict[str, Any]) -> dict[str, Any]:
    res = get_supabase_admin().table("team_memberships").insert(payload).execute()
    return res.data[0]


def end_membership(membership_id: str, left_on: str) -> Optional[dict[str, Any]]:
    res = (
        get_supabase_admin().table("team_memberships")
        .update({"left_on": left_on, "is_active": False})
        .eq("id", membership_id).execute()
    )
    return res.data[0] if res.data else None
