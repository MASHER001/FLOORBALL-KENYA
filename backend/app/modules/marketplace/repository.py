from typing import Any, Optional
from app.database.supabase import get_supabase_admin


def list_public_vendors(limit: int = 100, offset: int = 0) -> list[dict[str, Any]]:
    res = (
        get_supabase_admin().table("vendors")
        .select("*").eq("is_active", True).eq("is_verified", True)
        .order("name").range(offset, offset + limit - 1).execute()
    )
    return res.data or []


def get_vendor(vendor_id: str) -> Optional[dict[str, Any]]:
    res = (
        get_supabase_admin().table("vendors")
        .select("*").eq("id", vendor_id).limit(1).execute()
    )
    return res.data[0] if res.data else None


def get_vendor_by_slug(slug: str) -> Optional[dict[str, Any]]:
    res = (
        get_supabase_admin().table("vendors")
        .select("*").eq("slug", slug).limit(1).execute()
    )
    return res.data[0] if res.data else None


def insert_vendor(payload: dict[str, Any]) -> dict[str, Any]:
    res = get_supabase_admin().table("vendors").insert(payload).execute()
    return res.data[0]


def update_vendor(vendor_id: str, patch: dict[str, Any]) -> Optional[dict[str, Any]]:
    res = (
        get_supabase_admin().table("vendors")
        .update(patch).eq("id", vendor_id).execute()
    )
    return res.data[0] if res.data else None


def list_products(
    status: Optional[str] = "approved",
    vendor_id: Optional[str] = None,
    limit: int = 100, offset: int = 0,
) -> list[dict[str, Any]]:
    q = get_supabase_admin().table("products").select("*")
    if status:
        q = q.eq("status", status)
    if vendor_id:
        q = q.eq("vendor_id", vendor_id)
    res = q.order("created_at", desc=True).range(offset, offset + limit - 1).execute()
    return res.data or []


def get_product(product_id: str) -> Optional[dict[str, Any]]:
    res = (
        get_supabase_admin().table("products")
        .select("*").eq("id", product_id).limit(1).execute()
    )
    return res.data[0] if res.data else None


def insert_product(payload: dict[str, Any]) -> dict[str, Any]:
    res = get_supabase_admin().table("products").insert(payload).execute()
    return res.data[0]


def update_product(product_id: str, patch: dict[str, Any]) -> Optional[dict[str, Any]]:
    res = (
        get_supabase_admin().table("products")
        .update(patch).eq("id", product_id).execute()
    )
    return res.data[0] if res.data else None
