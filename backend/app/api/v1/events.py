from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.schemas.event import EventCreate, EventRead, EventListRead
from app.crud.event import create as create_event, get_multi as list_events, get as get_event
from app.api.deps import get_current_user
from app.api.deps import get_db
import logging, os

router = APIRouter(prefix="/events", tags=["events"])

logging.getLogger("sqlalchemy.engine").info("Connecting to DB at %s", os.getenv("DATABASE_URL"))

@router.post(
    "/",
    response_model=EventRead,
    status_code=status.HTTP_201_CREATED,
)
async def create_event_endpoint(
    in_evt: EventCreate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    new_evt = await create_event(db=db, obj_in=in_evt, creator_id=current_user.id)
    
    fresh = await get_event(db=db, event_id=int(new_evt.id)) # type: ignore
    if not fresh:
        raise HTTPException(500, "Failed to reload event after creation")
    return fresh

@router.get(
    "/",
    response_model=List[EventListRead],   
)
async def list_events_endpoint(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
):
    return await list_events(db=db, skip=skip, limit=limit)

@router.get(
    "/{event_id}",
    response_model=EventRead,
)
async def get_event_endpoint(
    event_id: int,
    db: AsyncSession = Depends(get_db),
):
    evt = await get_event(db=db, event_id=event_id)
    if not evt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found",
        )
    return evt

