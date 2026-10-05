# Bangladesh Healthcare Search

A medicine search and healthcare directory portal for Bangladesh. The catalogue contains **36,328 medicine products from the DGDA registry** plus a searchable healthcare directory: hospitals, clinics, diagnostic centres, dental clinics, doctors' practices, blood banks and pharmacies (sourced from OpenStreetMap, unverified). Doctor records are intentionally empty—only verified, consented data will be added.

- Stack: Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · local seed data · Docker Compose · Vercel
- Pages: `/` (search), `/search?q=`, `/medicine/[slug]`, `/hospitals`, `/hospitals/[location]/[specialty]`, `/hospital/[slug]`, `/pharmacies`, `/pharmacy/[slug]`, `/doctors`, `/doctor/[slug]`, `/specialties`, `/locations`, plus sitemaps and robots.txt
- Docs: [`docs/`](docs) — start with [PROJECT](docs/PROJECT.md), [ARCHITECTURE](docs/ARCHITECTURE.md) and [DECISIONS](docs/DECISIONS.md)

## Requirements

Docker with Compose v2.24+ only. No Node.js/npm is needed on the host.

## Quick start

```bash
cp .env.example .env              # optional; defaults work
docker compose up --build         # http://localhost:3000
```

First-time setup (generates `package-lock.json` on the host — commit it):

```bash
docker compose run --rm app npm install
```

## Common commands

All commands run inside the container:

| Task                        | Command                                                                |
| --------------------------- | ---------------------------------------------------------------------- |
| Lint                        | `docker compose run --rm app npm run lint`                             |
| Type check                  | `docker compose run --rm app npm run typecheck`                        |
| Tests                       | `docker compose run --rm app npm test`                                 |
| Production build            | `docker compose run --rm app npm run build`                            |
| Everything above            | `docker compose run --rm app npm run validate`                         |
| Format                      | `docker compose run --rm app npm run format`                           |
| Production image            | `docker compose --profile prod up --build web` → http://localhost:3001 |
| After changing dependencies | `docker compose run --rm app npm install`                              |

## Environment variables

See [`.env.example`](.env.example). No secrets are needed in Phase 1.

| Variable               | Default                 | Purpose                                                            |
| ---------------------- | ----------------------- | ------------------------------------------------------------------ |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | Canonical/OpenGraph base URL (build time)                          |
| `SITE_INDEXABLE`       | `false`                 | Allow search-engine indexing. Vercel previews are never indexable. |

## Medicine & Healthcare Data

Built from the DGDA registry and OpenStreetMap via repeatable pipelines (details and source assessment in [docs/DATA-PIPELINE.md](docs/DATA-PIPELINE.md)):

```bash
# Medicines (DGDA registry)
docker compose run --rm app npm run data:fetch      # download the DGDA registry snapshot (network)
docker compose run --rm app npm run data:build      # normalise, validate, deduplicate → seed files + report

# Healthcare directory (OpenStreetMap)
docker compose run --rm app npm run data:fetch-osm            # fetch health facilities and pharmacies
docker compose run --rm app npm run data:fetch-osm-areas      # fetch administrative boundaries (districts/areas)
docker compose run --rm app npm run data:build-healthcare     # merge and deduplicate → seed files + report

# Validation
docker compose run --rm app npm run validate:data   # check medicines, facilities, pharmacies, locations, specialties, doctors
```

Import reports: `data/reports/dgda-import-report.md` and `data/reports/osm-import-report.md`.

## Project layout

```
src/
  app/            routes (Server Components by default)
  components/     layout/, common/, ui/ (+ feature folders)
  domain/         entity types (medicine.ts, healthcare.ts) and read models — no I/O
  repositories/   repository interfaces (medicines, generics, manufacturers, pharmacies,
                  prices, sources; facilities, pharmacy directory, locations, specialties, doctors)
  data/           composition root (index.ts) + local seed provider (local/)
  services/       application services (medicine, pharmacy, facility, doctor, location, specialty,
                  directory, search, places)
  lib/            formatting, routes, SEO, search, geo, maps, site config
tests/            Vitest tests (data, repositories, services, SEO, components, routes)
scripts/data/     pipelines (fetch-dgda, build-catalog, fetch-osm-health, fetch-osm-areas,
                  build-healthcare, validate-data)
data/             raw snapshots and import reports (dgda-import-report, osm-import-report)
```

UI code imports services from `@/data` only; ESLint blocks imports of `@/data/local` and seed JSON from `src/app` and `src/components`.

## Deployment

GitHub → Vercel (framework preset: Next.js; no database or external services).

- Node.js version: 24.x (matches `engines` and the Dockerfile).
- `NEXT_PUBLIC_SITE_URL`: production URL (optional — falls back to Vercel's production domain).
- `SITE_INDEXABLE`: leave unset/`false` until real price data exists. Preview deployments are never indexable.
