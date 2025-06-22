from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from fastapi import HTTPException, status

from app.models.event import Event as EventModel, EventSlot as SlotModel
from app.schemas.event import EventCreate

async def get(db: AsyncSession, *, event_id: int) -> EventModel | None:
    q = await db.execute(
        select(EventModel)
        .where(EventModel.id == event_id)
        .options(
            selectinload(EventModel.slots)
                .selectinload(SlotModel.bookings)   
        )
    )
    return q.scalars().first()

async def get_multi(
    db: AsyncSession,
    *,
    skip: int = 0,
    limit: int = 100
) -> list[dict]:
    q = await db.execute(
        select(
            EventModel.id,
            EventModel.title,
            EventModel.creator_id,
            func.count(SlotModel.id).label("slot_count"),
        )
        .outerjoin(EventModel.slots)
        .group_by(EventModel.id)
        .order_by(EventModel.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    rows = q.all()  
    return [
        {
            "id":        r.id,
            "title":     r.title,
            "creator_id":r.creator_id,
            "slot_count":r.slot_count,
        }
        for r in rows
    ]

async def create(
    db: AsyncSession, *, obj_in: EventCreate, creator_id: int
) -> EventModel:
    # create main Event
    event = EventModel(
        title=obj_in.title,
        description=obj_in.description,
        creator_id=creator_id,
    )
    # attach slots
    event.slots = [
        SlotModel(start_time=slot.start_time, end_time=slot.end_time, max_capacity=slot.max_capacity)
        for slot in obj_in.slots
    ]

    db.add(event)
    await db.flush()
    await db.commit()
    await db.refresh(event)
    return event

async def cancel_event(
    db: AsyncSession,
    *,
    event_id: int,
    user_id: int,
) -> EventModel:
    ev = await get(db, event_id=event_id)
    if not ev:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Event not found")
    if ev.creator_id != user_id: # type: ignore
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Not allowed to cancel this event")
    if ev.is_cancelled: # type: ignore
        return ev
    ev.is_cancelled = True # type: ignore
    await db.commit()
    await db.refresh(ev)
    return ev
