# Google place IDs (optional)

Google information is **optional enrichment**. The site works fully without it, and nothing here is ever scraped: only official Google Maps Platform APIs are used.

## What is stored

`data/google/place-ids.json` maps an OpenStreetMap record id to a Google place ID:

```json
{ "node/13114468223": { "placeId": "ChIJ...", "lastChecked": "2026-10-05T10:00:00.000Z" } }
```

- Only the **place ID** and the check date are stored. Google's terms allow place IDs to be stored long term; ratings, review counts and review text must not be cached, so they are never written to the dataset.
- `placeId: null` means "searched, no acceptable match" (so reruns do not pay for it again). The build ignores these entries.
- If the file does not exist, `npm run data:build-healthcare` changes nothing.

## Matching (manual, optional)

```bash
GOOGLE_PLACES_API_KEY=... npm run data:match-google-places -- --limit 50
npm run data:build-healthcare   # merges the IDs into the seed data and prints the count
```

For each active facility or pharmacy with coordinates the script calls Places API (New) Text Search (`places:searchText`, field mask `places.id,places.displayName,places.location`) with a 150 m location bias around our coordinates. A result is accepted only if it is within 150 m **and** the normalised name similarity (token Jaccard) is at least 0.6; otherwise the record is skipped. It is rate limited (5 requests per second), saves progress as it goes, and can be rerun to resume.

Cost and terms: Text Search with these fields is billed per request under the Google Maps Platform price list (the location fields place it in a paid SKU). Run it with a small `--limit` first, set a budget alert and a quota in Google Cloud, and check the current pricing and the [Google Maps Platform Terms of Service](https://cloud.google.com/maps-platform/terms) before a full run. Restrict the key to the Places API.

## Live details on the site (optional)

Set both in the server environment (never `NEXT_PUBLIC_*`):

```
GOOGLE_PLACES_API_KEY=...
GOOGLE_PLACES_LIVE_DETAILS=true
```

Pages then request the rating and review count live (Place Details, `no-store`, 2.5 s timeout) and show them labelled "Google rating" with "Information from Google Maps". If either variable is missing or the request fails, the page shows only a "View on Google Maps" link. No review text is shown and no rating appears in structured data.
