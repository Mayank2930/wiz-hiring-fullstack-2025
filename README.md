# Mini-Calendly

A lightweight scheduling app inspired by Calendly—built with FastAPI, PostgreSQL, and React/Vite. Users can create events with time slots and public visitors can book them via name+email. Supports time-zone conversion, slot capacity, and optional booking management. This project is build as backend project with a sub par frontend 😅

---


## 🌐 Live Demo

- **Frontend:** https://wiz-hiring-fullstack-2025-98dp7m4zd-mayank2930s-projects.vercel.app/  
- **Backend API:** _(to be deployed; URL will be added here)_  

## 🧐 Overview & Approach

- **Backend**:  
  - **FastAPI** for async, type-safe HTTP endpoints  
  - **SQLAlchemy 2.0 + asyncpg** for async Postgres access  
  - **Alembic** for schema migrations  
  - **Pydantic** for request/response validation  
- **Frontend**:  
  - **Vite + React** for a fast dev workflow  
  - **Tailwind CSS** for utility-first styling  
  - **React Router** for client-side navigation  
  - **React Hook Form + Yup** for robust form validation  
  - **date-fns-tz** for time-zone conversion  
- **Deployment**:  
  - **Railway** for managed Postgres + FastAPI hosting  
  - **Vercel** for CDN-powered frontend hosting  

We keep all code in a **monorepo**: a single GitHub repo with `/backend` and `/frontend` directories, each deployed separately.

---

## 📁 Folder Structure

/
├─ backend/ # FastAPI app \
│ ├─ app/ \
│ │ ├─ api/ # Routers & dependencies \
│ │ ├─ core/ # Config & security \
│ │ ├─ crud/ # Database CRUD logic \
│ │ ├─ db/ # Session, Base, migrations \
│ │ ├─ models/ # SQLAlchemy models \
│ │ ├─ schemas/ # Pydantic schemas \
│ │ └─ main.py # FastAPI entrypoint \
│ ├─ migrations/ # Alembic migration scripts \
│ ├─ requirements.txt \
│ └─ Procfile # Railway start command \
└─ frontend/ # React/Vite app \
├─ public/ # Static assets & index.html \
├─ src/ \
│ ├─ api/ # axios instance \
│ ├─ components/ # Reusable UI components \
│ ├─ hooks/ # Custom React hooks \
│ ├─ pages/ # Route page components \
│ ├─ styles/ # Tailwind config & CSS \
│ └─ main.tsx # React entrypoint \
├─ package.json \
└─ tailwind.config.js \


---

## 🚀 Core Features

1. **Create Event** (authenticated users)  
   - Title, description, multiple UTC time slots, per-slot capacity  
2. **Public Event Listing**  
   - `GET /events` & `GET /events/{id}` endpoints  
3. **Booking Interface**  
   - Visitors book by name+email; enforces capacity & no duplicates  
4. **Time Zone Support**  
   - Store slots in UTC; convert client-side via `date-fns-tz`  
5. **View My Bookings**  
   - Public lookup by email or authenticated lookup; cancel bookings  

---

## 🎁 Bonus Features

- **Slot “remaining capacity”** computed server-side and sent in API  
- **Cancel Event** endpoint for creators to disable future bookings  
- **Public “cancel by email”** endpoint so visitors can cancel without signing up  
- **Hybrid auth model**: only event creation/cancellation locked behind JWT; bookings remain public  

---

## 🤔 Assumptions & Trade-offs

- **Email-only booking**: no invite links or magic tokens—relies on honest email entry  
- **No user accounts for visitors**: keeps friction low but opens “email snooping” risk  
- **Creator identity** via JWT only for event management; no multi-admin support    

---

## 🔭 Areas for Improvement

- **Strong booking authentication**: send one-time tokens to visitor emails to confirm/cancel  
- **Webhooks & notifications**: email reminders upon booking or cancellation  
- **Availability rules**: recurring slots, buffer times, blackout periods  
- **UI polishing**: calendar-style picker, timezone selector, dark mode switch  
- **E2E testing**: integrate Playwright or Cypress for full-flow validation  

---

## 🏁 Getting Started

### Backend

```bash
cd backend
cp .env.example .env             # set DATABASE_URL, SECRET_KEY, etc.
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload
```
### Frontend

```bash
cd frontend
npm install
npm run dev  ```
