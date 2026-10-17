from typing import Any
from fastapi import HTTPException, status
from app.modules.audit import service as audit
from app.modules.orders import repository as repo
from app.modules.orders.schemas import OrderCreate, OrderStatusUpdate


def create_order(payload: OrderCreate, customer_id: str) -> dict[str, Any]:
    order_items = []
    total = 0

    for item in payload.items:
        product = repo.get_product(str(item.product_id))
        if not product or product["status"] != "approved":
            raise HTTPException(status.HTTP_400_BAD_REQUEST,
                                f"Product {item.product_id} unavailable")
        if product["stock_quantity"] < item.quantity:
            raise HTTPException(status.HTTP_400_BAD_REQUEST,
                                f"Insufficient stock for {product['name']}")
        line_total = product["price_cents"] * item.quantity
        total += line_total
        order_items.append({
            "product_id": str(item.product_id),
            "vendor_id": product["vendor_id"],
            "product_name": product["name"],
            "unit_price_cents": product["price_cents"],
            "quantity": item.quantity,
        })

    order = repo.insert_order({
        "customer_id": customer_id,
        "status": "pending",
        "total_cents": total,
        "currency": "KES",
        "notes": payload.notes,
    })

    for row in order_items:
        row["order_id"] = order["id"]
    repo.insert_items(order_items)

    audit.log_action(actor={"id": customer_id}, action="order.create",
                     resource_type="order", resource_id=order["id"],
                     metadata={"total_cents": total, "item_count": len(order_items)})

    return repo.get_order(order["id"]) or order


def update_status(order_id: str, payload: OrderStatusUpdate, actor_id: str) -> dict[str, Any]:
    existing = repo.get_order(order_id)
    if not existing:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Order not found")
    updated = repo.update_order(order_id, {"status": payload.status}) or existing
    audit.log_action(actor={"id": actor_id}, action=f"order.{payload.status}",
                     resource_type="order", resource_id=order_id,
                     metadata={"from_status": existing["status"]})
    return updated
