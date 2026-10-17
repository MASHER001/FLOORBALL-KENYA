from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field


class NewsPublic(BaseModel):
    id: UUID
    slug: str
    title: str
    excerpt: Optional[str] = None
    body: str
    cover_image_url: Optional[str] = None
    category: Optional[str] = None
    published_at: Optional[datetime] = None


class NewsCreate(BaseModel):
    slug: str = Field(..., min_length=2, max_length=120)
    title: str = Field(..., min_length=2, max_length=200)
    excerpt: Optional[str] = Field(None, max_length=500)
    body: str = Field(..., min_length=1)
    cover_image_url: Optional[str] = None
    category: Optional[str] = Field(None, max_length=64)


class NewsUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=2, max_length=200)
    excerpt: Optional[str] = Field(None, max_length=500)
    body: Optional[str] = None
    cover_image_url: Optional[str] = None
    category: Optional[str] = Field(None, max_length=64)