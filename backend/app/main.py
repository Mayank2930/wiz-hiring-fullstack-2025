import os

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.events import router as events_router
from app.api.v1.bookings import public_bookings_router, event_bookings_router
from app.api.v1.users import router as users_router
from app.api.v1.auth import router as auth_router

app = FastAPI(
    title="Mini-Calendly",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

origins = [
    "http://localhost:5173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(events_router)
app.include_router(event_bookings_router)
app.include_router(public_bookings_router)
app.include_router(users_router)
app.include_router(auth_router)


@app.get("/", tags=["health"])
async def health_check():
    return {"status": "ok", "message": "Mini-Calendly API is running"}


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000)),
        reload=True,
    )
