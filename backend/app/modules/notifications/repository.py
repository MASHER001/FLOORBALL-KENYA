from typing import Any, Optional
from app.database.supabase import get_supabase_admin


def list_for_user(user_id: str, unread_only: bool = False,
                  limit: int = 50, offset: int = 0) -> list[dict[str, Any]]:
    q = get_supabase_admin().table("notifications").select("*").eq("user_id", user_id)
    if unread_only:
        q = q.eq("is_read", False)
    res = q.order("created_at", desc=True).range(offset, offset + limit - 1).execute()
    return res.data or []


def insert(payload: dict[str, Any]) -> dict[str, Any]:
    res = get_supabase_admin().table("notifications").insert(payload).execute()
    return res.data[0]


def get(notification_id: str, user_id: str) -> Optional[dict[str, Any]]:
    res = (
        get_supabase_admin().table("notifications")
        .select("*").eq("id", notification_id).eq("user_id", user_id)
        .limit(1).execute()
    )
    return res.data[0] if res.data else None


def mark_read(notification_id: str, user_id: str) -> Optional[dict[str, Any]]:
    res = (
        get_supabase_admin().table("notifications")
        .update({"is_read": True}).eq("id", notification_id).eq("user_id", user_id)
        .execute()
    )
    return res.data[0] if res.data else None


def mark_all_read(user_id: str) -> int:
    res = (
        get_supabase_admin().table("notifications")
        .update({"is_read": True}).eq("user_id", user_id).eq("is_read", False)
        .execute()
    )
    return len(res.data or [])
