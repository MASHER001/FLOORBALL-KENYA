"""
Payment schemas
===============

M-Pesa flow:
    1. POST /payments/mpesa/initiate    → returns checkout_request_id
    2. User enters PIN on phone
    3. Safaricom calls POST /payments/mpesa/callback
    4. We update payment + order status
"""

from datetime import datetime
from enum import Enum
from typing import Any, Optional

from pydantic import BaseModel, Field


class PaymentStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    SUCCESS = "success"
    FAILED = "failed"
    CANCELLED = "cancelled"
    REFUNDED = "refunded"


# ---------- Initiate ----------
class MpesaInitiateRequest(BaseModel):
    order_id: str
    phone: str = Field(..., min_length=10, max_length=15)

    model_config = {
        "json_schema_extra": {
            "example": {
                "order_id": "uuid-of-order",
                "phone": "254712345678",
            }
        }
    }


class MpesaInitiateResponse(BaseModel):
    payment_id: str
    checkout_request_id: str
    merchant_request_id: Optional[str] = None
    customer_message: str
    status: PaymentStatus = PaymentStatus.PENDING


# ---------- Callback (Daraja → our API) ----------
class MpesaCallbackRequest(BaseModel):
    """
    Raw M-Pesa callback body. Loosely typed because Safaricom's
    payload is nested and varies. We parse it in the service layer.
    """

    Body: dict[str, Any]


# ---------- Payment record ----------
class PaymentResponse(BaseModel):
    id: str
    order_id: str
    user_id: str
    provider: str
    amount: float
    currency: str
    status: PaymentStatus
    phone: Optional[str] = None
    merchant_request_id: Optional[str] = None
    checkout_request_id: Optional[str] = None
    mpesa_receipt: Optional[str] = None
    result_code: Optional[int] = None
    result_desc: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class PaymentListResponse(BaseModel):
    total: int
    page: int
    page_size: int
    items: list[PaymentResponse]