"""
Supabase queries for advertisements.
"""

from typing import Any, Optional

from app.database.supabase import get_supabase_admin


def _table():
    return get_supabase_admin().table("advertising_campaigns")


def get_campaign_by_id(campaign_id: str) -> Optional[dict[str, Any]]:
    res = (
        _table()
        .select("*, advertisement_creatives(*)")
        .eq("id", campaign_id)
        .limit(1)
        .execute()
    )
    return res.data[0] if res.data else None


def list_campaigns(
    status: Optional[str] = None,
    limit: int = 50,
    offset: int = 0,
) -> list[dict[str, Any]]:
    q = _table().select("*").order("created_at", desc=True)
    if status:
        q = q.eq("status", status)
    res = q.range(offset, offset + limit - 1).execute()
    return res.data or []


def insert_campaign(payload: dict[str, Any]) -> dict[str, Any]:
    res = _table().insert(payload).execute()
    return res.data[0]


def update_campaign(
    campaign_id: str, patch: dict[str, Any]
) -> Optional[dict[str, Any]]:
    res = _table().update(patch).eq("id", campaign_id).execute()
    return res.data[0] if res.data else None


def assign_placement(campaign_id: str, placement_id: str) -> dict[str, Any]:
    res = (
        get_supabase_admin()
        .table("campaign_placement_assignments")
        .upsert(
            {"campaign_id": campaign_id, "placement_id": placement_id},
            on_conflict="campaign_id,placement_id",
        )
        .execute()
    )
    return res.data[0] if res.data else {}


def list_campaigns_for_placement(placement_id: str) -> list[dict[str, Any]]:
    sb = get_supabase_admin()

    assigned = (
        sb.table("campaign_placement_assignments")
        .select("campaign_id")
        .eq("placement_id", placement_id)
        .execute()
    )
    campaign_ids = [row["campaign_id"] for row in (assigned.data or [])]
    if not campaign_ids:
        return []

    res = (
        sb.table("advertising_campaigns")
        .select("*, advertisement_creatives(*)")
        .in_("id", campaign_ids)
        .eq("status", "active")
        .order("priority", desc=True)
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
