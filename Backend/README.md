# G-Scores Backend

NestJS API for querying Vietnam THPT 2024 exam scores from a Supabase PostgreSQL database.

## Setup

Install packages:

```bash
npm install
```

Create `.env` from `.env.example` and set your Supabase PostgreSQL connection string:

```bash
cp .env.example .env
```

Generate the Prisma client:

```bash
npx prisma generate
```

Place the official CSV file at:

```text
data/diem_thi_thpt_2024.csv
```

Seed data:

```bash
npm run seed
```

Run the development server:

```bash
npm run start:dev
```

## API

### `GET /scores/:sbd`

Find one candidate by student number. `sbd` must be non-empty and contain digits only.

Success response:

```json
{
  "success": true,
  "data": {
    "id": "1",
    "sbd": "01000001",
    "toan": 8.4
  }
}
```

Returns `404` when no score exists for the requested `sbd`.

### `GET /scores/reports/score-levels`

Counts candidates by score level for every subject. Null scores are ignored.

Score levels:

- `excellent`: `>= 8`
- `good`: `>= 6` and `< 8`
- `average`: `>= 4` and `< 6`
- `poor`: `< 4`

### `GET /scores/reports/top-group-a`

Returns the top 10 candidates in Group A.

Group A score:

```text
math + physics + chemistry
```

Candidates must have all three scores.
