from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from app.modules.orders import repository as repo
from app.modules.orders import service
from app.modules.orders.permissions import require_authenticated, require_order_manager
from app.modules.orders.schemas import OrderCreate, OrderPublic, OrderStatusUpdate

router = APIRouter(tags=["Orders"])


@router.get("/orders/me", response_model=list[OrderPublic])
def my_orders(user=Depends(require_authenticated), limit: int = 50, offset: int = 0):
    return repo.list_for_customer(user["id"], limit=limit, offset=offset)


@router.get("/orders/{order_id}", response_model=OrderPublic)
def get_order(order_id: UUID, user=Depends(require_authenticated)):
    row = repo.get_order(str(order_id))
    if not row:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Order not found")
    if row["customer_id"] != user["id"] and user.get("role") not in ("admin", "super_admin"):
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Not your order")
    return row


@router.post("/orders", response_model=OrderPublic, status_code=status.HTTP_201_CREATED)
def create_order(payload: OrderCreate, user=Depends(require_authenticated)):
    return service.create_order(payload, customer_id=user["id"])


@router.patch("/admin/orders/{order_id}/status", response_model=OrderPublic)
def update_status(order_id: UUID, payload: OrderStatusUpdate,
                  user=Depends(require_order_manager)):
    return service.update_status(str(order_id), payload, actor_id=user["id"])
