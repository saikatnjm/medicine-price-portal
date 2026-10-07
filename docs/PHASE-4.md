# Phase 4 — consumer UX and SEO 2.0

See ADR D37 in `DECISIONS.md`. Summary of what changed:

- Homepage: pill search, popular searches, category cards, optional "Use my location", popular locations, popular medicine cards.
- Cards for hospitals, pharmacies and doctors; quick-filter chips on the hospital list; map beside the list on desktop.
- Hero card and icon actions on hospital and pharmacy pages; small FAQ on hospital, pharmacy and location pages.
- Titles, default social image (OpenGraph and Twitter large card), robots rules, Search Console verification variable.
- Data quality: more suspicious-name rules (re-run `npm run data:build-healthcare`).

Not done in this phase: bottom-sheet filters on mobile, a sort control beyond "distance from me", per-entity generated social images.
