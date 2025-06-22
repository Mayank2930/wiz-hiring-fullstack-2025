from sqlalchemy import (
    Column, Integer, String, DateTime,
    ForeignKey, UniqueConstraint, func, Boolean
)
from sqlalchemy.orm import relationship

from app.db.base import Base

class Booking(Base):
    __tablename__ = "bookings"
    __table_args__ = (
        UniqueConstraint("slot_id", "email", name="uq_slot_email"),
    )

    id         = Column(Integer, primary_key=True, index=True)
    slot_id    = Column(Integer, ForeignKey("event_slots.id", ondelete="CASCADE"), nullable=False)
    name       = Column(String(255), nullable=False)
    email      = Column(String(255), nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    is_cancelled = Column(Boolean, nullable=False, default=False)

    slot = relationship("EventSlot", back_populates="bookings")