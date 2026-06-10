# G-Score

Full-stack application for searching and reporting Vietnam THPT 2024 exam
scores. The project includes a NestJS API, PostgreSQL database, Prisma ORM, and
a React + Vite frontend.

## Prerequisites

- Node.js 20 or newer
- npm
- Docker Desktop or another Docker Compose-compatible runtime

## Project Structure

```text
Backend/    NestJS API, Prisma schema, seed script, SQL schema
Frontend/   React + Vite client
docker-compose.yml
```

## Run Locally With Docker

From the repository root:

```bash
docker compose up -d --build
```

This starts:

- PostgreSQL on `localhost:5432`
- Backend API on `http://localhost:3000`
- Frontend app on `http://localhost:8080`

Import the exam score CSV into PostgreSQL:

```bash
docker compose --profile seed run --rm seed
```

The seed command uses `Backend/data/diem_thi_thpt_2024.csv`. It skips duplicate
student records, so it is safe to run again.

Useful Docker commands:

```bash
docker compose logs -f
docker compose down
docker compose down -v
```

Use `docker compose down -v` only when you want to remove the local PostgreSQL
volume and start with an empty database.

## Run Locally For Development

Use this option when you want hot reload for both the backend and frontend.

### 1. Start PostgreSQL

From the repository root:

```bash
docker compose up -d db
```

The database is available at:

```text
postgresql://postgres:postgres@localhost:5432/gscores
```

### 2. Configure And Start The Backend

```bash
cd Backend
npm install
cp .env.example .env
```

Update `Backend/.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/gscores"
PORT=3000
FRONTEND_URL=http://localhost:5173
```

Generate the Prisma client:

```bash
npm run prisma:generate
```

Seed the database:

```bash
npm run seed
```

Start the API in watch mode:

```bash
npm run start:dev
```

The backend runs at `http://localhost:3000`.

### 3. Configure And Start The Frontend

Open a second terminal from the repository root:

```bash
cd Frontend
npm install
cp .env.example .env
```

Confirm `Frontend/.env` contains:

```env
VITE_API_URL=http://localhost:3000
```

Start the Vite dev server:

```bash
npm run dev
```

The frontend runs at `http://localhost:5173`.

## Build Commands

Backend:

```bash
cd Backend
npm run build
```

Frontend:

```bash
cd Frontend
npm run build
```

## API Endpoints

- `GET /` - API health check
- `GET /health` - API health check
- `GET /scores/:sbd` - find one candidate by student number
- `GET /scores/dashboard` - dashboard summary and distributions
- `GET /scores/reports/score-levels` - score-level report by subject
- `GET /scores/reports/top-groups` - supported admission groups
- `GET /scores/reports/top-groups/:groupCode` - top candidates for a group

Supported group examples include `A00`, `A01`, `B00`, `C00`, and `D01`.

## Deployment

### Frontend

The frontend is deployed on Vercel.

Frontend demo:

<https://g-scores-nu.vercel.app>

### Backend

The backend API is deployed on Render.

Backend API base URL:

<https://g-scores-84h8.onrender.com>

The backend root path `/` returns a health check response. You can also use the
API endpoints below to test specific features.

### Database

The production database is hosted on Supabase PostgreSQL.

### Deployment Note

The backend is deployed on Render Free Tier. If the backend has been inactive
for a while, the first request may take around 30-60 seconds because the service
needs to wake up. After the first request, the application should respond
normally.

### Production API Examples

Health check:

<https://g-scores-84h8.onrender.com/health>

Search score by registration number:

<https://g-scores-84h8.onrender.com/scores/01000008>

Dashboard report:

<https://g-scores-84h8.onrender.com/scores/dashboard>

Score-level report:

<https://g-scores-84h8.onrender.com/scores/reports/score-levels>

Supported admission groups:

<https://g-scores-84h8.onrender.com/scores/reports/top-groups>

Top candidates for Group A00:

<https://g-scores-84h8.onrender.com/scores/reports/top-groups/A00>

## Notes For Reviewers

The application can be run locally with Docker using one command.

The CSV import logic is included in the source code through the backend seed
script.

The local Docker setup uses a PostgreSQL container.

The production deployment uses Supabase PostgreSQL.

If the live demo takes time to load on the first request, please wait for the
Render backend service to wake up.

## Author

Đinh Phan Quốc Thắng
