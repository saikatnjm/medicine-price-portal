#!/usr/bin/env node
/**
 * Healthcare directory build (offline, deterministic):
 *
 *   data/raw/osm-bd-health.json (+ optional areas: data/raw/bd-areas.json from
 *   geoBoundaries, else data/raw/osm-bd-areas.json from OpenStreetMap)
 *     + scripts/data/taxonomy/specialties.mjs
 *     → src/data/local/seed/{facilities,pharmacies,locations,specialties,directory-sources}.json
 *     → data/reports/osm-import-report.{md,json}
 *
 *   docker compose run --rm app npm run data:build-healthcare
 *
 * Rules: docs/DATA-PIPELINE.md and ./lib/osm.mjs. Nothing is inferred; optional
 * fields are present only when OpenStreetMap publishes them.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { keyOf, slugify } from "./lib/normalize.mjs";
import {
  addressOf,
  areaNameOf,
  areaOf,
  bedsOf,
  boundsOf,
  distanceMetres,
  emailOf,
  emergencyOf,
  facilityKindOf,
  hasNoLetters,
  isGenericName,
  locationNameOf,
  namesOf,
  ownershipOf,
  phoneOf,
  pointInWays,
  postcodeOf,
  specialityValuesOf,
  websiteOf,
} from "./lib/osm.mjs";
import { INFO_FLAGS, qualityFlagsOf, refineKind, reviewStatusOf, stripCategorySuffix } from "./lib/quality.mjs";
import { SPECIALTIES } from "./taxonomy/specialties.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");
const RAW_FILE = join(ROOT, "data/raw/osm-bd-health.json");
/** First existing file wins. */
const AREAS_FILES = [join(ROOT, "data/raw/bd-areas.json"), join(ROOT, "data/raw/osm-bd-areas.json")];

/** Area ids may be numbers (OSM) or strings (geoBoundaries "BGD-ADM3-…"); make them id-safe. */
const areaKey = (id) => String(id).toLowerCase().replace(/[^a-z0-9]+/g, "_");
const SEED_DIR = join(ROOT, "src/data/local/seed");
const REPORT_DIR = join(ROOT, "data/reports");
const SOURCE_ID = "osm";
/** Same name + kind + district within this distance = the same place mapped twice. */
const DUPLICATE_DISTANCE_M = 300;

const table = (obj, limit = 40) => Object.entries(obj).slice(0, limit).map(([k, v]) => `| ${k} | ${v} |`).join("\n");
const byText = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
const countBy = (items, fn) => {
  const counts = {};
  for (const item of items) counts[fn(item)] = (counts[fn(item)] ?? 0) + 1;
  return Object.fromEntries(Object.entries(counts).sort((a, b) => b[1] - a[1] || byText(a[0], b[0])));
};
const compact = (object) => Object.fromEntries(Object.entries(object).filter(([, v]) => v !== undefined));

export function buildSpecialties() {
  return SPECIALTIES.map(({ slug, name, practitionerTitle, aliases, description }) => ({
    id: `spec_${slug.replace(/-/g, "_")}`,
    slug,
    name,
    practitionerTitle,
    description,
    aliases,
  }));
}

export function buildLocations(raw, areasRaw) {
  const divisions = raw.divisions.map((d) => {
    const name = locationNameOf(d.name);
    return compact({
      id: `loc_div_${d.id}`,
      slug: `${slugify(name)}-division`,
      name,
      nameBn: locationNameOf(d.nameBn) || undefined,
      level: "division",
    });
  });
  const districts = raw.districts.map((d) => {
    const name = locationNameOf(d.name);
    return compact({
      id: `loc_dis_${d.id}`,
      slug: slugify(name),
      name,
      nameBn: locationNameOf(d.nameBn) || undefined,
      level: "district",
      parentId: `loc_div_${d.divisionId}`,
    });
  });
  const districtNames = new Map(districts.map((d) => [d.id, d.name]));
  const areaRecords = (areasRaw?.areas ?? [])
    .map((a) => ({ raw: a, name: areaNameOf(a.name), districtId: a.districtId ? `loc_dis_${a.districtId}` : undefined }))
    .filter((a) => a.name && a.districtId && districtNames.has(a.districtId) && a.raw.ways.length > 0);
  // Area slugs: "dhanmondi"; when the name repeats (or equals a district/division slug), "{name}-{district}".
  const taken = new Set([...divisions, ...districts].map((l) => l.slug));
  const nameCounts = countBy(areaRecords, (a) => slugify(a.name));
  const areas = areaRecords
    .sort((a, b) => byText(areaKey(a.raw.id), areaKey(b.raw.id)))
    .map((a) => {
      let slug = slugify(a.name);
      if (!slug || nameCounts[slug] > 1 || taken.has(slug)) slug = slugify(`${a.name} ${districtNames.get(a.districtId)}`);
      if (!slug || taken.has(slug)) slug = `${slug || "area"}-${areaKey(a.raw.id).replace(/_/g, "-")}`;
      taken.add(slug);
      return compact({
        id: `loc_area_${areaKey(a.raw.id)}`,
        slug,
        name: a.name,
        nameBn: areaNameOf(a.raw.nameBn) || undefined,
        level: "area",
        parentId: a.districtId,
      });
    });
  return [...divisions, ...districts, ...areas].sort((a, b) => byText(a.id, b.id));
}

function shapesOf(areas) {
  return areas.map((a) => ({ ...a, bounds: boundsOf(a.ways) }));
}

function findShape(shapes, coordinates) {
  if (!coordinates) return undefined;
  const { lat, lon } = coordinates;
  return shapes.find(
    (s) => lat >= s.bounds.minLat && lat <= s.bounds.maxLat && lon >= s.bounds.minLon && lon <= s.bounds.maxLon && pointInWays(coordinates, s.ways),
  );
}

/**
 * The area fetch groups boundaries by an overlapping district query, so a
 * border upazila can be listed under its neighbour. Each area's district is
 * therefore the district most of its facilities belong to (exact Overpass area
 * containment), falling back to the fetch grouping.
 */
export function correctAreaDistricts(raw, areasRaw) {
  if (!areasRaw?.areas?.length) return areasRaw;
  const shapes = shapesOf(areasRaw.areas);
  const votes = new Map();
  for (const f of raw.features) {
    if (f.lat == null || f.lon == null || !f.districtId) continue;
    const hit = findShape(shapes, { lat: f.lat, lon: f.lon });
    if (!hit) continue;
    const tally = votes.get(hit.id) ?? new Map();
    tally.set(f.districtId, (tally.get(f.districtId) ?? 0) + 1);
    votes.set(hit.id, tally);
  }
  return {
    ...areasRaw,
    areas: areasRaw.areas.map((a) => {
      const tally = votes.get(a.id);
      if (!tally) return a;
      const [best] = [...tally.entries()].sort((x, y) => y[1] - x[1] || x[0] - y[0]);
      return { ...a, districtId: best[0] };
    }),
  };
}

/** Point → area lookup using the reduced OSM boundaries (empty when no areas file). */
function createAreaLocator(areasRaw, locations) {
  const known = new Set(locations.map((l) => l.id));
  const shapes = (areasRaw?.areas ?? [])
    .filter((a) => known.has(`loc_area_${areaKey(a.id)}`))
    .map((a) => ({
      id: `loc_area_${areaKey(a.id)}`,
      districtId: `loc_dis_${a.districtId}`,
      ways: a.ways,
      bounds: boundsOf(a.ways),
    }));
  return (coordinates) => {
    const hit = findShape(shapes, coordinates);
    return hit ? { areaId: hit.id, districtId: hit.districtId } : undefined;
  };
}

export function buildDirectory(raw, rawAreas) {
  const retrievedAt = raw.meta.retrievedAt;
  const areasRaw = correctAreaDistricts(raw, rawAreas);
  const locations = buildLocations(raw, areasRaw);
  const locateArea = createAreaLocator(areasRaw, locations);
  const specialties = buildSpecialties();
  const specialtyByOsm = new Map(SPECIALTIES.flatMap((s) => s.osm.map((v) => [v, `spec_${s.slug.replace(/-/g, "_")}`])));
  const districtById = new Map(locations.filter((l) => l.level === "district").map((l) => [l.id, l]));
  const unmappedSpecialities = {};
  const rejected = [];
  const candidates = [];
  const reclassified = [];

  for (const feature of raw.features) {
    const recordId = `${feature.type}/${feature.id}`;
    const reject = (reason) => rejected.push({ recordId, reason, name: feature.tags?.name ?? "" });
    const tags = feature.tags ?? {};
    const taggedKind = facilityKindOf(tags);
    if (!taggedKind) { reject("unsupported_type"); continue; }
    if (tags.disused === "yes" || tags["disused:amenity"] || tags.abandoned === "yes") { reject("disused"); continue; }
    const names = namesOf(tags);
    // Trim OSM category/address text pasted into the name; the original is kept as sourceName.
    const strippedName = stripCategorySuffix(names.name);
    const name = strippedName ?? names.name;
    const sourceName = strippedName ? names.name : undefined;
    const altName = names.altName;
    if (!name) { reject("missing_name"); continue; }
    if (isGenericName(name)) { reject("generic_name_only"); continue; }
    if (hasNoLetters(name)) { reject("invalid_name"); continue; }
    if (/veterinar|vet clinic|animal/i.test(`${name} ${tags.healthcare ?? ""}`)) { reject("veterinary"); continue; }

    const coordinates =
      feature.lat != null && feature.lon != null
        ? { lat: Number(feature.lat.toFixed(6)), lon: Number(feature.lon.toFixed(6)) }
        : undefined;
    const located = locateArea(coordinates);
    // The feature's own district (Overpass area containment) wins; the area's district
    // fills it only when missing. An area from another district is not used.
    const ownDistrictId = feature.districtId ? `loc_dis_${feature.districtId}` : undefined;
    const districtId = ownDistrictId ?? located?.districtId;
    const areaId = located && located.districtId === districtId ? located.areaId : undefined;
    const district = districtId ? districtById.get(districtId) : undefined;
    const specialtyIds = [];
    for (const value of specialityValuesOf(tags)) {
      const id = specialtyByOsm.get(value);
      if (id) specialtyIds.push(id);
      else unmappedSpecialities[value] = (unmappedSpecialities[value] ?? 0) + 1;
    }
    // The tagged OSM category is refined only when the record's own name states another kind.
    const { kind, rule } = refineKind(name, taggedKind);
    if (rule !== "as_tagged") reclassified.push({ recordId, name, from: taggedKind, to: kind, rule });
    candidates.push({
      kind,
      tagCount: Object.keys(tags).length,
      record: compact({
        name,
        sourceName,
        altName,
        districtId: district ? districtId : undefined,
        areaId: district ? areaId : undefined,
        locality: areaOf(tags, district?.name),
        address: addressOf(tags),
        postalCode: postcodeOf(tags),
        phone: phoneOf(tags),
        website: websiteOf(tags),
        email: emailOf(tags),
        openingHours: tags.opening_hours ? String(tags.opening_hours).slice(0, 120) : undefined,
        coordinates,
      }),
      facilityOnly: compact({
        ownership: ownershipOf(tags),
        emergency: emergencyOf(tags),
        beds: bedsOf(tags),
        specialtyIds: [...new Set(specialtyIds)].sort(),
      }),
      recordId,
      osmNumericId: feature.id,
    });
  }

  // Deduplicate: same kind + name + district, mapped within DUPLICATE_DISTANCE_M.
  candidates.sort(
    (a, b) =>
      byText(`${a.kind}|${keyOf(a.record.name)}|${a.record.districtId ?? ""}`, `${b.kind}|${keyOf(b.record.name)}|${b.record.districtId ?? ""}`) ||
      b.tagCount - a.tagCount ||
      a.osmNumericId - b.osmNumericId,
  );
  const kept = [];
  const duplicates = [];
  for (const candidate of candidates) {
    const key = `${candidate.kind}|${keyOf(candidate.record.name)}|${candidate.record.districtId ?? ""}`;
    const twin = kept.findLast?.((k) => k.key === key && distanceMetres(k.c.record.coordinates, candidate.record.coordinates) <= DUPLICATE_DISTANCE_M);
    if (twin) duplicates.push({ recordId: candidate.recordId, keptId: twin.c.recordId });
    else kept.push({ key, c: candidate });
  }

  // Same name at (almost) the same point under different kinds: probably one place mapped twice.
  const possibleDuplicates = new Set();
  const byName = new Map();
  for (const { c } of kept) {
    const list = byName.get(keyOf(c.record.name)) ?? [];
    for (const other of list) {
      if (other.kind !== c.kind && distanceMetres(other.record.coordinates, c.record.coordinates) <= 50) {
        possibleDuplicates.add(c.recordId);
        possibleDuplicates.add(other.recordId);
      }
    }
    list.push(c);
    byName.set(keyOf(c.record.name), list);
  }

  // Slugs: "{name}-{district}", collisions get the OSM id. Names without Latin letters use the kind.
  const usedSlugs = new Set();
  let slugCollisions = 0;
  const ordered = kept.map((k) => k.c).sort((a, b) => byText(a.recordId, b.recordId));
  const out = { facilities: [], pharmacies: [] };
  for (const c of ordered.sort((a, b) => a.osmNumericId - b.osmNumericId || byText(a.recordId, b.recordId))) {
    const districtName = c.record.districtId ? districtById.get(c.record.districtId)?.name : undefined;
    const namePart = slugify(c.record.name) || slugify(c.record.altName ?? "") || c.kind.replace(/_/g, "-");
    let slug = slugify(`${namePart} ${districtName ?? ""}`);
    if (usedSlugs.has(slug)) {
      slugCollisions++;
      slug = `${slug}-${c.recordId.replace("/", "-").replace(/^node/, "n").replace(/^way/, "w").replace(/^relation/, "r")}`;
    }
    usedSlugs.add(slug);
    const provenance = compact({
      sourceId: SOURCE_ID,
      recordId: c.recordId,
      recordUrl: `https://www.openstreetmap.org/${c.recordId}`,
      status: "unverified",
      sourceUpdatedAt: raw.meta.osmTimestamp ?? undefined,
      lastCheckedAt: retrievedAt,
    });
    const flags = qualityFlagsOf(c.record);
    if (possibleDuplicates.has(c.recordId)) flags.push("possible_duplicate");
    const reviewStatus = reviewStatusOf(flags);
    // "active" is the default and is not stored, keeping records small.
    const quality = {
      ...(reviewStatus === "active" ? {} : { reviewStatus }),
      ...(flags.length ? { qualityFlags: flags } : {}),
    };
    const idSuffix = c.recordId.replace("/", "_");
    if (c.kind === "pharmacy") {
      out.pharmacies.push(compact({ id: `pha_${idSuffix}`, slug, ...c.record, ...quality, updatedAt: retrievedAt, provenance }));
    } else {
      out.facilities.push(compact({ id: `fac_${idSuffix}`, slug, kind: c.kind, ...c.record, ...c.facilityOnly, ...quality, updatedAt: retrievedAt, provenance }));
    }
  }
  out.facilities.sort((a, b) => byText(a.slug, b.slug));
  out.pharmacies.sort((a, b) => byText(a.slug, b.slug));

  const sources = [
    {
      id: SOURCE_ID,
      name: "OpenStreetMap",
      publisher: "OpenStreetMap contributors",
      url: "https://www.openstreetmap.org/",
      apiUrl: raw.meta.source.api,
      licence: "Open Database License (ODbL) 1.0",
      licenceUrl: "https://www.openstreetmap.org/copyright",
      attribution: "© OpenStreetMap contributors",
      retrievedAt,
      note: "Community-mapped facilities. Not verified by us; details may be incomplete or out of date.",
    },
  ];
  // Area boundaries from another provider (geoBoundaries) need their own attribution.
  const areaSource = areasRaw?.meta?.source;
  if (areaSource && areaSource.name !== "OpenStreetMap" && locations.some((l) => l.level === "area")) {
    sources.push(
      compact({
        id: "geoboundaries",
        name: "geoBoundaries – Bangladesh upazila / thana boundaries",
        publisher: areaSource.publisher ?? areaSource.name,
        url: areaSource.url ?? "https://www.geoboundaries.org/",
        apiUrl: areaSource.datasetUrl,
        licence: areaSource.licence,
        licenceUrl: /^https?:\/\//.test(areaSource.licenceUrl ?? "")
          ? areaSource.licenceUrl
          : /3\.0 IGO/i.test(areaSource.licence ?? "")
            ? "https://creativecommons.org/licenses/by/3.0/igo/"
            : undefined,
        attribution: "Area boundaries: geoBoundaries",
        retrievedAt: areasRaw.meta.retrievedAt,
        note: "Used only to place listings in an upazila / thana.",
      }),
    );
  }

  const all = [...out.facilities, ...out.pharmacies];
  const report = {
    retrievedAt,
    osmTimestamp: raw.meta.osmTimestamp,
    rawFeatures: raw.features.length,
    facilities: out.facilities.length,
    pharmacies: out.pharmacies.length,
    rejected: rejected.length,
    rejectedByReason: countBy(rejected, (r) => r.reason),
    duplicatesRemoved: duplicates.length,
    slugCollisionsResolved: slugCollisions,
    divisions: locations.filter((l) => l.level === "division").length,
    districts: locations.filter((l) => l.level === "district").length,
    areas: locations.filter((l) => l.level === "area").length,
    withArea: all.filter((r) => r.areaId).length,
    facilitiesByKind: countBy(out.facilities, (f) => f.kind),
    reclassified: reclassified.length,
    reclassifiedByRule: countBy(reclassified, (r) => `${r.from} → ${r.to} (${r.rule})`),
    reviewStatus: countBy(all, (r) => r.reviewStatus ?? "active"),
    qualityFlags: countBy(all.flatMap((r) => r.qualityFlags ?? []), (f) => f),
    withoutDistrict: all.filter((r) => !r.districtId).length,
    fieldCoverage: Object.fromEntries(
      ["altName", "locality", "address", "postalCode", "phone", "website", "email", "openingHours", "coordinates"].map((f) => [f, all.filter((r) => r[f]).length]),
    ),
    facilityFieldCoverage: Object.fromEntries(
      ["ownership", "emergency", "beds"].map((f) => [f, out.facilities.filter((r) => r[f] !== undefined).length]).concat([["specialties", out.facilities.filter((r) => r.specialtyIds.length).length]]),
    ),
    byDistrict: countBy(all, (r) => (r.districtId ? districtById.get(r.districtId)?.name : "(none)")),
    unmappedSpecialities: Object.fromEntries(Object.entries(unmappedSpecialities).sort((a, b) => b[1] - a[1])),
  };

  return { ...out, locations, specialties, sources, report, rejected, duplicates, reclassified };
}

function writeJsonLines(file, items) {
  writeFileSync(file, items.length ? `[\n${items.map((i) => `  ${JSON.stringify(i)}`).join(",\n")}\n]\n` : "[]\n", "utf8");
}

/** Lists every reclassified or flagged record, so reviewers can fix the source (OSM) rather than our copy. */
function writeQualityReport(result) {
  const flagged = [...result.facilities, ...result.pharmacies]
    .filter((r) => r.qualityFlags?.some((f) => !INFO_FLAGS.has(f)) || r.sourceName)
    .map((r) => ({ id: r.id, name: r.name, sourceName: r.sourceName, kind: r.kind ?? "pharmacy", reviewStatus: r.reviewStatus ?? "active", flags: r.qualityFlags ?? [], source: r.provenance.recordUrl }))
    .sort((a, b) => byText(a.id, b.id));
  writeFileSync(
    join(REPORT_DIR, "directory-quality-report.json"),
    `${JSON.stringify({ generatedFrom: result.report.retrievedAt, reclassified: result.reclassified, flagged }, null, 2)}\n`,
  );
  const r = result.report;
  const examples = (flag) =>
    flagged
      .filter((f) => f.flags.includes(flag))
      .slice(0, 12)
      .map((f) => `| ${(f.sourceName ?? f.name).replace(/\|/g, "/")} | ${f.kind} | ${f.reviewStatus} | ${f.source} |`)
      .join("\n");
  const reclassExamples = (rule) =>
    result.reclassified
      .filter((x) => x.rule === rule)
      .slice(0, 10)
      .map((x) => `| ${x.name.replace(/\|/g, "/")} | ${x.from} → ${x.to} |`)
      .join("\n");
  const rules = [...new Set(result.reclassified.map((x) => x.rule))].sort();
  const md = `# Directory data-quality report

Generated by \`scripts/data/build-healthcare.mjs\` from the OpenStreetMap snapshot of ${r.retrievedAt}.
Rules: \`scripts/data/lib/quality.mjs\`. Coordinates and contacts are never changed; names only lose OSM
category/address text pasted after a comma (original kept as \`sourceName\`). Fixes belong in OpenStreetMap
(each record links to its source).

- **active**: shown and indexable when it has public details.
- **needs_review**: shown with a notice, noindex, left out of the sitemap.
- **excluded**: kept in the data for audit, hidden from the site.

| Status | Records |
|---|---|
${table(r.reviewStatus)}

## Flags

| Flag | Records |
|---|---|
${table(r.qualityFlags)}

${Object.keys(r.qualityFlags)
  .map((flag) => `### ${flag} (examples)\n\n| Name | Kind | Status | Source |\n|---|---|---|---|\n${examples(flag)}\n`)
  .join("\n")}
## Kinds refined from the name (${r.reclassified})

| Change | Records |
|---|---|
${table(r.reclassifiedByRule)}

${rules.map((rule) => `### ${rule} (examples)\n\n| Name | Change |\n|---|---|\n${reclassExamples(rule)}\n`).join("\n")}`;
  writeFileSync(join(REPORT_DIR, "directory-quality-report.md"), md);
}

function renderReport(r) {
  return `# OpenStreetMap import report

Generated by \`scripts/data/build-healthcare.mjs\` from the snapshot retrieved ${r.retrievedAt} (OSM data as of ${r.osmTimestamp ?? "unknown"}).
Data © OpenStreetMap contributors, ODbL 1.0. All records have status \`unverified\`.

| Metric | Count |
|---|---|
| Raw OSM features | ${r.rawFeatures} |
| Facilities (non-pharmacy) | ${r.facilities} |
| Pharmacies | ${r.pharmacies} |
| Rejected | ${r.rejected} |
| Duplicates removed | ${r.duplicatesRemoved} |
| Slug collisions resolved | ${r.slugCollisionsResolved} |
| Without district | ${r.withoutDistrict} |
| Divisions / districts / areas | ${r.divisions} / ${r.districts} / ${r.areas} |
| Records placed in an area | ${r.withArea} |

## Data quality

Kinds refined from the record's own name: ${r.reclassified}. Review status: ${Object.entries(r.reviewStatus).map(([k, v]) => `${k} ${v}`).join(", ")}.
Details: \`data/reports/directory-quality-report.md\`.

## Rejected by reason

| Reason | Count |
|---|---|
${table(r.rejectedByReason)}

## Facilities by kind

| Kind | Count |
|---|---|
${table(r.facilitiesByKind)}

## Field coverage (facilities + pharmacies)

| Field | Records with it |
|---|---|
${table(r.fieldCoverage)}
${table(r.facilityFieldCoverage)}

## By district (top 30)

| District | Records |
|---|---|
${table(r.byDistrict, 30)}

## Unmapped OSM specialities (top 30)

| Value | Count |
|---|---|
${table(r.unmappedSpecialities, 30)}
`;
}

/**
 * Optional merge of data/google/place-ids.json ({ "<osm recordId>": { placeId, lastChecked } },
 * written by match-google-places.mjs). Only the place id is kept. Absent file = no change.
 */
export function mergeGooglePlaces(records, placeIds) {
  let merged = 0;
  const out = records.map((record) => {
    const entry = placeIds?.[record.provenance?.recordId];
    if (!entry || typeof entry.placeId !== "string" || !entry.placeId || typeof entry.lastChecked !== "string") return record;
    merged += 1;
    return { ...record, google: { placeId: entry.placeId, lastChecked: entry.lastChecked } };
  });
  return { records: out, merged };
}

function applyGooglePlaces(result) {
  const file = join(ROOT, "data/google/place-ids.json");
  if (!existsSync(file)) return;
  const placeIds = JSON.parse(readFileSync(file, "utf8"));
  const facilities = mergeGooglePlaces(result.facilities, placeIds);
  const pharmacies = mergeGooglePlaces(result.pharmacies, placeIds);
  result.facilities = facilities.records;
  result.pharmacies = pharmacies.records;
  console.log(`Google place IDs merged: ${facilities.merged} facilities, ${pharmacies.merged} pharmacies.`);
}

function main() {
  if (!existsSync(RAW_FILE)) {
    console.error(`Missing ${RAW_FILE}. Run "npm run data:fetch-osm" first.`);
    process.exit(1);
  }
  const raw = JSON.parse(readFileSync(RAW_FILE, "utf8"));
  const areasFile = AREAS_FILES.find((f) => existsSync(f));
  const areasRaw = areasFile ? JSON.parse(readFileSync(areasFile, "utf8")) : null;
  if (!areasRaw) console.warn(`No areas file; building without areas (run "npm run data:fetch-areas").`);
  else console.log(`Areas from ${areasFile}`);
  const result = buildDirectory(raw, areasRaw);
  applyGooglePlaces(result);
  mkdirSync(REPORT_DIR, { recursive: true });
  writeJsonLines(join(SEED_DIR, "facilities.json"), result.facilities);
  writeJsonLines(join(SEED_DIR, "pharmacies.json"), result.pharmacies);
  writeJsonLines(join(SEED_DIR, "locations.json"), result.locations);
  writeJsonLines(join(SEED_DIR, "specialties.json"), result.specialties);
  // Keep doctor sources written by data:import-doctors (ids "doctors-…").
  const sourcesFile = join(SEED_DIR, "directory-sources.json");
  const doctorSources = existsSync(sourcesFile)
    ? JSON.parse(readFileSync(sourcesFile, "utf8")).filter((s) => String(s.id).startsWith("doctors-"))
    : [];
  writeJsonLines(sourcesFile, [...result.sources, ...doctorSources]);
  if (!existsSync(join(SEED_DIR, "doctors.json"))) writeFileSync(join(SEED_DIR, "doctors.json"), "[]\n");
  writeFileSync(
    join(REPORT_DIR, "osm-import-report.json"),
    `${JSON.stringify({ ...result.report, rejectedRecords: result.rejected, duplicateRecords: result.duplicates }, null, 2)}\n`,
  );
  writeFileSync(join(REPORT_DIR, "osm-import-report.md"), renderReport(result.report));
  writeQualityReport(result);
  const r = result.report;
  console.log(
    `Facilities ${r.facilities}, pharmacies ${r.pharmacies} from ${r.rawFeatures} features ` +
      `(rejected ${r.rejected}, duplicates ${r.duplicatesRemoved}); ${r.districts} districts, ${r.areas} areas, ${r.withArea} records placed in an area.`,
  );
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
