#!/usr/bin/env node
/**
 * Step 2 of the data pipeline (offline, deterministic):
 *
 *   data/raw/dgda-drug-registry.json
 *     → parse → normalise → validate → deduplicate
 *     → src/data/local/seed/{medicines,generics,manufacturers,sources,popular}.json
 *     → data/reports/dgda-import-report.{md,json}
 *
 *   docker compose run --rm app npm run data:build
 *
 * Rules are documented in docs/DATA-PIPELINE.md and implemented in ./lib/normalize.mjs.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  brandNameOf,
  classifyDosageForm,
  cleanText,
  genericNameOf,
  isVeterinary,
  keyOf,
  looksMalformed,
  manufacturerDisplayName,
  manufacturerKey,
  slugify,
  splitGenericContent,
} from "./lib/normalize.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");
const RAW_FILE = join(ROOT, "data/raw/dgda-drug-registry.json");
const SEED_DIR = join(ROOT, "src/data/local/seed");
const REPORT_DIR = join(ROOT, "data/reports");
const SOURCE_ID = "dgda-registry";
/** Forms whose slug omits the form (the most common, plain forms). */
const PLAIN_FORM_LABELS = new Set(["Tablet", "Capsule"]);
/** Strength components included in a slug; more than this and the strength is omitted. */
const MAX_SLUG_STRENGTH_PARTS = 3;
/**
 * Editorial homepage examples (not a popularity or quality ranking):
 * [brand, strength, dosage form label, manufacturer key].
 */
const POPULAR = [
  ["Napa", "500 mg", "Tablet", "beximcopharmaceuticalsltd"],
  ["Ace", "500 mg", "Tablet", "squarepharmaceuticalsplc"],
  ["Seclo", "20 mg", "Capsule", "squarepharmaceuticalsplc"],
  ["Sergel", "20 mg", "Capsule", "healthcarepharmaceuticalsltd"],
  ["Fexo", "120 mg", "Tablet", "squarepharmaceuticalsplc"],
  ["Monas", "10 mg", "Tablet", "theacmelaboratoriesltd"],
  ["Alatrol", "10 mg", "Tablet", "squarepharmaceuticalsplc"],
  ["Zimax", "500 mg", "Tablet", "squarepharmaceuticalsplc"],
];

const byText = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

/** Most frequent value; ties broken alphabetically (deterministic). */
function mostFrequent(values) {
  const counts = new Map();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || byText(a[0], b[0]))[0][0];
}

function countBy(items, keyFn) {
  const counts = {};
  for (const item of items) {
    const key = keyFn(item);
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return Object.fromEntries(
    Object.entries(counts).sort((a, b) => b[1] - a[1] || byText(a[0], b[0])),
  );
}

/** Writes a JSON array with one element per line (diffable, compact). */
function writeJsonLines(file, items) {
  const body = items.length
    ? `[\n${items.map((item) => `  ${JSON.stringify(item)}`).join(",\n")}\n]\n`
    : "[]\n";
  writeFileSync(file, body, "utf8");
}

export function buildCatalog(raw) {
  const { meta, records } = raw;
  const retrievedAt = meta.retrievedAt;
  const rejected = [];
  const candidates = [];

  // 1–3. Parse, normalise, validate.
  for (const record of records) {
    const reject = (reason) =>
      rejected.push({ id: record.id, reason, tradeName: record.tradeName });
    if (record.conceptClass !== "Drug") {
      reject("not_a_drug_product");
      continue;
    }
    if (record.retired) {
      reject("retired");
      continue;
    }
    if (looksMalformed(record.tradeName)) {
      reject("missing_or_malformed_brand");
      continue;
    }
    if (looksMalformed(record.company)) {
      reject("missing_or_malformed_manufacturer");
      continue;
    }
    if (isVeterinary(record)) {
      reject("veterinary_product");
      continue;
    }
    const form = classifyDosageForm(record.dosageForm);
    if ("excluded" in form) {
      reject(form.excluded.startsWith("non_human_form") ? "non_human_dosage_form" : form.excluded);
      continue;
    }
    const content = splitGenericContent(record.genericContentRaw);
    if (!content) {
      reject("missing_generic");
      continue;
    }
    if (content.malformedStrength !== undefined) {
      reject("malformed_strength");
      continue;
    }
    if (content.ingredients.some((name) => looksMalformed(name))) {
      reject("malformed_generic");
      continue;
    }

    const brandName = brandNameOf(record.tradeName, content.strength);
    const genericName = genericNameOf(content.ingredients);
    candidates.push({
      record,
      brandName,
      registeredName: cleanText(record.tradeName),
      genericName,
      genericKey: keyOf(genericName),
      strength: content.strength,
      dosageForm: form.category,
      dosageFormLabel: form.label,
      manufacturerName: manufacturerDisplayName(record.company),
      manufacturerKey: manufacturerKey(record.company),
    });
  }

  // 4. Deduplicate on product identity.
  const identity = (c) =>
    [
      keyOf(c.brandName),
      c.genericKey,
      keyOf(c.strength),
      keyOf(c.dosageFormLabel),
      c.manufacturerKey,
    ].join("|");
  candidates.sort((a, b) => byText(identity(a), identity(b)) || byText(a.record.id, b.record.id));
  const products = [];
  const duplicates = [];
  for (const candidate of candidates) {
    const previous = products[products.length - 1];
    if (previous && identity(previous) === identity(candidate)) {
      duplicates.push({
        id: candidate.record.id,
        keptId: previous.record.id,
        identity: identity(candidate),
      });
    } else {
      products.push(candidate);
    }
  }

  // 5. Manufacturers (display name = most frequent spelling per key).
  const manufacturerNames = new Map();
  for (const p of products) {
    manufacturerNames.set(p.manufacturerKey, [
      ...(manufacturerNames.get(p.manufacturerKey) ?? []),
      p.manufacturerName,
    ]);
  }
  const manufacturers = [];
  const manufacturerIdByKey = new Map();
  const usedManufacturerSlugs = new Set();
  for (const key of [...manufacturerNames.keys()].sort(byText)) {
    const name = mostFrequent(manufacturerNames.get(key));
    let slug = slugify(name) || key;
    while (usedManufacturerSlugs.has(slug)) slug = `${slug}-${key.slice(0, 6)}`;
    usedManufacturerSlugs.add(slug);
    const id = `mfr_${slug.replace(/-/g, "_")}`;
    manufacturerIdByKey.set(key, id);
    manufacturers.push({ id, slug, name });
  }

  // 6. Generics (combination products are their own generic).
  const genericNames = new Map();
  for (const p of products)
    genericNames.set(p.genericKey, [...(genericNames.get(p.genericKey) ?? []), p.genericName]);
  const generics = [];
  const genericIdByKey = new Map();
  const usedGenericSlugs = new Set();
  for (const key of [...genericNames.keys()].sort(byText)) {
    const name = mostFrequent(genericNames.get(key));
    let slug = slugify(name) || key;
    if (slug.length > 120) slug = slug.slice(0, 120).replace(/-+$/, "");
    while (usedGenericSlugs.has(slug)) slug = `${slug}-2`;
    usedGenericSlugs.add(slug);
    const id = `gen_${slug.replace(/-/g, "_")}`;
    genericIdByKey.set(key, id);
    generics.push({ id, slug, name });
  }

  // 7. Slugs: stable, readable, unique. Collisions get the manufacturer, then the record id.
  const ordered = [...products].sort(
    (a, b) =>
      byText(keyOf(a.brandName), keyOf(b.brandName)) ||
      byText(a.strength, b.strength) ||
      byText(a.dosageFormLabel, b.dosageFormLabel) ||
      byText(a.manufacturerKey, b.manufacturerKey) ||
      byText(a.record.id, b.record.id),
  );
  const usedSlugs = new Set();
  let slugCollisions = 0;
  const medicines = ordered.map((p) => {
    const formPart = PLAIN_FORM_LABELS.has(p.dosageFormLabel) ? "" : ` ${p.dosageFormLabel}`;
    // "500 mg" → "500mg" so slugs read like the product: napa-500mg, napa-120mg-5ml-suspension.
    // Multi-ingredient products (e.g. multivitamins) list many strengths; keep their slugs short.
    const strengthPart =
      p.strength.split("+").length > MAX_SLUG_STRENGTH_PARTS
        ? ""
        : p.strength.replace(/(\d)\s+(?=[A-Za-z%])/g, "$1");
    const base = slugify(`${p.brandName} ${strengthPart}${formPart}`) || slugify(p.registeredName);
    let slug = base;
    if (usedSlugs.has(slug)) {
      slugCollisions++;
      slug = `${base}-${slugify(p.manufacturerName.split(" ").slice(0, 2).join(" "))}`;
      if (usedSlugs.has(slug)) slug = `${base}-${slugify(p.record.id)}`;
    }
    usedSlugs.add(slug);

    const flaggedDar = Boolean(p.record.darQualityFlag);
    const medicine = {
      id: `dgda-${p.record.id}`,
      slug,
      brandName: p.brandName,
      genericId: genericIdByKey.get(p.genericKey),
      manufacturerId: manufacturerIdByKey.get(p.manufacturerKey),
      strength: p.strength,
      dosageForm: p.dosageForm,
      dosageFormLabel: p.dosageFormLabel,
      updatedAt: retrievedAt,
      provenance: {
        sourceId: SOURCE_ID,
        recordId: p.record.id,
        ...(flaggedDar || !p.record.darNumber ? {} : { darNumber: p.record.darNumber }),
        status: "registered",
      },
    };
    if (p.registeredName !== p.brandName) medicine.registeredName = p.registeredName;
    return medicine;
  });
  medicines.sort((a, b) => byText(a.slug, b.slug));

  // 8. Editorial popular list.
  const missingPopular = [];
  const popular = POPULAR.flatMap(([brand, strength, label, mfrKey]) => {
    const hit = ordered.find(
      (p) =>
        keyOf(p.brandName) === keyOf(brand) &&
        p.strength === strength &&
        p.dosageFormLabel === label &&
        p.manufacturerKey === mfrKey,
    );
    if (!hit) {
      missingPopular.push(`${brand} ${strength} ${label}`);
      return [];
    }
    return [`dgda-${hit.record.id}`];
  });

  const sources = [
    {
      id: SOURCE_ID,
      name: meta.source.name,
      publisher: meta.source.publisher,
      url: meta.source.documentation,
      apiUrl: meta.source.api,
      retrievedAt,
      note: "Official registration data. It does not include prices, pack sizes or prescription status.",
    },
  ];

  const genericById = new Map(generics.map((g) => [g.id, g.name]));
  const manufacturerById = new Map(manufacturers.map((m) => [m.id, m.name]));
  const report = {
    source: meta.source,
    retrievedAt,
    rawRecords: records.length,
    imported: medicines.length,
    rejected: rejected.length,
    rejectedByReason: countBy(rejected, (r) => r.reason),
    duplicatesRemoved: duplicates.length,
    slugCollisionsResolved: slugCollisions,
    generics: generics.length,
    manufacturers: manufacturers.length,
    missingOptionalFields: {
      strength: medicines.filter((m) => !m.strength).length,
      darNumberWithheldDueToQualityFlag: medicines.filter((m) => !m.provenance.darNumber).length,
      packSize: medicines.length,
      prescriptionStatus: medicines.length,
      category: medicines.length,
      description: medicines.length,
    },
    byDosageForm: countBy(medicines, (m) => m.dosageForm),
    byDosageFormLabel: countBy(medicines, (m) => m.dosageFormLabel),
    byManufacturer: countBy(medicines, (m) => manufacturerById.get(m.manufacturerId)),
    byGeneric: countBy(medicines, (m) => genericById.get(m.genericId)),
    missingPopular,
  };

  return { medicines, generics, manufacturers, sources, popular, report, rejected, duplicates };
}

function topList(counts, limit) {
  return Object.entries(counts)
    .slice(0, limit)
    .map(([name, count]) => `| ${name} | ${count} |`)
    .join("\n");
}

function renderReport(report) {
  return `# DGDA import report

Generated by \`scripts/data/build-catalog.mjs\` from the snapshot retrieved ${report.retrievedAt}.

Source: ${report.source.name} — ${report.source.publisher} (${report.source.api})

| Metric | Count |
|---|---|
| Raw registry records | ${report.rawRecords} |
| Imported medicine products | ${report.imported} |
| Rejected | ${report.rejected} |
| Duplicates removed | ${report.duplicatesRemoved} |
| Slug collisions resolved | ${report.slugCollisionsResolved} |
| Generics | ${report.generics} |
| Manufacturers | ${report.manufacturers} |

## Rejected by reason

| Reason | Count |
|---|---|
${topList(report.rejectedByReason, 50)}

## Missing optional fields

| Field | Records without it |
|---|---|
${topList(report.missingOptionalFields, 20)}

Pack size, prescription status, category and description are not published in the source and are not filled in.

## By dosage form (category)

| Category | Count |
|---|---|
${topList(report.byDosageForm, 50)}

## By manufacturer (top 40)

| Manufacturer | Count |
|---|---|
${topList(report.byManufacturer, 40)}

## By generic (top 40)

| Generic | Count |
|---|---|
${topList(report.byGeneric, 40)}
${report.missingPopular.length ? `\n## Popular examples not found\n\n${report.missingPopular.map((p) => `- ${p}`).join("\n")}\n` : ""}`;
}

function main() {
  const raw = JSON.parse(readFileSync(RAW_FILE, "utf8"));
  const result = buildCatalog(raw);
  mkdirSync(SEED_DIR, { recursive: true });
  mkdirSync(REPORT_DIR, { recursive: true });
  writeJsonLines(join(SEED_DIR, "medicines.json"), result.medicines);
  writeJsonLines(join(SEED_DIR, "generics.json"), result.generics);
  writeJsonLines(join(SEED_DIR, "manufacturers.json"), result.manufacturers);
  writeJsonLines(join(SEED_DIR, "sources.json"), result.sources);
  writeFileSync(join(SEED_DIR, "popular.json"), `${JSON.stringify(result.popular, null, 2)}\n`);
  writeFileSync(
    join(REPORT_DIR, "dgda-import-report.json"),
    `${JSON.stringify({ ...result.report, rejectedRecords: result.rejected, duplicateRecords: result.duplicates }, null, 2)}\n`,
  );
  writeFileSync(join(REPORT_DIR, "dgda-import-report.md"), renderReport(result.report));
  const r = result.report;
  console.log(
    `Imported ${r.imported} of ${r.rawRecords} (rejected ${r.rejected}, duplicates ${r.duplicatesRemoved}); ` +
      `${r.generics} generics, ${r.manufacturers} manufacturers.`,
  );
  if (r.missingPopular.length)
    console.warn(`Popular examples not found: ${r.missingPopular.join("; ")}`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
