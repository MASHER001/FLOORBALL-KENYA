from uuid import UUID
from fastapi import APIRouter, Depends, status
from app.modules.payments import repository as repo
from app.modules.payments import service
from app.modules.payments.permissions import require_payment_manager
from app.modules.payments.schemas import (
    PaymentInitiate, PaymentPublic, PaymentStatusUpdate, WebhookEvent,
)

router = APIRouter(tags=["Payments"])


@router.get("/orders/{order_id}/payments", response_model=list[PaymentPublic])
def list_payments(order_id: UUID):
    return repo.list_for_order(str(order_id))


@router.post("/payments/initiate", response_model=PaymentPublic,
             status_code=status.HTTP_201_CREATED)
def initiate(payload: PaymentInitiate, user=Depends(require_payment_manager)):
    return service.initiate(payload, actor_id=user["id"])


@router.patch("/admin/payments/{payment_id}/status", response_model=PaymentPublic)
def update_status(payment_id: UUID, payload: PaymentStatusUpdate,
                  user=Depends(require_payment_manager)):
    return service.update_status(str(payment_id), payload, actor_id=user["id"])


@router.post("/payments/webhook", status_code=status.HTTP_202_ACCEPTED)
def webhook(payload: WebhookEvent):
    """
    Idempotent webhook receiver.
    Records the event; a worker reconciles the payment status.
    """
    event = repo.insert_webhook_event({
        "provider": payload.provider,
        "event_id": payload.event_id,
        "payload": payload.payload,
    })
    return {"received": event is not None, "event_id": payload.event_id}
