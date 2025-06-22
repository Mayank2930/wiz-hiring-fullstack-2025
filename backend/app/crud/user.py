from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from passlib.context import CryptContext
from sqlalchemy.exc import IntegrityError

from app.models.users import User as UserModel
from app.schemas.user import UserCreate
from app.core.security import verify_password

pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def get_by_email(db: AsyncSession, *, email: str) -> UserModel | None:
    q = await db.execute(select(UserModel).where(UserModel.email == email))
    return q.scalars().first()

async def create(db: AsyncSession, *, User: UserCreate) -> UserModel:
    hashed = pwd_ctx.hash(User.password)
    db_obj = UserModel(email=User.email, name=User.name, hashed_password=hashed)
    db.add(db_obj)
    await db.flush()
    # try:
    #     await db.flush()
    # except IntegrityError:
    #     raise HTTPException(status_code=400, detail="Email already registered")     
    await db.refresh(db_obj)
    return db_obj

async def authenticate_user(db: AsyncSession, email: str, password: str) -> UserModel | None:
    user = await get_by_email(db, email=email)
    if not user or not verify_password(password, getattr(user, "hashed_password", "")):
        return None
    return user
