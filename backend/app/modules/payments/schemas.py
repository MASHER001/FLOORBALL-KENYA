from datetime import datetime
from typing import Any, Optional
from uuid import UUID
from pydantic import BaseModel, Field


class PaymentPublic(BaseModel):
    id: UUID
    order_id: UUID
    amount_cents: int
    currency: str
    provider: str
    provider_ref: Optional[str] = None
    status: str
    metadata: dict[str, Any] = {}
    created_at: datetime


class PaymentInitiate(BaseModel):
    order_id: UUID
    provider: str = Field("mpesa", pattern="^(mpesa|stripe|manual)$")
    phone: Optional[str] = Field(None, max_length=32)


class PaymentStatusUpdate(BaseModel):
    status: str = Field(..., pattern="^(pending|success|failed|refunded)$")
    provider_ref: Optional[str] = None


class WebhookEvent(BaseModel):
    event_id: str = Field(..., min_length=3, max_length=200)
    provider: str = Field(..., min_length=3, max_length=32)
    payload: dict[str, Any]
