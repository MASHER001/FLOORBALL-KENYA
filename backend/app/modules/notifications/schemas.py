from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field


class NotificationPublic(BaseModel):
    id: UUID
    title: str
    body: Optional[str] = None
    link: Optional[str] = None
    type: str
    is_read: bool
    created_at: datetime


class NotificationCreate(BaseModel):
    user_id: UUID
    title: str = Field(..., min_length=1, max_length=200)
    body: Optional[str] = Field(None, max_length=2000)
    link: Optional[str] = None
    type: str = Field("info", pattern="^(info|warning|success|error)$")
