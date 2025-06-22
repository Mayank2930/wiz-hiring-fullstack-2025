from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud.user import create as create_user, authenticate_user
from app.schemas.user import UserCreate, UserRead
from app.schemas.token import Token
from app.core.security import create_access_token
from app.api.deps   import get_db
from app.core.config import settings

router = APIRouter(tags=["auth"])

@router.post(
    "/auth/signup",
    response_model=UserRead,
    status_code=status.HTTP_201_CREATED,
)
async def signup(
    user_in: UserCreate,
    db: AsyncSession = Depends(get_db),
):
    try:
        user = await create_user(db=db, User=user_in)
    except HTTPException as e:
        raise e
    return user

@router.post(
    "/auth/token",
    response_model=Token,
)
async def login_for_access_token(
    db: AsyncSession = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends(),
):
    user = await authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    token = create_access_token(
        data={"sub": user.email},
        expires_delta=expires,
    )
    return {"access_token": token, "token_type": "bearer"}