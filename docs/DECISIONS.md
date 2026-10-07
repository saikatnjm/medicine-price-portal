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

## D34 — Optional list maps: runtime-loaded Leaflet + OpenStreetMap tiles (Phase 2)
Hospital and pharmacy list pages offer a "Show map" button (`ResultsMap`) that shows a multi-marker map of the results on the current page only. Leaflet 1.9.4 is not an npm dependency: its script and CSS are injected from unpkg (with SRI) only after the visitor clicks, once per page, and tiles come from the standard OpenStreetMap tile server with attribution. Nothing is requested from a map provider before the click; if loading fails, a text message points to the Directions links. Markers are built from the already-paginated items (no extra queries, no coordinates beyond what the list shows); popups are built with `textContent`, never `innerHTML`. Desktop shows list and map side by side; mobile shows the map above the list, never full-screen. The list remains the primary content and every card keeps its address and Directions link. Rationale: privacy and performance (consistent with D28), no lockfile change, simple migration to a bundled map library later. Trade-off: depends on unpkg availability and OSM tile usage policy (fine at pilot traffic; use a tile provider before heavy traffic).

## D35 — Optional Google Places enrichment: place ID stored, ratings live only (Phase 3)
Supersedes the "no Places API" part of D27. Listings may carry `google: { placeId, lastChecked }`, produced by an optional manual script (`npm run data:match-google-places`, official Places API (New) Text Search; accepts a match only within 150 m and with name similarity >= 0.6) and merged by `data:build-healthcare` from `data/google/place-ids.json`. Ratings and review counts are never stored (Google terms): `GooglePlaceInfo` fetches them live per request (Place Details, `no-store`, 2.5 s timeout, any failure = no details) only when `GOOGLE_PLACES_API_KEY` (server-only) and `GOOGLE_PLACES_LIVE_DETAILS=true` are set. Without live details it shows a key-free "View on Google Maps" link; without a place ID, nothing. Google data is labelled "Google rating" and attributed "Information from Google Maps", never mixed with our own information; no review text and no `aggregateRating` JSON-LD. Rationale: useful extra context for visitors, opt-in cost, no dependency (the site works without any Google key), and compliance with caching terms.

## D36 — Optional Google Analytics 4

GA4 loads only when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set and never on Vercel
preview deployments. Scripts load `afterInteractive` via `next/script` (no npm
dependency). Automatic page views are disabled; a client tracker sends one
`page_view` per navigation after removing the `near` parameter (the visitor's
rounded position from "near me"), so location never reaches analytics. The
/about page discloses analytics when it is enabled.

## D37 — Consumer UX and SEO 2.0 (Phase 4)

UI: icon-led cards (`result-cards.tsx`, inline SVG icons in `ui/icons.tsx`, no icon dependency), a rounded pill search on the homepage, category cards with real counts ("Coming soon" for doctors), popular searches, an optional "Use my location" (position requested only after the click, rounded to ~1 km, placed only in `?near=` links, never stored), data-driven popular locations (top districts by listed records, never hand-picked), type/emergency quick-filter chips as plain links (each state has its own URL, no JavaScript), and a hero card with icon actions on hospital and pharmacy pages. Desktop shows list and map side by side from the start (Leaflet is still only requested client-side after hydration, D34); mobile keeps the map behind "Show map".

SEO: titles follow one pattern per entity (hospital "Name, Area — Location, Contact & Details", pharmacy "— Location & Contact", specialty "X in Bangladesh", location "Healthcare in X | Hospitals, Pharmacies & More"; the layout template appends the site name). One generated default social image (`app/opengraph-image.tsx`) is used for OpenGraph and the Twitter `summary_large_image` card on every page; entity-specific text comes from each page's title and description. `robots.txt` additionally blocks crawling of `q`, `near` and `page` parameter URLs. A Search Console token can be set with `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`. Small factual FAQs (native `<details>`, answers built from the page's own data, deliberately no FAQPage markup) appear on hospital, pharmacy and location pages. URLs are unchanged (`/specialties/…`, `/locations/…`), which keeps existing links working.

Data quality: names that contain camp, programme/program, campaign or bridge (and no hospital/clinic word) are flagged `suspicious_category` and become `needs_review` (visible, noindex, out of the sitemap) the next time `data:build-healthcare` runs.

## D38 — SEO growth and browser-local retention (Phase 5)

SEO core: `lib/seo-core.ts` is the single entry for metadata helpers and `getIndexability` (noindex for invalid, needs-review, filtered and below-threshold pages) plus an internal-only `seoQualityScore`. Thresholds live in `lib/seo-config.ts` (`SEO_THRESHOLDS`, env-configurable). Place aliases (Dacca, Chittagong, Jessore, …) resolve to the canonical place in search through `lib/aliases.ts`; they never create separate pages. Internal linking: `lib/related-searches.ts` and `services.directory.relatedFor*` feed "People also search for" and "Next steps" blocks, built only from combinations that exist in the data.

Retention: recent searches, recently viewed, saved items and the compare list live only in this browser's localStorage (`lib/local-store.ts`, versioned keys, tolerant parsing, `useSyncExternalStore` hooks). Nothing is sent to a server and no account exists. The homepage "Continue where you left off" and `/saved` render only when data exists; "Clear history" removes searches and views. `/compare?m=a,b` is noindex and accepts up to four slugs. Analytics (`lib/events.ts`) is a provider-agnostic `track()` that sends only query text and result counts (including zero-result searches), never location or saved items.

Not done in this phase: per-entity OG images, sitemap groups for specialties/locations, data-quality/SEO/link audit scripts (see docs/PHASE-5.md).
