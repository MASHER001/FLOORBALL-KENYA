"""
Supabase client
===============

Provides two clients:
    - get_supabase()        -> anon key (respects RLS, for user-facing ops)
    - get_supabase_admin()  -> service_role key (bypasses RLS, for admin ops)

Neither is cached: FastAPI runs sync route handlers in a thread-pool, and a
single shared httpx/HTTP2 connection reused across concurrent threads was
corrupting its compression state under load (RemoteProtocolError /
ConnectionTerminated error_code:9, followed by a KeyError in httpcore's
stream cleanup). Building a fresh client per call avoids that entirely —
same pattern get_supabase_for_user() already used, which is why it never
hit the bug.
"""

from supabase import Client, create_client
from supabase.lib.client_options import ClientOptions

from app.core.config import settings


def _client_options() -> ClientOptions:
    """Build standard client options."""
    return ClientOptions(
        postgrest_client_timeout=30,
        storage_client_timeout=30,
        schema="public",
    )


def get_supabase() -> Client:
    """Anonymous client — respects Row Level Security."""
    if not settings.SUPABASE_URL or not settings.SUPABASE_ANON_KEY:
        raise RuntimeError("SUPABASE_URL and SUPABASE_ANON_KEY must be set in .env")
    return create_client(
        settings.SUPABASE_URL,
        settings.SUPABASE_ANON_KEY,
        options=_client_options(),
    )


def get_supabase_admin() -> Client:
    """Service-role client — bypasses Row Level Security."""
    if not settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_ROLE_KEY:
        raise RuntimeError(
            "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env"
        )
    return create_client(
        settings.SUPABASE_URL,
        settings.SUPABASE_SERVICE_ROLE_KEY,
        options=_client_options(),
    )


def get_supabase_for_user(access_token: str) -> Client:
    """
    Returns a Supabase client authenticated as the given user
    (uses the user's JWT — RLS applies).
    """
    client = create_client(
        settings.SUPABASE_URL,
        settings.SUPABASE_ANON_KEY,
        options=_client_options(),
    )
    client.postgrest.auth(access_token)
    return client