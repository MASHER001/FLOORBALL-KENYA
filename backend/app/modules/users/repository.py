from typing import Any, Optional
from app.database.supabase import get_supabase_admin


def get_profile(user_id: str) -> Optional[dict[str, Any]]:
    res = (
        get_supabase_admin().table("profiles").select("*")
        .eq("id", user_id).limit(1).execute()
    )
    return res.data[0] if res.data else None


def list_users(search: Optional[str] = None, limit: int = 50,
               offset: int = 0) -> list[dict[str, Any]]:
    q = get_supabase_admin().table("profiles").select("*")
    if search:
        q = q.ilike("email", f"%{search}%")
    res = q.order("created_at", desc=True).range(offset, offset + limit - 1).execute()
    return res.data or []


def update_profile(user_id: str, patch: dict[str, Any]) -> Optional[dict[str, Any]]:
    res = (
        get_supabase_admin().table("profiles").update(patch)
        .eq("id", user_id).execute()
    )
    return res.data[0] if res.data else None
