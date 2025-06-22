from fastapi import APIRouter, Depends, Body, status
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel, EmailStr

from app.schemas.booking import BookingCreate, BookingRead
from app.crud.booking import create as create_booking, delete_booking
from app.api.deps import get_db, get_current_user
from app.schemas.user import UserBase

event_bookings_router = APIRouter(
    prefix="/events/{slot_id}/bookings",
    tags=["bookings"],
)

@event_bookings_router.post(
    "/",
    response_model=BookingRead,
    status_code=status.HTTP_201_CREATED,
)
async def book_slot_endpoint(
    slot_id: int,
    in_bk: BookingCreate,
    db: AsyncSession = Depends(get_db),
):
    return await create_booking(db=db, slot_id=slot_id, obj_in=in_bk)


@event_bookings_router.delete(
    "/{booking_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def cancel_booking_as_creator(
    slot_id: int,
    booking_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: UserBase = Depends(get_current_user),
):
    await delete_booking(
        db=db,
        booking_id=booking_id,
        user_email=current_user.email,
        slot_id=slot_id,
        allow_public=False,
    )

public_bookings_router = APIRouter(
    prefix="/bookings",
    tags=["bookings"],
)

class CancelBookingByEmail(BaseModel):
    email: EmailStr

@public_bookings_router.delete(
    "/{booking_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def cancel_booking_by_email(
    booking_id: int,
    payload: CancelBookingByEmail = Body(...),
    db: AsyncSession = Depends(get_db),
):
    await delete_booking(
        db=db,
        booking_id=booking_id,
        user_email=payload.email,
        slot_id=None,
        allow_public=True,
    )
