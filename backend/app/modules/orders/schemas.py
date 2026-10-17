from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field


class OrderItemPublic(BaseModel):
    id: UUID
    product_id: UUID
    vendor_id: UUID
    product_name: str
    unit_price_cents: int
    quantity: int


class OrderPublic(BaseModel):
    id: UUID
    customer_id: UUID
    status: str
    total_cents: int
    currency: str
    notes: Optional[str] = None
    created_at: datetime
    items: list[OrderItemPublic] = []


class OrderItemCreate(BaseModel):
    product_id: UUID
    quantity: int = Field(..., ge=1, le=999)


class OrderCreate(BaseModel):
    notes: Optional[str] = Field(None, max_length=1000)
    items: list[OrderItemCreate] = Field(..., min_length=1)


class OrderStatusUpdate(BaseModel):
    status: str = Field(..., pattern="^(pending|paid|shipped|delivered|cancelled|refunded)$")
