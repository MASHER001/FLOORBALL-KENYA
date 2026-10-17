"""
Super Admin router
==================

Super-admin-only endpoints:
    - Promote/demote users to admin
    - View + edit platform settings (commission rate, etc.)
    - View audit logs
    - Danger zone: hard-delete vendors, etc.
"""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field

from app.core.dependencies import require_super_admin
from app.database.supabase import get_supabase_admin

router = APIRouter(prefix="/superadmin", tags=["Super Admin"])


# ---------- Inline schemas ----------
class RoleChangeRequest(BaseModel):
    role: str = Field(..., pattern="^(admin|super_admin|team_manager|player|vendor|customer)$")


class SettingUpdate(BaseModel):
    value: object  # any JSON value


# ============================================================
# POST /superadmin/admins/{user_id}  → promote
# ============================================================
@router.post(
    "/admins/{user_id}",
    summary="Promote a user to admin (super admin only)",
)
def promote_to_admin(user_id: str, _sa: dict = Depends(require_super_admin)):
    sb = get_supabase_admin()
    existing = sb.table("profiles").select("*").eq("id", user_id).limit(1).execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="User not found")

    sb.table("profiles").update({"role": "admin"}).eq("id", user_id).execute()
    updated = sb.table("profiles").select("*").eq("id", user_id).limit(1).execute()

    _audit_log(_sa["id"], "promote_admin", "user", user_id)
    return updated.data[0]


# ============================================================
# DELETE /superadmin/admins/{user_id}  → demote
# ============================================================
@router.delete(
    "/admins/{user_id}",
    summary="Demote an admin back to customer (super admin only)",
)
def demote_admin(
    user_id: str,
    sa: dict = Depends(require_super_admin),
):
    if user_id == sa["id"]:
        raise HTTPException(status_code=400, detail="You cannot demote yourself")
    sb = get_supabase_admin()
    sb.table("profiles").update({"role": "customer"}).eq("id", user_id).execute()
    updated = sb.table("profiles").select("*").eq("id", user_id).limit(1).execute()
    if not updated.data:
        raise HTTPException(status_code=404, detail="User not found")

    _audit_log(sa["id"], "demote_admin", "user", user_id)
    return updated.data[0]


# ============================================================
# PATCH /superadmin/users/{user_id}/role  → change any role
# ============================================================
@router.patch(
    "/users/{user_id}/role",
    summary="Change any user's role (super admin only)",
)
def change_role(
    user_id: str,
    payload: RoleChangeRequest,
    sa: dict = Depends(require_super_admin),
):
    if user_id == sa["id"]:
        raise HTTPException(status_code=400, detail="You cannot change your own role")
    sb = get_supabase_admin()
    sb.table("profiles").update({"role": payload.role}).eq("id", user_id).execute()
    updated = sb.table("profiles").select("*").eq("id", user_id).limit(1).execute()
    if not updated.data:
        raise HTTPException(status_code=404, detail="User not found")

    _audit_log(sa["id"], f"set_role:{payload.role}", "user", user_id)
    return updated.data[0]


# ============================================================
# SETTINGS
# ============================================================
@router.get("/settings", summary="View all platform settings (super admin only)")
def list_settings(_sa: dict = Depends(require_super_admin)):
    sb = get_supabase_admin()
    resp = sb.table("platform_settings").select("*").execute()
    return resp.data or []


@router.put(
    "/settings/{key}",
    summary="Update a platform setting (super admin only)",
)
def update_setting(
    key: str,
    payload: SettingUpdate,
    sa: dict = Depends(require_super_admin),
):
    sb = get_supabase_admin()
    sb.table("platform_settings").upsert(
        {
            "key": key,
            "value": payload.value,
            "updated_by": sa["id"],
        },
        on_conflict="key",
    ).execute()

    _audit_log(sa["id"], f"update_setting:{key}", "setting", key)
    return {"key": key, "value": payload.value}


# ============================================================
# AUDIT LOGS
# ============================================================
@router.get("/audit-logs", summary="View audit logs (super admin only)")
def list_audit_logs(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=200),
    _sa: dict = Depends(require_super_admin),
):
    sb = get_supabase_admin()
    offset = (page - 1) * page_size
    result = (
        sb.table("audit_logs")
        .select("*", count="exact")
        .order("created_at", desc=True)
        .range(offset, offset + page_size - 1)
        .execute()
    )
    return {
        "total": result.count or 0,
        "page": page,
        "page_size": page_size,
        "items": result.data or [],
    }


# ============================================================
# DANGER ZONE
# ============================================================
@router.delete(
    "/vendors/{vendor_id}",
    summary="Hard-delete a vendor (super admin only)",
)
def hard_delete_vendor(vendor_id: str, sa: dict = Depends(require_super_admin)):
    sb = get_supabase_admin()
    sb.table("vendors").delete().eq("id", vendor_id).execute()
    _audit_log(sa["id"], "hard_delete_vendor", "vendor", vendor_id)
    return {"success": True}


# ============================================================
# Helpers
# ============================================================
def _audit_log(
    actor_id: str,
    action: str,
    target_type: str,
    target_id: str,
) -> None:
    try:
        sb = get_supabase_admin()
        sb.table("audit_logs").insert(
            {
                "actor_id": actor_id,
                "actor_role": "super_admin",
                "action": action,
                "target_type": target_type,
                "target_id": target_id,
            }
        ).execute()
    except Exception as exc:
        # Never break the request because of audit logging
        print(f"[audit_log] {exc}")