"""
Supabase queries for tournament draws.
"""

from typing import Any, Optional

from app.database.supabase import get_supabase_admin


def insert_draw(payload: dict[str, Any]) -> dict[str, Any]:
    res = get_supabase_admin().table("tournament_draws").insert(payload).execute()
    return res.data[0]


def insert_entries(entries: list[dict[str, Any]]) -> list[dict[str, Any]]:
    if not entries:
        return []
    res = (
        get_supabase_admin()
        .table("tournament_draw_entries")
        .insert(entries)
        .execute()
    )
    return res.data or []


def get_draw(draw_id: str) -> Optional[dict[str, Any]]:
    res = (
        get_supabase_admin()
        .table("tournament_draws")
        .select("*, tournament_draw_entries(*)")
        .eq("id", draw_id)
        .limit(1)
        .execute()
    )
    return res.data[0] if res.data else None


def list_draws_for_tournament(tournament_id: str) -> list[dict[str, Any]]:
    res = (
        get_supabase_admin()
        .table("tournament_draws")
        .select("*")
        .eq("tournament_id", tournament_id)
        .order("version", desc=True)
        .execute()
    )
    return res.data or []


def update_draw(draw_id: str, patch: dict[str, Any]) -> Optional[dict[str, Any]]:
    res = (
        get_supabase_admin()
        .table("tournament_draws")
        .update(patch)
        .eq("id", draw_id)
        .execute()
    )
    return res.data[0] if res.data else None


def next_version(tournament_id: str) -> int:
    res = (
        get_supabase_admin()
        .table("tournament_draws")
        .select("version")
        .eq("tournament_id", tournament_id)
        .order("version", desc=True)
        .limit(1)
        .execute()
    )
    if res.data:
        return int(res.data[0]["version"]) + 1
    return 1
