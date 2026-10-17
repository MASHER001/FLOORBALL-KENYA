"""
Order schemas
=============

Covers cart items, orders, and order line items.
Order items snapshot price at purchase time.
"""

from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class OrderStatus(str, Enum):
    PENDING = "pending"
    PAID = "paid"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    REFUNDED = "refunded"


# ---------- Cart ----------
class CartItemAdd(BaseModel):
    product_id: str
    quantity: int = Field(default=1, ge=1, le=100)


class CartItemUpdate(BaseModel):
    quantity: int = Field(..., ge=1, le=100)


class CartItemResponse(BaseModel):
    id: str
    user_id: str
    product_id: str
    quantity: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class CartResponse(BaseModel):
    items: list[CartItemResponse]
    subtotal: float = 0
    item_count: int = 0


# ---------- Order ----------
class OrderCreate(BaseModel):
    delivery_address: str = Field(..., min_length=5, max_length=255)
    delivery_phone: str = Field(..., min_length=7, max_length=20)
    notes: Optional[str] = None


class OrderStatusUpdate(BaseModel):
    status: OrderStatus
    notes: Optional[str] = None


class OrderItemResponse(BaseModel):
    id: str
    product_id: Optional[str] = None
    vendor_id: Optional[str] = None
    product_name: str
    unit_price: float
    quantity: int
    subtotal: float
    created_at: datetime

    model_config = {"from_attributes": True}


class OrderResponse(BaseModel):
    id: str
    user_id: str
    status: OrderStatus
    subtotal: float
    delivery_fee: float
    total: float
    delivery_address: Optional[str] = None
    delivery_phone: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    items: Optional[list[OrderItemResponse]] = None

    model_config = {"from_attributes": True}


class OrderListResponse(BaseModel):
    total: int
    page: int
    page_size: int
    items: list[OrderResponse]