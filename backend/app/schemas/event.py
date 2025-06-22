from datetime import datetime, timezone
from dateutil.parser import isoparse
from typing import List
from pydantic import BaseModel, field_validator

class EventSlotBase(BaseModel):
    start_time: datetime
    end_time: datetime
    max_capacity: int = 1
    

    @field_validator("start_time", mode="before")
    def ensure_utc(cls, v):
        if isinstance(v, str):
            v = isoparse(v)      
        if v.tzinfo is None:
            v = v.replace(tzinfo=timezone.utc)
        return v.astimezone(timezone.utc)
    
    @field_validator("end_time", mode="before")
    def ensure_utc_end(cls, v):
        if isinstance(v, str):
            v = isoparse(v)
        if v.tzinfo is None:
            v = v.replace(tzinfo=timezone.utc)
        return v.astimezone(timezone.utc)

class EventSlotCreate(EventSlotBase):
    pass

class EventSlotRead(EventSlotBase):
    id: int
    remaining_capacity: int
    
    class Config:
        orm_mode = True


class EventBase(BaseModel):
    title: str
    description: str | None = None

class EventCreate(EventBase):
    slots: List[EventSlotCreate]

class EventRead(EventBase):
    id: int
    creator_id: int
    created_at: datetime
    is_cancelled: bool
    slots: List[EventSlotRead]

    class Config:
        orm_mode = True

class EventListRead(BaseModel):
    id: int
    title: str
    creator_id: int
    slot_count: int

    class Config:
        orm_mode = True