from datetime import datetime
from pydantic import BaseModel, EmailStr

class BookingBase(BaseModel):
    name: str
    email: EmailStr

class BookingCreate(BookingBase):
    pass

class CancelBookingByEmail(BaseModel):
    email: EmailStr

class BookingRead(BookingBase):
    id: int
    slot_id: int
    created_at: datetime

    class Config:
        orm_mode = True
