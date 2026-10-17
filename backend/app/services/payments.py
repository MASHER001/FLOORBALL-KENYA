"""
Payments service (M-Pesa / Safaricom Daraja)
============================================

Flow:
    1. initiate_mpesa_payment(order_id, phone)
         → POST to Daraja STK Push
         → create payments row (status=pending)
         → return checkout_request_id

    2. handle_mpesa_callback(callback_body)
         → parse Daraja payload
         → find payment by checkout_request_id
         → update payment (status, receipt, result_code)
         → if success, mark order paid + record commissions

If MPESA_CONSUMER_KEY/SECRET are not set, runs in MOCK mode.
"""

import base64
from datetime import datetime
from typing import Any, Dict, Optional

import httpx
from fastapi import HTTPException

from app.core.config import settings
from app.database.supabase import get_supabase_admin
from app.services.commissions import record_commissions_for_order


# ---------- Helpers ----------
def _require_order(order_id: str) -> Dict[str, Any]:
    sb = get_supabase_admin()
    resp = sb.table("orders").select("*").eq("id", order_id).limit(1).execute()
    if not resp.data:
        raise HTTPException(status_code=404, detail="Order not found")
    return resp.data[0]


def _normalize_phone(phone: str) -> str:
    """Convert 07xxxxxxxx or +2547xxxxxxxx → 2547xxxxxxxx."""
    p = phone.strip().replace(" ", "").replace("-", "")
    if p.startswith("+"):
        p = p[1:]
    if p.startswith("0"):
        p = "254" + p[1:]
    if not p.startswith("254") or len(p) != 12:
        raise HTTPException(status_code=400, detail="Invalid phone number format")
    return p


def _daraja_base_url() -> str:
    return (
        "https://sandbox.safaricom.co.ke"
        if settings.MPESA_ENV == "sandbox"
        else "https://api.safaricom.co.ke"
    )


def _is_mock_mode() -> bool:
    return not (
        settings.MPESA_CONSUMER_KEY
        and settings.MPESA_CONSUMER_SECRET
        and settings.MPESA_PASSKEY
    )


async def _get_daraja_token() -> str:
    url = f"{_daraja_base_url()}/oauth/v1/generate?grant_type=client_credentials"
    creds = f"{settings.MPESA_CONSUMER_KEY}:{settings.MPESA_CONSUMER_SECRET}"
    auth = base64.b64encode(creds.encode()).decode()
    async with httpx.AsyncClient(timeout=15) as client:
        r = await client.get(url, headers={"Authorization": f"Basic {auth}"})
        r.raise_for_status()
        return r.json()["access_token"]


def _stk_timestamp() -> str:
    return datetime.now().strftime("%Y%m%d%H%M%S")


def _stk_password(timestamp: str) -> str:
    raw = f"{settings.MPESA_SHORTCODE}{settings.MPESA_PASSKEY}{timestamp}"
    return base64.b64encode(raw.encode()).decode()


# ---------- Initiate ----------
async def initiate_mpesa_payment(order_id: str, phone: str) -> Dict[str, Any]:
    order = _require_order(order_id)
    if order["status"] not in ("pending", "cancelled"):
        raise HTTPException(
            status_code=400,
            detail=f"Cannot pay for order in status '{order['status']}'",
        )

    normalized_phone = _normalize_phone(phone)
    amount = int(float(order["total"]))
    if amount <= 0:
        raise HTTPException(status_code=400, detail="Order total must be > 0")

    sb = get_supabase_admin()

    # ---------- MOCK MODE ----------
    if _is_mock_mode():
        mock_id = f"MOCK-{datetime.now().strftime('%Y%m%d%H%M%S')}-{order_id[:8]}"
        payment = {
            "order_id": order_id,
            "user_id": order["user_id"],
            "provider": "mpesa",
            "amount": float(order["total"]),
            "currency": "KES",
            "status": "pending",
            "phone": normalized_phone,
            "checkout_request_id": mock_id,
            "merchant_request_id": f"MOCK-MR-{order_id[:8]}",
            "result_desc": "Mock mode — no Daraja call made",
        }
        inserted = sb.table("payments").insert(payment).execute()
        row = inserted.data[0]

        return {
            "payment_id": row["id"],
            "checkout_request_id": mock_id,
            "merchant_request_id": payment["merchant_request_id"],
            "customer_message": "Mock STK Push sent.",
            "status": "pending",
        }

    # ---------- REAL DARAJA MODE ----------
    token = await _get_daraja_token()
    ts = _stk_timestamp()
    payload = {
        "BusinessShortCode": settings.MPESA_SHORTCODE,
        "Password": _stk_password(ts),
        "Timestamp": ts,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": amount,
        "PartyA": normalized_phone,
        "PartyB": settings.MPESA_SHORTCODE,
        "PhoneNumber": normalized_phone,
        "CallBackURL": settings.MPESA_CALLBACK_URL,
        "AccountReference": f"ORD-{order_id[:8]}",
        "TransactionDesc": f"FloorballKenya order {order_id[:8]}",
    }

    async with httpx.AsyncClient(timeout=20) as client:
        r = await client.post(
            f"{_daraja_base_url()}/mpesa/stkpush/v1/processrequest",
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json",
            },
            json=payload,
        )
        data = r.json()

    if r.status_code != 200 or data.get("ResponseCode") != "0":
        raise HTTPException(
            status_code=502,
            detail=f"Daraja error: {data.get('errorMessage') or data.get('ResponseDescription')}",
        )

    payment = {
        "order_id": order_id,
        "user_id": order["user_id"],
        "provider": "mpesa",
        "amount": float(order["total"]),
        "currency": "KES",
        "status": "pending",
        "phone": normalized_phone,
        "checkout_request_id": data["CheckoutRequestID"],
        "merchant_request_id": data["MerchantRequestID"],
        "result_desc": data.get("CustomerMessage"),
    }
    inserted = sb.table("payments").insert(payment).execute()
    row = inserted.data[0]

    return {
        "payment_id": row["id"],
        "checkout_request_id": data["CheckoutRequestID"],
        "merchant_request_id": data["MerchantRequestID"],
        "customer_message": data.get("CustomerMessage", "STK Push sent"),
        "status": "pending",
    }


# ---------- Callback ----------
def handle_mpesa_callback(body: Dict[str, Any]) -> Dict[str, Any]:
    sb = get_supabase_admin()

    checkout_id: Optional[str] = None
    success = False
    receipt: Optional[str] = None
    result_code: Optional[int] = None
    result_desc: Optional[str] = None

    if "Body" in body and isinstance(body["Body"], dict):
        stk = body["Body"].get("stkCallback", {})
        checkout_id = stk.get("CheckoutRequestID")
        result_code = stk.get("ResultCode")
        result_desc = stk.get("ResultDesc")
        success = result_code == 0

        meta = stk.get("CallbackMetadata", {}) or {}
        for item in meta.get("Item", []):
            if item.get("Name") == "MpesaReceiptNumber":
                receipt = item.get("Value")
    else:
        checkout_id = body.get("checkout_request_id")
        success = bool(body.get("success", False))
        receipt = body.get("receipt")
        result_code = 0 if success else 1
        result_desc = body.get("result_desc", "Mock callback")

    if not checkout_id:
        raise HTTPException(status_code=400, detail="Missing checkout_request_id")

    pay_resp = (
        sb.table("payments")
        .select("*")
        .eq("checkout_request_id", checkout_id)
        .limit(1)
        .execute()
    )
    if not pay_resp.data:
        raise HTTPException(status_code=404, detail="Payment not found for this checkout ID")

    payment = pay_resp.data[0]

    new_status = "success" if success else "failed"
    sb.table("payments").update(
        {
            "status": new_status,
            "mpesa_receipt": receipt,
            "result_code": result_code,
            "result_desc": result_desc,
            "raw_callback": body,
        }
    ).eq("id", payment["id"]).execute()

    if success:
        sb.table("orders").update({"status": "paid"}).eq(
            "id", payment["order_id"]
        ).execute()

        try:
            record_commissions_for_order(payment["order_id"])
        except Exception as exc:
            print(f"[commissions] failed for order {payment['order_id']}: {exc}")

    return {
        "payment_id": payment["id"],
        "order_id": payment["order_id"],
        "status": new_status,
        "receipt": receipt,
    }