from sqlalchemy import (
    Column, Integer, String, Text,
    ForeignKey, DateTime, UniqueConstraint, func, CheckConstraint, Boolean
)
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import TIMESTAMP

from app.db.base import Base

class Event(Base):
    __tablename__ = "events"

    id          = Column(Integer, primary_key=True, index=True)
    title       = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    creator_id  = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    is_cancelled = Column(Boolean, nullable=False, default=False, index=True)
    created_at  = Column(DateTime(timezone=True), server_default=func.now())

    creator = relationship("User", back_populates="events")
    slots   = relationship("EventSlot", back_populates="event", cascade="all, delete-orphan")
    
class EventSlot(Base):
    __tablename__ = "event_slots"
    __table_args__ = (
       UniqueConstraint("event_id", "start_time", name="uq_event_slot_time"),
       CheckConstraint("end_time > start_time", name="ck_event_slot_time_order"),
    )

    id            = Column(Integer, primary_key=True, index=True)
    event_id      = Column(Integer, ForeignKey("events.id", ondelete="CASCADE"), nullable=False)
    start_time    = Column(TIMESTAMP(timezone=True), nullable=False, index=True)
    end_time      = Column(TIMESTAMP(timezone=True), nullable=False, index=True)
    max_capacity  = Column(Integer, nullable=False, default=1)

    event     = relationship("Event", back_populates="slots")
    bookings  = relationship("Booking", back_populates="slot", cascade="all, delete-orphan")
    
    @property
    def remaining_capacity(self) -> int:
        return self.max_capacity - len(self.bookings) # type: ignore