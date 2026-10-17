from typing import Any, Optional
from app.database.supabase import get_supabase_admin


def insert_payment(payload: dict[str, Any]) -> dict[str, Any]:
    res = get_supabase_admin().table("payments").insert(payload).execute()
    return res.data[0]


def get_payment(payment_id: str) -> Optional[dict[str, Any]]:
    res = (
        get_supabase_admin().table("payments")
        .select("*").eq("id", payment_id).limit(1).execute()
    )
    return res.data[0] if res.data else None


def list_for_order(order_id: str) -> list[dict[str, Any]]:
    res = (
        get_supabase_admin().table("payments")
        .select("*").eq("order_id", order_id)
        .order("created_at", desc=True).execute()
    )
    return res.data or []


def update_payment(payment_id: str, patch: dict[str, Any]) -> Optional[dict[str, Any]]:
    res = (
        get_supabase_admin().table("payments")
        .update(patch).eq("id", payment_id).execute()
    )
    return res.data[0] if res.data else None


def get_order(order_id: str) -> Optional[dict[str, Any]]:
    res = (
        get_supabase_admin().table("orders")
        .select("*").eq("id", order_id).limit(1).execute()
    )
    return res.data[0] if res.data else None


def insert_webhook_event(payload: dict[str, Any]) -> Optional[dict[str, Any]]:
    try:
        res = (
            get_supabase_admin().table("payment_webhook_events")
            .insert(payload).execute()
        )
        return res.data[0] if res.data else None
    except Exception:
        # Unique violation on event_id — already processed
        return None
