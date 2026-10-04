# Development Workflow

## Environment

Docker with Compose v2.24+. The host does not need Node.js or npm. All commands run in the `app` container.

## First run

```bash
docker compose run --rm app npm install   # creates package-lock.json on the host; commit it
docker compose up --build                 # dev server on http://localhost:3000
```

## Stop

```bash
docker compose down            # keep volumes
docker compose down -v         # also drop node_modules / .next volumes
```

## How the dev container works

- Source is bind-mounted at `/app`; `node_modules` and `.next` live in named volumes so host files stay clean.
- The container runs as the image's `node` user (uid 1000). If your host uid differs, files created by `npm install` (e.g. the lockfile) may need a `chown`.
- After changing `package.json`, run `docker compose run --rm app npm install`.
- If hot reload misses changes (Docker Desktop on macOS/Windows), enable `WATCHPACK_POLLING` in `docker-compose.yml`.

## Validation (before committing)

```bash
docker compose run --rm app npm run validate     # lint + typecheck + test + build
docker compose --profile prod up --build web     # production image on http://localhost:3001
```

## Seed data

```bash
docker compose run --rm app node scripts/generate-seed-data.mjs
```

Regenerates `src/data/local/seed/*.json` deterministically. Edit the catalogue in the script, not the JSON.

## Git

Focused commits. Never commit `.env`, `.env.local`, `node_modules`, `.next`, secrets or credentials. Commit `package-lock.json`.

## Vercel

Deploys from GitHub. Node.js 24.x. Set `NEXT_PUBLIC_SITE_URL` for production. Do not set `SITE_INDEXABLE=true` while data is sample data.

## Dependencies

Do not add a dependency just because it makes a small task easier. Prefer existing utilities and native Next.js features. Record notable additions in `docs/DECISIONS.md`.
