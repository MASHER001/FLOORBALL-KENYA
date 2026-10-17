from typing import Any, Optional

from app.database.supabase import get_supabase_admin


def list_placements() -> list[dict[str, Any]]:
    res = (
        get_supabase_admin()
        .table("advertisement_placements")
        .select("*")
        .eq("is_active", True)
        .order("slug")
        .execute()
    )
    return res.data or []


def get_placement_by_slug(slug: str) -> Optional[dict[str, Any]]:
    res = (
        get_supabase_admin()
        .table("advertisement_placements")
        .select("*")
        .eq("slug", slug)
        .limit(1)
        .execute()
    )
    return res.data[0] if res.data else None
