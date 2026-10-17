"""
Auth router
===========

Handles registration, login, profile fetch, logout.

Auth is delegated to Supabase Auth:
    - register  → sign up + create profile row
    - login     → sign in and return the session (access + refresh tokens)
    - me        → return the current profile (from public.profiles)
    - logout    → client-side token discard (Supabase access tokens are stateless)
"""

from fastapi import APIRouter, Depends, HTTPException, status

from app.core.dependencies import get_current_user
from app.database.supabase import get_supabase_admin, get_supabase
from app.schemas.auth import (
    LoginRequest,
    LogoutResponse,
    MeResponse,
    RegisterRequest,
    TokenResponse,
)

router = APIRouter(prefix="/auth", tags=["Auth"])


# ============================================================
# POST /auth/register
# ============================================================
@router.post(
    "/register",
    response_model=MeResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new account",
)
def register(payload: RegisterRequest):
    """
    Create a Supabase Auth user and matching profile row.

    The `on_auth_user_created` trigger creates the profile automatically.
    We then upsert role/full_name/phone to be safe.
    """
    sb = get_supabase_admin()

    # ---------- 1. Create the auth user ----------
    try:
        created = sb.auth.admin.create_user(
            {
                "email": payload.email,
                "password": payload.password,
                "email_confirm": True,
                "user_metadata": {
                    "full_name": payload.full_name,
                    "phone": payload.phone,
                    "role": payload.role.value,
                },
            }
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Could not register user: {exc}",
        )

    if not created or not getattr(created, "user", None):
        raise HTTPException(status_code=500, detail="User creation failed")

    user_id = created.user.id

    # ---------- 2. Ensure the profile row reflects the requested role ----------
    sb.table("profiles").upsert(
        {
            "id": user_id,
            "email": payload.email,
            "full_name": payload.full_name,
            "phone": payload.phone,
            "role": payload.role.value,
            "is_active": True,
        },
        on_conflict="id",
    ).execute()

    # ---------- 3. Return the fresh profile ----------
    profile = (
        sb.table("profiles").select("*").eq("id", user_id).limit(1).execute()
    ).data[0]
    return profile


# ============================================================
# POST /auth/login
# ============================================================
@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Log in and get an access token",
)
def login(payload: LoginRequest):
    """
    Sign in via Supabase Auth (email + password).

    Returns the Supabase session including `access_token` (JWT)
    that the frontend sends as `Authorization: Bearer <token>`.
    """
    sb = get_supabase()

    try:
        session = sb.auth.sign_in_with_password(
            {"email": payload.email, "password": payload.password}
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid credentials: {exc}",
        )

    if not session or not session.session:
        raise HTTPException(status_code=401, detail="Login failed")

    return {
        "access_token": session.session.access_token,
        "refresh_token": session.session.refresh_token,
        "token_type": "bearer",
        "expires_in": session.session.expires_in,
        "user": {
            "id": session.user.id,
            "email": session.user.email,
        },
    }


# ============================================================
# GET /auth/me
# ============================================================
@router.get(
    "/me",
    response_model=MeResponse,
    summary="Get the currently authenticated user's profile",
)
def me(user: dict = Depends(get_current_user)):
    """Return the full profile of the logged-in user."""
    return user


# ============================================================
# POST /auth/logout
# ============================================================
@router.post(
    "/logout",
    response_model=LogoutResponse,
    summary="Log out (client discards token)",
)
def logout(user: dict = Depends(get_current_user)):
    """
    Supabase JWTs are stateless — the client simply discards the token.

    This endpoint exists so the frontend has a single logout call and
    so we can later add audit logging / token revocation.
    """
    return {"success": True, "message": "Logged out successfully"}