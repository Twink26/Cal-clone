## Cal.com Clone – End‑to‑End Guide

This file is your **step‑by‑step playbook** to finish, deploy, and confidently present this project so you can get selected.

It covers:

- Exactly what’s already implemented.
- How to run everything locally.
- How to deploy backend + frontend.
- How to explain your **database design**, **features**, and **UI** in the evaluation.

---

## 1. What You Already Have

- **Stack**
  - Frontend: React + TypeScript (Vite SPA, React Router).
  - Backend: Node.js + Express.
  - DB: PostgreSQL via Prisma ORM.

- **Core Features**
  - Event types CRUD (title, description, duration, slug, public URL).
  - Availability:
    - Weekly working hours (Mon–Sun).
    - **Multiple schedules** (e.g. “Working hours”, “Summer hours”).
    - **Date overrides** (block dates or set custom hours).
  - Public booking page:
    - Date selector.
    - Available time slots based on availability + overrides.
    - Booking form (name, email).
    - Double‑booking prevention (checked at slot generation + booking creation).
    - Booking confirmation page with event details.
  - Bookings dashboard:
    - Upcoming / Past / Canceled tabs.
    - Cancel booking.

- **Assignment alignment**
  - **No login**: default user ID 1, used across API.
  - **Sample data**: seeded user, event types, schedule, and booking in `backend/prisma/seed.js`.
  - **Custom schema**: designed in `backend/prisma/schema.prisma`.
  - **README**: `README.md` with setup + tech stack.

---

## 2. Local Setup – Do This First

### 2.1 Install global prerequisites

- Install **Node.js 18+** (you already have newer, that’s fine).
- Install **PostgreSQL** and create a database (e.g. `calclone`).

### 2.2 Configure backend `.env`

In `backend/.env` set:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/calclone?schema=public"
```

Replace `USER`, `PASSWORD`, and `calclone` with your local DB credentials and DB name.

### 2.3 Install dependencies

From project root:

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2.4 Apply Prisma schema (migrations)

From `backend/`:

```bash
cd backend
npx prisma migrate dev --name init
```

If you later change the schema again, run another migrate with a new name.

### 2.5 Seed sample data

From `backend/`:

```bash
node prisma/seed.js
```

This will:

- Create default user `admin@example.com`.
- Create sample event types:
  - `Intro Call` – 30 min, slug `intro-call-30`.
  - `Strategy Session` – 60 min, slug `strategy-session-60`.
- Create a default availability schedule (“Working hours”).
- Create a sample booking tomorrow at 10:00 for the 30‑minute event.

### 2.6 Run backend server

From `backend/`:

```bash
npm run dev
```

Backend will run on `http://localhost:4000`.

You can test quickly:

- `GET http://localhost:4000/api/event-types`
- `GET http://localhost:4000/api/availability`

### 2.7 Run frontend

Set API URL for the SPA. In `frontend/.env`:

```env
VITE_API_URL="http://localhost:4000"
```

Then:

```bash
cd frontend
npm run dev
```

Open `http://localhost:5173/` in your browser.

---

## 3. How to Use the App (Demo Flow)

Use this flow when showing the app in the evaluation.

### 3.1 Event types (admin)

- Go to `/` (root).
  - Show the **“Event types”** list with seeded items.
  - Create a new event type with:
    - Title (e.g. “Portfolio Review”).
    - Description.
    - Duration (e.g. 45).
    - Slug (e.g. `portfolio-review`).
  - Point out the **public URL**: `/book/<slug>`.

### 3.2 Availability

- Go to `/availability`.
  - Show the schedule selector (e.g. “Working hours (default)”).
  - Show weekly hours (Mon–Fri 9–5).
  - Toggle some days off/on and save.
  - Add a **date override**:
    - Example: pick a date, set “Block all day” → that day shows no slots.
    - Or: custom hours (e.g. 14:00–17:00 for a specific date).

### 3.3 Bookings dashboard

- Go to `/bookings`.
  - Show **Upcoming / Past / Canceled** tabs.
  - Show sample upcoming booking from the seed script.
  - Cancel it and see it move into Canceled/Past (depending on date).

### 3.4 Public booking flow

- Open `/book/intro-call-30`.
  - Show 3‑column layout:
    - Date picker.
    - Timeslots from availability + overrides.
    - Form for name + email.
  - Pick a date and time, enter details, book.
  - Land on `/confirm` with meeting title and start/end times.
  - Show that trying to book the **same slot** again gives a 409 (backend prevents double booking).

---

## 4. Deployment Guide (Step by Step)

You need:

- A deployed **backend API** + Postgres.
- A deployed **frontend SPA**.
- A **public GitHub repo**.

### 4.1 Push code to GitHub

From project root:

```bash
git init
git add .
git commit -m "Cal.com-style booking app"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

Use that repo for both backend and frontend deployment.

### 4.2 Backend deployment (Render example)

1. **Create managed Postgres** on Render (or Railway/Neon/Supabase).
   - Copy the Postgres connection string.

2. **Create Web Service** (backend):
   - Import your GitHub repo.
   - Set **Root/Working directory** to `backend`.
   - Build command: `npm install`.
   - Start command: `npm run start`.
   - Add environment variable:
     - `DATABASE_URL` = your managed Postgres URL.

3. **Run migrations on the remote DB**:
   - Use Render’s shell / one‑off command from `backend`:

   ```bash
   npx prisma migrate deploy
   node prisma/seed.js
   ```

4. **Note the backend URL**:
   - Something like `https://your-backend.onrender.com`.

### 4.3 Frontend deployment (Vercel example)

1. On Vercel: “New Project” → import your GitHub repo.
2. In project settings:
   - Root directory: `frontend`.
   - Build command: `npm run build`.
   - Output directory: `dist`.
3. Set environment variable:

   - `VITE_API_URL` = `https://your-backend.onrender.com`

4. Deploy; you’ll get a URL like `https://your-frontend.vercel.app`.
5. Test:
   - `https://your-frontend.vercel.app/`
   - `https://your-frontend.vercel.app/book/intro-call-30`

You now have:

- Public GitHub repo.
- Deployed backend + DB.
- Deployed frontend.

Those are the links you submit.

---

## 5. Database Design – How to Explain It

All models are in `backend/prisma/schema.prisma`. Be ready to describe:

- **User**
  - Fields: `id`, `name`, `email`, `timezone`.
  - Relations:
    - `eventTypes` (1‑many).
    - `availabilitySchedules` (1‑many).
  - Rationale: default “owner” of all event types and availability.

- **EventType**
  - Fields: `title`, `description`, `duration`, `slug`, `createdAt`, `updatedAt`.
  - Belongs to a `User`.
  - Has many `Booking`s.
  - Rationale: separate configuration for each type of meeting.

- **AvailabilitySchedule**
  - Fields: `name`, `isDefault`.
  - Belongs to a `User`.
  - Has many `AvailabilityRule`s and `DateOverride`s.
  - Rationale: allows multiple working‑hour patterns (e.g. normal vs. special schedule).

- **AvailabilityRule**
  - Weekly pattern: `dayOfWeek`, `startTime`, `endTime`.
  - Belongs to an `AvailabilitySchedule`.
  - Rationale: base weekly template for when the user is bookable.

- **DateOverride**
  - Fields: `date`, `isBlocked`, optional `startTime`, `endTime`.
  - Belongs to an `AvailabilitySchedule`.
  - Rationale: make exceptions to the weekly pattern (vacation days, special extended hours).

- **Booking**
  - Fields: `name`, `email`, `start`, `end`, `status`, `createdAt`.
  - Belongs to an `EventType`.
  - `status` is enum: `CONFIRMED` / `CANCELLED`.
  - Rationale: track meetings, support cancellation and dashboard views.

Also mention:

- **Double‑booking prevention**:
  - Query overlaps on `(start, end, eventTypeId, status = CONFIRMED)` before returning a slot and before creating a booking.
- **Timezone handling**:
  - Availability is expressed in user timezone; converted with `date-fns-tz` (`utcToZonedTime`, `zonedTimeToUtc`).

---

## 6. How to Talk About Code Quality & Modularity

Points to highlight during evaluation:

- **Separation of concerns**
  - API endpoints grouped in `backend/src/index.js`.
  - Schema lives only in `schema.prisma`; seeding in `prisma/seed.js`.
  - Frontend separated into:
    - `pages/` (screens),
    - `components/layout/` (shell),
    - `api/client.ts` (all HTTP calls in one place).

- **Reusability**
  - `DashboardLayout` wraps all admin pages.
  - `api` client centralizes base URL and error handling.

- **Error handling**
  - Consistent 4xx for validation errors, 5xx for server errors.
  - Conflict (409) on double booking.

---

## 7. Final Checklist Before You Submit

1. **Local run**
   - [ ] `npm run dev` in `backend` works and DB connects.
   - [ ] `npm run dev` in `frontend` works and pages load.
2. **Sample data**
   - [ ] `node prisma/seed.js` run at least once on your main DB.
   - [ ] Event types, availability, and bookings visible in UI.
3. **Deployment**
   - [ ] Backend deployed and reachable.
   - [ ] `DATABASE_URL` correctly set on server.
   - [ ] `npx prisma migrate deploy` and `node prisma/seed.js` run on server.
   - [ ] Frontend deployed with `VITE_API_URL` pointing to backend.
4. **GitHub**
   - [ ] Repo is **public**.
   - [ ] `README.md` and this `GUIDE.md` exist.
5. **Demo script ready**
   - [ ] Walkthrough: Event types → Availability → Bookings → Public booking → Confirmation.
   - [ ] Ready to explain schema + double‑booking logic + timezone behavior.

If you follow this guide and keep it open during your evaluation, you’ll be able to confidently explain every decision and show a working, deployed Cal.com‑style scheduler. Good luck – you’re in a strong position with this setup.

