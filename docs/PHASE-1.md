# Phase 1 — Public Pilot

## Objective

Build and deploy a free, production-quality pilot combining medicine search (DGDA registry) and a healthcare directory (OpenStreetMap).

## Success Criteria

A visitor can:

1. Open the homepage.
2. Search for medicines or healthcare providers (hospitals, clinics, doctors, pharmacies).
3. See relevant results grouped by type.
4. Open a medicine detail page (brand, generic, strength, dosage form, manufacturer, alternatives).
5. Open a healthcare provider detail page (contact, location, hours, specialties).
6. Navigate by location (district) and/or specialty (for facilities and doctors).
7. View directions and contact information.
8. Use the site comfortably on mobile.
9. Find content through search engines (medicine pages, provider pages, location/specialty pages with ≥3 results).
10. See source attribution (DGDA for medicines, © OpenStreetMap contributors for directory).

## Pages

### Homepage `/`

- Search field (prominent)
- Popular medicine examples
- Healthcare provider examples (facilities, doctors)
- Product explanation
- Source attribution
- Demo-data disclaimer (when applicable)
- Responsive layout

### Search `/search?q=...`

- Grouped results: medicines, facilities, pharmacies, doctors
- Result count per group
- Pagination for each group
- Empty state
- Loading state
- Query analysis (search intent: entity, specialty, location)
- SEO: always noindex with canonical to `/search`

### Medicine `/medicine/[slug]`

- Brand name, generic name, strength, dosage form
- Manufacturer, registeredName (if different)
- Same-generic alternatives (same ingredient, strength, form)
- Provenance (DGDA registry reference)
- Price comparison placeholder ("coming soon")
- Related medicines (same generic)
- SEO: indexable when SITE_INDEXABLE=true

### Healthcare Facility `/hospital/[slug]`

- Name, kind (hospital/clinic/etc.)
- Location (address, district, area)
- Contact (phone, website, email)
- Opening hours
- Specialties (if tagged)
- "Get directions" (Google Maps URL)
- Map preview (click-to-load OSM or Google Embed)
- Provenance (OpenStreetMap, unverified)
- SEO: indexable when SITE_INDEXABLE=true

### Doctor `/doctor/[slug]`

- Name, specialties
- Chambers (practice locations with facility/address/hours)
- Contact information
- Biography (if available)
- Provenance (source and status)
- SEO: indexable if verified

### Pharmacy `/pharmacy/[slug]`

- Name, location, contact
- Hours, website
- Map, directions
- Provenance
- SEO: indexable

### Facility List `/hospitals`, `/clinics`, etc.

- Filterable by location (district/area) and specialty
- Sorted by location/distance/name
- Combination pages (location + specialty) indexable only if ≥3 results
- Load more / pagination
- SEO: filtered views noindex with canonical to clean path

### Doctor List `/doctors`, `/doctors/[location]`, `/doctors/[location]/[specialty]`

- Filterable by location and specialty
- Sorted by specialty/name/distance
- Similar indexing rules as facilities

### Pharmacy List `/pharmacies`, `/pharmacies/[location]`

- Filterable by location
- Similar indexing rules

### Location `/locations/[slug]`, `/locations`

- District or area details
- Facilities count, doctors count, etc.
- Links to filtered facility/doctor lists
- SEO: indexable if ≥3 related records

### Specialty `/specialties/[slug]`, `/specialties`

- Specialty description
- Practitioner title, aliases
- Links to filtered facility/doctor lists
- SEO: indexable if ≥3 related records

### API

`/api/suggest?q=...` — Autocomplete (GET, cached 5 min). Suggests medicines, providers, specialties, locations based on query intent.

## Search & Query Handling

Unified search that:
- Indexes medicines (brand, generic, strength, slug)
- Indexes healthcare providers (name, specialty, location)
- Indexes specialties and locations
- Uses deterministic intent parser: entity words (doctor, hospital, pharmacy), specialty titles/aliases, location names
- Case-insensitive, word-prefix matching
- Returns grouped results (medicines, facilities, doctors, pharmacies) with top results per group

## Data

**Medicines:** 36,328 from DGDA registry
- Generics: 1,520
- Manufacturers: 276
- Providers: DGDA Registered Drug Products (published by DGHS Ministry of Health)

**Healthcare directory:** 7,866 OSM features
- Facilities (hospitals, clinics, diagnostic centres, etc.): 3,447
- Pharmacies: 3,712
- Locations: 8 divisions, 64 districts
- Specialties: 22 curated, mapped to OSM values

**Prices:** None yet (no verified source). Price comparison infrastructure ready; UI shows placeholder.

**Doctors:** Intentionally empty (no open source; only verified/consented data will be added).

Data sources disclosed on every page; unverified OSM records marked as such.

## SEO

Every medicine should have:

- unique title
- description
- canonical URL
- OpenGraph metadata

Generate:

sitemap.xml
robots.txt

## Responsive

Must support:

mobile
tablet
desktop

## Accessibility

Use:

semantic HTML
accessible forms
keyboard navigation
focus states
proper labels
alt text

## Validation

Before completion:

npm/package manager commands should be executed inside Docker.

Required:

lint
typecheck
test
production build
Docker build
Docker Compose startup

## Deployment

Repository:

GitHub

Deployment:

Vercel

No external database.

No API secrets.

No paid services.

## Out of Scope

Everything listed as Phase 2+.
