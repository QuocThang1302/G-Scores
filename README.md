# G-Score

Full-stack app for querying Vietnam THPT 2024 exam scores.

## Run With Docker

Build and start PostgreSQL, the NestJS API, and the React frontend:

```bash
docker compose up -d --build
```

Open:

- Frontend: http://localhost:8080
- Backend API: http://localhost:3000

The Docker frontend is built with `VITE_API_URL=/api`, and nginx proxies
`/api/*` requests to the backend service inside the Compose network.

The Postgres container creates the `exam_scores` schema from
`Backend/database.sql` when the `postgres_data` volume is first created.

## Seed Exam Data

After the database is running, import `Backend/data/diem_thi_thpt_2024.csv`:

```bash
docker compose --profile seed run --rm seed
```

The seed script uses `skipDuplicates`, so re-running it will not duplicate
existing student records.

## Useful Commands

View logs:

```bash
docker compose logs -f
```

Stop containers:

```bash
docker compose down
```

Reset containers and the local Postgres data volume:

```bash
docker compose down -v
```
