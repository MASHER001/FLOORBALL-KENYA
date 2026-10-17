from typing import Any, Optional
from app.database.supabase import get_supabase_admin


def get_by_user(user_id: str) -> Optional[dict[str, Any]]:
    res = (
        get_supabase_admin().table("player_profiles").select("*")
        .eq("user_id", user_id).limit(1).execute()
    )
    return res.data[0] if res.data else None


def get(player_id: str) -> Optional[dict[str, Any]]:
    res = (
        get_supabase_admin().table("player_profiles").select("*")
        .eq("id", player_id).limit(1).execute()
    )
    return res.data[0] if res.data else None


def insert(payload: dict[str, Any]) -> dict[str, Any]:
    res = get_supabase_admin().table("player_profiles").insert(payload).execute()
    return res.data[0]


def update(player_id: str, patch: dict[str, Any]) -> Optional[dict[str, Any]]:
    res = (
        get_supabase_admin().table("player_profiles").update(patch)
        .eq("id", player_id).execute()
    )
    return res.data[0] if res.data else None


def list_for_team(team_id: str) -> list[dict[str, Any]]:
    sb = get_supabase_admin()
    members = (
        sb.table("team_memberships").select("user_id")
        .eq("team_id", team_id).eq("is_active", True).execute()
    )
    user_ids = [m["user_id"] for m in (members.data or [])]
    if not user_ids:
        return []
    res = (
        sb.table("player_profiles").select("*").in_("user_id", user_ids).execute()
    )
    return res.data or []
