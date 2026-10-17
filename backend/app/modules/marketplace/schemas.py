from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field


class VendorPublic(BaseModel):
    id: UUID
    name: str
    slug: str
    description: Optional[str] = None
    logo_url: Optional[str] = None
    is_verified: bool


class VendorCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=200)
    slug: str = Field(..., min_length=2, max_length=64)
    description: Optional[str] = Field(None, max_length=2000)
    logo_url: Optional[str] = None
    contact_email: Optional[str] = None


class ProductPublic(BaseModel):
    id: UUID
    vendor_id: UUID
    name: str
    slug: str
    description: Optional[str] = None
    price_cents: int
    currency: str
    stock_quantity: int
    category: Optional[str] = None
    image_url: Optional[str] = None
    status: str
    created_at: datetime


class ProductCreate(BaseModel):
    vendor_id: UUID
    name: str = Field(..., min_length=2, max_length=200)
    slug: str = Field(..., min_length=2, max_length=64)
    description: Optional[str] = Field(None, max_length=5000)
    price_cents: int = Field(..., ge=0)
    currency: str = Field("KES", min_length=3, max_length=3)
    stock_quantity: int = Field(0, ge=0)
    category: Optional[str] = Field(None, max_length=64)
    image_url: Optional[str] = None


class ProductModeration(BaseModel):
    status: str = Field(..., pattern="^(approved|rejected|archived)$")
    reason: Optional[str] = Field(None, max_length=500)
