# Doctor data

The doctor directory is **empty by default**. Doctors are added only from sources that
allow it, through one import path. We never scrape, copy or invent profiles, qualifications,
schedules or phone numbers.

## Acceptable sources

- **Official hospital or organisation profile pages**, used with the organisation's written
  permission (keep the permission note in `sources.json`).
- **Doctor-provided** information, given with the doctor's consent to publish it
  (keep the consent record outside the repo; `verification_method` = `doctor_provided`).
- **Registries** whose terms allow reuse (`verification_method` = `registry`; record the licence).

## Not acceptable

- Scraping or bulk copying of any website.
- Aggregator or "find a doctor" sites, review sites, directories built from other directories.
- Social media profiles or posts.
- Personal phone numbers or home addresses. Only public practice contacts.
- Ratings, reviews, fees or availability we cannot verify.

## Consent and verification checklist

1. The source is listed in `data/doctors/sources.json` with the licence or permission note.
2. Permission or consent to publish is documented (who, when, scope).
3. `source_url` is the exact page the data came from (or the registry entry).
4. Every field was read from the source, not guessed or "filled in".
5. Phone numbers are public practice numbers; `profile_summary` is text supplied by the source (max 500 characters).
6. `verified_at` is the date a person checked the data against the source.
7. The doctor can ask for correction or removal; remove rows on request and re-run the import.

## Files

- `data/doctors/doctors.csv` (UTF-8, header only when empty): one row per chamber, rows grouped by `doctor_key`.
- `data/doctors/sources.json`: array of sources. Each has `id` (must start with `doctors-`), `name`, `url`,
  `licence` (licence or permission note); optional `publisher`, `licenceUrl`, `attribution`, `note`.
- `data/doctors/doctors.example.csv` and `sources.example.json`: **EXAMPLE ONLY**, fictional placeholders on `example.org`.
  The importer refuses `example.org` / `example.com` hosts unless run with `--allow-examples` (tests only).

## Columns

Doctor-level columns are read from the first row of a group; later rows may repeat them or leave them blank
(a different value is an error). Unknown columns are rejected.

| Column | Required | Notes |
|---|---|---|
| `doctor_key` | yes | Your stable key for the doctor (any text). Groups rows; ids are derived from it. |
| `name` | yes | As published, e.g. `Dr. Firstname Lastname`. |
| `specialties` | yes | Specialty slugs from the taxonomy, separated by `;` (e.g. `cardiology;internal-medicine`). |
| `qualifications`, `designation`, `organization` | no | Text from the source. `organization` = main hospital when it is not a directory facility. |
| `profile_summary` | no | Short text supplied by the source, max 500 characters. |
| `phone` | no | Public practice phone only. |
| `source_id` | yes | An `id` from `sources.json`. |
| `source_url` | yes | http(s) page the data came from. |
| `verification_method` | yes | `official_profile`, `doctor_provided` or `registry`. |
| `verified_at` | yes | `YYYY-MM-DD`, not in the future. |
| `facility_slug` | chamber | Slug of a facility in the directory. Use this **or** `facility_name` + `district_slug`. |
| `facility_name`, `district_slug` | chamber | For chambers outside the directory. |
| `area_slug`, `locality`, `address`, `postal_code` | no | Location details as published. |
| `latitude`, `longitude` | no | Only if the source provides them; must fall inside Bangladesh. |
| `chamber_phone`, `appointment_phone`, `appointment_url` | no | Public contacts for that chamber. |
| `consultation_days`, `consultation_hours` | no | As published, e.g. `Sat-Thu`, `5 pm - 9 pm`. |

## Running the import

```bash
docker compose run --rm app npm run data:import-doctors
docker compose run --rm app npm run validate:data
```

The import is all-or-nothing: any invalid row aborts it, nothing is written but the report, and it exits non-zero.
On success it writes `src/data/local/seed/doctors.json` (ids and slugs such as `dr-firstname-lastname-dhaka`, collisions
get `-2`, `-3`), merges the sources it used into `src/data/local/seed/directory-sources.json` (existing entries are kept)
and writes `data/reports/doctor-import-report.md`. Every doctor is stored with status `verified`, a verification method,
`verifiedAt` and `recordUrl`; `validate:data` fails for doctors without them.

Note: `npm run data:build-healthcare` rewrites `directory-sources.json`; re-run the doctor import afterwards to restore doctor sources.
