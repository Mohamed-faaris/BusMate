# BusMate

Modern bus seat booking for campuses and routes, built with Next.js App Router, NextAuth, Drizzle ORM, and PostgreSQL. Users can register, sign in, view their dashboard, select a bus by boarding point, see a live seat map, and book seats. Admins can define boarding points, bus models (seat layouts), and buses with route stops.

## What it does

- User registration with validation and credentials login
- Dashboard with user details and current bookings
- Seat selection and booking on a visual bus layout
- Route filtering: list buses by boarding point
- Admin ops: add boarding points, models (layouts), and buses; map buses to boarding points with times

## Pages (App Router)

- `/` Home: quick links and a simple user lookup tool
- `/auth/register` Registration flow
- `/auth/signIn` Sign in (Credentials)
- `/dashboard` Main dashboard
- `/dashboard/booking` Seat booking UI with bus layout and “Book Now” dialog
- `/dashboard/account` Account page
- `/admin` Admin hub
  - `/admin/boardingPoint` Manage boarding points
  - `/admin/model` Manage seat models
  - `/admin/bus` Manage buses
  - `/admin/userDetails` View user details

## API routes

Auth

- GET/POST `/api/auth/[...nextauth]` NextAuth handlers (Credentials provider)

Registration

- POST `/api/register/send` Validate email and roll no availability
  - Body: `{ email: string, rollNo: string }`
  - 200: `{ success: true }`; 409 on conflict
- POST `/api/register` Create user + password
  - Body matches `registrationSchema` (see Schema section)
  - Note: OTP is currently a fixed demo value: `123123`

User and dashboard

- GET `/api/user/[userId]` Return user + bus + boardingPoint
- GET `/api/dashboard` Auth required; returns joined user/seat/bus/boarding point record for the logged-in user

Boarding points and buses

- GET `/api/boarding-points` List all boarding points
- GET `/api/busRoutes` List boarding points as `{ boardingPoints: [...] }`
- GET `/api/bus/byBoardingPoint/[boardingPointId]` List buses serving a boarding point
  - Response: `[{ id, name: busNumber }]`
- GET `/api/bus/[busId]` Bus details including `model.data` (seat layout) and `bus.seats` JSON

Booking

- POST `/api/bookSeat` Auth required; book a seat and update bus seat JSON
  - Body: `{ seatId: string, busId: string }`
  - Determines seat status by user gender: `bookedMale` or `bookedFemale`
  - 200: `{ message: "success" }`

Admin

- POST `/api/admin/addBoardingPoints` Create boarding point
  - Body: `{ name: string, latitude?: number, longitude?: number }`
- GET `/api/admin/addBus` List buses and bus-boarding point mappings
- POST `/api/admin/addBus` Create a bus and optional boarding point schedule
  - Body: `{ modelId, busNumber, routeName?, driverName, driverPhone, boardingPoints?: [{ boardingPointId, arrivalTime }] }`
- GET `/api/admin/model` List models `{ id, model }`
- GET `/api/admin/model/[modelId]` Get a model by id
- POST `/api/admin/addModel` Create a seat model
  - Body: `{ model: string, data: BusModelProperties }`

## Database schema (Drizzle + PostgreSQL)

All tables are prefixed with `BusMate_` via `pgTableCreator`.

Enums

- `gender`: `male | female | other`
- `seatStatus`: `available | bookedMale | bookedFemale | reserved`

Tables (key columns)

- `BusMate_user`
  - `id uuid PK`, `rollNo unique`, `name`, `gender`, `email unique`, `phone`, `address`, `dateOfBirth timestamp`
  - `busId uuid FK -> BusMate_bus.id`
  - `boardingPointId uuid FK -> BusMate_boardingPoint.id`
  - `receiptId`, `isVerified boolean`, `isAdmin boolean`, timestamps
- `BusMate_account`
  - `userId uuid PK/FK -> BusMate_user.id`, `password`
- `BusMate_boardingPoint`
  - `id uuid PK`, `name`, `latitude?`, `longitude?`
- `BusMate_bus`
  - `id uuid PK`, `modelId uuid`, `busNumber unique`, `routeName?`, `driverName`, `driverPhone`
  - `seats jsonb` map of `seatId -> seatStatus`
- `BusMate_seat`
  - `id serial PK`, `userId uuid`, `busId uuid`, `seatId varchar(16)`, `status seatStatus`, timestamps
- `BusMate_busBoardingPoint`
  - `id serial PK`, `busId uuid`, `boardingPointId uuid`, `arrivalTime time`
- `BusMate_acceptedRolls`
  - `rollNo unique`, `boardingPointId uuid`
- `BusMate_model`
  - `id uuid PK`, `model unique`, `data json` of `BusModelProperties` (seat layout)

Types (seat model layout)

- `SeatStatus = "available" | "bookedMale" | "bookedFemale" | "reserved" | "unavailable"`
- `BusModelProperties` contains seat groups: `leftTopSeatColumns`, `leftSeatColumns`, `rightSeatColumns`, `backSeats`, optional `door`, `driver`. Each group has `seatsRows` arrays of `{ id, seatStatus? }`.

## Tech stack

- Next.js 15 (App Router), React 19
- Auth: NextAuth v5 (Credentials)
- DB: Drizzle ORM, PostgreSQL
- State/Data: TanStack Query 5
- UI: Tailwind CSS v4, Radix UI primitives, lucide-react icons
- Tooling: TypeScript, ESLint, Prettier, pnpm

## Environment variables

Server-side

- `DATABASE_URL` Postgres connection URL (e.g. `postgres://root:root@localhost:5432/BusMate`)
- `AUTH_SECRET` Required in production for NextAuth
- `NODE_ENV` `development|test|production`

Client-side

- `NEXT_PUBLIC_BASE_URL` Full base URL (e.g. `http://localhost:3000`)

Validated via `@t3-oss/env-nextjs` in `src/env.js`. You can bypass during builds with `SKIP_ENV_VALIDATION=1`.

## How to run (local)

Prereqs: Node 22+, pnpm, and a Postgres database.

1. Install deps

```cmd
pnpm install
```

2. Configure env (create `.env.local`)

```env
DATABASE_URL=postgres://root:root@localhost:5432/BusMate
AUTH_SECRET=some-long-random-string
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

3. Start Postgres (option A: Docker quick start)

```cmd
docker run -d --name busmate-db -e POSTGRES_USER=root -e POSTGRES_PASSWORD=root -e POSTGRES_DB=BusMate -p 5432:5432 -v busmate_data:/var/lib/postgresql/data postgres:latest
```

4. Apply schema (Drizzle)

```cmd
pnpm db:push
```

5. Dev server

```cmd
pnpm dev
```

Open http://localhost:3000

## How to run (Docker Compose)

`compose.yaml` includes a Postgres service and an app service.

1. Ensure env is available to the `server` service (e.g., via an `.env` file in project root):

```env
DATABASE_URL=postgres://root:root@postgres-container:5432/BusMate
AUTH_SECRET=some-long-random-string
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

2. Start services

```cmd
docker compose up -d --build
```

Note: The current compose file sets only `NODE_ENV` for the app. You may extend it to pass the env vars above to the `server` service.

## Quick start: seed minimal data

If you’re starting from an empty database, seed a minimal set so the booking flow works end-to-end.

Option A — Drizzle Studio (no code):

- Run: `pnpm db:studio`
- Insert a row in `BusMate_boardingPoint` with a name (e.g., "Main Gate").
- Insert a row in `BusMate_model` with a simple seat layout. Example `data`:
  - leftTopSeatColumns: 3x4, leftSeatColumns: 8x3, rightSeatColumns: 10x2, backSeats: 1x6, door/driver optional.
- Insert a row in `BusMate_bus` referencing the model; set `seats` to a JSON map like `{ "L1-01": "available" }` or generate via the admin API below.
- Insert one or more rows in `BusMate_busBoardingPoint` mapping your bus to the boarding point, with an `arrivalTime`.

Option B — Admin APIs:

- POST `/api/admin/addModel` with a `BusModelProperties` payload.
- POST `/api/admin/addBoardingPoints` to create stops.
- POST `/api/admin/addBus` with `modelId`, bus metadata, and an array of boarding point schedules; the handler will auto-generate the `seats` JSON from the model.

After this, register a user, set their `boardingPointId` (via UI or DB), sign in, and go to `/dashboard/booking`.

## Admin workflow (suggested)

1. Define a seat model (layout) in `/admin/model` or via `/api/admin/addModel`.
2. Add boarding points in `/admin/boardingPoint`.
3. Create a bus in `/admin/bus`, select the model, and map boarding points with arrival times.
4. (Optional) Mark an admin by setting `BusMate_user.isAdmin = true` and add auth guards to admin pages.

## Architecture overview

- Next.js App Router serves pages and API routes in `src/app`.
- Auth uses NextAuth Credentials: `src/server/auth` and `/api/auth/[...nextauth]`.
- Data layer: Drizzle ORM with PostgreSQL; schemas in `src/server/db/schema`.
- Booking flow:
  - UI fetches `/api/user/[id]` and `/api/bus/byBoardingPoint/[boardingPointId]`.
  - Seat map fetches `/api/bus/[busId]` for `model.data` + `bus.seats`.
  - Booking POSTs to `/api/bookSeat`, writes to `BusMate_seat`, and updates `BusMate_bus.seats` JSON.

## Relations at a glance

- `user.boardingPointId -> boardingPoint.id`
- `user.busId -> bus.id`
- `seat.userId -> user.id`
- `seat.busId -> bus.id`
- `busBoardingPoint.busId -> bus.id`
- `busBoardingPoint.boardingPointId -> boardingPoint.id`
- `bus.modelId -> model.id`
- `account.userId -> user.id`

## Usage notes

- Booking requires an authenticated session. Use `/auth/signIn` after registering.
- Registration’s OTP is a hardcoded demo value `123123` and should be replaced in production.
- Seat status is stored both as rows in `BusMate_seat` and as a JSON map on `BusMate_bus.seats` for fast lookups.

## Common scripts

- `pnpm dev` Start Next.js in dev
- `pnpm preview` Build and start
- `pnpm db:generate` Generate Drizzle migrations
- `pnpm db:migrate` Apply migrations
- `pnpm db:push` Push schema to DB
- `pnpm db:studio` Drizzle Studio
- `pnpm lint` / `pnpm typecheck` Lint / TS check

## Minimal API examples

- Check availability

```http
POST /api/register/send
Content-Type: application/json

{ "email": "user@example.com", "rollNo": "cs001" }
```

- Register

```http
POST /api/register
Content-Type: application/json

{
    "rollNo":"cs001",
    "name":"User",
    "email":"user@example.com",
    "boardingPoint":"<boardingPointId or name per UI>",
    "gender":"male",
    "phone":"1234567890",
    "address":"Somewhere",
    "dateOfBirth":"2000-01-01",
    "otp":"123123",
    "password":"password123"
}
```

- Buses by boarding point

```http
GET /api/bus/byBoardingPoint/<boardingPointId>
```

- Bus details (for seat map)

```http
GET /api/bus/<busId>
```

- Book seat

```http
POST /api/bookSeat
Content-Type: application/json

{ "seatId": "L2-03", "busId": "<uuid>" }
```

## Security and production notes

- Replace the demo OTP flow; use a real email/OTP service.
- Set a strong `AUTH_SECRET` in production.
- Restrict admin endpoints with proper authorization checks (add guards as needed).
- Consider row-level constraints to enforce seat uniqueness and booking windows.

## Troubleshooting

- NextAuth page routes: config uses `/auth/signin` and `/auth/signup` but pages exist at `/auth/signIn` and `/auth/register`. Align these paths if redirects 404.
- `pnpm db:push` fails: verify `DATABASE_URL` is reachable and the user has create/alter privileges.
- Booking returns 401: ensure you’re signed in; `/api/bookSeat` requires an authenticated session.
- No buses listed for a boarding point: verify `BusMate_busBoardingPoint` has rows for that boarding point and bus.
- Docker Compose app can’t reach DB: for `DATABASE_URL` in compose, host must be `postgres-container`, not `localhost`.

## Contributing

PRs and issues are welcome. Run `pnpm lint` and `pnpm typecheck` before submitting.

## License

TBD

---

Made with Next.js, Drizzle, and a sprinkle of TypeScript.
