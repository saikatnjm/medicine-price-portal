# Phase 3 — Trust, maps, doctors, Google Places, domain

## Assessment (before changes)

| Area | Finding |
|---|---|
| Already implemented | Medicines (DGDA, 36k), OSM directory (hospitals/clinics/pharmacies), areas, specialties, grouped search + autocomplete, directions links, click-to-load maps, list map, nearby lists, combination pages, split sitemaps, JSON-LD, Docker/Vercel. |
| Needs improvement | Entity kinds taken verbatim from OSM tags; detail pages lacked quick actions and a clear source/last-checked section; nearby lists mixed all kinds; homepage did not state the product name. |
| Missing | Data-quality rules and review states, error reporting, doctor import path, optional Google enrichment, WebSite JSON-LD, manifest. |
| Potential bugs | Medicine sources and directory sources merged (fixed in Phase 2); doctor sources would be dropped by the directory build (fixed). |
| Data quality | ~920 names with OSM category/address text pasted in ("X Hospital, Hospital, Road …"); medicine shops, diagnostic centres, dental clinics and community clinics tagged as hospitals/clinics; offices and associations tagged as hospitals; a few same-name records under two kinds. |
| SEO | Production is `noindex` until `SITE_INDEXABLE=true`; canonical host comes from `NEXT_PUBLIC_SITE_URL`/Vercel env (no hard-coded domain). |
| UX | Map is optional and lazy; directions work without keys; doctor pages honestly empty. |

## What changed

- **Data quality** (`scripts/data/lib/quality.mjs`, report `data/reports/directory-quality-report.md`):
  kinds refined only when the record's own name states another kind (553 records,
  e.g. "… Medical Hall" tagged hospital → pharmacy, "… community clinic" → health centre);
  pasted category/address text trimmed from 920 names (original kept as `sourceName`);
  review states `active` / `needs_review` (shown with a notice, noindex, not in sitemap) /
  `excluded` (kept for audit, hidden). New kinds: health centre, other facility.
- **Trust model**: provenance `sourceUpdatedAt`, `lastCheckedAt`, `verificationMethod`,
  `verifiedAt`; plain labels ("Community-mapped", "Source verified", …); "Source & last checked"
  and "Is something incorrect?" (OSM edit link + optional `NEXT_PUBLIC_REPORT_URL`) on entity pages; `/about` data page.
- **Pages**: quick actions (Call / Website / Directions), grouped nearby (hospitals, clinics,
  diagnostic centres, pharmacies), location sections by kind.
- **Doctors**: verified-only model, CSV import (`npm run data:import-doctors`, `docs/DOCTOR-DATA.md`),
  profile/chamber UX, "Doctor at <hospital>" search. Dataset remains empty (no legitimate source yet).
- **Google (optional)**: stored place ids only; live "Google rating" only with
  `GOOGLE_PLACES_API_KEY` + `GOOGLE_PLACES_LIVE_DETAILS=true`; offline matcher `npm run data:match-google-places`.
- **SEO/brand**: homepage h1 "Bangladesh Healthcare Search", WebSite + SearchAction JSON-LD,
  Twitter card, web manifest, `/specialty/*` and `/location/*` redirects, entity titles
  ("ABC Eye Hospital, Gazipur", "Napa 500 mg Tablet — Medicine Information").
