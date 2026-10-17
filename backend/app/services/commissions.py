"""
Commissions service
===================

On successful payment:
    1. For each order item with a vendor:
         commission = subtotal × rate
         vendor_earning = subtotal − commission
    2. Insert into `commissions`
    3. Upsert aggregate into `vendor_earnings`

Rate is read from `platform_settings.commission_rate`.
"""

from decimal import Decimal, ROUND_HALF_UP
from typing import Any, Dict, List

from app.core.config import settings
from app.database.supabase import get_supabase_admin


def _get_commission_rate() -> Decimal:
    """Fetch the current platform commission rate (0..1) as Decimal."""
    sb = get_supabase_admin()
    resp = (
        sb.table("platform_settings")
        .select("value")
        .eq("key", "commission_rate")
        .limit(1)
        .execute()
    )
    if resp.data:
        try:
            raw = resp.data[0]["value"]
            if isinstance(raw, str):
                return Decimal(raw)
            return Decimal(str(raw))
        except Exception:
            pass
    return Decimal(str(settings.DEFAULT_COMMISSION_RATE))


def _q(value: Decimal) -> Decimal:
    """Quantize to 2 decimal places."""
    return value.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


def _order_items(order_id: str) -> List[Dict[str, Any]]:
    sb = get_supabase_admin()
    resp = (
        sb.table("order_items")
        .select("id, vendor_id, subtotal")
        .eq("order_id", order_id)
        .execute()
    )
    return resp.data or []


def record_commissions_for_order(order_id: str) -> Dict[str, Any]:
    """Compute and persist commissions + vendor earnings for a paid order."""
    sb = get_supabase_admin()
    rate = _get_commission_rate()

    sb.table("commissions").delete().eq("order_id", order_id).execute()

    items = _order_items(order_id)
    inserted = 0
    total_commission = Decimal("0.00")
    total_earnings = Decimal("0.00")

    for item in items:
        vendor_id = item.get("vendor_id")
        if not vendor_id:
            continue

        gross = _q(Decimal(str(item.get("subtotal") or "0")))
        commission = _q(gross * rate)
        earning = _q(gross - commission)

        sb.table("commissions").insert(
            {
                "order_id": order_id,
                "vendor_id": vendor_id,
                "order_item_id": item["id"],
                "gross_amount": float(gross),
                "rate": float(rate),
                "commission_amt": float(commission),
                "vendor_earning": float(earning),
            }
        ).execute()

        _bump_vendor_earnings(vendor_id, gross, commission, earning)

        inserted += 1
        total_commission += commission
        total_earnings += earning

    return {
        "order_id": order_id,
        "rate": float(rate),
        "items_processed": inserted,
        "total_commission": float(total_commission),
        "total_vendor_earnings": float(total_earnings),
    }


def _bump_vendor_earnings(
    vendor_id: str,
    gross: Decimal,
    commission: Decimal,
    earning: Decimal,
) -> None:
    sb = get_supabase_admin()

    existing = (
        sb.table("vendor_earnings")
        .select("total_gross, total_commission, total_earnings")
        .eq("vendor_id", vendor_id)
        .limit(1)
        .execute()
    )

    if existing.data:
        row = existing.data[0]
        new_gross = _q(Decimal(str(row["total_gross"])) + gross)
        new_comm = _q(Decimal(str(row["total_commission"])) + commission)
        new_earn = _q(Decimal(str(row["total_earnings"])) + earning)

        sb.table("vendor_earnings").update(
            {
                "total_gross": float(new_gross),
                "total_commission": float(new_comm),
                "total_earnings": float(new_earn),
            }
        ).eq("vendor_id", vendor_id).execute()
    else:
        sb.table("vendor_earnings").insert(
            {
                "vendor_id": vendor_id,
                "total_gross": float(gross),
                "total_commission": float(commission),
                "total_earnings": float(earning),
            }
        ).execute()


def get_vendor_earnings(vendor_id: str) -> Dict[str, Any]:
    sb = get_supabase_admin()
    resp = (
        sb.table("vendor_earnings")
        .select("*")
        .eq("vendor_id", vendor_id)
        .limit(1)
        .execute()
    )
    if not resp.data:
        return {
            "vendor_id": vendor_id,
            "total_gross": 0.0,
            "total_commission": 0.0,
            "total_earnings": 0.0,
        }
    return resp.data[0]