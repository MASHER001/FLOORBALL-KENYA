from typing import Any, Optional
from app.database.supabase import get_supabase_admin


def insert_order(payload: dict[str, Any]) -> dict[str, Any]:
    res = get_supabase_admin().table("orders").insert(payload).execute()
    return res.data[0]


def insert_items(items: list[dict[str, Any]]) -> list[dict[str, Any]]:
    if not items:
        return []
    res = get_supabase_admin().table("order_items").insert(items).execute()
    return res.data or []


def get_order(order_id: str) -> Optional[dict[str, Any]]:
    res = (
        get_supabase_admin().table("orders")
        .select("*, order_items(*)")
        .eq("id", order_id).limit(1).execute()
    )
    return res.data[0] if res.data else None


def list_for_customer(customer_id: str, limit: int = 50, offset: int = 0) -> list[dict[str, Any]]:
    res = (
        get_supabase_admin().table("orders")
        .select("*, order_items(*)").eq("customer_id", customer_id)
        .order("created_at", desc=True).range(offset, offset + limit - 1).execute()
    )
    return res.data or []


def update_order(order_id: str, patch: dict[str, Any]) -> Optional[dict[str, Any]]:
    res = (
        get_supabase_admin().table("orders")
        .update(patch).eq("id", order_id).execute()
    )
    return res.data[0] if res.data else None


def get_product(product_id: str) -> Optional[dict[str, Any]]:
    res = (
        get_supabase_admin().table("products")
        .select("*").eq("id", product_id).limit(1).execute()
    )
    return res.data[0] if res.data else None
