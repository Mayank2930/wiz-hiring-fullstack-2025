from fastapi import APIRouter, Depends
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.booking import BookingRead
from app.crud.booking import get_multi_by_user_email
from app.api.deps import get_db

router = APIRouter(prefix="/users", tags=["users"])


@router.get(
    "/{email}/bookings",
    response_model=List[BookingRead],
)
async def get_user_bookings(
    email: str,
    db: AsyncSession = Depends(get_db),
):
    return await get_multi_by_user_email(db=db, email=email)
