"""
Users router
============

Profile CRUD + admin-only user listing/management.
"""

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.core.dependencies import (
    get_current_user,
    require_admin,
    require_super_admin,
)
from app.database.supabase import get_supabase_admin
from app.schemas.user import (
    UserAdminUpdate,
    UserListResponse,
    UserResponse,
    UserStatusUpdate,
    UserUpdate,
)

router = APIRouter(prefix="/users", tags=["Users"])


# ============================================================
# GET /users  — admin only
# ============================================================
@router.get(
    "",
    response_model=UserListResponse,
    summary="List all users (admin only)",
)
def list_users(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    role: str | None = Query(None, description="Filter by role"),
    q: str | None = Query(None, description="Search by email/full_name"),
    _admin: dict = Depends(require_admin),
):
    sb = get_supabase_admin()
    offset = (page - 1) * page_size

    query = sb.table("profiles").select("*", count="exact")
    if role:
        query = query.eq("role", role)
    if q:
        query = query.or_(f"email.ilike.%{q}%,full_name.ilike.%{q}%")

    result = query.order("created_at", desc=True).range(offset, offset + page_size - 1).execute()

    return {
        "total": result.count or 0,
        "page": page,
        "page_size": page_size,
        "items": result.data or [],
    }


# ============================================================
# GET /users/{user_id}
# ============================================================
@router.get(
    "/{user_id}",
    response_model=UserResponse,
    summary="Get a single user's profile",
)
def get_user(user_id: str, current: dict = Depends(get_current_user)):
    """
    Any authenticated user can view any profile.
    Only self or admin can view private fields — for MVP all fields are public.
    """
    sb = get_supabase_admin()
    resp = sb.table("profiles").select("*").eq("id", user_id).limit(1).execute()
    if not resp.data:
        raise HTTPException(status_code=404, detail="User not found")
    return resp.data[0]


# ============================================================
# PUT /users/{user_id}  — self only
# ============================================================
@router.put(
    "/{user_id}",
    response_model=UserResponse,
    summary="Update your own profile",
)
def update_user(
    user_id: str,
    payload: UserUpdate,
    current: dict = Depends(get_current_user),
):
    if current["id"] != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update your own profile",
        )

    data = payload.model_dump(exclude_unset=True)
    if not data:
        raise HTTPException(status_code=400, detail="No fields to update")

    sb = get_supabase_admin()
    sb.table("profiles").update(data).eq("id", user_id).execute()
    updated = sb.table("profiles").select("*").eq("id", user_id).limit(1).execute()
    return updated.data[0]


# ============================================================
# PATCH /users/{user_id}/status  — admin only
# ============================================================
@router.patch(
    "/{user_id}/status",
    response_model=UserResponse,
    summary="Activate/deactivate a user (admin only)",
)
def set_user_status(
    user_id: str,
    payload: UserStatusUpdate,
    admin: dict = Depends(require_admin),
):
    if admin["id"] == user_id and payload.is_active is False:
        raise HTTPException(status_code=400, detail="You cannot deactivate yourself")

    sb = get_supabase_admin()
    sb.table("profiles").update({"is_active": payload.is_active}).eq("id", user_id).execute()
    updated = sb.table("profiles").select("*").eq("id", user_id).limit(1).execute()
    if not updated.data:
        raise HTTPException(status_code=404, detail="User not found")
    return updated.data[0]


# ============================================================
# PUT /users/{user_id}/admin  — admin editing any profile
# ============================================================
@router.put(
    "/{user_id}/admin",
    response_model=UserResponse,
    summary="Admin update of any profile",
)
def admin_update_user(
    user_id: str,
    payload: UserAdminUpdate,
    admin: dict = Depends(require_admin),
):
    data = payload.model_dump(exclude_unset=True)
    if not data:
        raise HTTPException(status_code=400, detail="No fields to update")

    # Only super admin can change roles
    if "role" in data and admin["role"] != "super_admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only a super admin can change user roles",
        )

    sb = get_supabase_admin()
    sb.table("profiles").update(data).eq("id", user_id).execute()
    updated = sb.table("profiles").select("*").eq("id", user_id).limit(1).execute()
    if not updated.data:
        raise HTTPException(status_code=404, detail="User not found")
    return updated.data[0]


# ============================================================
# DELETE /users/{user_id}  — super admin only
# ============================================================
@router.delete(
    "/{user_id}",
    summary="Delete a user (super admin only)",
)
def delete_user(
    user_id: str,
    admin: dict = Depends(require_super_admin),
):
    if admin["id"] == user_id:
        raise HTTPException(status_code=400, detail="You cannot delete yourself")

    sb = get_supabase_admin()
    # Deletes from auth.users → cascades to public.profiles
    sb.auth.admin.delete_user(user_id)
    return {"success": True, "message": "User deleted"}