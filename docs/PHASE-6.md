# Phase 6 — doctors, trusted medicine information, healthcare UX (status)

Implemented
- Medicine safety data layer: `MedicineSafetyInfo` (domain), `MedicineSafetyRepository`, `MedicineDetail.safety`. Keyed by generic; every field nullable; a record is served only when `source_cited`, licensed (`licenceNote`) and non-empty. The seed (`medicine-safety.json`) is EMPTY on purpose.
- Medicine page: brand vs generic header, "Medicine information & safety" section (common / serious / seek-help groups, source + last checked, persistent disclaimer; honest "not available yet" panel + DailyMed search link when no record), "Other products containing the same generic", factual compare page ("Compare product information").
- Report incorrect information with reasons (mailto / configured URL; never claims submission), click analytics events (maps, phone, website, report), `npm run data:report` quality report.
- Doctor source research: `docs/DOCTOR-SOURCES.md`.

Why safety data and doctors are empty
- MedlinePlus drug text is copyrighted (ASHP); copying or paraphrasing it is not allowed without written permission.
- BMDC and hospital doctor lists need written permission; no open licence found. See `DOCTOR-SOURCES.md` for the permission path.

Not done: homepage/hospital visual redesign, per-entity OG images, global search upgrades beyond Phase 4/5. Verification: not run in the authoring workspace.
