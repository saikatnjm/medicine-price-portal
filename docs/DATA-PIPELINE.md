# Data Pipeline: Medicines & Healthcare Directory

The catalogue is built from the **official DGDA registry of registered drug products**. Nothing in it is typed by hand or generated from memory.

```
DGHS terminology server (OCL API)
  └─ npm run data:fetch      scripts/data/fetch-dgda.mjs      → data/raw/dgda-drug-registry.json   (network, polite)
       └─ npm run data:build  scripts/data/build-catalog.mjs   → src/data/local/seed/*.json         (offline, deterministic)
                                                              → data/reports/dgda-import-report.{md,json}
            └─ npm run validate:data  scripts/data/validate-data.mjs (also part of `npm run validate`)
```

Run inside Docker: `docker compose run --rm app npm run data:fetch` (then `data:build`, `validate:data`). Commit the raw snapshot, the generated seed files and the report together.

## Sources considered

| Source | Provenance | Access / reuse | Decision |
|---|---|---|---|
| **DGDA Registered Drug Products** — OCL source `MoHFW/DGDA-Drugs` on `api.tr.ocl.dghs.gov.bd`, documented in the [Bangladesh Core FHIR IG](https://fhir.dghs.gov.bd/core/CodeSystem-dgda-drug-registry.html) | Official: DGDA registry published by DGHS (Ministry of Health and Family Welfare) | Public, anonymous read (`public_access: View`); no login, paywall or CAPTCHA; no robots.txt on the API host. No explicit licence is published. | **Used.** Government registry intended for national interoperability. Attribute DGDA/DGHS; re-check terms before commercial use. |
| Mendeley Data "Medicinal Products in Bangladesh" (2024) | Research dataset; collection method and licence not stated on the landing page | Unclear origin | Not used (unclear provenance and licence). |
| Commercial medicine directories (e.g. MedEx) and scraper listings | Commercial databases | Terms do not grant reuse; scraping would copy a proprietary database | Not used. |

Fields available from the registry: DAR (registration) number, trade name, company, dosage form, generic content (ingredients + strength), a DAR quality flag. **Not available:** prices, pack sizes, prescription status, therapeutic category, descriptions. These are left empty, never inferred.

## Rules (scripts/data/lib/normalize.mjs)

**Parsing.** `generic_content_raw` is `"<ingredients joined by +>  <strengths>"`; the strength starts at the first double-space-separated part beginning with a number.

**Normalisation (formatting only).** Unicode/whitespace cleanup; strength notation (`.5 %` → `0.5%`, `ml` → `mL`, spacing around `/` and `+`); dosage-form labels title-cased with acronyms (`Sr Tablet` → `SR Tablet`); manufacturer factory/site suffixes dropped (`Square Pharmaceuticals PLC, Pabna` → `Square Pharmaceuticals PLC`); a trailing number is removed from the displayed brand only when it equals the registered strength (`Acumet 50` + `50 mg` → `Acumet`), with the registered name kept in `registeredName`.

**Controlled dosage forms.** Each product keeps its precise registered label (130 labels, e.g. "SR Tablet", "Eye Drops") and gets one of 20 categories (`DOSAGE_FORMS`). Alternatives compare the precise label, so an SR tablet is never treated as the same form as a plain tablet.

**Rejected (not published).**

| Reason | Rule |
|---|---|
| `veterinary_product` | DAR category code `077`, or "Vet"/"Veterinary" in the trade or company name. In the snapshot, category 077 holds the livestock products (boluses, feed powders, almost all "Vet"-named items); no other category has more than 5 "Vet"-named products. This is an observed pattern, not a published definition. |
| `non_human_dosage_form` | Bolus, pellets, water-soluble powder, raw material, gas |
| `not_a_drug_product` | OCL concept class is not `Drug` (ingredient entries) |
| `retired` | Retired in the source |
| `missing_or_malformed_brand` / `_manufacturer` / `missing_generic` / `malformed_strength` / `malformed_generic` | Empty, placeholder, non-alphabetic or replacement-character values; a strength that does not start with a number |

**Deduplication.** Product identity = normalised brand + generic + strength + precise dosage form + manufacturer (site suffixes ignored). The same product registered at several plants of one company is kept once (lowest record id). Pack size is not part of the key because the source does not publish it.

**Slugs.** `{brand}-{strength}` with units joined (`napa-500mg`); the dosage form is appended for anything other than plain tablets/capsules (`napa-120mg-5ml-suspension`); strengths with more than 3 components are omitted (multivitamins); collisions get the manufacturer, then the record id. Deterministic for a given snapshot.

**Provenance.** Every medicine has `provenance: { sourceId, recordId, darNumber?, status: "registered" }`. The DAR number is withheld when the source flags it (`dar_truncated`, `dar_malformed`, …). "Registered" means present in the official registry; it does not mean currently marketed.

## Current snapshot (retrieved 2026-10-04)

| | |
|---|---|
| Raw registry records | 39,196 |
| Published medicine products | 36,328 |
| Rejected | 1,616 (veterinary 1,444; ingredient entries 86; non-human forms 80; blank brand 6) |
| Duplicates removed | 1,252 |
| Generics | 1,520 |
| Manufacturers | 276 |
| DAR number withheld (source quality flag) | 428 |

Full breakdowns (by manufacturer, dosage form, generic, rejected records) are in `data/reports/dgda-import-report.md` and `.json`.

## Known limitations

- Registration ≠ availability: discontinued products may still be registered.
- No prices, pack sizes or prescription status. The UI omits them; price comparison shows "Price information coming soon".
- Names are shown as registered (including the registry's own spellings).
- Ingredient synonyms are not merged (e.g. "Losartan" and "Losartan Potassium" are separate generics), so some same-generic alternatives appear under "other strengths and forms" or not at all. A curated synonym map is the next data step.
- The veterinary filter is rule-based; review `rejectedRecords` in the JSON report after each import.

---

# Healthcare Directory Pipeline (OpenStreetMap)

The healthcare directory is built from OpenStreetMap data (facilities, pharmacies, locations) via a repeatable fetch → build → validate pipeline.

```
OpenStreetMap (Overpass API)
  └─ npm run data:fetch-osm        scripts/data/fetch-osm-health.mjs      → data/raw/osm-bd-health.json   (network, respects rate limits)
       └─ npm run data:fetch-osm-areas scripts/data/fetch-osm-areas.mjs   → data/raw/osm-bd-areas.json    (network, cached)
            └─ npm run data:build-healthcare scripts/data/build-healthcare.mjs → src/data/local/seed/*.json (offline, deterministic)
                                                                           → data/reports/osm-import-report.{md,json}
                 └─ npm run validate:data    scripts/data/validate-data.mjs (check all seed data)
```

Run inside Docker: `docker compose run --rm app npm run data:fetch-osm` (then `data:fetch-osm-areas`, `data:build-healthcare`, `validate:data`). Commit the raw snapshots, generated seed files and report together.

## OSM Data Import

| Source | Access | License | Decision |
|---|---|---|---|
| **OpenStreetMap** — health facilities and pharmacies via Overpass API | Public, anonymous query (`https://overpass-api.de/`); no login or payment; respects rate limits (1 req/sec) | ODbL 1.0; attribution "© OpenStreetMap contributors" required on all pages | **Used.** Comprehensive, open-licensed directory. All records marked `status: "unverified"`. |

Data retrieved: 2026-10-04 (OSM snapshot as of 2026-10-04T12:50:21Z). Currently **7,866 features** → **3,447 facilities + 3,712 pharmacies**.

### Processing

1. **Fetch (Overpass):** Query `[bbox:healthcare facilities, pharmacies]` for each district
2. **Filter:** Reject veterinary, generic-name-only, and records without a name
3. **Deduplicate:** Merge near-duplicates by (name, districtId, coordinates within 50m)
4. **Standardize:** Normalise names (unicode, case), dosage forms, ownership
5. **Assign areas:** Point-in-polygon from OSM admin boundaries (admin_level 6 = upazila/thana). District = majority district of a facility's records
6. **Generate:** Write seed JSON (facilities, pharmacies, locations), report

### Current snapshot (2026-10-04)

| Metric | Count |
|---|---|
| Raw OSM features | 7,866 |
| Facilities (non-pharmacy) | 3,447 |
| Pharmacies | 3,712 |
| Rejected (missing name, veterinary, generic only) | 510 |
| Duplicates removed | 197 |
| Slug collisions resolved | 362 |
| Divisions / Districts / Areas | 8 / 64 / 0 |

### Field coverage

Most records have name and coordinates; phone, website, opening hours are sparse. Email, ownership, specialties are rare. Full breakdown in `data/reports/osm-import-report.md`.

### Known limitations

- **Unverified.** All records are marked `status: "unverified"`. Accuracy, completeness and currency depend on volunteer contributions.
- **No area assignment yet.** OSM admin_level 6 boundaries are sparse for Bangladesh; currently 0 records assigned to areas.
- **Sparse metadata.** Phone, hours, ownership are optional and often missing.
- **No doctor records.** OSM has no reliable doctor/clinician directory (privacy concerns). Doctor records will only be added from verified, consented sources.
- **No prices.** Medicine prices are not tracked in OSM and will not be inferred from facility type.

### Refresh & validation

```bash
docker compose run --rm app npm run data:fetch-osm               # fetch current snapshot
docker compose run --rm app npm run data:fetch-osm-areas         # fetch/update area boundaries (resumable)
docker compose run --rm app npm run data:build-healthcare        # regenerate seed data
docker compose run --rm app npm run validate:data                # check all seed data
```

If processing rules change, regenerate from the raw snapshot without re-fetching (offline, deterministic).

### Locations (Administrative)

Fetched from OSM `admin_level` boundaries:
- `admin_level 4` = division (8 total)
- `admin_level 6` = district (64 total)
- `admin_level 7` or finer = area/upazila/thana (sparse; point-in-polygon used when available)

Each facility/pharmacy record stores its assigned districtId; when area boundaries are available, areaId is assigned via point-in-polygon.

### Specialties

Curated taxonomy (`scripts/data/taxonomy/specialties.mjs`, 22 specialties) maps OSM `healthcare:speciality` values to canonical names (e.g., OSM "cardiology" → taxonomy "Cardiology"). Facilities can be tagged with one or more specialties; doctors inherit from their chambers/facilities.

### Provenance

Every facility and pharmacy has `provenance: { sourceId → "osm", recordId, status: "unverified" }`. Source metadata (retrieval date, attribution) is in `directory-sources.json`.
