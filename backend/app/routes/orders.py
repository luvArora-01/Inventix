from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from ..dependencies import get_db
from ..models import Customer, Order, OrderItem, Product
from ..schemas import Message, OrderCreate, OrderRead

router = APIRouter(prefix="/orders", tags=["orders"])


def get_order_or_404(order_id: int, db: Session) -> Order:
    order = (
        db.query(Order)
        .options(joinedload(Order.customer), joinedload(Order.items).joinedload(OrderItem.product))
        .filter(Order.id == order_id)
        .first()
    )
    if order is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    return order


@router.post("", response_model=OrderRead, status_code=status.HTTP_201_CREATED)
def create_order(payload: OrderCreate, db: Session = Depends(get_db)) -> Order:
    customer = db.get(Customer, payload.customer_id)
    if customer is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")

    requested_quantities: dict[int, int] = {}
    for item in payload.items:
        requested_quantities[item.product_id] = requested_quantities.get(item.product_id, 0) + item.quantity

    products = (
        db.query(Product)
        .filter(Product.id.in_(requested_quantities.keys()))
        .with_for_update()
        .all()
    )
    products_by_id = {product.id: product for product in products}

    missing_ids = sorted(set(requested_quantities) - set(products_by_id))
    if missing_ids:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product not found: {missing_ids[0]}",
        )

    for product_id, quantity in requested_quantities.items():
        product = products_by_id[product_id]
        if product.quantity_in_stock < quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient stock for {product.product_name}",
            )

    total_amount = Decimal("0.00")
    order = Order(customer_id=payload.customer_id, total_amount=Decimal("0.00"))
    db.add(order)
    db.flush()

    for product_id, quantity in requested_quantities.items():
        product = products_by_id[product_id]
        unit_price = Decimal(product.price)
        total_amount += unit_price * quantity
        product.quantity_in_stock -= quantity
        db.add(
            OrderItem(
                order_id=order.id,
                product_id=product.id,
                quantity=quantity,
                unit_price=unit_price,
            )
        )

    order.total_amount = total_amount
    db.commit()
    return get_order_or_404(order.id, db)


@router.get("", response_model=list[OrderRead])
def list_orders(db: Session = Depends(get_db)) -> list[Order]:
    return (
        db.query(Order)
        .options(joinedload(Order.customer), joinedload(Order.items).joinedload(OrderItem.product))
        .order_by(Order.id.desc())
        .all()
    )


@router.get("/{order_id}", response_model=OrderRead)
def retrieve_order(order_id: int, db: Session = Depends(get_db)) -> Order:
    return get_order_or_404(order_id, db)


@router.delete("/{order_id}", response_model=Message)
def delete_order(order_id: int, db: Session = Depends(get_db)) -> Message:
    order = get_order_or_404(order_id, db)
    for item in order.items:
        item.product.quantity_in_stock += item.quantity
    db.delete(order)
    db.commit()
    return Message(message="Order cancelled successfully")
