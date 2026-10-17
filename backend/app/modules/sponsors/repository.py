from typing import Any, Optional
from app.database.supabase import get_supabase_admin


def list_public() -> list[dict[str, Any]]:
    res = (
        get_supabase_admin().table("sponsors").select("*")
        .eq("is_public", True).order("tier").execute()
    )
    return res.data or []


def get(sponsor_id: str) -> Optional[dict[str, Any]]:
    res = (
        get_supabase_admin().table("sponsors").select("*")
        .eq("id", sponsor_id).limit(1).execute()
    )
    return res.data[0] if res.data else None


def get_by_slug(slug: str) -> Optional[dict[str, Any]]:
    res = (
        get_supabase_admin().table("sponsors").select("*")
        .eq("slug", slug).limit(1).execute()
    )
    return res.data[0] if res.data else None


def insert_sponsor(payload: dict[str, Any]) -> dict[str, Any]:
    res = get_supabase_admin().table("sponsors").insert(payload).execute()
    return res.data[0]


def insert_package(payload: dict[str, Any]) -> dict[str, Any]:
    res = get_supabase_admin().table("sponsorship_packages").insert(payload).execute()
    return res.data[0]


def list_packages() -> list[dict[str, Any]]:
    res = (
        get_supabase_admin().table("sponsorship_packages").select("*")
        .eq("is_active", True).order("price_cents").execute()
    )
    return res.data or []
def update_sponsor(sponsor_id: str, patch: dict[str, Any]) -> Optional[dict[str, Any]]:
    res = (
        get_supabase_admin().table("sponsors").update(patch)
        .eq("id", sponsor_id).execute()
    )
    return res.data[0] if res.data else None