# Doctor sources: what could legitimately be used

Research date: 2026-10-07. Method: WebSearch/WebFetch of public pages only (no scraping, no bulk copying,
no doctor data copied). The summarising fetch tool paraphrases pages, so every "terms found" quote must be
re-checked by a person on the live page before we rely on it. Policy: see `DOCTOR-DATA.md`.
Where terms could not be found, this file says "not found". Nothing here is legal advice.

## Summary

| Source | Verdict |
|---|---|
| BMDC registration search | Not usable now. Usable only with written permission |
| data.gov.bd "Doctor Directory" | Not usable now (no licence stated, age 2017). Ask the publisher |
| DGHS | Not found: no doctor list or open-data licence |
| Hospital official doctor pages | Usable with written permission, per hospital |
| Google Places | place_id only (already our approach) |
| Doctor-provided data | Usable now with consent. The smallest path |

## 1. BMDC (Bangladesh Medical & Dental Council)

- URLs: https://www.bmdc.org.bd, https://verify.bmdc.org.bd, terms at https://www.bmdc.org.bd/termsofuse
- Data: "Find Registered Doctor" lookup. Inputs seen: full registration number (MBBS or BDS), medical assistant
  number, portable card number. Result fields: not found (not visible to our fetch tool; check manually).
  It is a lookup by a known number, not a browsable list or bulk export.
- Terms found: "None of the information may be reproduced, republished or disseminated in any manner" without
  "prior written consent" of BM&DC (https://www.bmdc.org.bd/termsofuse).
- robots.txt: only `Disallow: /news-events/` (https://www.bmdc.org.bd/robots.txt). That is not permission to
  copy; the terms still apply. The verify subdomain's robots/terms: not found.
- Verdict: not usable now. Usable with written permission.
- Onboarding: email BM&DC (contact details on bmdc.org.bd) asking for written consent to (a) link to the
  verify page per doctor, and ideally (b) display registration number, name and status for doctors who opt in.
  Until then, do not store BMDC data. A safe interim: tell doctors to give us their registration number and
  show it as "doctor-provided, not verified by us", with a link to the official lookup.

## 2. Open-data portals

- https://data.gov.bd/dataset/doctor-directory: "Doctor Directory" (XLS), Health group, released 2016-10-18,
  modified 2017-01-18. Licence field: "License Not Specified". Whether it holds named doctors: not confirmed.
- Portal terms (https://data.gov.bd/terms-of-use): "Permission is granted to all user of this website to
  print all the information available in the websites without any deletion, addition or modification."
  That is permission to print unmodified content, not a reuse licence for datasets. Licence terms: not found.
- DGHS (https://dghs.gov.bd): staff and facility-head contact pages exist; no open-data licence or terms
  found. DGHS/MIS doctor lists with a reuse licence: not found.
- Verdict: not usable now (no licence, 2017 data would also be stale). Usable with written permission.
- Onboarding: email the portal/publisher (a2i / DGHS contact on the dataset page) asking which licence applies,
  whether it contains named practitioners, and whether it may be republished. Facility-level lists (hospitals,
  not people) are a separate and lower-risk question.

## 3. Hospital official "find a doctor" pages

None of these showed reuse terms in what we could read. Absence of a stated licence means all rights reserved,
not "free to use". All need permission from the hospital, kept in `sources.json`.

| Hospital | Doctor page | Terms found |
|---|---|---|
| Square Hospitals | https://www.squarehospital.com/doctors | Only "Copyright © 2022 Square Hospitals Ltd."; no terms link seen. robots.txt allows all (https://www.squarehospital.com/robots.txt) |
| Labaid | https://labaid.com.bd/en/doctors | "Copyright © 2026 Labaid"; no terms or privacy link seen |
| Evercare Bangladesh | https://www.evercarebd.com/en (doctor URL not confirmed) | Not found |
| United Hospital | https://www.unitedhospitalbd.com | Not reachable by our fetch tool; terms not found |
| Popular Diagnostic | https://www.populardiagnostic.com | Not found |
| Ibn Sina Trust | https://ibnsinatrust.com | Not found |
| BSMMU | https://www.bsmmu.edu.bd | Not reachable (certificate/robots error); terms not found |
| Apollo/Impulse Dhaka, Univ. Health Link | not verified | apollodhaka.com redirected to an unrelated domain; uhlbd.com returned no text. Do not use until confirmed |

- Verdict: usable with written permission only. robots.txt allowing crawlers does not grant reuse rights.
- Onboarding: see template below. Ask the hospital for a CSV or approval of exact fields, never crawl.

## 4. Google Places API

- URL: https://developers.google.com/maps/documentation/places/web-service/policies
- Terms found: "The place ID is exempt from the caching restrictions." Everything else (names, addresses, ratings,
  reviews, photos, coordinates) must not be pre-fetched, cached or stored beyond allowed exceptions.
- Verdict: usable now for place_id only, fetched live at display time with Google attribution. It is not a
  doctor source and gives no verified doctor facts. Never store ratings or reviews.

## Permission email template (hospital or BMDC)

> Subject: Request for permission to list your doctors' public profiles on Bangladesh Healthcare Search
>
> Dear [Name/Department],
> Bangladesh Healthcare Search is a free, non-commercial information site that helps people find healthcare
> providers. We would like your written permission to list, with a link back to your official page, the
> following public profile fields for your doctors: name, specialty, qualifications, designation, practice
> phone, consultation days/hours. We will not scrape your site; we ask you to send or approve the data.
> We show the source and verified date, correct or remove any entry within [7] days on request, and do not
> add ratings or reviews. May we have your written consent, and a contact for corrections?
> Regards, [Name, site URL, email]

## Recommendation: smallest legitimate path

1. Start with doctor-provided profiles: 5 to 10 doctors (personal contacts, a clinic) who give written consent
   and their own details. Use `verification_method = doctor_provided`, `source_id` such as `doctors-self`.
   No third-party terms involved.
2. In parallel, send the template to one or two hospitals (Square, Labaid have accessible doctor pages) and to
   BM&DC for permission to link to or display registration status.
3. Import only after consent is on file. Never import from any source in the "not usable" column above.
