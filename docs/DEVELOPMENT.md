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
docker compose run --rm app npm run validate     # data + lint + typecheck + test + build
docker compose --profile prod up --build web     # production image on http://localhost:3001
```

## Data Management

### Medicine data (DGDA registry)

```bash
docker compose run --rm app npm run data:fetch      # download DGDA snapshot (network, polite)
docker compose run --rm app npm run data:build      # DGDA → medicines + generics + manufacturers (deterministic)
docker compose run --rm app npm run validate:data   # validate all seed data
```

### Healthcare directory (OpenStreetMap)

```bash
docker compose run --rm app npm run data:fetch-osm             # fetch health facilities and pharmacies (Overpass API)
docker compose run --rm app npm run data:fetch-osm-areas       # fetch district/area boundaries (resumable cache)
docker compose run --rm app npm run data:build-healthcare      # OSM → facilities + pharmacies + locations (deterministic)
docker compose run --rm app npm run validate:data              # validate all seed data
```

Never edit generated JSON by hand. Change rules in `scripts/data/` and rebuild. See [DATA-PIPELINE.md](DATA-PIPELINE.md) for details and refresh policies.

## Git

Focused commits. Never commit `.env`, `.env.local`, `node_modules`, `.next`, secrets or credentials. Commit `package-lock.json`.

## Vercel

Deploys from GitHub. Node.js 24.x. Set `NEXT_PUBLIC_SITE_URL` for production. Decide on indexing (`SITE_INDEXABLE`) deliberately; preview deployments are never indexed.

## Dependencies

Do not add a dependency just because it makes a small task easier. Prefer existing utilities and native Next.js features. Record notable additions in `docs/DECISIONS.md`.
