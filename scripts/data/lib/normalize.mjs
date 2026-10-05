/**
 * Pure normalisation rules for DGDA registry records. No I/O, no dependencies,
 * deterministic. Used by build-catalog.mjs and covered by tests/data-pipeline.test.ts.
 *
 * Principle: clean formatting only; never invent or infer medical information.
 */

/** Collapse whitespace, normalise Unicode, strip control characters. */
export function cleanText(value) {
  return String(value ?? "")
    .normalize("NFKC")
    .replace(/[\u0000-\u001f\u007f\u00a0\u200b-\u200d\ufeff]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Lower-case alphanumeric key for duplicate detection. */
export function keyOf(value) {
  return cleanText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

export function slugify(value) {
  return cleanText(value)
    .toLowerCase()
    .replace(/\+/g, " ")
    .replace(/%/g, " pct ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ------------------------------------------------------------------ strength

/**
 * "  .5 %" → "0.5%", "200 mg/5 ml" → "200 mg/5 mL", "140 mg + 35 mg/ml" → "140 mg + 35 mg/mL".
 * Concentrations and units are preserved; only spacing and obvious notation are normalised.
 */
export function normalizeStrength(value) {
  let s = cleanText(value);
  if (!s) return "";
  s = s
    .replace(/(^|[\s+/(])\.(\d)/g, "$10.$2") // leading decimal point
    .replace(/\s*\/\s*/g, "/")
    .replace(/\s*\+\s*/g, " + ")
    .replace(/(\d)\s*%/g, "$1%")
    .replace(/\bml\b/gi, "mL")
    .replace(/\bmcg\b/gi, "mcg")
    .replace(/\bmg\b/gi, "mg")
    .replace(/\biu\b/gi, "IU");
  return s;
}

const STRENGTH_START = /^(?:\d|\.\d)/;

/**
 * Splits "Amoxicillin + Clavulanic Acid  140 mg + 35 mg/ml" into ingredients and strength.
 * The registry separates the two parts with two or more spaces.
 */
export function splitGenericContent(raw) {
  const text = String(raw ?? "")
    .replace(/\u00a0/g, " ")
    .trim();
  if (!text) return null;
  let genericPart = text;
  let strengthPart = "";
  const parts = text.split(/\s{2,}/);
  // The strength starts at the first double-space-separated part that begins with a number
  // (generic names can themselves contain double spaces: "Pentosan Polysulfate  Sodium  100 mg").
  const strengthIndex = parts.findIndex(
    (part, index) => index > 0 && STRENGTH_START.test(part.trim()),
  );
  if (strengthIndex > 0) {
    genericPart = parts.slice(0, strengthIndex).join(" ");
    strengthPart = parts.slice(strengthIndex).join(" ");
  } else if (parts.length >= 2) {
    genericPart = parts[0];
    strengthPart = parts.slice(1).join(" ");
  } else {
    // Fallback: strength starts at the first token beginning with a digit.
    const match = text.match(/^(.*?[A-Za-z)\]])\s+((?:\d|\.\d).*)$/);
    if (match) {
      genericPart = match[1];
      strengthPart = match[2];
    }
  }
  const ingredients = cleanText(genericPart)
    .split(/\s+\+\s+/)
    .map((name) => cleanText(name))
    .filter(Boolean);
  const strength = normalizeStrength(strengthPart);
  if (ingredients.length === 0) return null;
  if (strength && !STRENGTH_START.test(strength.replace(/^0\./, "0")))
    return { ingredients, strength: "", malformedStrength: strength };
  return { ingredients, strength };
}

export function genericNameOf(ingredients) {
  return ingredients.join(" + ");
}

// --------------------------------------------------------------- dosage form

const ACRONYMS = new Set([
  "sr",
  "xr",
  "er",
  "cr",
  "mr",
  "dr",
  "iv",
  "im",
  "sc",
  "od",
  "odt",
  "mups",
  "ec",
  "ds",
  "hfa",
  "mdi",
  "dpi",
]);

/** "sr tablet" → "SR Tablet", "eye and ear drops" → "Eye and Ear Drops". */
export function formatDosageFormLabel(raw) {
  const words = cleanText(raw).toLowerCase().split(" ");
  return words
    .map((word, index) =>
      word
        .split("/")
        .map((part) => {
          if (ACRONYMS.has(part)) return part.toUpperCase();
          if (index > 0 && ["and", "for", "of", "in", "with"].includes(part)) return part;
          return part.charAt(0).toUpperCase() + part.slice(1);
        })
        .join("/"),
    )
    .join(" ");
}

/** Raw-label spelling fixes seen in the registry (formatting only). */
const LABEL_FIXES = { "Sached Powder": "Sachet Powder" };

/**
 * Controlled categories. Order matters: first match wins. The precise label is
 * always kept separately, so e.g. "SR Tablet" is never merged with "Tablet".
 */
const FORM_RULES = [
  ["inhaler", /inhal|aerosol|rotacap|nebuli[sz]|respules|evohaler|accuhaler/],
  ["injection", /inject|infusion|vial|ampoule|\biv\b|\bim\b/],
  ["drops", /drop/],
  ["spray", /spray/],
  ["suppository", /suppositor|pessar/],
  ["patch", /patch|transdermal/],
  ["capsule", /capsule|\bcap\b/],
  ["tablet", /tablet|\btab\b|caplet|lozenge/],
  ["suspension", /suspension/],
  ["syrup", /syrup|elixir/],
  ["granules", /granule/],
  ["powder", /powder|sachet|saline/],
  ["cream", /cream/],
  ["ointment", /ointment/],
  ["gel", /\bgel\b|jelly/],
  ["lotion", /lotion/],
  ["mouthwash", /mouth ?wash|gargle/],
  ["shampoo", /shampoo/],
  ["solution", /solution|liquid|emulsion|tincture|paint|linctus|concentrate|lavage|rub|scrub|oil/],
];

/** Must match DOSAGE_FORMS in src/domain/types.ts (checked by tests). */
export const DOSAGE_FORM_CATEGORIES = [...FORM_RULES.map(([category]) => category), "other"];

/** Non-human-medicine registry entries that are excluded from the public catalogue. */
const EXCLUDED_FORMS =
  /raw material|bolus|water soluble powder|premix|feed|pellet|gas\b|bulk|api\b/;
const VETERINARY_NAME = /(^|[\s(\-])vet\.?($|[\s)\-])|veterinary/i;

/** @returns {{category: string, label: string} | {excluded: string}} */
export function classifyDosageForm(raw) {
  const cleaned = cleanText(raw);
  if (!cleaned) return { excluded: "missing_dosage_form" };
  const lower = cleaned.toLowerCase();
  if (EXCLUDED_FORMS.test(lower)) return { excluded: `non_human_form:${cleaned}` };
  const label = LABEL_FIXES[formatDosageFormLabel(cleaned)] ?? formatDosageFormLabel(cleaned);
  for (const [category, pattern] of FORM_RULES) {
    if (pattern.test(lower)) return { category, label };
  }
  return { category: "other", label };
}

/**
 * DAR numbers end in a 3-digit product-category code. In the registry snapshot,
 * category 077 contains the veterinary products (boluses, livestock powders and
 * almost all products explicitly named "Vet"), while no other category contains
 * more than a handful of "Vet"-named products. This is an observed pattern, not a
 * published definition; the name rule below catches the remaining "Vet" products.
 */
const VETERINARY_DAR_CATEGORY = "077";

export function isVeterinary(record) {
  return (
    String(record.darNumber ?? "")
      .trim()
      .endsWith(`-${VETERINARY_DAR_CATEGORY}`) ||
    VETERINARY_NAME.test(record.tradeName) ||
    VETERINARY_NAME.test(record.company)
  );
}

// -------------------------------------------------------------- manufacturer

const LEGAL_SUFFIX = /\b(ltd|limited|plc|inc|llc|pvt|corporation|corp|co)\b\.?/i;

/**
 * "Square Pharmaceuticals PLC, Pabna" → "Square Pharmaceuticals PLC";
 * "Eskayef Pharmaceuticals Ltd. Mirpur." → "Eskayef Pharmaceuticals Ltd."
 * (factory/site suffixes are dropped; the company name itself is not changed).
 */
export function manufacturerDisplayName(company) {
  let name = cleanText(company).split(",")[0].trim();
  const suffix = name.match(LEGAL_SUFFIX);
  if (suffix && suffix.index !== undefined) {
    name = name.slice(0, suffix.index + suffix[0].length).trim();
  }
  return name.replace(/\s+\.$/, ".");
}

export function manufacturerKey(company) {
  return keyOf(
    manufacturerDisplayName(company)
      .toLowerCase()
      .replace(/\blimited\b/g, "ltd")
      .replace(/\bpublic limited company\b/g, "plc"),
  );
}

// --------------------------------------------------------------------- brand

/**
 * The registry often appends the strength to the trade name ("Acumet 50",
 * "Naproxen-500"). The number is removed from the displayed brand only when it
 * equals the leading number of the registered strength; the registered name is
 * kept unchanged in `registeredName`.
 */
export function brandNameOf(tradeName, strength) {
  const name = cleanText(tradeName);
  const firstNumber = strength.match(/^(\d+(?:\.\d+)?)/)?.[1];
  if (!firstNumber) return name;
  const pattern = new RegExp(
    `^(.*?[A-Za-z)])[\\s-]*${firstNumber.replace(".", "\\.")}\\s*(mg|mcg|gm|g|iu|ml)?$`,
    "i",
  );
  const match = name.match(pattern);
  return match ? cleanText(match[1]).replace(/[\s-]+$/, "") : name;
}

/** Detects placeholder/garbled values that must not be published. */
export function looksMalformed(value) {
  const text = cleanText(value);
  return (
    !text ||
    /^(n\/?a|null|none|test|xxx+|-+|\?+)$/i.test(text) ||
    /\uFFFD/.test(text) ||
    !/[A-Za-z]/.test(text)
  );
}
