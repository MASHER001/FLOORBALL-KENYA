"""
Gallery service.

Storage object lifecycle:
    - The admin requests a signed upload URL via
      POST /admin/gallery/upload-url
    - The client PUTs the file directly to Supabase Storage
    - The client then POSTs the resulting storage_path via
      POST /admin/gallery/media
    - Media starts as 'pending'
    - An admin approves it via POST /admin/gallery/media/{id}/moderate
    - Approved media appears in public listings
"""

from typing import Any

from fastapi import HTTPException, status

from app.integrations import storage
from app.modules.audit import service as audit
from app.modules.gallery import repository as repo
from app.modules.gallery.schemas import (
    AlbumCreate,
    MediaCreate,
    UploadUrlResponse,
    SignedUrlResponse,
)


# ---------- Albums ----------

def create_album(payload: AlbumCreate, created_by: str) -> dict[str, Any]:
    if repo.get_album_by_slug(payload.slug):
        raise HTTPException(
            status.HTTP_409_CONFLICT, f"Album slug '{payload.slug}' already exists"
        )
    data = payload.model_dump()
    data["created_by"] = created_by
    album = repo.insert_album(data)

    audit.log_action(
        actor={"id": created_by},
        action="album.create",
        resource_type="gallery_album",
        resource_id=album["id"],
        metadata={"slug": album["slug"], "title": album["title"]},
    )
    return album


def publish_album(album_id: str, actor_id: str) -> dict[str, Any]:
    existing = repo.get_album(album_id)
    if not existing:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Album not found")

    updated = repo.update_album(album_id, {"is_published": True}) or existing

    audit.log_action(
        actor={"id": actor_id},
        action="album.publish",
        resource_type="gallery_album",
        resource_id=album_id,
        metadata={"slug": existing["slug"]},
    )
    return updated


# ---------- Media ----------

def add_media(payload: MediaCreate, created_by: str) -> dict[str, Any]:
    if payload.album_id and not repo.get_album(str(payload.album_id)):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Album not found")

    data = payload.model_dump()
    data["album_id"] = str(data["album_id"]) if data["album_id"] else None
    data["status"] = "pending"
    data["created_by"] = created_by

    media = repo.insert_media(data)

    audit.log_action(
        actor={"id": created_by},
        action="media.create",
        resource_type="gallery_media",
        resource_id=media["id"],
        metadata={"album_id": data["album_id"], "type": data["media_type"]},
    )
    return media


def moderate_media(
    media_id: str, new_status: str, actor_id: str, reason: str | None = None
) -> dict[str, Any]:
    existing = repo.get_media(media_id)
    if not existing:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Media not found")

    updated = repo.update_media(media_id, {"status": new_status}) or existing

    audit.log_action(
        actor={"id": actor_id},
        action=f"media.{new_status}",
        resource_type="gallery_media",
        resource_id=media_id,
        metadata={"from_status": existing["status"], "reason": reason},
    )
    return updated


# ---------- Storage helpers ----------

def make_upload_url(path: str) -> dict[str, Any]:
    result = storage.create_signed_upload_url("gallery", path)
    # supabase-py returns a dict with 'signedURL' (or 'signed_url') and 'token'
    signed = result.get("signedURL") or result.get("signed_url") or result.get("signedUrl")
    token = result.get("token")
    return UploadUrlResponse(
        bucket="gallery",
        path=path,
        signed_url=signed,
        token=token,
    ).model_dump()


def make_media_signed_url(media_id: str) -> dict[str, Any]:
    row = repo.get_media(media_id)
    if not row:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Media not found")

    result = storage.create_signed_download_url("gallery", row["storage_path"])
    signed = result.get("signedURL") or result.get("signed_url") or result.get("signedUrl")
    return SignedUrlResponse(
        bucket="gallery",
        path=row["storage_path"],
        signed_url=signed,
    ).model_dump()