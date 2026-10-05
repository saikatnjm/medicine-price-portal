#!/usr/bin/env node
/**
 * Optional, manual: find Google place IDs for our facilities and pharmacies
 * using the official Places API (New) Text Search. Never scrapes.
 *
 *   GOOGLE_PLACES_API_KEY=... npm run data:match-google-places -- --limit 50
 *   npm run data:build-healthcare     # merges data/google/place-ids.json
 *
 * Writes data/google/place-ids.json: { "<osm recordId>": { placeId, lastChecked } }.
 * Only the place ID (null when no acceptable match) and check date are stored
 * (Google terms). Resumable: records already present are skipped. Cost and terms: data/google/README.md.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { MAX_DISTANCE_M, pickMatch } from "./lib/google-match.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");
const SEED_DIR = join(ROOT, "src/data/local/seed");
const OUT_FILE = join(ROOT, "data/google/place-ids.json");
const ENDPOINT = "https://places.googleapis.com/v1/places:searchText";
const REQUESTS_PER_SECOND = 5;
const SAVE_EVERY = 25;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function parseLimit(argv) {
  const index = argv.indexOf("--limit");
  if (index === -1) return Infinity;
  const value = Number(argv[index + 1]);
  if (!Number.isInteger(value) || value <= 0) {
    console.error("--limit needs a positive integer.");
    process.exit(1);
  }
  return value;
}

function readJson(file, fallback) {
  return existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : fallback;
}

function save(results) {
  mkdirSync(dirname(OUT_FILE), { recursive: true });
  writeFileSync(OUT_FILE, `${JSON.stringify(results, null, 2)}\n`, "utf8");
}

async function searchText(apiKey, record) {
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": "places.id,places.displayName,places.location",
    },
    body: JSON.stringify({
      textQuery: record.name,
      maxResultCount: 5,
      locationBias: {
        circle: {
          center: { latitude: record.coordinates.lat, longitude: record.coordinates.lon },
          radius: MAX_DISTANCE_M,
        },
      },
    }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error(`Places API returned HTTP ${response.status}`);
  const json = await response.json();
  return Array.isArray(json.places) ? json.places : [];
}

async function main() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY?.trim();
  if (!apiKey) {
    console.error("Set GOOGLE_PLACES_API_KEY to run this optional script. See data/google/README.md.");
    process.exit(1);
  }
  const limit = parseLimit(process.argv.slice(2));
  const records = ["facilities.json", "pharmacies.json"]
    .flatMap((file) => readJson(join(SEED_DIR, file), []))
    .filter((r) => (r.reviewStatus ?? "active") === "active" && r.coordinates && r.provenance?.recordId);

  const results = readJson(OUT_FILE, {});
  const todo = records.filter((r) => !(r.provenance.recordId in results));
  console.log(`${records.length} eligible records, ${records.length - todo.length} already processed, ${Math.min(todo.length, limit)} to do.`);

  let requests = 0;
  let matched = 0;
  let skipped = 0;
  let failed = 0;
  for (const record of todo.slice(0, limit)) {
    try {
      const placeId = pickMatch(record, await searchText(apiKey, record));
      requests += 1;
      // Unmatched records are stored with placeId null so reruns do not pay for them again.
      results[record.provenance.recordId] = { placeId, lastChecked: new Date().toISOString() };
      if (placeId) matched += 1;
      else skipped += 1;
    } catch (error) {
      failed += 1;
      console.warn(`Skipped ${record.provenance.recordId}: ${error instanceof Error ? error.message : "request failed"}`);
    }
    if (requests % SAVE_EVERY === 0) save(results);
    await sleep(1000 / REQUESTS_PER_SECOND);
  }
  save(results);
  console.log(`Done. Requests ${requests}, matched ${matched}, no acceptable match ${skipped}, failed ${failed}. Total stored ${Object.keys(results).length}.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
