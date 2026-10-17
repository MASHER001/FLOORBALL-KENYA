"""
Supabase Storage integration.

Provides signed upload/download URLs and helpers for creating buckets
on demand. All calls use the service-role client so bucket policies can
be locked down for direct anon access.
"""

from typing import Any

from fastapi import HTTPException, status

from app.database.supabase import get_supabase_admin


DEFAULT_BUCKETS = ("gallery", "products", "news", "certificates")


def _bucket(name: str):
    return get_supabase_admin().storage.from_(name)


def create_signed_upload_url(
    bucket: str,
    path: str,
    expires_in: int = 3600,
) -> dict[str, Any]:
    """
    Returns a URL the client can PUT to in order to upload a file.
    """
    if not bucket or not path:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "bucket and path are required")

    try:
        res = _bucket(bucket).create_signed_upload_url(path)
        return res
    except Exception as exc:
        raise HTTPException(
            status.HTTP_500_INTERNAL_SERVER_ERROR,
            f"Could not create signed upload URL: {exc}",
        )


def create_signed_download_url(
    bucket: str,
    path: str,
    expires_in: int = 3600,
) -> dict[str, Any]:
    try:
        res = _bucket(bucket).create_signed_url(path, expires_in)
        return res
    except Exception as exc:
        raise HTTPException(
            status.HTTP_500_INTERNAL_SERVER_ERROR,
            f"Could not create signed download URL: {exc}",
        )


def get_public_url(bucket: str, path: str) -> str:
    return _bucket(bucket).get_public_url(path)


def remove_object(bucket: str, path: str) -> None:
    try:
        _bucket(bucket).remove([path])
    except Exception:
        pass