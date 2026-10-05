#!/usr/bin/env node
/**
 * Downloads Bangladesh healthcare facilities (hospitals, clinics, pharmacies,
 * doctors' practices, dentists, laboratories) from OpenStreetMap via the public
 * Overpass API, together with the division → district hierarchy.
 *
 *   docker compose run --rm app npm run data:fetch-osm
 *
 * Licence: © OpenStreetMap contributors, ODbL 1.0 (https://www.openstreetmap.org/copyright).
 * Attribution is shown on every page that uses this data.
 *
 * Politeness (Overpass usage policy): one query at a time, a pause between
 * queries, retries with backoff on 429/504. Output is cached in the repo and
 * refreshed manually, not on every build.
 *
 * Output: data/raw/osm-bd-health.json
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ENDPOINT = process.env.OVERPASS_URL ?? "https://overpass-api.de/api/interpreter";
const USER_AGENT = "bangladesh-healthcare-search-data-import/1.0 (+https://github.com/saikatnjm/medicine-price-portal)";
const PAUSE_MS = 5000;
const MAX_RETRIES = 4;
const OUT_FILE = join(dirname(fileURLToPath(import.meta.url)), "../../data/raw/osm-bd-health.json");
const AREA_ID_OFFSET = 3600000000;

/** Facilities of interest. */
const FEATURE_FILTER = `
    nwr(area.scope)["amenity"~"^(hospital|clinic|pharmacy|doctors|dentist)$"];
    nwr(area.scope)["healthcare"~"^(hospital|clinic|pharmacy|doctor|dentist|centre|laboratory|blood_donation)$"];`;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function overpass(query, label) {
  for (let attempt = 1; ; attempt++) {
    process.stdout.write(`${label} (attempt ${attempt})… `);
    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": USER_AGENT },
        body: new URLSearchParams({ data: query }),
      });
      if (response.ok) {
        const json = await response.json();
        if (json.remark && /runtime error|timed out|out of memory/i.test(json.remark)) {
          throw new Error(`Overpass: ${json.remark}`);
        }
        console.log(`${json.elements.length} elements`);
        return json;
      }
      if (![429, 502, 503, 504].includes(response.status)) throw new Error(`HTTP ${response.status}`);
      console.log(`HTTP ${response.status}`);
    } catch (error) {
      console.log(error.message);
      if (attempt >= MAX_RETRIES) throw error;
    }
    if (attempt >= MAX_RETRIES) throw new Error(`${label} failed after ${attempt} attempts`);
    await sleep(PAUSE_MS * 2 ** attempt);
  }
}

const nameOf = (tags = {}) => tags["name:en"] ?? tags.name ?? "";

function compactFeature(element, districtId) {
  return {
    type: element.type,
    id: element.id,
    lat: element.lat ?? element.center?.lat ?? null,
    lon: element.lon ?? element.center?.lon ?? null,
    districtId,
    tags: element.tags ?? {},
  };
}

async function main() {
  // 1. Administrative hierarchy: divisions (admin_level 4) and their districts (admin_level 5).
  const hierarchy = await overpass(
    `[out:json][timeout:300];
area["ISO3166-1"="BD"][admin_level=2]->.bd;
rel(area.bd)["boundary"="administrative"]["admin_level"="4"]->.divs;
foreach.divs->.dv(
  .dv out tags;
  .dv map_to_area->.scope;
  rel(area.scope)["boundary"="administrative"]["admin_level"="5"];
  out tags;
);`,
    "Divisions and districts",
  );
  const divisions = [];
  const districts = new Map();
  let currentDivision = null;
  for (const el of hierarchy.elements) {
    if (el.tags?.admin_level === "4") {
      currentDivision = { id: el.id, name: nameOf(el.tags), nameBn: el.tags["name:bn"] ?? el.tags.name ?? "" };
      divisions.push(currentDivision);
    } else if (el.tags?.admin_level === "5" && currentDivision && !districts.has(el.id)) {
      districts.set(el.id, {
        id: el.id,
        name: nameOf(el.tags),
        nameBn: el.tags["name:bn"] ?? el.tags.name ?? "",
        divisionId: currentDivision.id,
      });
    }
  }

  // 2. Facilities per division, grouped by district (one query per division keeps each request small).
  const features = new Map();
  for (const division of divisions) {
    await sleep(PAUSE_MS);
    const result = await overpass(
      `[out:json][timeout:600];
area(${AREA_ID_OFFSET + division.id})->.division;
rel(area.division)["boundary"="administrative"]["admin_level"="5"];
map_to_area->.districts;
foreach.districts->.scope(
  .scope out ids;
  (${FEATURE_FILTER}
  );
  out center tags;
);`,
      `Facilities in ${division.name}`,
    );
    let currentDistrict = null;
    for (const el of result.elements) {
      if (el.type === "area") {
        currentDistrict = el.id - AREA_ID_OFFSET;
        continue;
      }
      const key = `${el.type}/${el.id}`;
      if (!features.has(key)) features.set(key, compactFeature(el, currentDistrict));
    }
  }

  // 3. Country-wide pass for anything outside a mapped district boundary.
  await sleep(PAUSE_MS);
  const all = await overpass(
    `[out:json][timeout:600];
area["ISO3166-1"="BD"][admin_level=2]->.scope;
(${FEATURE_FILTER}
);
out center tags;`,
    "Facilities nationwide",
  );
  for (const el of all.elements) {
    const key = `${el.type}/${el.id}`;
    if (!features.has(key)) features.set(key, compactFeature(el, null));
  }

  const sortKey = (f) => `${f.type}/${String(f.id).padStart(12, "0")}`;
  const sortedFeatures = [...features.values()].sort((a, b) => (sortKey(a) < sortKey(b) ? -1 : 1));
  const meta = {
    source: {
      name: "OpenStreetMap",
      publisher: "© OpenStreetMap contributors",
      licence: "ODbL 1.0",
      licenceUrl: "https://www.openstreetmap.org/copyright",
      api: ENDPOINT,
    },
    retrievedAt: new Date().toISOString(),
    osmTimestamp: all.osm3s?.timestamp_osm_base ?? null,
  };
  const lines = sortedFeatures.map((f) => `    ${JSON.stringify(f)}`).join(",\n");
  const json =
    `{\n  "meta": ${JSON.stringify(meta)},\n` +
    `  "divisions": ${JSON.stringify(divisions.sort((a, b) => a.id - b.id))},\n` +
    `  "districts": ${JSON.stringify([...districts.values()].sort((a, b) => a.id - b.id))},\n` +
    `  "features": [\n${lines}\n  ]\n}\n`;
  mkdirSync(dirname(OUT_FILE), { recursive: true });
  writeFileSync(OUT_FILE, json, "utf8");
  console.log(
    `Wrote ${sortedFeatures.length} facilities, ${divisions.length} divisions, ${districts.size} districts to ${OUT_FILE}`,
  );
}

main().catch((error) => {
  console.error(`\nOSM fetch failed: ${error.message}`);
  process.exit(1);
});
