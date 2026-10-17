"""
Pydantic schemas for the gallery.
"""

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field


class MediaPublic(BaseModel):
    id: UUID
    album_id: Optional[UUID] = None
    storage_path: str
    media_type: str
    caption: Optional[str] = None
    alt_text: Optional[str] = None
    tags: list[str] = Field(default_factory=list)
    width_px: Optional[int] = None
    height_px: Optional[int] = None
    size_bytes: Optional[int] = None
    status: str
    created_at: datetime


class AlbumPublic(BaseModel):
    id: UUID
    slug: str
    title: str
    description: Optional[str] = None
    cover_media_id: Optional[UUID] = None
    is_published: bool
    created_at: datetime


class AlbumCreate(BaseModel):
    slug: str = Field(..., min_length=2, max_length=64)
    title: str = Field(..., min_length=2, max_length=200)
    description: Optional[str] = Field(None, max_length=2000)


class MediaCreate(BaseModel):
    album_id: Optional[UUID] = None
    storage_path: str = Field(..., min_length=2, max_length=500)
    media_type: str = Field("image", pattern="^(image|video)$")
    caption: Optional[str] = Field(None, max_length=500)
    alt_text: Optional[str] = Field(None, max_length=300)
    tags: list[str] = Field(default_factory=list)
    width_px: Optional[int] = None
    height_px: Optional[int] = None
    size_bytes: Optional[int] = None


class MediaModeration(BaseModel):
    status: str = Field(..., pattern="^(approved|rejected|removed)$")
    reason: Optional[str] = Field(None, max_length=500)


class UploadUrlResponse(BaseModel):
    bucket: str
    path: str
    signed_url: str
    token: Optional[str] = None


class SignedUrlResponse(BaseModel):
    bucket: str
    path: str
    signed_url: str