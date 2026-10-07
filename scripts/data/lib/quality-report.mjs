/**
 * Data-quality report (pure, read-only). `buildQualityReport` inspects the seed datasets and returns counts and
 * capped example ids per check; it never changes or deletes data. See scripts/data/report-quality.mjs.
 */

export const BD_COORD_RANGE = { minLat: 20.5, maxLat: 26.7, minLon: 88, maxLon: 92.8 };
export const STALE_AFTER_DAYS = 365;
export const DUPLICATE_RADIUS_M = 100;
export const DEFAULT_EXAMPLE_CAP = 10;

/** Same rule as import-doctors.mjs isValidPhone. */
export function isValidPhone(value) {
  if (typeof value !== "string") return false;
  const digits = value.replace(/\D/g, "");
  return /^\+?\d[\d\s\-()]{4,24}$/.test(value) && digits.length >= 6 && digits.length <= 15;
}

/** Lower-cased name with punctuation and spacing removed, for duplicate detection. */
export function normalizeName(name) {
  return String(name ?? "")
    .toLowerCase()
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N}]+/gu, "");
}

export function haversineMeters(a, b) {
  const R = 6371000;
  const rad = (d) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** "missing" (no coordinates), "invalid" (not finite numbers / out of the lat/lon range) or "outside_bangladesh". */
export function coordinateProblem(coords) {
  if (coords == null) return "missing";
  const { lat, lon } = coords;
  if (typeof lat !== "number" || typeof lon !== "number" || !Number.isFinite(lat) || !Number.isFinite(lon)) return "invalid";
  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) return "invalid";
  const r = BD_COORD_RANGE;
  if (lat < r.minLat || lat > r.maxLat || lon < r.minLon || lon > r.maxLon) return "outside_bangladesh";
  return null;
}

/** Slugs used by more than one record: [{ slug, ids }]. */
export function findDuplicateSlugs(records) {
  const bySlug = new Map();
  for (const r of records) {
    if (!r.slug) continue;
    const list = bySlug.get(r.slug) ?? [];
    list.push(r.id);
    bySlug.set(r.slug, list);
  }
  return [...bySlug].filter(([, ids]) => ids.length > 1).map(([slug, ids]) => ({ slug, ids }));
}

/** Pairs with the same normalised name within `radiusM` metres: [[idA, idB]]. */
export function findProbableDuplicates(records, radiusM = DUPLICATE_RADIUS_M) {
  const groups = new Map();
  for (const r of records) {
    const key = normalizeName(r.name);
    if (!key || coordinateProblem(r.coordinates)) continue;
    const list = groups.get(key) ?? [];
    list.push(r);
    groups.set(key, list);
  }
  const pairs = [];
  for (const list of groups.values()) {
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        if (haversineMeters(list[i].coordinates, list[j].coordinates) <= radiusM) pairs.push([list[i].id, list[j].id]);
      }
    }
  }
  return pairs;
}

export function isStale(iso, now, days = STALE_AFTER_DAYS) {
  if (!iso) return false;
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return false;
  return now.getTime() - t > days * 86400000;
}

/** Doctor chambers sharing the same facility (id, else normalised name) within one doctor: [{ doctorId, facility }]. */
export function findDuplicateChambers(doctors) {
  const out = [];
  for (const d of doctors) {
    const seen = new Set();
    for (const c of d.chambers ?? []) {
      const key = c.facilityId ?? (c.facilityName ? `name:${normalizeName(c.facilityName)}` : null);
      if (!key) continue;
      if (seen.has(key)) out.push({ doctorId: d.id, facility: key });
      seen.add(key);
    }
  }
  return out;
}

class Check {
  constructor(severity, cap) {
    this.severity = severity;
    this.cap = cap;
    this.count = 0;
    this.examples = [];
  }
  add(example) {
    this.count += 1;
    if (this.examples.length < this.cap) this.examples.push(example);
  }
}

function recordChecks(kind, records, { now, cap, withCoordinates, withReviewStatus }) {
  const c = {
    missingName: new Check("error", cap),
    missingProvenance: new Check("error", cap),
    malformedPhone: new Check("warning", cap),
    stale: new Check("warning", cap),
  };
  if (withCoordinates) {
    c.missingCoordinates = new Check("warning", cap);
    c.invalidCoordinates = new Check("error", cap);
    c.outsideBangladesh = new Check("error", cap);
  }
  if (withReviewStatus) {
    c.needsReview = new Check("info", cap);
    c.excluded = new Check("info", cap);
  }
  for (const r of records) {
    const id = r.id ?? r.slug ?? "(no id)";
    if (!String(r.name ?? r.brandName ?? "").trim()) c.missingName.add(id);
    const p = r.provenance;
    if (!p || !p.sourceId || !p.recordId) c.missingProvenance.add(id);
    if (r.phone != null && !isValidPhone(r.phone)) c.malformedPhone.add(id);
    for (const ch of r.chambers ?? []) {
      if (ch.phone != null && !isValidPhone(ch.phone)) c.malformedPhone.add(id);
    }
    if (isStale(p?.lastCheckedAt ?? p?.verifiedAt, now)) c.stale.add(id);
    if (withCoordinates) {
      const problem = coordinateProblem(r.coordinates);
      if (problem === "missing") c.missingCoordinates.add(id);
      else if (problem === "invalid") c.invalidCoordinates.add(id);
      else if (problem === "outside_bangladesh") c.outsideBangladesh.add(id);
    }
    if (withReviewStatus) {
      if (r.reviewStatus === "needs_review") c.needsReview.add(id);
      if (r.reviewStatus === "excluded") c.excluded.add(id);
    }
  }
  return c;
}

function summarise(check) {
  return { severity: check.severity, count: check.count, examples: check.examples };
}

/**
 * @param {{facilities?: object[], pharmacies?: object[], doctors?: object[], locations?: object[], medicines?: object[]}} data
 * @param {{now?: Date, cap?: number}} [options]
 */
export function buildQualityReport(data, { now = new Date(), cap = DEFAULT_EXAMPLE_CAP } = {}) {
  const facilities = data.facilities ?? [];
  const pharmacies = data.pharmacies ?? [];
  const doctors = data.doctors ?? [];
  const locations = data.locations ?? [];
  const medicines = data.medicines ?? [];

  const datasets = {};
  const sets = [
    ["facilities", facilities, { withCoordinates: true, withReviewStatus: true }],
    ["pharmacies", pharmacies, { withCoordinates: true, withReviewStatus: true }],
    ["doctors", doctors, { withCoordinates: false, withReviewStatus: false }],
    ["locations", locations, { withCoordinates: false, withReviewStatus: false }],
    ["medicines", medicines, { withCoordinates: false, withReviewStatus: false }],
  ];
  for (const [key, records, opts] of sets) {
    const checks = recordChecks(key, records, { now, cap, ...opts });
    // Locations carry no provenance or contact data by design.
    if (key === "locations") {
      delete checks.missingProvenance;
      delete checks.malformedPhone;
      delete checks.stale;
    }
    const dup = new Check("error", cap);
    for (const d of findDuplicateSlugs(records)) dup.add(`${d.slug}: ${d.ids.join(", ")}`);
    const out = { total: records.length, duplicateSlugs: summarise(dup) };
    for (const [name, check] of Object.entries(checks)) out[name] = summarise(check);
    if (key === "facilities" || key === "pharmacies") {
      const probable = new Check("warning", cap);
      for (const [a, b] of findProbableDuplicates(records)) probable.add(`${a} ~ ${b}`);
      out.probableDuplicates = summarise(probable);
    }
    if (key === "doctors") {
      const chambers = new Check("warning", cap);
      for (const d of findDuplicateChambers(records)) chambers.add(`${d.doctorId} @ ${d.facility}`);
      out.duplicateChambers = summarise(chambers);
    }
    datasets[key] = out;
  }

  const issues = { error: 0, warning: 0, info: 0 };
  for (const ds of Object.values(datasets)) {
    for (const v of Object.values(ds)) {
      if (v && typeof v === "object" && "severity" in v) issues[v.severity] += v.count;
    }
  }
  return {
    generatedAt: now.toISOString(),
    thresholds: {
      staleAfterDays: STALE_AFTER_DAYS,
      duplicateRadiusMeters: DUPLICATE_RADIUS_M,
      coordinateRange: BD_COORD_RANGE,
      exampleCap: cap,
    },
    totals: { ...issues },
    datasets,
  };
}

/** Short human-readable summary lines (only checks with findings). */
export function summarizeReport(report) {
  const lines = [`Data quality report (${report.generatedAt})`];
  for (const [name, ds] of Object.entries(report.datasets)) {
    lines.push(`${name}: ${ds.total} records`);
    for (const [check, v] of Object.entries(ds)) {
      if (v && typeof v === "object" && "severity" in v && v.count > 0) {
        lines.push(`  [${v.severity}] ${check}: ${v.count}`);
      }
    }
  }
  lines.push(`Totals: ${report.totals.error} errors, ${report.totals.warning} warnings, ${report.totals.info} notes`);
  return lines;
}
