from typing import Any, Optional
from app.database.supabase import get_supabase_admin


# ---------- Profiles ----------

def get_by_user(user_id: str) -> Optional[dict[str, Any]]:
    res = (
        get_supabase_admin().table("official_profiles").select("*")
        .eq("user_id", user_id).limit(1).execute()
    )
    return res.data[0] if res.data else None


def get(official_id: str) -> Optional[dict[str, Any]]:
    res = (
        get_supabase_admin().table("official_profiles").select("*")
        .eq("id", official_id).limit(1).execute()
    )
    return res.data[0] if res.data else None


def list_all(limit: int = 100, offset: int = 0) -> list[dict[str, Any]]:
    res = (
        get_supabase_admin().table("official_profiles").select("*")
        .order("created_at", desc=True).range(offset, offset + limit - 1).execute()
    )
    return res.data or []


def insert(payload: dict[str, Any]) -> dict[str, Any]:
    res = get_supabase_admin().table("official_profiles").insert(payload).execute()
    return res.data[0]


def update(official_id: str, patch: dict[str, Any]) -> Optional[dict[str, Any]]:
    res = (
        get_supabase_admin().table("official_profiles").update(patch)
        .eq("id", official_id).execute()
    )
    return res.data[0] if res.data else None


# ---------- Availability ----------

def list_availability(official_id: str) -> list[dict[str, Any]]:
    res = (
        get_supabase_admin().table("official_availability").select("*")
        .eq("official_id", official_id).order("available_on").execute()
    )
    return res.data or []


def upsert_availability(payload: dict[str, Any]) -> dict[str, Any]:
    res = (
        get_supabase_admin().table("official_availability")
        .upsert(payload, on_conflict="official_id,available_on").execute()
    )
    return res.data[0]


def is_available(official_id: str, on_date: str) -> bool:
    res = (
        get_supabase_admin().table("official_availability").select("id")
        .eq("official_id", official_id).eq("available_on", on_date)
        .limit(1).execute()
    )
    return bool(res.data)


# ---------- Qualifications ----------

def list_qualifications(official_id: str) -> list[dict[str, Any]]:
    res = (
        get_supabase_admin().table("official_qualifications").select("*")
        .eq("official_id", official_id).execute()
    )
    return res.data or []


def add_qualification(payload: dict[str, Any]) -> dict[str, Any]:
    res = (
        get_supabase_admin().table("official_qualifications")
        .upsert(payload, on_conflict="official_id,qualification").execute()
    )
    return res.data[0]


def officials_with_qualification(qualification: str) -> list[str]:
    res = (
        get_supabase_admin().table("official_qualifications").select("official_id")
        .eq("qualification", qualification).execute()
    )
    return [r["official_id"] for r in (res.data or [])]


# ---------- Assignments ----------

def insert_assignment(payload: dict[str, Any]) -> dict[str, Any]:
    res = (
        get_supabase_admin().table("match_official_assignments")
        .insert(payload).execute()
    )
    return res.data[0]


def get_assignment(assignment_id: str) -> Optional[dict[str, Any]]:
    res = (
        get_supabase_admin().table("match_official_assignments").select("*")
        .eq("id", assignment_id).limit(1).execute()
    )
    return res.data[0] if res.data else None


def assignments_for_match(match_id: str) -> list[dict[str, Any]]:
    res = (
        get_supabase_admin().table("match_official_assignments").select("*")
        .eq("match_id", match_id).execute()
    )
    return res.data or []


def assignments_for_official(official_id: str) -> list[dict[str, Any]]:
    res = (
        get_supabase_admin().table("match_official_assignments").select("*")
        .eq("official_id", official_id).order("assigned_at", desc=True).execute()
    )
    return res.data or []


def update_assignment(assignment_id: str, patch: dict[str, Any]) -> Optional[dict[str, Any]]:
    res = (
        get_supabase_admin().table("match_official_assignments").update(patch)
        .eq("id", assignment_id).execute()
    )
    return res.data[0] if res.data else None


def get_fixture(match_id: str) -> Optional[dict[str, Any]]:
    res = (
        get_supabase_admin().table("fixtures").select("*")
        .eq("id", match_id).limit(1).execute()
    )
    return res.data[0] if res.data else None


def fixtures_for_tournament(tournament_id: str) -> list[dict[str, Any]]:
    res = (
        get_supabase_admin().table("fixtures").select("*")
        .eq("tournament_id", tournament_id)
        .order("kickoff_at").execute()
    )
    return res.data or []
