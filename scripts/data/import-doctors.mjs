#!/usr/bin/env node
/**
 * Imports doctor profiles from a curated CSV (docs/DOCTOR-DATA.md).
 *
 *   npm run data:import-doctors [-- --allow-examples] [-- --dry-run]
 *
 *   data/doctors/doctors.csv    one row per chamber, rows grouped by doctor_key
 *   data/doctors/sources.json   the permitted sources the rows cite
 *     → src/data/local/seed/doctors.json
 *     → src/data/local/seed/directory-sources.json   (doctor sources merged in; others kept)
 *     → data/reports/doctor-import-report.md
 *
 * Strict by design: any invalid row aborts the import and nothing is written
 * except the report. This script never fetches anything from the network and
 * never invents data; header-only CSV yields an empty doctor list.
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { cleanText, slugify } from "./lib/normalize.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");
const SEED_DIR = join(ROOT, "src/data/local/seed");
const DATA_DIR = join(ROOT, "data/doctors");
const REPORT_PATH = join(ROOT, "data/reports/doctor-import-report.md");

export const COLUMNS = [
  "doctor_key",
  "name",
  "specialties",
  "qualifications",
  "designation",
  "organization",
  "profile_summary",
  "phone",
  "source_id",
  "source_url",
  "verification_method",
  "verified_at",
  "facility_slug",
  "facility_name",
  "district_slug",
  "area_slug",
  "locality",
  "address",
  "postal_code",
  "latitude",
  "longitude",
  "chamber_phone",
  "appointment_phone",
  "appointment_url",
  "consultation_days",
  "consultation_hours",
];
/** Doctor-level columns: taken from the first row of a group; later rows may repeat or leave them blank. */
const DOCTOR_COLUMNS = COLUMNS.slice(1, 12);
const REQUIRED = ["doctor_key", "name", "specialties", "source_id", "source_url", "verification_method", "verified_at"];
const METHODS = new Set(["official_profile", "doctor_provided", "registry"]);
const EXAMPLE_HOSTS = new Set(["example.org", "example.com", "www.example.org", "www.example.com"]);
const MAX_SUMMARY = 500;
const MAX_NAME = 120;
const TITLE_PREFIX = /^(?:(?:dr|prof|professor|assoc|asst|associate|assistant)\.?\s+)+/i;

// ------------------------------------------------------------------------ CSV

/** RFC 4180 parser: quoted fields, doubled quotes, CRLF/LF, optional BOM. Returns rows with their line numbers. */
export function parseCsv(text) {
  const src = text.replace(/^﻿/, "");
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  let line = 1;
  let rowLine = 1;
  const endRow = () => {
    row.push(field);
    field = "";
    if (row.some((v) => v.trim() !== "")) rows.push({ line: rowLine, cells: row });
    row = [];
  };
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (quoted) {
      if (c === '"' && src[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') quoted = false;
      else {
        if (c === "\n") line++;
        field += c;
      }
    } else if (c === '"' && field === "") quoted = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && src[i + 1] === "\n") i++;
      endRow();
      line++;
      rowLine = line;
    } else field += c;
  }
  if (field !== "" || row.length > 0) endRow();
  return rows;
}

// ----------------------------------------------------------------- validation

export function isValidPhone(value) {
  const digits = value.replace(/\D/g, "");
  return /^\+?\d[\d\s\-()]{4,24}$/.test(value) && digits.length >= 6 && digits.length <= 15;
}

function hostOf(url) {
  try {
    const u = new URL(url);
    return /^https?:$/.test(u.protocol) ? u.hostname.toLowerCase() : null;
  } catch {
    return null;
  }
}

function parseDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}(?:T[\d:.]+Z?)?$/.test(value)) return null;
  const t = Date.parse(value);
  return Number.isNaN(t) ? null : new Date(t).toISOString();
}

function validateSources(sources, allowExamples, errors) {
  const out = new Map();
  if (!Array.isArray(sources)) {
    errors.push("sources.json: must be an array");
    return out;
  }
  sources.forEach((s, i) => {
    const at = `sources.json[${i}]`;
    for (const f of ["id", "name", "url", "licence"])
      if (typeof s?.[f] !== "string" || !s[f].trim()) errors.push(`${at}: "${f}" is required (licence = licence or permission note)`);
    if (typeof s?.id === "string" && !/^doctors-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s.id))
      errors.push(`${at}: id "${s.id}" must look like "doctors-<name>"`);
    if (typeof s?.url === "string") {
      const host = hostOf(s.url);
      if (!host) errors.push(`${at}: url must be http(s)`);
      else if (EXAMPLE_HOSTS.has(host) && !allowExamples) errors.push(`${at}: example hosts are not allowed`);
    }
    if (out.has(s?.id)) errors.push(`${at}: duplicate id "${s.id}"`);
    if (s?.id) out.set(s.id, s);
  });
  return out;
}

// ---------------------------------------------------------------------- build

/**
 * Pure import: returns { doctors, sources, errors, report }. Nothing is read or written here.
 * @param {{csvText: string, sources: unknown, specialties: any[], facilities: any[], locations: any[],
 *          allowExamples?: boolean, now?: string}} input
 */
export function buildDoctors({ csvText, sources, specialties, facilities, locations, allowExamples = false, now = new Date().toISOString() }) {
  const errors = [];
  const warnings = [];
  const doctors = [];
  const usedSlugs = new Set();
  const usedSources = new Set();
  const specialtyBySlug = new Map(specialties.map((s) => [s.slug, s]));
  const facilityBySlug = new Map(facilities.map((f) => [f.slug, f]));
  const locationBySlug = new Map(locations.map((l) => [l.slug, l]));
  const locationById = new Map(locations.map((l) => [l.id, l]));
  const sourceById = validateSources(sources, allowExamples, errors);

  const parsed = parseCsv(csvText);
  const header = parsed[0]?.cells.map((h) => h.trim());
  if (!header) {
    errors.push("doctors.csv: missing header row");
    return finish();
  }
  for (const c of header) if (!COLUMNS.includes(c)) errors.push(`doctors.csv: unknown column "${c}" (no extra fields are imported)`);
  for (const c of REQUIRED) if (!header.includes(c)) errors.push(`doctors.csv: missing required column "${c}"`);
  if (errors.length > 0) return finish();

  // Group rows by doctor_key, keeping file order.
  const groups = new Map();
  for (const { line, cells } of parsed.slice(1)) {
    if (cells.length > header.length) {
      errors.push(`line ${line}: ${cells.length} cells but the header has ${header.length}`);
      continue;
    }
    const rec = Object.fromEntries(header.map((h, i) => [h, cleanText(cells[i] ?? "")]));
    if (!rec.doctor_key) {
      errors.push(`line ${line}: doctor_key is required`);
      continue;
    }
    if (!groups.has(rec.doctor_key)) groups.set(rec.doctor_key, []);
    groups.get(rec.doctor_key).push({ line, rec });
  }

  for (const [key, rows] of groups) {
    const first = rows[0];
    const where = `doctor "${key}" (line ${first.line})`;
    const fail = (msg, line = first.line) => errors.push(`line ${line}: ${msg} [${key}]`);
    const d = Object.fromEntries(DOCTOR_COLUMNS.map((c) => [c, first.rec[c] ?? ""]));

    for (const { line, rec } of rows.slice(1))
      for (const c of DOCTOR_COLUMNS)
        if (rec[c] && rec[c] !== d[c]) fail(`"${c}" differs from the first row of this doctor`, line);

    for (const c of ["name", "specialties", "source_id", "source_url", "verification_method", "verified_at"])
      if (!d[c]) fail(`${c} is required`);
    if (d.name && d.name.length > MAX_NAME) fail(`name is longer than ${MAX_NAME} characters`);
    if (d.profile_summary.length > MAX_SUMMARY) fail(`profile_summary is longer than ${MAX_SUMMARY} characters`);
    if (d.phone && !isValidPhone(d.phone)) fail(`phone "${d.phone}" is not a valid phone number`);

    const specialtyIds = [];
    for (const slug of d.specialties.split(";").map((s) => s.trim()).filter(Boolean)) {
      const s = specialtyBySlug.get(slug);
      if (!s) fail(`unknown specialty slug "${slug}"`);
      else if (!specialtyIds.includes(s.id)) specialtyIds.push(s.id);
    }
    if (d.specialties && specialtyIds.length === 0 && !errors.some((e) => e.includes(`unknown specialty`) && e.endsWith(`[${key}]`)))
      fail("at least one specialty is required");

    if (d.source_id && !sourceById.has(d.source_id)) fail(`source_id "${d.source_id}" is not in sources.json`);
    else if (d.source_id) usedSources.add(d.source_id);
    if (d.source_url) {
      const host = hostOf(d.source_url);
      if (!host) fail("source_url must be an http(s) URL");
      else if (EXAMPLE_HOSTS.has(host) && !allowExamples) fail(`source_url host "${host}" is a placeholder; use the real source page`);
    }
    if (d.verification_method && !METHODS.has(d.verification_method))
      fail(`verification_method must be one of ${[...METHODS].join(", ")}`);
    const verifiedAt = d.verified_at ? parseDate(d.verified_at) : null;
    if (d.verified_at && !verifiedAt) fail("verified_at must be a date like 2026-10-01");
    else if (verifiedAt && Date.parse(verifiedAt) > Date.parse(now)) fail("verified_at is in the future");

    const chambers = [];
    for (const { line, rec } of rows) {
      const hasAny = ["facility_slug", "facility_name", "district_slug", "area_slug", "locality", "address", "chamber_phone", "appointment_phone", "appointment_url", "consultation_days", "consultation_hours", "latitude", "longitude"].some((c) => rec[c]);
      if (!hasAny) continue; // doctor with no published chamber
      const c = {};
      const facility = rec.facility_slug ? facilityBySlug.get(rec.facility_slug) : null;
      if (rec.facility_slug && rec.facility_name) fail("give either facility_slug or facility_name, not both", line);
      if (rec.facility_slug) {
        if (!facility) fail(`unknown facility_slug "${rec.facility_slug}" (not in facilities.json)`, line);
        else {
          c.facilityId = facility.id;
          c.facilityKind = facility.kind;
        }
      } else {
        if (!rec.facility_name) fail("a chamber needs facility_slug, or facility_name with district_slug", line);
        else c.facilityName = rec.facility_name;
        if (!rec.district_slug) fail("district_slug is required when facility_slug is not given", line);
      }
      if (rec.district_slug) {
        const district = locationBySlug.get(rec.district_slug);
        if (!district || district.level !== "district") fail(`unknown district_slug "${rec.district_slug}"`, line);
        else c.districtId = district.id;
      }
      if (rec.area_slug) {
        const area = locationBySlug.get(rec.area_slug);
        if (!area || area.level !== "area") fail(`unknown area_slug "${rec.area_slug}"`, line);
        else {
          if (c.districtId && area.parentId !== c.districtId) fail(`area "${rec.area_slug}" is not in district "${rec.district_slug}"`, line);
          c.areaId = area.id;
          c.districtId ??= area.parentId;
        }
      }
      if (rec.locality) c.locality = rec.locality;
      if (rec.address) c.address = rec.address;
      if (rec.postal_code) c.postalCode = rec.postal_code;
      if (rec.latitude || rec.longitude) {
        const lat = Number(rec.latitude);
        const lon = Number(rec.longitude);
        // Bangladesh bounding box, to catch swapped or mistyped values.
        if (!rec.latitude || !rec.longitude || !(lat >= 20 && lat <= 27) || !(lon >= 88 && lon <= 93))
          fail("latitude/longitude must both be given and fall inside Bangladesh", line);
        else c.coordinates = { lat, lon };
      }
      for (const [col, field] of [["chamber_phone", "phone"], ["appointment_phone", "appointmentPhone"]]) {
        if (!rec[col]) continue;
        if (!isValidPhone(rec[col])) fail(`${col} "${rec[col]}" is not a valid phone number`, line);
        else c[field] = rec[col];
      }
      if (rec.appointment_url) {
        if (hostOf(rec.appointment_url)) c.appointmentUrl = rec.appointment_url;
        else fail("appointment_url must be an http(s) URL", line);
      }
      if (rec.consultation_days) c.consultationDays = rec.consultation_days;
      if (rec.consultation_hours) c.consultationHours = rec.consultation_hours;
      chambers.push(c);
    }

    // id/slug are only built once the row is otherwise valid.
    if (errors.some((e) => e.endsWith(`[${key}]`))) continue;
    const firstFacility = chambers[0]?.facilityId ? facilities.find((f) => f.id === chambers[0].facilityId) : undefined;
    const firstDistrictId = chambers[0]?.districtId ?? firstFacility?.districtId;
    const districtSlug = firstDistrictId ? locationById.get(firstDistrictId)?.slug : "";
    const base = ["dr", slugify(d.name.replace(TITLE_PREFIX, "")), districtSlug].filter(Boolean).join("-");
    let slug = base;
    for (let n = 2; usedSlugs.has(slug); n++) slug = `${base}-${n}`;
    usedSlugs.add(slug);

    const doctor = {
      id: `doc_${createHash("sha1").update(`${d.source_id}|${key}`).digest("hex").slice(0, 16)}`,
      slug,
      name: d.name,
      specialtyIds,
      ...(d.qualifications && { qualifications: d.qualifications }),
      ...(d.designation && { designation: d.designation }),
      ...(d.profile_summary && { profileSummary: d.profile_summary }),
      ...(d.phone && { phone: d.phone }),
      ...(d.organization && { organization: d.organization }),
      chambers,
      updatedAt: verifiedAt,
      provenance: {
        sourceId: d.source_id,
        recordId: key,
        recordUrl: d.source_url,
        status: "verified",
        verificationMethod: d.verification_method,
        verifiedAt,
      },
    };
    if (chambers.length === 0) warnings.push(`${where}: no chamber published`);
    doctors.push(doctor);
  }

  return finish();

  function finish() {
    const outSources = [...usedSources].flatMap((id) => {
      const s = sourceById.get(id);
      if (!s) return [];
      return [
        {
          id: s.id,
          name: s.name,
          publisher: s.publisher ?? s.name,
          url: s.url,
          licence: s.licence,
          ...(s.licenceUrl && { licenceUrl: s.licenceUrl }),
          ...(s.attribution && { attribution: s.attribution }),
          retrievedAt: now,
          ...(s.note && { note: s.note }),
        },
      ];
    });
    return {
      doctors: errors.length === 0 ? doctors : [],
      sources: outSources,
      errors,
      warnings,
      report: { rows: parsed.length > 0 ? parsed.length - 1 : 0, doctors: doctors.length, chambers: doctors.reduce((n, x) => n + x.chambers.length, 0), now },
    };
  }
}

/** Existing entries are kept; entries with the same id as an imported source are replaced. */
export function mergeSources(existing, imported) {
  const ids = new Set(imported.map((s) => s.id));
  return [...existing.filter((s) => !ids.has(s.id)), ...imported];
}

export function renderReport(result, { allowExamples } = {}) {
  const { errors, warnings, report, sources } = result;
  const lines = [
    "# Doctor import report",
    "",
    `Generated by \`scripts/data/import-doctors.mjs\` at ${report.now}.`,
    "Input: `data/doctors/doctors.csv` and `data/doctors/sources.json`. See `docs/DOCTOR-DATA.md`.",
    "",
    `Status: **${errors.length === 0 ? "success" : "failed (nothing was written)"}**${allowExamples ? " (example hosts allowed)" : ""}`,
    "",
    "| Metric | Count |",
    "|---|---|",
    `| CSV rows | ${report.rows} |`,
    `| Doctors imported | ${errors.length === 0 ? report.doctors : 0} |`,
    `| Chambers | ${errors.length === 0 ? report.chambers : 0} |`,
    `| Sources used | ${sources.length} |`,
    "",
  ];
  if (report.rows === 0 && errors.length === 0)
    lines.push("The CSV has no data rows, so the doctor dataset is empty. No doctor is ever invented.", "");
  if (errors.length > 0) lines.push("## Errors", "", ...errors.map((e) => `- ${e}`), "");
  if (warnings.length > 0) lines.push("## Warnings", "", ...warnings.map((w) => `- ${w}`), "");
  return `${lines.join("\n")}\n`;
}

function readJson(path, fallback) {
  return existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : fallback;
}

function main() {
  const args = new Set(process.argv.slice(2));
  const allowExamples = args.has("--allow-examples");
  const csvPath = join(DATA_DIR, "doctors.csv");
  if (!existsSync(csvPath)) {
    console.error(`Missing ${csvPath}. Copy the header from data/doctors/doctors.example.csv.`);
    process.exit(1);
  }
  const result = buildDoctors({
    csvText: readFileSync(csvPath, "utf8"),
    sources: readJson(join(DATA_DIR, "sources.json"), []),
    specialties: readJson(join(SEED_DIR, "specialties.json"), []),
    facilities: readJson(join(SEED_DIR, "facilities.json"), []),
    locations: readJson(join(SEED_DIR, "locations.json"), []),
    allowExamples,
  });
  mkdirSync(dirname(REPORT_PATH), { recursive: true });
  writeFileSync(REPORT_PATH, renderReport(result, { allowExamples }));
  if (result.errors.length > 0) {
    console.error(`Doctor import failed with ${result.errors.length} error(s); nothing written:`);
    for (const e of result.errors) console.error(`  - ${e}`);
    process.exit(1);
  }
  if (!args.has("--dry-run")) {
    const body = result.doctors.length === 0 ? "[]\n" : `[\n${result.doctors.map((d) => `  ${JSON.stringify(d)}`).join(",\n")}\n]\n`;
    writeFileSync(join(SEED_DIR, "doctors.json"), body);
    const sourcesPath = join(SEED_DIR, "directory-sources.json");
    const merged = mergeSources(readJson(sourcesPath, []), result.sources);
    writeFileSync(sourcesPath, `[\n${merged.map((s) => `  ${JSON.stringify(s)}`).join(",\n")}\n]\n`);
  }
  console.log(`Imported ${result.doctors.length} doctor(s) with ${result.report.chambers} chamber(s).`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
