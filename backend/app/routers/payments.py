"""
Payments router (M-Pesa)
========================

    POST /payments/mpesa/initiate         — trigger STK Push
    POST /payments/mpesa/callback         — Safaricom callback
    GET  /payments/{transaction_id}       — payment status
    GET  /payments                        — list payments (self or admin)
"""

from fastapi import APIRouter, Depends, HTTPException, Query

from app.core.dependencies import get_current_user
from app.database.supabase import get_supabase_admin
from app.schemas.payment import (
    MpesaCallbackRequest,
    MpesaInitiateRequest,
    MpesaInitiateResponse,
    PaymentListResponse,
    PaymentResponse,
)
from app.services.payments import handle_mpesa_callback, initiate_mpesa_payment

router = APIRouter(prefix="/payments", tags=["Payments"])


# ============================================================
# POST /payments/mpesa/initiate
# ============================================================
@router.post(
    "/mpesa/initiate",
    response_model=MpesaInitiateResponse,
    summary="Start M-Pesa STK Push for an order",
)
async def mpesa_initiate(
    payload: MpesaInitiateRequest,
    user: dict = Depends(get_current_user),
):
    # Verify order belongs to user (unless admin)
    sb = get_supabase_admin()
    order = (
        sb.table("orders").select("id, user_id").eq("id", payload.order_id).limit(1).execute()
    )
    if not order.data:
        raise HTTPException(status_code=404, detail="Order not found")
    if user["role"] not in ("admin", "super_admin") and order.data[0]["user_id"] != user["id"]:
        raise HTTPException(status_code=403, detail="Not your order")

    result = await initiate_mpesa_payment(payload.order_id, payload.phone)
    return result


# ============================================================
# POST /payments/mpesa/callback  (public — Safaricom calls this)
# ============================================================
@router.post(
    "/mpesa/callback",
    summary="Safaricom callback (do not call manually)",
)
def mpesa_callback(payload: MpesaCallbackRequest):
    """
    Receives the callback body from Safaricom. Public endpoint —
    no auth. Response must be {"ResultCode": 0, "ResultDesc": "..."}
    to acknowledge receipt.
    """
    try:
        result = handle_mpesa_callback(payload.Body)
    except HTTPException:
        raise
    except Exception as exc:
        # Still return 200 so Safaricom doesn't retry forever
        print(f"[mpesa callback] error: {exc}")
        return {"ResultCode": 1, "ResultDesc": "Processing error"}

    return {"ResultCode": 0, "ResultDesc": "Accepted", "data": result}


# ============================================================
# GET /payments — list
# ============================================================
@router.get("", response_model=PaymentListResponse, summary="List payments")
def list_payments(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status_: str | None = Query(None, alias="status"),
    user: dict = Depends(get_current_user),
):
    sb = get_supabase_admin()
    offset = (page - 1) * page_size

    query = sb.table("payments").select("*", count="exact")
    if user["role"] not in ("admin", "super_admin"):
        query = query.eq("user_id", user["id"])
    if status_:
        query = query.eq("status", status_)

    result = (
        query.order("created_at", desc=True)
        .range(offset, offset + page_size - 1)
        .execute()
    )
    return {
        "total": result.count or 0,
        "page": page,
        "page_size": page_size,
        "items": result.data or [],
    }


# ============================================================
# GET /payments/{payment_id}
# ============================================================
@router.get(
    "/{payment_id}",
    response_model=PaymentResponse,
    summary="Get a payment by ID",
)
def get_payment(payment_id: str, user: dict = Depends(get_current_user)):
    sb = get_supabase_admin()
    resp = sb.table("payments").select("*").eq("id", payment_id).limit(1).execute()
    if not resp.data:
        raise HTTPException(status_code=404, detail="Payment not found")
    p = resp.data[0]
    if user["role"] not in ("admin", "super_admin") and p["user_id"] != user["id"]:
        raise HTTPException(status_code=403, detail="Not your payment")
    return p