from typing import Any
from fastapi import HTTPException, status
from app.modules.audit import service as audit
from app.modules.payments import repository as repo
from app.modules.payments.schemas import PaymentInitiate, PaymentStatusUpdate


def initiate(payload: PaymentInitiate, actor_id: str) -> dict[str, Any]:
    order = repo.get_order(str(payload.order_id))
    if not order:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Order not found")

    payment = repo.insert_payment({
        "order_id": str(payload.order_id),
        "amount_cents": order["total_cents"],
        "currency": order["currency"],
        "provider": payload.provider,
        "status": "pending",
        "metadata": {"phone": payload.phone} if payload.phone else {},
    })

    audit.log_action(actor={"id": actor_id}, action="payment.initiate",
                     resource_type="payment", resource_id=payment["id"],
                     metadata={"order_id": str(payload.order_id),
                               "provider": payload.provider})
    return payment


def update_status(payment_id: str, payload: PaymentStatusUpdate, actor_id: str) -> dict[str, Any]:
    existing = repo.get_payment(payment_id)
    if not existing:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Payment not found")
    patch = {"status": payload.status}
    if payload.provider_ref:
        patch["provider_ref"] = payload.provider_ref
    updated = repo.update_payment(payment_id, patch) or existing
    audit.log_action(actor={"id": actor_id}, action=f"payment.{payload.status}",
                     resource_type="payment", resource_id=payment_id,
                     metadata={"from_status": existing["status"]})
    return updated
