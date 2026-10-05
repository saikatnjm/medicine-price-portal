#!/usr/bin/env node
/**
 * Validates the application dataset in src/data/local/seed/.
 *
 *   docker compose run --rm app npm run validate:data
 *
 * Exits non-zero and lists every problem found. Independent of the build step,
 * so hand edits and generated output are checked the same way.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { DOSAGE_FORM_CATEGORIES, keyOf } from "./lib/normalize.mjs";

const SEED_DIR = join(dirname(fileURLToPath(import.meta.url)), "../../src/data/local/seed");
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const AVAILABILITY = new Set(["in_stock", "limited", "out_of_stock", "unknown"]);
const PRICE_SOURCES = new Set(["sample", "manual", "integration"]);
const PROVENANCE_STATUS = new Set(["registered", "unverified", "needs_review", "verified"]);
const FACILITY_KINDS = new Set(["hospital", "clinic", "diagnostic_centre", "dental_clinic", "doctors_practice", "blood_bank"]);
const OWNERSHIP = new Set(["government", "private", "non_profit", "military"]);
const LOCATION_LEVELS = new Set(["division", "district", "area"]);
const MAX_ERRORS_PER_RULE = 20;

export function validateDataset(data) {
  const errors = [];
  const counts = new Map();
  const fail = (rule, message) => {
    const n = (counts.get(rule) ?? 0) + 1;
    counts.set(rule, n);
    if (n <= MAX_ERRORS_PER_RULE) errors.push(`[${rule}] ${message}`);
  };
  const { medicines, generics, manufacturers, pharmacies, prices, popular } = data;
  // Directory files are optional so medicine-only fixtures stay valid.
  const facilities = data.facilities ?? [];
  const locations = data.locations ?? [];
  const specialties = data.specialties ?? [];
  const doctors = data.doctors ?? [];
  const sources = [...(data.sources ?? []), ...(data.directorySources ?? [])];

  for (const [name, list] of Object.entries({
    medicines,
    generics,
    manufacturers,
    sources,
    pharmacies,
    prices,
    facilities,
    locations,
    specialties,
    doctors,
  })) {
    if (!Array.isArray(list)) fail("invalid_json", `${name}.json must be an array`);
  }
  if (!Array.isArray(popular)) fail("invalid_json", "popular.json must be an array");
  if (errors.length) return { errors, counts };

  const unique = (list, field, label) => {
    const seen = new Set();
    for (const item of list) {
      const value = item[field];
      if (seen.has(value)) fail(`duplicate_${label}_${field}`, `${label} ${field} "${value}"`);
      seen.add(value);
    }
    return seen;
  };

  const genericIds = unique(generics, "id", "generic");
  unique(generics, "slug", "generic");
  const manufacturerIds = unique(manufacturers, "id", "manufacturer");
  unique(manufacturers, "slug", "manufacturer");
  const sourceIds = unique(sources, "id", "source");
  const medicineIds = unique(medicines, "id", "medicine");
  unique(medicines, "slug", "medicine");
  const pharmacyIds = unique(pharmacies, "id", "pharmacy");
  unique(pharmacies, "slug", "pharmacy");
  unique(prices, "id", "price");
  const facilityIds = unique(facilities, "id", "facility");
  unique(facilities, "slug", "facility");
  const locationIds = unique(locations, "id", "location");
  unique(locations, "slug", "location");
  const specialtyIds = unique(specialties, "id", "specialty");
  unique(specialties, "slug", "specialty");
  unique(doctors, "id", "doctor");
  unique(doctors, "slug", "doctor");

  const manufacturerKeys = new Map();
  for (const m of manufacturers) {
    if (!m.name?.trim()) fail("missing_field", `manufacturer ${m.id} has no name`);
    if (!SLUG.test(m.slug ?? "")) fail("invalid_slug", `manufacturer ${m.id}: "${m.slug}"`);
    const key = keyOf(m.name);
    if (manufacturerKeys.has(key))
      fail("duplicate_manufacturer", `"${m.name}" duplicates "${manufacturerKeys.get(key)}"`);
    manufacturerKeys.set(key, m.name);
  }
  for (const g of generics) {
    if (!g.name?.trim()) fail("missing_field", `generic ${g.id} has no name`);
    if (!SLUG.test(g.slug ?? "")) fail("invalid_slug", `generic ${g.id}: "${g.slug}"`);
  }
  for (const s of sources) {
    for (const field of ["name", "publisher", "url", "retrievedAt"]) {
      if (!s[field]) fail("missing_field", `source ${s.id} has no ${field}`);
    }
  }

  const identities = new Set();
  for (const m of medicines) {
    for (const field of [
      "id",
      "slug",
      "brandName",
      "genericId",
      "manufacturerId",
      "dosageForm",
      "dosageFormLabel",
      "updatedAt",
    ]) {
      if (typeof m[field] !== "string" || !m[field].trim())
        fail("missing_field", `medicine ${m.id ?? "?"} has no ${field}`);
    }
    if (typeof m.strength !== "string")
      fail("missing_field", `medicine ${m.id} strength must be a string`);
    if (!SLUG.test(m.slug ?? "")) fail("invalid_slug", `medicine ${m.id}: "${m.slug}"`);
    if (!DOSAGE_FORM_CATEGORIES.includes(m.dosageForm))
      fail("invalid_dosage_form", `medicine ${m.id}: "${m.dosageForm}"`);
    if (!genericIds.has(m.genericId))
      fail("broken_reference", `medicine ${m.id} → generic ${m.genericId}`);
    if (!manufacturerIds.has(m.manufacturerId))
      fail("broken_reference", `medicine ${m.id} → manufacturer ${m.manufacturerId}`);
    if (Number.isNaN(Date.parse(m.updatedAt)))
      fail("malformed_record", `medicine ${m.id} has invalid updatedAt`);
    if (m.strength && !/^(?:\d|0\.)/.test(m.strength))
      fail("malformed_record", `medicine ${m.id} strength "${m.strength}"`);
    if (/�|undefined|null/.test(`${m.brandName} ${m.strength}`))
      fail("malformed_record", `medicine ${m.id} has placeholder text`);
    const p = m.provenance;
    if (!p || !sourceIds.has(p.sourceId) || !p.recordId || !PROVENANCE_STATUS.has(p.status)) {
      fail("invalid_provenance", `medicine ${m.id}`);
    }
    if (m.packSize && !(m.packSize.quantity > 0 && m.packSize.unit))
      fail("malformed_record", `medicine ${m.id} packSize`);
    const identity = [
      keyOf(m.brandName),
      m.genericId,
      keyOf(m.strength),
      keyOf(m.dosageFormLabel),
      m.manufacturerId,
    ].join("|");
    if (identities.has(identity))
      fail(
        "duplicate_product",
        `medicine ${m.id} (${m.brandName} ${m.strength} ${m.dosageFormLabel})`,
      );
    identities.add(identity);
  }

  const pricePairs = new Set();
  for (const p of prices) {
    if (!medicineIds.has(p.medicineId))
      fail("broken_reference", `price ${p.id} → medicine ${p.medicineId}`);
    if (!pharmacyIds.has(p.pharmacyId))
      fail("broken_reference", `price ${p.id} → pharmacy ${p.pharmacyId}`);
    if (!(p.amount > 0) || p.currency !== "BDT")
      fail("malformed_record", `price ${p.id} amount/currency`);
    if (!AVAILABILITY.has(p.availability)) fail("malformed_record", `price ${p.id} availability`);
    if (!PRICE_SOURCES.has(p.source)) fail("malformed_record", `price ${p.id} source`);
    const pair = `${p.medicineId}|${p.pharmacyId}`;
    if (pricePairs.has(pair)) fail("duplicate_price", pair);
    pricePairs.add(pair);
  }
  const checkProvenance = (label, r) => {
    const p = r.provenance;
    if (!p || !sourceIds.has(p.sourceId) || !p.recordId || !PROVENANCE_STATUS.has(p.status))
      fail("invalid_provenance", `${label} ${r.id}`);
  };
  const checkPlace = (label, id, r) => {
    for (const field of ["districtId", "areaId"])
      if (r[field] !== undefined && !locationIds.has(r[field]))
        fail("broken_reference", `${label} ${id} → location ${r[field]}`);
  };
  const checkBasics = (label, r) => {
    for (const field of ["id", "slug", "name", "updatedAt"])
      if (typeof r[field] !== "string" || !r[field].trim())
        fail("missing_field", `${label} ${r.id ?? "?"} has no ${field}`);
    if (!SLUG.test(r.slug ?? "")) fail("invalid_slug", `${label} ${r.id}: "${r.slug}"`);
    if (r.updatedAt && Number.isNaN(Date.parse(r.updatedAt)))
      fail("malformed_record", `${label} ${r.id} has invalid updatedAt`);
    checkPlace(label, r.id, r);
    if (r.coordinates && !(Math.abs(r.coordinates.lat) <= 90 && Math.abs(r.coordinates.lon) <= 180))
      fail("malformed_record", `${label} ${r.id} coordinates`);
    if (r.website && !/^https?:\/\//.test(r.website))
      fail("malformed_record", `${label} ${r.id} website`);
    checkProvenance(label, r);
  };
  const profileKey = (r) => [keyOf(r.name), r.districtId ?? ""].join("|");

  for (const l of locations) {
    if (!l.name?.trim() || !SLUG.test(l.slug ?? "")) fail("missing_field", `location ${l.id}`);
    if (!LOCATION_LEVELS.has(l.level)) fail("malformed_record", `location ${l.id} level`);
    if ((l.level === "district" || l.level === "area") && !locationIds.has(l.parentId))
      fail("broken_reference", `location ${l.id} → parent ${l.parentId}`);
  }
  for (const s of specialties) {
    if (!s.name?.trim() || !s.practitionerTitle?.trim() || !SLUG.test(s.slug ?? ""))
      fail("missing_field", `specialty ${s.id}`);
  }

  const facilityProfiles = new Map();
  for (const f of facilities) {
    checkBasics("facility", f);
    if (!FACILITY_KINDS.has(f.kind)) fail("malformed_record", `facility ${f.id} kind "${f.kind}"`);
    if (f.ownership !== undefined && !OWNERSHIP.has(f.ownership))
      fail("malformed_record", `facility ${f.id} ownership`);
    if (!Array.isArray(f.specialtyIds)) fail("missing_field", `facility ${f.id} specialtyIds`);
    for (const id of f.specialtyIds ?? [])
      if (!specialtyIds.has(id)) fail("broken_reference", `facility ${f.id} → specialty ${id}`);
    // Same name, kind and district is allowed only when the source has separate
    // records far apart (the build step merges near duplicates); flag exact coordinates.
    const key = `${f.kind}|${profileKey(f)}|${f.coordinates ? `${f.coordinates.lat.toFixed(4)},${f.coordinates.lon.toFixed(4)}` : ""}`;
    if (facilityProfiles.has(key))
      fail("duplicate_profile", `facility ${f.id} duplicates ${facilityProfiles.get(key)}`);
    facilityProfiles.set(key, f.id);
  }
  for (const ph of pharmacies) {
    if (ph.provenance) checkBasics("pharmacy", ph);
  }
  const doctorProfiles = new Map();
  for (const d of doctors) {
    checkBasics("doctor", d);
    // Doctors must come from a verified or consented source, never a scrape.
    if (d.provenance?.status === "unverified")
      fail("invalid_provenance", `doctor ${d.id} must not be unverified`);
    for (const id of d.specialtyIds ?? [])
      if (!specialtyIds.has(id)) fail("broken_reference", `doctor ${d.id} → specialty ${id}`);
    if (!Array.isArray(d.chambers)) fail("missing_field", `doctor ${d.id} chambers`);
    for (const c of d.chambers ?? []) {
      if (c.facilityId !== undefined && !facilityIds.has(c.facilityId))
        fail("broken_reference", `doctor ${d.id} → facility ${c.facilityId}`);
      checkPlace("doctor chamber", d.id, c);
    }
    // Same name + specialties + first chamber place = the same person listed twice.
    const firstChamber = d.chambers?.[0] ?? {};
    const key = [keyOf(d.name), [...(d.specialtyIds ?? [])].sort().join(","), firstChamber.facilityId ?? firstChamber.districtId ?? ""].join("|");
    if (doctorProfiles.has(key))
      fail("duplicate_profile", `doctor ${d.id} duplicates ${doctorProfiles.get(key)}`);
    doctorProfiles.set(key, d.id);
  }

  for (const id of popular)
    if (!medicineIds.has(id)) fail("broken_reference", `popular → medicine ${id}`);

  return { errors, counts };
}

function load(name) {
  try {
    return JSON.parse(readFileSync(join(SEED_DIR, `${name}.json`), "utf8"));
  } catch (error) {
    console.error(`[invalid_json] ${name}.json: ${error.message}`);
    process.exit(1);
  }
}

function main() {
  const data = Object.fromEntries(
    [
      "medicines",
      "generics",
      "manufacturers",
      "sources",
      "pharmacies",
      "prices",
      "popular",
      "facilities",
      "locations",
      "specialties",
      "doctors",
    ].map((n) => [n, load(n)]),
  );
  data.directorySources = load("directory-sources");
  const { errors, counts } = validateDataset(data);
  if (errors.length) {
    console.error(errors.join("\n"));
    console.error(
      `\nData validation failed: ${[...counts.entries()].map(([rule, n]) => `${rule}=${n}`).join(", ")}`,
    );
    process.exit(1);
  }
  console.log(
    `Data OK: ${data.medicines.length} medicines, ${data.generics.length} generics, ` +
      `${data.manufacturers.length} manufacturers, ${data.prices.length} prices, ${data.pharmacies.length} pharmacies, ` +
      `${data.facilities.length} facilities, ${data.locations.length} locations, ` +
      `${data.specialties.length} specialties, ${data.doctors.length} doctors.`,
  );
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
