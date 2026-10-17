"""
FastAPI dependencies
====================

Reusable dependencies for:
    - Authenticating requests (JWT -> user profile)
    - Enforcing role-based access (RBAC)

Usage in a router:
    from app.core.dependencies import get_current_user, require_admin, require_super_admin

    @router.get("/me")
    def me(user = Depends(get_current_user)):
        return user

    @router.post("/matches/{id}/result")
    def record_result(admin = Depends(require_admin)):
        ...

    @router.put("/settings/commission")
    def update_commission(super_admin = Depends(require_super_admin)):
        ...
"""

from typing import Any, Callable, Dict

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.security import (
    TokenError,
    decode_supabase_token,
    extract_user_id,
)
from app.database.supabase import get_supabase_admin


# ---------- HTTP Bearer scheme (auto-documented in /docs) ----------
bearer_scheme = HTTPBearer(auto_error=False)


# ============================================================
# 1. Get the raw JWT payload
# ============================================================
def get_token_payload(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
) -> Dict[str, Any]:
    """
    Extract and verify the Bearer token, returning its decoded payload.
    Raises 401 if the token is missing or invalid.
    """
    if credentials is None:
        raise TokenError("Missing Authorization header")

    token = credentials.credentials
    return decode_supabase_token(token)


# ============================================================
# 2. Get the current user's profile (from public.profiles)
# ============================================================
def get_current_user(
    payload: Dict[str, Any] = Depends(get_token_payload),
) -> Dict[str, Any]:
    """
    Load the authenticated user's profile from `public.profiles`.

    Returns a dict with at least:
        {
            "id": uuid,
            "email": str,
            "full_name": str,
            "role": "super_admin" | "admin" | "team_manager" | "player" | "vendor" | "customer",
            "is_active": bool,
            ...
        }

    Raises:
        401 if the token is invalid
        403 if the user profile does not exist or is inactive
    """
    user_id = extract_user_id(payload)

    supabase = get_supabase_admin()
    result = (
        supabase.table("profiles")
        .select("*")
        .eq("id", user_id)
        .limit(1)
        .execute()
    )

    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User profile not found. Contact an administrator.",
        )

    profile = result.data[0]

    if not profile.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated. Contact an administrator.",
        )

    return profile


# ============================================================
# 3. Optional user (for public endpoints that behave differently when logged in)
# ============================================================
def get_optional_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
) -> Dict[str, Any] | None:
    """
    Same as `get_current_user` but returns None instead of raising
    when no token is provided or the token is invalid.

    Useful for endpoints like `GET /products` that work for guests
    but can also enrich responses for logged-in users.
    """
    if credentials is None:
        return None

    try:
        payload = decode_supabase_token(credentials.credentials)
        user_id = extract_user_id(payload)

        supabase = get_supabase_admin()
        result = (
            supabase.table("profiles")
            .select("*")
            .eq("id", user_id)
            .limit(1)
            .execute()
        )

        if not result.data:
            return None

        profile = result.data[0]
        return profile if profile.get("is_active", True) else None

    except TokenError:
        return None


# ============================================================
# 4. Role guard factory
# ============================================================
def require_role(*allowed_roles: str) -> Callable[..., Dict[str, Any]]:
    """
    Factory that returns a dependency enforcing that the current user
    has one of the given roles.

    Example:
        require_admin = require_role("admin", "super_admin")
    """
    allowed = set(allowed_roles)

    def checker(user: Dict[str, Any] = Depends(get_current_user)) -> Dict[str, Any]:
        if user.get("role") not in allowed:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Insufficient permissions. Requires one of: {sorted(allowed)}",
            )
        return user

    return checker


# ============================================================
# 5. Pre-built shortcuts
# ============================================================
require_admin = require_role("admin", "super_admin")
require_super_admin = require_role("super_admin")
require_team_manager = require_role("team_manager", "admin", "super_admin")
require_vendor = require_role("vendor", "admin", "super_admin")
require_customer = require_role("customer", "admin", "super_admin")


# ============================================================
# 6. Owner-or-admin guard factory
# ============================================================
def require_owner_or_admin(
    owner_field: str = "user_id",
) -> Callable[..., Dict[str, Any]]:
    """
    Returns a dependency that allows access if:
        - The current user's role is admin/super_admin, OR
        - The resource's owner field matches the current user's id.

    NOTE: This is a *generator* - the actual ownership check must happen
    inside the route because the resource has to be fetched first.

    In practice you'll usually just write:
        if user["role"] not in ("admin", "super_admin") and user["id"] != resource["user_id"]:
            raise HTTPException(403, ...)
    """

    def checker(user: Dict[str, Any] = Depends(get_current_user)) -> Dict[str, Any]:
        return user

    return checker