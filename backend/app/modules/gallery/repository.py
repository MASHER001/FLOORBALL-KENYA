"""
Supabase queries for the gallery.
"""

from typing import Any, Optional

from app.database.supabase import get_supabase_admin


# ---------- Albums ----------

def list_published_albums(limit: int = 100, offset: int = 0) -> list[dict[str, Any]]:
    res = (
        get_supabase_admin()
        .table("gallery_albums")
        .select("*")
        .eq("is_published", True)
        .order("created_at", desc=True)
        .range(offset, offset + limit - 1)
        .execute()
    )
    return res.data or []


def get_album(album_id: str) -> Optional[dict[str, Any]]:
    res = (
        get_supabase_admin()
        .table("gallery_albums")
        .select("*")
        .eq("id", album_id)
        .limit(1)
        .execute()
    )
    return res.data[0] if res.data else None


def get_album_by_slug(slug: str) -> Optional[dict[str, Any]]:
    res = (
        get_supabase_admin()
        .table("gallery_albums")
        .select("*")
        .eq("slug", slug)
        .limit(1)
        .execute()
    )
    return res.data[0] if res.data else None


def insert_album(payload: dict[str, Any]) -> dict[str, Any]:
    res = get_supabase_admin().table("gallery_albums").insert(payload).execute()
    return res.data[0]


def update_album(album_id: str, patch: dict[str, Any]) -> Optional[dict[str, Any]]:
    res = (
        get_supabase_admin()
        .table("gallery_albums")
        .update(patch)
        .eq("id", album_id)
        .execute()
    )
    return res.data[0] if res.data else None


# ---------- Media ----------

def list_published_media(
    album_id: Optional[str] = None,
    media_type: Optional[str] = None,
    limit: int = 100,
    offset: int = 0,
) -> list[dict[str, Any]]:
    q = (
        get_supabase_admin()
        .table("gallery_media")
        .select("*")
        .eq("status", "approved")
        .order("created_at", desc=True)
    )
    if album_id:
        q = q.eq("album_id", album_id)
    if media_type:
        q = q.eq("media_type", media_type)
    res = q.range(offset, offset + limit - 1).execute()
    return res.data or []


def list_media_for_album(album_id: str) -> list[dict[str, Any]]:
    res = (
        get_supabase_admin()
        .table("gallery_media")
        .select("*")
        .eq("album_id", album_id)
        .eq("status", "approved")
        .order("created_at", desc=True)
        .execute()
    )
    return res.data or []


def get_media(media_id: str) -> Optional[dict[str, Any]]:
    res = (
        get_supabase_admin()
        .table("gallery_media")
        .select("*")
        .eq("id", media_id)
        .limit(1)
        .execute()
    )
    return res.data[0] if res.data else None


def insert_media(payload: dict[str, Any]) -> dict[str, Any]:
    res = get_supabase_admin().table("gallery_media").insert(payload).execute()
    return res.data[0]


def update_media(media_id: str, patch: dict[str, Any]) -> Optional[dict[str, Any]]:
    res = (
        get_supabase_admin()
        .table("gallery_media")
        .update(patch)
        .eq("id", media_id)
        .execute()
    )
    return res.data[0] if res.data else None