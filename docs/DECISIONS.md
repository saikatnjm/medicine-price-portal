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

## D7 — Sample data policy (superseded by D19)

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

## D17 — Seed data generation (superseded by D19)

`scripts/generate-seed-data.mjs` (Node, no dependencies, seeded PRNG) produces all seed JSON deterministically. Phase-1 dataset: 81 medicines (26 generics, 9 manufacturers), 10 fictional pharmacies, 531 sample prices. Two medicines intentionally have no prices to exercise empty states.

## D18 — No shadcn/ui components yet

The Phase-1 UI needs only links, a native GET search form, lists and definition lists. Adding shadcn/ui (Radix, cva, clsx, tailwind-merge) would add dependencies without benefit; revisit when an interactive component (dialog, combobox) is needed.

## D19 — Real catalogue from the DGDA registry (supersedes D7 and D17)
Medicines, generics and manufacturers come from the official DGDA Registered Drug Products registry (DGHS terminology server) via a repeatable fetch → build → validate pipeline. See [DATA-PIPELINE.md](DATA-PIPELINE.md). The demo generator (`scripts/generate-seed-data.mjs`) and all fictional data were removed.

## D20 — No invented prices or pharmacies
No verified, reusable Bangladesh price source was found, so `prices.json` and `pharmacies.json` are empty. The price comparison and pharmacy infrastructure stay in place; medicine pages show "Price information coming soon", and every pharmacy URL is a 404 until sourced data exists.

## D21 — Optional fields stay empty
Pack size, prescription status, category and description are optional in the domain model and are only shown when a source publishes them. The UI omits missing fields rather than showing "Unknown".

## D22 — Provenance on every record
`Medicine.provenance` (source, record id, DAR number when unflagged, status `registered`) plus a `sources.json` entry with retrieval date. Medicine pages and the homepage disclose the source contextually.

## D23 — Scale: 36k products
Only homepage examples are prerendered; other medicine pages render on first request and are cached (`dynamicParams`). The search index is built lazily once per server instance and pre-sorted (single linear scan per query, a few ms). Related lists on a medicine page are capped at 30 with a link to the full search. The sitemap (~36k URLs) stays a single file under the 50,000-URL limit; split it with `generateSitemaps` if the catalogue grows past that.

## D24 — Search refinements
Queries also match the registered name and the brand with spaces removed ("napa500", "cef3"). If nothing matches every word, the search falls back to the first word and says so ("Napa Extra" → results for "Napa"). Within a brand, tablets/capsules and single-ingredient products are listed first (display order only, not a ranking of merit).

## D25 — OpenStreetMap as directory source (Phase 2)
Healthcare directory (facilities, pharmacies, locations) is sourced from OpenStreetMap (ODbL 1.0 license). All records are marked `status: "unverified"` with attribution "© OpenStreetMap contributors" shown on all pages and in metadata. Rationale: comprehensive, open-licensed coverage; transparent provenance; avoids vendor lock-in. Risk mitigation: unverified status prominent; Django API provider can later support multiple sources or curated datasets.

## D26 — No doctor data without verified consent (Phase 2)
Doctor records are intentionally empty. Only individuals who have explicitly consented (verified source, signed agreement) will be added. No auto-population from OSM or any source, and no inference from facility data. The model supports chambers and specialties for future expansion when verified data exists.

## D27 — Google integration limited to key-free URLs and optional Embed API (Phase 2)
- "Get directions" and "View on Google Maps" use official key-free Google Maps URLs (no API key required)
- Map embed preview defaults to OpenStreetMap; Google Maps Embed API (public key, domain-restricted) is optional
- No Places API, no ratings/reviews stored or shown, no aggregateRating in JSON-LD
- Rationale: cost (Places API is paid); caching terms prohibit long-term storage of ratings; OSM provides adequate preview; official URLs work without key
- GooglePlaceRef stores only placeId (if available) and lastChecked; no ratings/reviews

## D28 — Click-to-load maps (Phase 2)
Maps embedded on directory pages (facility, doctor, pharmacy) default to unloaded to avoid early third-party requests. Visitor must click "View on map" to load the OSM embed or Google Maps Embed API. Rationale: privacy; performance; avoids third-party overhead for users who don't need the map.

## D29 — Administrative areas via OSM point-in-polygon (Phase 2)
Each facility/pharmacy stores districtId (from metadata or majority of records); areaId is assigned via point-in-polygon with OSM admin_level 6 boundaries. Deterministic for a given snapshot. Rationale: OSM boundaries are public and revisable; point-in-polygon is reproducible; no dependency on external geocoding APIs.

## D30 — Deterministic search intent instead of NLP (Phase 2)
Directory search uses hand-coded entity word recognition ("doctors", "hospital", "pharmacy"), specialty title/alias matching, and location name/parent matching — no NLP. Rationale: transparent, predictable, maintainable; avoids ML model dependencies and cost; sufficient for Phase 1 scale; can upgrade to Meilisearch or embedding-based search in Phase 3 without changing the UI.

## D31 — Combination page threshold is 3 records (Phase 2)
Pages like "/hospitals/dhaka/cardiology" are indexable only if they show ≥3 results. Otherwise, canonical redirects to the parent (e.g., "/hospitals/dhaka" or "/hospitals"). Rationale: avoid thin content penalties; focus SEO on pages with substantial information; reduces duplicate content. Checked at build time and at request time.

## D32 — In-memory distance sorting acceptable at current scale (Phase 2)
Directory listings with "sort by distance from me" use browser geolocation (2-decimal precision, ~1 km) and server-side distance calculation (linear scan). Rationale: 7k records at current scale; sub-second latency acceptable; upgrade path: PostGIS distance queries or Meilisearch once 50k+ records exist.

## D33 — Product renamed: Medicine Price Portal → Bangladesh Healthcare Search (Phase 2)
The product expanded beyond medicine prices (empty source) to a comprehensive directory of healthcare providers (hospitals, clinics, doctors, pharmacies). New name reflects the expanded scope and primary Phase 1 deliverable. Rationale: marketing clarity; user expectations; domain coverage.
