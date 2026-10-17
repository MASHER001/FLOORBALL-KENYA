"""
Supabase queries for fixtures.
"""

from typing import Any, Optional

from app.database.supabase import get_supabase_admin


def insert_fixtures(rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
    if not rows:
        return []
    res = get_supabase_admin().table("fixtures").insert(rows).execute()
    return res.data or []


def insert_generation_run(payload: dict[str, Any]) -> dict[str, Any]:
    res = (
        get_supabase_admin()
        .table("fixture_generation_runs")
        .insert(payload)
        .execute()
    )
    return res.data[0]


def get_draw_with_entries(draw_id: str) -> Optional[dict[str, Any]]:
    res = (
        get_supabase_admin()
        .table("tournament_draws")
        .select("*, tournament_draw_entries(*)")
        .eq("id", draw_id)
        .limit(1)
        .execute()
    )
    return res.data[0] if res.data else None


def list_fixtures_for_tournament(tournament_id: str) -> list[dict[str, Any]]:
    res = (
        get_supabase_admin()
        .table("fixtures")
        .select("*")
        .eq("tournament_id", tournament_id)
        .order("kickoff_at")
        .execute()
    )
    return res.data or []


def list_fixtures_for_group(group_id: str) -> list[dict[str, Any]]:
    res = (
        get_supabase_admin()
        .table("fixtures")
        .select("*")
        .eq("group_id", group_id)
        .order("kickoff_at")
        .execute()
    )
    return res.data or []


def get_fixture(fixture_id: str) -> Optional[dict[str, Any]]:
    res = (
        get_supabase_admin()
        .table("fixtures")
        .select("*")
        .eq("id", fixture_id)
        .limit(1)
        .execute()
    )
    return res.data[0] if res.data else None


def update_fixture(fixture_id: str, patch: dict[str, Any]) -> Optional[dict[str, Any]]:
    res = (
        get_supabase_admin()
        .table("fixtures")
        .update(patch)
        .eq("id", fixture_id)
        .execute()
    )
    return res.data[0] if res.data else None
