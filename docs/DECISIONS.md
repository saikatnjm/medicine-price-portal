# Architecture Decisions

Short log of decisions. Add new entries at the bottom; do not rewrite old ones — supersede them.

## D1 — Layering

UI → services (`src/services`) → repository interfaces (`src/repositories`) → provider (`src/data/local`).
`src/data/index.ts` is the single composition root. Enforced by ESLint `no-restricted-imports` for `src/app` and `src/components`.

## D2 — Async, coarse repositories

All repository methods return Promises. Search, alternatives and batch `findByIds` live in repositories so an API provider needs few round-trips and search can move to the backend/search engine.

## D3 — Generic is an entity

`Medicine.genericId` references `Generic`. A combination product (e.g. Paracetamol + Caffeine) is its own generic.

## D4 — Alternatives are derived

Alternative = same `genericId` + `strength` + `dosageForm`, excluding itself. No stored `MedicineAlternative` table in Phase 1. Shown as information, never as a substitution recommendation.

## D5 — Price semantics

`MedicinePrice.amount` is the price of one `Medicine.packSize`, in BDT major units. Each price has `source` (`sample` | `manual` | `integration`); the UI derives sample-data labelling from it.

## D6 — Indexing off by default

`SITE_INDEXABLE=false` by default; Vercel preview deployments are never indexable. Structured data must not include prices/offers while data is sample data.

## D7 — Sample data policy

Pharmacies are fictional. Medicine brand names and manufacturers are real-world examples; brand/manufacturer mappings, strengths and prescription status must be verified before public launch.

## D8 — Slugs

Stored, unique, never computed at runtime. Tablets: `{brand}-{strength}` (`napa-500mg`); other forms append the form (`napa-120mg-5ml-suspension`).

## D9 — Search (Phase 1)

In-memory, case-insensitive, word-prefix matching over brand, strength, generic and slug. Every query token must match. Ranking: exact brand → brand prefix → brand contains → generic prefix → other; ties by brand, strength, slug. Mid-word matches are intentionally excluded.

## D10 — Tooling

npm; ESLint 9 flat config with `eslint-config-next`; Prettier; Vitest (+ Testing Library/jsdom per-file for components). No Playwright yet. System font stack (no build-time font download). shadcn/ui components are added only when a component is actually needed.

## D11 — Runtime and containers

Node 24 (Docker `node:24-bookworm-slim`, `engines.node`, Vercel setting). Next.js `output: "standalone"` for the Docker production image. Seed JSON is imported (bundled), never read via `fs`, so it works in Vercel functions.

## D12 — Localisation

English URLs stay unprefixed; Bangla can be added later under `/bn/...` without breaking existing URLs. Search normalisation already keeps Bengali script.

## D13 — Sample labelling comes from data

`PriceStats.hasSampleData` / `MedicineDetail.hasSampleData` / `PharmacyDetail.hasSampleData` are derived from `MedicinePrice.source`. UI copy and page titles say "Sample prices" only when data is sample, so real data later needs no UI change.

## D14 — Search pages are noindex

`/search` is server-rendered from the URL (`?q=&page=`) but always `noindex`; medicine and pharmacy pages are the indexable content (when `SITE_INDEXABLE=true`). Breadcrumb JSON-LD omits the search crumb.

## D15 — Framework-free core

`src/domain`, `src/repositories`, `src/services`, `src/data/local` and most of `src/lib` use relative imports and no Next.js/React APIs, so they can be type-checked and tested in isolation and reused by a future API client.

## D16 — Site URL

`NEXT_PUBLIC_SITE_URL`, falling back to Vercel's `VERCEL_PROJECT_PRODUCTION_URL`, then `http://localhost:3000`.

## D17 — Seed data generation

`scripts/generate-seed-data.mjs` (Node, no dependencies, seeded PRNG) produces all seed JSON deterministically. Phase-1 dataset: 81 medicines (26 generics, 9 manufacturers), 10 fictional pharmacies, 531 sample prices. Two medicines intentionally have no prices to exercise empty states.

## D18 — No shadcn/ui components yet

The Phase-1 UI needs only links, a native GET search form, lists and definition lists. Adding shadcn/ui (Radix, cva, clsx, tailwind-merge) would add dependencies without benefit; revisit when an interactive component (dialog, combobox) is needed.
