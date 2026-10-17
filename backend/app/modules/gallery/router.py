"""
Gallery router.

Public:
    GET  /gallery/albums
    GET  /gallery/albums/{album_id}
    GET  /gallery/albums/{album_id}/media
    GET  /gallery/media

Admin:
    POST   /admin/gallery/upload-url
    POST   /admin/gallery/albums
    POST   /admin/gallery/albums/{album_id}/publish
    POST   /admin/gallery/media
    POST   /admin/gallery/media/{media_id}/moderate
    POST   /admin/gallery/media/{media_id}/signed-url
"""

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status

from app.modules.gallery import repository as repo
from app.modules.gallery import service
from app.modules.gallery.permissions import require_gallery_manager
from app.modules.gallery.schemas import (
    AlbumCreate,
    AlbumPublic,
    MediaCreate,
    MediaModeration,
    MediaPublic,
    SignedUrlResponse,
    UploadUrlResponse,
)

router = APIRouter(tags=["Gallery"])


# ============================================================
# Public
# ============================================================

@router.get(
    "/gallery/albums",
    response_model=list[AlbumPublic],
    summary="List published albums",
)
def list_albums(limit: int = 100, offset: int = 0):
    return repo.list_published_albums(limit=limit, offset=offset)


@router.get(
    "/gallery/albums/{album_id}",
    response_model=AlbumPublic,
    summary="Get an album by id",
)
def get_album(album_id: UUID):
    row = repo.get_album(str(album_id))
    if not row or not row.get("is_published"):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Album not found")
    return row


@router.get(
    "/gallery/albums/{album_id}/media",
    response_model=list[MediaPublic],
    summary="List approved media in an album",
)
def album_media(album_id: UUID):
    album = repo.get_album(str(album_id))
    if not album or not album.get("is_published"):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Album not found")
    return repo.list_media_for_album(str(album_id))


@router.get(
    "/gallery/media",
    response_model=list[MediaPublic],
    summary="List approved media",
)
def list_media(
    album_id: UUID | None = None,
    media_type: str | None = None,
    limit: int = 100,
    offset: int = 0,
):
    return repo.list_published_media(
        album_id=str(album_id) if album_id else None,
        media_type=media_type,
        limit=limit,
        offset=offset,
    )


# ============================================================
# Admin
# ============================================================

@router.post(
    "/admin/gallery/upload-url",
    response_model=UploadUrlResponse,
    summary="Get a signed upload URL for gallery media (admin)",
)
def gallery_upload_url(path: str, _user=Depends(require_gallery_manager)):
    return service.make_upload_url(path)


@router.post(
    "/admin/gallery/albums",
    response_model=AlbumPublic,
    status_code=status.HTTP_201_CREATED,
    summary="Create an album (admin)",
)
def create_album(
    payload: AlbumCreate,
    user=Depends(require_gallery_manager),
):
    return service.create_album(payload, created_by=user["id"])


@router.post(
    "/admin/gallery/albums/{album_id}/publish",
    response_model=AlbumPublic,
    summary="Publish an album (admin)",
)
def publish_album(
    album_id: UUID,
    user=Depends(require_gallery_manager),
):
    return service.publish_album(str(album_id), actor_id=user["id"])


@router.post(
    "/admin/gallery/media",
    response_model=MediaPublic,
    status_code=status.HTTP_201_CREATED,
    summary="Register uploaded media (admin)",
)
def add_media(
    payload: MediaCreate,
    user=Depends(require_gallery_manager),
):
    return service.add_media(payload, created_by=user["id"])


@router.post(
    "/admin/gallery/media/{media_id}/moderate",
    response_model=MediaPublic,
    summary="Approve, reject, or remove media (admin)",
)
def moderate_media(
    media_id: UUID,
    payload: MediaModeration,
    user=Depends(require_gallery_manager),
):
    return service.moderate_media(
        str(media_id),
        new_status=payload.status,
        actor_id=user["id"],
        reason=payload.reason,
    )


@router.post(
    "/admin/gallery/media/{media_id}/signed-url",
    response_model=SignedUrlResponse,
    summary="Get a signed download URL for a media object (admin)",
)
def media_signed_url(
    media_id: UUID,
    _user=Depends(require_gallery_manager),
):
    return service.make_media_signed_url(str(media_id))