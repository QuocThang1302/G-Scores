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

### `GET /scores/dashboard`

Returns data for the dashboard overview.

Response data:

```json
{
  "summary": {
    "examYear": 2024,
    "totalCandidates": 1060000
  },
  "subjectAverages": [
    {
      "code": "toan",
      "name": "Math",
      "displayName": "Toan",
      "average": 6.45,
      "candidateCount": 1045613,
      "candidatePercentage": 98.64
    }
  ],
  "mathScoreDistribution": [
    {
      "score": 0,
      "label": "0 - 0.5",
      "lowerBound": 0,
      "upperBound": 0.5,
      "count": 120
    }
  ]
}
```

`subjectAverages` includes every subject. Null scores are ignored for
`average` and `candidateCount`.

`mathScoreDistribution` groups math scores into half-point ranges from
`0 - 0.5` through `9.5 - 10`; the `9.5 - 10` bucket includes scores from
`9.5` through `10`.

### `GET /scores/reports/top-groups`

Returns the supported admission groups.

Success response:

```json
[
  {
    "code": "A00",
    "name": "Math-Physics-Chemistry",
    "subjects": [
      { "field": "toan", "label": "Math" },
      { "field": "vatLi", "label": "Physics" },
      { "field": "hoaHoc", "label": "Chemistry" }
    ]
  }
]
```

### `GET /scores/reports/top-groups/:groupCode`

Returns the top 10 candidates for an admission group such as `A00`, `A01`,
`B00`, `C00`, or `D01`.

Success response:

```json
{
  "group": {
    "code": "A00",
    "name": "Math-Physics-Chemistry",
    "subjects": [
      { "field": "toan", "label": "Math" },
      { "field": "vatLi", "label": "Physics" },
      { "field": "hoaHoc", "label": "Chemistry" }
    ]
  },
  "students": [
    {
      "sbd": "01000001",
      "subjects": [
        { "field": "toan", "label": "Math", "score": 9.8 },
        { "field": "vatLi", "label": "Physics", "score": 9.75 },
        { "field": "hoaHoc", "label": "Chemistry", "score": 9.75 }
      ],
      "totalScore": 29.3
    }
  ]
}
```

Candidates must have all three subject scores for the selected group.

### `GET /scores/reports/top-group-a`

Legacy endpoint for the top 10 candidates in Group A00.

Group A score:

```text
math + physics + chemistry
```

Candidates must have all three scores.
