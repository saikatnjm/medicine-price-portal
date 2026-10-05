#!/usr/bin/env node
/**
 * Downloads Bangladesh upazila / thana boundaries (OSM admin_level 6) from the
 * public Overpass API, grouped by district, so facilities can be placed in an
 * area such as "Dhanmondi" by point-in-polygon instead of free-text tags.
 *
 *   docker compose run --rm app npm run data:fetch-osm-areas
 *
 * Run after data:fetch-osm (never at the same time: Overpass allows few parallel
 * requests per IP). One small query per district; finished districts are cached
 * in data/raw/.osm-areas-cache/ so an interrupted run can simply be rerun.
 * Licence: © OpenStreetMap contributors, ODbL 1.0.
 *
 * Geometry is reduced (coordinates rounded to ~11 m, repeated points removed);
 * it is only used to assign areas, never displayed.
 *
 * Output: data/raw/osm-bd-areas.json
 */
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Public Overpass instances, tried in turn when one is overloaded (HTTP 429/504).
 * OVERPASS_URL pins a single endpoint.
 */
const ENDPOINTS = process.env.OVERPASS_URL
  ? [process.env.OVERPASS_URL]
  : [
      "https://overpass-api.de/api/interpreter",
      "https://overpass.private.coffee/api/interpreter",
      "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
    ];
const USER_AGENT = "bangladesh-healthcare-search-data-import/1.0 (+https://github.com/saikatnjm/medicine-price-portal)";
const PAUSE_MS = 5000;
const MAX_RETRIES = 6;
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");
const HEALTH_FILE = join(ROOT, "data/raw/osm-bd-health.json");
const OUT_FILE = join(ROOT, "data/raw/osm-bd-areas.json");
/** Per-district results, so a rerun after a timeout resumes instead of starting over. */
const CACHE_DIR = join(ROOT, "data/raw/.osm-areas-cache");
const AREA_ID_OFFSET = 3600000000;
const PRECISION = 1e4;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function overpass(query, label) {
  for (let attempt = 1; ; attempt++) {
    process.stdout.write(`${label} (attempt ${attempt}, ${new URL(ENDPOINTS[(attempt - 1) % ENDPOINTS.length]).host})… `);
    try {
      // Rotate to the next public instance after each failed attempt.
      const endpoint = ENDPOINTS[(attempt - 1) % ENDPOINTS.length];
      const response = await fetch(endpoint, {
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
    await sleep(PAUSE_MS * attempt);
  }
}

const round = (n) => Math.round(n * PRECISION) / PRECISION;

/** Outer and inner ways as [lat, lon] lists; even-odd point-in-polygon works without assembling rings. */
function waysOf(relation) {
  const ways = [];
  for (const member of relation.members ?? []) {
    if (member.type !== "way" || !member.geometry || !["outer", "inner", ""].includes(member.role)) continue;
    const points = [];
    for (const { lat, lon } of member.geometry) {
      const point = [round(lat), round(lon)];
      const last = points.at(-1);
      if (!last || last[0] !== point[0] || last[1] !== point[1]) points.push(point);
    }
    if (points.length >= 2) ways.push(points);
  }
  return ways;
}

async function main() {
  const health = JSON.parse(readFileSync(HEALTH_FILE, "utf8"));
  const areas = new Map();
  mkdirSync(CACHE_DIR, { recursive: true });
  const districts = [...health.districts].sort((x, y) => x.id - y.id);
  for (const [index, district] of districts.entries()) {
    const cacheFile = join(CACHE_DIR, `${district.id}.json`);
    let elements;
    const cached = existsSync(cacheFile) ? JSON.parse(readFileSync(cacheFile, "utf8")) : null;
    // A cached district without any boundary geometry is from a bad run: fetch it again.
    if (cached && cached.some((a) => a.ways.length > 0)) {
      elements = cached;
    } else {
      await sleep(PAUSE_MS);
      const result = await overpass(
        `[out:json][timeout:300];
area(${AREA_ID_OFFSET + district.id})->.district;
rel(area.district)["boundary"="administrative"]["admin_level"="6"];
out body geom;`,
        `Areas in ${district.name} (${index + 1}/${districts.length})`,
      );
      elements = result.elements
        .filter((el) => el.type === "relation")
        .map((el) => ({
          id: el.id,
          name: el.tags?.["name:en"] ?? el.tags?.name ?? "",
          nameBn: el.tags?.["name:bn"] ?? "",
          ways: waysOf(el),
        }));
      writeFileSync(cacheFile, JSON.stringify(elements));
    }
    // A boundary touching a neighbouring district is returned for both; the
    // first district is kept and the build step re-checks by geometry.
    for (const area of elements) {
      if (!areas.has(area.id)) areas.set(area.id, { ...area, districtId: district.id });
    }
  }

  const sorted = [...areas.values()].sort((a, b) => a.id - b.id);
  const meta = {
    source: { name: "OpenStreetMap", publisher: "© OpenStreetMap contributors", licence: "ODbL 1.0" },
    retrievedAt: new Date().toISOString(),
    adminLevel: 6,
  };
  mkdirSync(dirname(OUT_FILE), { recursive: true });
  writeFileSync(
    OUT_FILE,
    `{\n  "meta": ${JSON.stringify(meta)},\n  "areas": [\n${sorted.map((a) => `    ${JSON.stringify(a)}`).join(",\n")}\n  ]\n}\n`,
    "utf8",
  );
  rmSync(CACHE_DIR, { recursive: true, force: true });
  console.log(`Wrote ${sorted.length} areas to ${OUT_FILE}`);
}

main().catch((error) => {
  console.error(`\nOSM area fetch failed: ${error.message}`);
  process.exit(1);
});
