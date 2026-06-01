from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from ..dependencies import get_db
from ..models import Customer
from ..schemas import CustomerCreate, CustomerRead, Message

router = APIRouter(prefix="/customers", tags=["customers"])


def get_customer_or_404(customer_id: int, db: Session) -> Customer:
    customer = db.get(Customer, customer_id)
    if customer is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")
    return customer


@router.post("", response_model=CustomerRead, status_code=status.HTTP_201_CREATED)
def create_customer(payload: CustomerCreate, db: Session = Depends(get_db)) -> Customer:
    customer = Customer(**payload.model_dump())
    db.add(customer)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Customer email already exists",
        ) from exc
    db.refresh(customer)
    return customer


@router.get("", response_model=list[CustomerRead])
def list_customers(db: Session = Depends(get_db)) -> list[Customer]:
    return db.query(Customer).order_by(Customer.id.desc()).all()


@router.get("/{customer_id}", response_model=CustomerRead)
def retrieve_customer(customer_id: int, db: Session = Depends(get_db)) -> Customer:
    return get_customer_or_404(customer_id, db)


@router.delete("/{customer_id}", response_model=Message)
def delete_customer(customer_id: int, db: Session = Depends(get_db)) -> Message:
    customer = get_customer_or_404(customer_id, db)
    db.delete(customer)
    db.commit()
    return Message(message="Customer deleted successfully")
