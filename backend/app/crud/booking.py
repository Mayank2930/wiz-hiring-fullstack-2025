# app/crud/booking.py
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

from app.models.bookings import Booking as BookingModel
from app.models.event import EventSlot as SlotModel
from app.schemas.booking import BookingCreate


async def create(
    db: AsyncSession,
    *,
    slot_id: int,
    obj_in: BookingCreate,
) -> BookingModel:
    result = await db.execute(
        select(SlotModel)
        .where(SlotModel.id == slot_id)
        .with_for_update()
    )
    slot = result.scalars().first()
    if not slot:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Slot not found")

    current = await db.scalar(
        select(func.count())
        .select_from(BookingModel)
        .where(BookingModel.slot_id == slot.id)
    )
    current = int(current or 0)

    max_capacity = int(getattr(slot, "max_capacity", 0))
    
    if current >= max_capacity:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,
                            detail="Slot is full")

    dup = await db.execute(
        select(BookingModel)
        .where(BookingModel.slot_id == slot.id)
        .where(BookingModel.email == obj_in.email)
    )
    if dup.scalars().first():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,
                            detail="You have already booked this slot")

    booking = BookingModel(
        slot_id=slot.id,
        name=obj_in.name,
        email=obj_in.email,
    )
    db.add(booking)
    await db.flush()     
    await db.refresh(booking)
    return booking


async def get(
    db: AsyncSession,
    *,
    booking_id: int,
) -> BookingModel | None:
    result = await db.execute(
        select(BookingModel).where(BookingModel.id == booking_id)
    )
    return result.scalars().first()


async def get_multi_by_slot(
    db: AsyncSession,
    *,
    slot_id: int,
    skip: int = 0,
    limit: int = 100,
) -> list[BookingModel]:
    result = await db.execute(
        select(BookingModel)
        .where(BookingModel.slot_id == slot_id)
        .offset(skip)
        .limit(limit)
    )
    return list(result.scalars().all())


async def get_multi_by_user_email(
    db: AsyncSession,
    *,
    email: str,
    skip: int = 0,
    limit: int = 100,
) -> list[BookingModel]:
    result = await db.execute(
        select(BookingModel)
        .where(BookingModel.email == email)
        .offset(skip)
        .limit(limit)
    )
    return list(result.scalars().all())


async def delete_booking(
    db: AsyncSession,
    *,
    booking_id: int,
    user_email: str,
    slot_id: int | None = None,
    allow_public: bool = False,
) -> None:
    
    q = select(BookingModel).where(BookingModel.id == booking_id)
    if slot_id is not None:
        q = q.where(BookingModel.slot_id == slot_id)
    result = await db.execute(q)
    booking = result.scalars().first()

    if not booking:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Booking not found")

    if allow_public:
        if booking.email != user_email: # type: ignore
            raise HTTPException(status.HTTP_403_FORBIDDEN, "Email mismatch")
    else:
        await db.refresh(booking, attribute_names=["slot"])
        await db.refresh(booking.slot, attribute_names=["event"])
        if booking.slot.event.creator_id != int(user_email):
            raise HTTPException(status.HTTP_403_FORBIDDEN, "Not allowed to cancel this booking")

    await db.delete(booking)
    await db.commit()
