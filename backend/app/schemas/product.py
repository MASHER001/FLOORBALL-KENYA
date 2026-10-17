"""
Product schemas
===============

Products belong to vendors and optionally to a category.
"""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


# ---------- Category ----------
class CategoryBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=80)
    slug: str = Field(..., min_length=2, max_length=80)
    description: Optional[str] = None


class CategoryCreate(CategoryBase):
    pass


class CategoryResponse(CategoryBase):
    id: str
    created_at: datetime

    model_config = {"from_attributes": True}


# ---------- Product ----------
class ProductBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=160)
    slug: str = Field(..., min_length=2, max_length=160)
    description: Optional[str] = None
    price: float = Field(..., ge=0)
    currency: str = "KES"
    stock: int = Field(default=0, ge=0)
    image_urls: list[str] = Field(default_factory=list)


class ProductCreate(ProductBase):
    """Vendor_id is taken from the JWT — never from the body."""

    category_id: Optional[str] = None


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    category_id: Optional[str] = None
    image_urls: Optional[list[str]] = None
    is_active: Optional[bool] = None


class ProductStockUpdate(BaseModel):
    stock: int = Field(..., ge=0)


class ProductResponse(ProductBase):
    id: str
    vendor_id: str
    category_id: Optional[str] = None
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


# ---------- List ----------
class ProductListResponse(BaseModel):
    total: int
    page: int
    page_size: int
    items: list[ProductResponse]