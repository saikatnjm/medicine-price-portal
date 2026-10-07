/**
 * Data-quality rules for directory records (pure, deterministic).
 *
 * OpenStreetMap categories in Bangladesh are noisy: medicine shops tagged as
 * hospitals, community clinics tagged as hospitals, doctors' chambers tagged
 * as clinics, offices of hospital groups tagged as hospitals. These rules:
 *
 * 1. refine the entity kind ONLY when the record's own name states a different
 *    kind unambiguously (e.g. "Rahim Medical Hall" tagged amenity=hospital is a
 *    medicine shop). The rule that fired is recorded in the import report.
 * 2. flag records for review (shown, but noindex and kept out of the sitemap),
 *    or exclude records that are clearly not a place of care (kept in the data
 *    for audit, hidden from the site).
 *
 * Nothing is invented: coordinates and contact details are never changed; names only
 * lose OSM category/address text pasted after a comma (the original is kept).
 */

/** Bounding box around Bangladesh (generous). */
export const BD_BOUNDS = { minLat: 20.3, maxLat: 26.8, minLon: 87.9, maxLon: 92.8 };

const has = (re, text) => re.test(text);

// Words that mean "this is a care facility of the tagged kind"; when present, no refinement.
const HOSPITAL_WORDS = /\b(hospital|hospitals|medical college)\b|হাসপাতাল/i;
const CLINIC_WORDS = /\bclinic\b|ক্লিনিক/i;

const PHARMACY_NAME =
  /\b(pharmacy|pharmacies|pharma|medical hall|medicine (corner|centre|center|store|shop|house)|drug (house|store)|homo?eo(pathic)? hall)\b|ঔষধালয়|ফার্মেসী|ফার্মেসি/i;
const DIAGNOSTIC_NAME = /\b(diagnostics?|patholog(y|ical)|laborator(y|ies)|lab|imaging|x-?ray)\b|ডায়াগনস্টিক/i;
const DENTAL_NAME = /\b(dental|dentist|dentists|orthodont\w*)\b/i;
const CHAMBER_NAME = /\bchamber\b|চেম্বার/i;
const HEALTH_CENTRE_NAME =
  /\b(community clinic|family welfare|union health|sub[- ]?health|health (post|centre|center|complex))\b|স্বাস্থ্য কেন্দ্র|কমিউনিটি ক্লিনিক/i;

/** Clearly an organisation or office, not a place where people receive care. */
const NOT_A_FACILITY =
  /\b(association|head office|corporate office|liaison office|office of|supply chain|trading|traders|ltd\.? office)\b|\boffice\b(?!.*\b(hospital|clinic)\b)/i;
/** Probably not a facility, but not certain enough to hide. */
const SUSPICIOUS =
  /\b(college|university|institute|school|foundation|trust|council|parishad|bank|ngo|society|agro|feed|camp|programme|program|campaign|bridge)\b/i;
/** OSM category text pasted into the name, e.g. "Rahim Medical Hall, Hospital". */
const CATEGORY_IN_NAME =
  /,\s*(hospital|private hospital|pharmacy|parapharmacy|doctor|dentist|clinic|medical cent(er|re)|laboratory)\b/i;

const CATEGORY_SUFFIX =
  /,\s*(hospital|private hospital|pharmacy|parapharmacy|doctor|dentist|clinic|medical cent(er|re)|laboratory)\b.*$/i;

/**
 * Some bulk-imported OSM names carry the category and address after a comma:
 * "Al Bayt Hospital, Hospital, Dhaka - Mawa Hwy, Dhaka". Returns the part before
 * the pasted category ("Al Bayt Hospital"), or null when the name has no such
 * suffix or the remainder would not be a usable name. The original is kept by the caller.
 */
export function stripCategorySuffix(name) {
  const cleaned = (name ?? "").replace(CATEGORY_SUFFIX, "").replace(/[\s,.;:-]+$/, "").trim();
  if (cleaned === name || cleaned.length < 3 || !/\p{L}/u.test(cleaned)) return null;
  return cleaned;
}

/**
 * Returns the refined kind and the rule used ("as_tagged" when unchanged).
 * `kind` is one of the facility kinds or "pharmacy".
 */
export function refineKind(name, kind) {
  // Ignore OSM category text pasted after a comma ("Rahim Medical Hall, Hospital, Road 5").
  const n = (name ?? "").replace(CATEGORY_SUFFIX, "");
  if (kind === "pharmacy") return { kind, rule: "as_tagged" };
  const careWords = has(HOSPITAL_WORDS, n) || has(CLINIC_WORDS, n);

  if (["hospital", "clinic"].includes(kind) && has(HEALTH_CENTRE_NAME, n) && !has(HOSPITAL_WORDS, n)) {
    // Upazila Health Complexes are hospitals; community clinics and union centres are not.
    if (!/\bhealth complex\b/i.test(n)) return { kind: "health_centre", rule: "name_health_centre" };
  }
  if (kind !== "dental_clinic" && has(DENTAL_NAME, n) && !has(HOSPITAL_WORDS, n) && !/college/i.test(n)) {
    return { kind: "dental_clinic", rule: "name_dental" };
  }
  if (["hospital", "clinic", "doctors_practice"].includes(kind) && has(PHARMACY_NAME, n) && !careWords && !has(DIAGNOSTIC_NAME, n)) {
    return { kind: "pharmacy", rule: "name_pharmacy" };
  }
  if (["hospital", "clinic"].includes(kind) && has(DIAGNOSTIC_NAME, n) && !careWords) {
    return { kind: "diagnostic_centre", rule: "name_diagnostic" };
  }
  if (["hospital", "clinic"].includes(kind) && has(CHAMBER_NAME, n) && !has(HOSPITAL_WORDS, n)) {
    return { kind: "doctors_practice", rule: "name_chamber" };
  }
  return { kind, rule: "as_tagged" };
}

export function isInBangladesh(c) {
  return Boolean(
    c && c.lat >= BD_BOUNDS.minLat && c.lat <= BD_BOUNDS.maxLat && c.lon >= BD_BOUNDS.minLon && c.lon <= BD_BOUNDS.maxLon,
  );
}

/** Quality flags for one record (before duplicate detection). */
export function qualityFlagsOf(record) {
  const flags = [];
  const name = record.name ?? "";
  if (NOT_A_FACILITY.test(name)) flags.push("not_a_facility");
  else if (SUSPICIOUS.test(name) && !HOSPITAL_WORDS.test(name) && !CLINIC_WORDS.test(name)) flags.push("suspicious_category");
  if (CATEGORY_IN_NAME.test(name)) flags.push("category_in_name");
  if (record.sourceName) flags.push("name_cleaned");
  if (name.length > 80) flags.push("long_name");
  if (!record.coordinates) flags.push("missing_coordinates");
  else if (!isInBangladesh(record.coordinates)) flags.push("coordinates_outside_bangladesh");
  if (!record.districtId) flags.push("missing_district");
  return flags;
}

/** Flags that hide a record from the site (kept in the data for audit). */
export const EXCLUDING_FLAGS = new Set(["not_a_facility", "coordinates_outside_bangladesh"]);
/** Flags that keep a record visible but out of search engines until reviewed. */
export const REVIEW_FLAGS = new Set(["suspicious_category", "category_in_name", "long_name", "missing_district", "possible_duplicate"]);
/** Informational flags (no effect on visibility). */
export const INFO_FLAGS = new Set(["name_cleaned", "missing_coordinates"]);

export function reviewStatusOf(flags) {
  if (flags.some((f) => EXCLUDING_FLAGS.has(f))) return "excluded";
  if (flags.some((f) => REVIEW_FLAGS.has(f))) return "needs_review";
  return "active";
}
