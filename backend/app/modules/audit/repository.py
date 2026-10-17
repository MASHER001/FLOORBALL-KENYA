"""
Supabase queries for audit logs.
"""

from typing import Any, Optional

from app.database.supabase import get_supabase_admin


def insert_log(payload: dict[str, Any]) -> Optional[dict[str, Any]]:
    try:
        res = (
            get_supabase_admin()
            .table("audit_logs")
            .insert(payload)
            .execute()
        )
        return res.data[0] if res.data else None
    except Exception:
        # Never let an audit failure break the business action.
        return None


def list_logs(
    actor_id: Optional[str] = None,
    action: Optional[str] = None,
    resource_type: Optional[str] = None,
    resource_id: Optional[str] = None,
    limit: int = 50,
    offset: int = 0,
) -> tuple[list[dict[str, Any]], int]:
    sb = get_supabase_admin()
    q = sb.table("audit_logs").select("*", count="exact")
    if actor_id:
        q = q.eq("actor_id", actor_id)
    if action:
        q = q.eq("action", action)
    if resource_type:
        q = q.eq("resource_type", resource_type)
    if resource_id:
        q = q.eq("resource_id", resource_id)
    q = q.order("occurred_at", desc=True).range(offset, offset + limit - 1)
    res = q.execute()
    return (res.data or [], res.count or 0)
