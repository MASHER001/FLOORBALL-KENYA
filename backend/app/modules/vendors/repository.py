from typing import Any, Optional
from app.database.supabase import get_supabase_admin


def get_by_owner(owner_id: str) -> Optional[dict[str, Any]]:
    res = (
        get_supabase_admin().table("vendors").select("*")
        .eq("owner_id", owner_id).limit(1).execute()
    )
    return res.data[0] if res.data else None


def get(vendor_id: str) -> Optional[dict[str, Any]]:
    res = (
        get_supabase_admin().table("vendors").select("*")
        .eq("id", vendor_id).limit(1).execute()
    )
    return res.data[0] if res.data else None


def update(vendor_id: str, patch: dict[str, Any]) -> Optional[dict[str, Any]]:
    res = (
        get_supabase_admin().table("vendors").update(patch)
        .eq("id", vendor_id).execute()
    )
    return res.data[0] if res.data else None


def my_products(vendor_id: str) -> list[dict[str, Any]]:
    res = (
        get_supabase_admin().table("products").select("*")
        .eq("vendor_id", vendor_id).order("created_at", desc=True).execute()
    )
    return res.data or []
