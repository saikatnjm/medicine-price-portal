#!/usr/bin/env node
/**
 * Downloads Bangladesh upazila / thana boundaries (ADM3) from geoBoundaries
 * (https://www.geoboundaries.org, William & Mary geoLab), one static file, so
 * facilities can be placed in an area such as "Dhanmondi" by point-in-polygon.
 * This replaces the slow per-district Overpass queries of data:fetch-osm-areas.
 *
 *   docker compose run --rm app npm run data:fetch-areas
 *
 * The licence and original source are read from the geoBoundaries API and kept
 * in the output's meta, and shown as an attribution by the app.
 * Geometry is reduced (coordinates rounded to ~11 m, repeated points removed);
 * it is only used to assign areas, never displayed.
 *
 * Output: data/raw/bd-areas.json (same shape as data:fetch-osm-areas output;
 * districts are assigned later by the build step from the facilities inside).
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const API_URL = "https://www.geoboundaries.org/api/current/gbOpen/BGD/ADM3/";
const FALLBACK_GEOJSON =
  "https://github.com/wmgeolab/geoBoundaries/raw/main/releaseData/gbOpen/BGD/ADM3/geoBoundaries-BGD-ADM3_simplified.geojson";
const USER_AGENT = "bangladesh-healthcare-search-data-import/1.0 (+https://github.com/saikatnjm/medicine-price-portal)";
const OUT_FILE = join(dirname(fileURLToPath(import.meta.url)), "../../data/raw/bd-areas.json");
const PRECISION = 1e4;
const MAX_RETRIES = 4;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const round = (n) => Math.round(n * PRECISION) / PRECISION;

async function get(url, label) {
  for (let attempt = 1; ; attempt++) {
    process.stdout.write(`${label} (attempt ${attempt})… `);
    try {
      const response = await fetch(url, { headers: { "User-Agent": USER_AGENT }, redirect: "follow" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = await response.json();
      console.log("ok");
      return json;
    } catch (error) {
      console.log(error.message);
      if (attempt >= MAX_RETRIES) throw error;
      await sleep(3000 * attempt);
    }
  }
}

/** GeoJSON Polygon / MultiPolygon rings → [[lat, lon], …] ways (closed rings). */
function waysOf(geometry) {
  const polygons =
    geometry?.type === "Polygon" ? [geometry.coordinates] : geometry?.type === "MultiPolygon" ? geometry.coordinates : [];
  const ways = [];
  for (const polygon of polygons) {
    for (const ring of polygon) {
      const points = [];
      for (const [lon, lat] of ring) {
        const point = [round(lat), round(lon)];
        const last = points.at(-1);
        if (!last || last[0] !== point[0] || last[1] !== point[1]) points.push(point);
      }
      if (points.length >= 4) ways.push(points);
    }
  }
  return ways;
}

async function main() {
  let meta = null;
  let geojsonUrl = FALLBACK_GEOJSON;
  try {
    meta = await get(API_URL, "geoBoundaries metadata");
    geojsonUrl = meta.simplifiedGeometryGeoJSON || meta.gjDownloadURL || FALLBACK_GEOJSON;
  } catch {
    console.log("Metadata unavailable; using the fallback download URL.");
  }
  const geojson = await get(geojsonUrl, "Bangladesh ADM3 boundaries");

  const areas = (geojson.features ?? [])
    .map((f, index) => ({
      id: String(f.properties?.shapeID ?? `adm3-${index}`),
      name: String(f.properties?.shapeName ?? "").trim(),
      nameBn: "",
      districtId: null,
      ways: waysOf(f.geometry),
    }))
    .filter((a) => a.name && a.ways.length > 0)
    .sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));

  const out = {
    meta: {
      source: {
        name: "geoBoundaries",
        publisher: meta?.boundarySource ? `geoBoundaries (source: ${meta.boundarySource})` : "geoBoundaries",
        licence: meta?.boundaryLicense ?? "See geoBoundaries metadata",
        licenceUrl: /^https?:\/\//.test(meta?.licenseDetail ?? "") ? meta.licenseDetail : undefined,
        url: "https://www.geoboundaries.org/",
        datasetUrl: geojsonUrl,
        boundaryYear: meta?.boundaryYearRepresented ?? undefined,
      },
      retrievedAt: new Date().toISOString(),
      adminLevel: 3,
    },
    areas,
  };
  mkdirSync(dirname(OUT_FILE), { recursive: true });
  writeFileSync(
    OUT_FILE,
    `{\n  "meta": ${JSON.stringify(out.meta)},\n  "areas": [\n${areas.map((a) => `    ${JSON.stringify(a)}`).join(",\n")}\n  ]\n}\n`,
    "utf8",
  );
  console.log(`Wrote ${areas.length} areas to ${OUT_FILE}`);
}

main().catch((error) => {
  console.error(`\nArea download failed: ${error.message}`);
  process.exit(1);
});
