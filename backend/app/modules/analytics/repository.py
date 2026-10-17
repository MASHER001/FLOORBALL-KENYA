"""
Supabase queries for analytics.
"""

from typing import Any, Optional

from app.database.supabase import get_supabase_admin


def insert_event(payload: dict[str, Any]) -> Optional[dict[str, Any]]:
    """
    Insert a campaign event. If the dedup_key already exists,
    Supabase raises a unique violation; we swallow it and return None.
    """
    try:
        res = (
            get_supabase_admin()
            .table("campaign_events")
            .insert(payload)
            .execute()
        )
        return res.data[0] if res.data else None
    except Exception:
        # Unique violation on dedup_key — event already recorded.
        return None


def count_events(
    event_type: str,
    campaign_id: Optional[str] = None,
    placement_id: Optional[str] = None,
    since: Optional[str] = None,
    until: Optional[str] = None,
) -> int:
    sb = get_supabase_admin()
    q = (
        sb.table("campaign_events")
        .select("id", count="exact")
        .eq("event_type", event_type)
    )
    if campaign_id:
        q = q.eq("campaign_id", campaign_id)
    if placement_id:
        q = q.eq("placement_id", placement_id)
    if since:
        q = q.gte("occurred_at", since)
    if until:
        q = q.lte("occurred_at", until)
    res = q.execute()
    return res.count or 0


def list_campaign_ids_with_events() -> list[str]:
    res = (
        get_supabase_admin()
        .table("campaign_events")
        .select("campaign_id")
        .execute()
    )
    seen = set()
    out = []
    for row in (res.data or []):
        cid = row["campaign_id"]
        if cid not in seen:
            seen.add(cid)
            out.append(cid)
    return out


def list_placements_with_events() -> list[str]:
    res = (
        get_supabase_admin()
        .table("campaign_events")
        .select("placement_id")
        .execute()
    )
    seen = set()
    out = []
    for row in (res.data or []):
        pid = row.get("placement_id")
        if pid and pid not in seen:
            seen.add(pid)
            out.append(pid)
    return out


def get_campaign_title(campaign_id: str) -> Optional[str]:
    res = (
        get_supabase_admin()
        .table("advertising_campaigns")
        .select("title")
        .eq("id", campaign_id)
        .limit(1)
        .execute()
    )
    return res.data[0]["title"] if res.data else None


def get_placement(placement_id: str) -> Optional[dict[str, Any]]:
    res = (
        get_supabase_admin()
        .table("advertisement_placements")
        .select("*")
        .eq("id", placement_id)
        .limit(1)
        .execute()
    )
    return res.data[0] if res.data else None


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
