#!/usr/bin/env node
/**
 * Generates the Phase-1 SAMPLE dataset in src/data/local/seed/.
 *
 *   docker compose run --rm app node scripts/generate-seed-data.mjs
 *
 * Output is deterministic (seeded PRNG) and committed. All prices and
 * availability are fictional sample values (source: "sample"). Pharmacies are
 * fictional. Brand/manufacturer/strength/prescription data are illustrative and
 * must be verified against an authoritative source before any public launch.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), "../src/data/local/seed");
const PRNG_SEED = 20261001;
const PRICE_DATE_FROM = Date.UTC(2026, 8, 1); // 1 Sep 2026
const PRICE_DATE_DAYS = 30;
const CATALOGUE_UPDATED_AT = "2026-10-01T00:00:00.000Z";
const MIN_PHARMACIES_PER_MEDICINE = 5;
const MAX_PHARMACIES_PER_MEDICINE = 8;
/** Medicines intentionally left without prices to exercise the empty state. */
const UNPRICED = new Set(["thyrox-100mcg", "esoral-40mg"]);

// ---------------------------------------------------------------- generics
const GENERICS = {
  paracetamol: ["Paracetamol", "Analgesic and antipyretic."],
  "paracetamol-caffeine": ["Paracetamol + Caffeine", "Paracetamol combined with caffeine."],
  omeprazole: ["Omeprazole", "Proton pump inhibitor."],
  esomeprazole: ["Esomeprazole", "Proton pump inhibitor."],
  pantoprazole: ["Pantoprazole", "Proton pump inhibitor."],
  rabeprazole: ["Rabeprazole", "Proton pump inhibitor."],
  fexofenadine: ["Fexofenadine Hydrochloride", "Second-generation antihistamine."],
  cetirizine: ["Cetirizine Hydrochloride", "Second-generation antihistamine."],
  montelukast: ["Montelukast", "Leukotriene receptor antagonist."],
  amlodipine: ["Amlodipine", "Calcium channel blocker."],
  losartan: ["Losartan Potassium", "Angiotensin II receptor blocker."],
  metformin: ["Metformin Hydrochloride", "Biguanide antidiabetic."],
  atorvastatin: ["Atorvastatin", "HMG-CoA reductase inhibitor (statin)."],
  azithromycin: ["Azithromycin", "Macrolide antibiotic."],
  cefixime: ["Cefixime", "Third-generation cephalosporin antibiotic."],
  ciprofloxacin: ["Ciprofloxacin", "Fluoroquinolone antibiotic."],
  amoxicillin: ["Amoxicillin", "Penicillin antibiotic."],
  metronidazole: ["Metronidazole", "Nitroimidazole antimicrobial."],
  domperidone: ["Domperidone", "Dopamine antagonist."],
  ketorolac: ["Ketorolac Tromethamine", "Non-steroidal anti-inflammatory drug (NSAID)."],
  diclofenac: ["Diclofenac Sodium", "Non-steroidal anti-inflammatory drug (NSAID)."],
  "vitamin-c": ["Ascorbic Acid (Vitamin C)", "Vitamin."],
  "calcium-vitamin-d3": ["Calcium Carbonate + Vitamin D3", "Mineral and vitamin combination."],
  salbutamol: ["Salbutamol", "Short-acting beta-2 agonist."],
  clopidogrel: ["Clopidogrel", "Antiplatelet agent."],
  levothyroxine: ["Levothyroxine Sodium", "Thyroid hormone."],
};

/** Prescription classification is per generic in this sample dataset. */
const PRESCRIPTION_REQUIRED = new Set([
  "omeprazole",
  "esomeprazole",
  "pantoprazole",
  "rabeprazole",
  "montelukast",
  "amlodipine",
  "losartan",
  "metformin",
  "atorvastatin",
  "azithromycin",
  "cefixime",
  "ciprofloxacin",
  "amoxicillin",
  "metronidazole",
  "domperidone",
  "ketorolac",
  "diclofenac",
  "salbutamol",
  "clopidogrel",
  "levothyroxine",
]);

const CATEGORY = {
  paracetamol: "Pain & fever",
  "paracetamol-caffeine": "Pain & fever",
  ketorolac: "Pain & inflammation",
  diclofenac: "Pain & inflammation",
  omeprazole: "Gastrointestinal",
  esomeprazole: "Gastrointestinal",
  pantoprazole: "Gastrointestinal",
  rabeprazole: "Gastrointestinal",
  domperidone: "Gastrointestinal",
  fexofenadine: "Allergy",
  cetirizine: "Allergy",
  montelukast: "Respiratory",
  salbutamol: "Respiratory",
  amlodipine: "Cardiovascular",
  losartan: "Cardiovascular",
  atorvastatin: "Cardiovascular",
  clopidogrel: "Cardiovascular",
  metformin: "Diabetes",
  levothyroxine: "Hormones",
  azithromycin: "Antibiotics",
  cefixime: "Antibiotics",
  ciprofloxacin: "Antibiotics",
  amoxicillin: "Antibiotics",
  metronidazole: "Anti-infectives",
  "vitamin-c": "Vitamins & minerals",
  "calcium-vitamin-d3": "Vitamins & minerals",
};

// ----------------------------------------------------------- manufacturers
const MANUFACTURERS = {
  beximco: "Beximco Pharmaceuticals Ltd.",
  square: "Square Pharmaceuticals PLC",
  acme: "The ACME Laboratories Ltd.",
  opsonin: "Opsonin Pharma Ltd.",
  eskayef: "Eskayef Pharmaceuticals Ltd.",
  renata: "Renata PLC",
  incepta: "Incepta Pharmaceuticals Ltd.",
  healthcare: "Healthcare Pharmaceuticals Ltd.",
  general: "General Pharmaceuticals Ltd.",
};

// --------------------------------------------------------------- catalogue
// [brand, generic, manufacturer, strength, dosageForm, packQty, packUnit, samplePackPriceBDT, note?]
const T = (q = 10) => [q, "tablets"];
const C = (q = 10) => [q, "capsules"];
const ML = (q) => [q, "ml"];
const CATALOGUE = [
  ["Napa", "paracetamol", "beximco", "500 mg", "tablet", ...T(), 12],
  ["Napa", "paracetamol", "beximco", "120 mg/5 ml", "suspension", ...ML(60), 35],
  [
    "Napa Extend",
    "paracetamol",
    "beximco",
    "665 mg",
    "tablet",
    ...T(),
    20,
    "Extended-release tablet.",
  ],
  ["Napa Rapid", "paracetamol", "beximco", "500 mg", "tablet", ...T(), 15],
  ["Ace", "paracetamol", "square", "500 mg", "tablet", ...T(), 12],
  ["Ace", "paracetamol", "square", "120 mg/5 ml", "suspension", ...ML(60), 35],
  ["Ace XR", "paracetamol", "square", "665 mg", "tablet", ...T(), 20, "Extended-release tablet."],
  ["Fast", "paracetamol", "acme", "500 mg", "tablet", ...T(), 11.5],
  ["Renova", "paracetamol", "opsonin", "500 mg", "tablet", ...T(), 11],
  ["Reset", "paracetamol", "incepta", "500 mg", "tablet", ...T(), 11.5],
  ["Napa Extra", "paracetamol-caffeine", "beximco", "500 mg + 65 mg", "tablet", ...T(), 25],
  ["Ace Plus", "paracetamol-caffeine", "square", "500 mg + 65 mg", "tablet", ...T(), 25],
  ["Seclo", "omeprazole", "square", "20 mg", "capsule", ...C(), 60],
  ["Seclo", "omeprazole", "square", "40 mg", "capsule", ...C(), 90],
  ["Losectil", "omeprazole", "eskayef", "20 mg", "capsule", ...C(), 50],
  ["Losectil", "omeprazole", "eskayef", "40 mg", "capsule", ...C(), 80],
  ["Proceptin", "omeprazole", "general", "20 mg", "capsule", ...C(), 50],
  ["Sergel", "esomeprazole", "healthcare", "20 mg", "capsule", ...C(), 70],
  ["Sergel", "esomeprazole", "healthcare", "40 mg", "capsule", ...C(), 100],
  ["Maxpro", "esomeprazole", "renata", "20 mg", "tablet", ...T(), 70],
  ["Maxpro", "esomeprazole", "renata", "40 mg", "tablet", ...T(), 100],
  ["Nexum", "esomeprazole", "square", "20 mg", "tablet", ...T(), 70],
  ["Nexum", "esomeprazole", "square", "40 mg", "tablet", ...T(), 100],
  ["Esoral", "esomeprazole", "eskayef", "20 mg", "capsule", ...C(), 65],
  ["Esoral", "esomeprazole", "eskayef", "40 mg", "capsule", ...C(), 95],
  ["Pantonix", "pantoprazole", "incepta", "20 mg", "tablet", ...T(), 50],
  ["Pantonix", "pantoprazole", "incepta", "40 mg", "tablet", ...T(), 80],
  ["Finix", "rabeprazole", "opsonin", "20 mg", "tablet", ...T(), 70],
  ["Fexo", "fexofenadine", "square", "120 mg", "tablet", ...T(), 90],
  ["Fexo", "fexofenadine", "square", "180 mg", "tablet", ...T(), 120],
  ["Fexo", "fexofenadine", "square", "30 mg/5 ml", "suspension", ...ML(50), 80],
  ["Fenadin", "fexofenadine", "renata", "120 mg", "tablet", ...T(), 80],
  ["Fenadin", "fexofenadine", "renata", "180 mg", "tablet", ...T(), 110],
  ["Alatrol", "cetirizine", "square", "10 mg", "tablet", ...T(), 30],
  ["Alatrol", "cetirizine", "square", "5 mg/5 ml", "syrup", ...ML(60), 35],
  ["Atrizin", "cetirizine", "beximco", "10 mg", "tablet", ...T(), 28],
  ["Monas", "montelukast", "acme", "10 mg", "tablet", ...T(), 160],
  ["Monas", "montelukast", "acme", "5 mg", "tablet", ...T(), 100, "Chewable tablet."],
  ["Monas", "montelukast", "acme", "4 mg", "tablet", ...T(), 80, "Chewable tablet."],
  ["Amdocal", "amlodipine", "beximco", "5 mg", "tablet", ...T(), 50],
  ["Amdocal", "amlodipine", "beximco", "10 mg", "tablet", ...T(), 80],
  ["Camlodin", "amlodipine", "square", "5 mg", "tablet", ...T(), 50],
  ["Camlodin", "amlodipine", "square", "10 mg", "tablet", ...T(), 80],
  ["Osartil", "losartan", "incepta", "25 mg", "tablet", ...T(), 50],
  ["Osartil", "losartan", "incepta", "50 mg", "tablet", ...T(), 80],
  ["Angilock", "losartan", "square", "25 mg", "tablet", ...T(), 50],
  ["Angilock", "losartan", "square", "50 mg", "tablet", ...T(), 80],
  ["Comet", "metformin", "square", "500 mg", "tablet", ...T(), 40],
  ["Comet", "metformin", "square", "850 mg", "tablet", ...T(), 60],
  ["Comet", "metformin", "square", "1000 mg", "tablet", ...T(), 70],
  ["Atova", "atorvastatin", "beximco", "10 mg", "tablet", ...T(), 100],
  ["Atova", "atorvastatin", "beximco", "20 mg", "tablet", ...T(), 160],
  ["Atova", "atorvastatin", "beximco", "40 mg", "tablet", ...T(), 250],
  ["Zimax", "azithromycin", "square", "500 mg", "tablet", ...T(6), 210],
  ["Zimax", "azithromycin", "square", "200 mg/5 ml", "suspension", ...ML(15), 120],
  ["Azithrocin", "azithromycin", "beximco", "500 mg", "tablet", ...T(6), 200],
  ["Tridosil", "azithromycin", "incepta", "500 mg", "tablet", ...T(6), 200],
  ["Cef-3", "cefixime", "square", "200 mg", "capsule", ...C(), 450],
  ["Cef-3", "cefixime", "square", "100 mg/5 ml", "suspension", ...ML(50), 260],
  ["Triocim", "cefixime", "eskayef", "200 mg", "capsule", ...C(), 420],
  ["Ciprocin", "ciprofloxacin", "square", "250 mg", "tablet", ...T(), 80],
  ["Ciprocin", "ciprofloxacin", "square", "500 mg", "tablet", ...T(), 150],
  ["Neofloxin", "ciprofloxacin", "beximco", "250 mg", "tablet", ...T(), 75],
  ["Neofloxin", "ciprofloxacin", "beximco", "500 mg", "tablet", ...T(), 140],
  ["Moxacil", "amoxicillin", "square", "250 mg", "capsule", ...C(), 45],
  ["Moxacil", "amoxicillin", "square", "500 mg", "capsule", ...C(), 80],
  ["Tycil", "amoxicillin", "beximco", "500 mg", "capsule", ...C(), 75],
  ["Amodis", "metronidazole", "square", "400 mg", "tablet", ...T(), 25],
  ["Amodis", "metronidazole", "square", "200 mg/5 ml", "suspension", ...ML(60), 45],
  ["Filmet", "metronidazole", "beximco", "400 mg", "tablet", ...T(), 24],
  ["Filmet", "metronidazole", "beximco", "200 mg/5 ml", "suspension", ...ML(60), 42],
  ["Omidon", "domperidone", "opsonin", "10 mg", "tablet", ...T(), 30],
  ["Rolac", "ketorolac", "renata", "10 mg", "tablet", ...T(), 120],
  ["Clofenac", "diclofenac", "square", "50 mg", "tablet", ...T(), 25],
  ["Ceevit", "vitamin-c", "square", "250 mg", "tablet", ...T(), 15, "Chewable tablet."],
  ["Calbo-D", "calcium-vitamin-d3", "square", "500 mg + 200 IU", "tablet", ...T(), 90],
  ["Azmasol", "salbutamol", "beximco", "100 mcg/puff", "inhaler", 200, "doses", 250],
  ["Anclog", "clopidogrel", "square", "75 mg", "tablet", ...T(), 120],
  ["Thyrox", "levothyroxine", "square", "25 mcg", "tablet", ...T(), 50],
  ["Thyrox", "levothyroxine", "square", "50 mcg", "tablet", ...T(), 60],
  ["Thyrox", "levothyroxine", "square", "100 mcg", "tablet", ...T(), 80],
];

// -------------------------------------------------------------- pharmacies
const PHARMACIES = [
  ["Shapla Pharmacy", "Dhanmondi", "Dhaka"],
  ["Nirob Medicine Corner", "Mirpur", "Dhaka"],
  ["Lifeline Pharma Point", "Uttara", "Dhaka"],
  ["Green Leaf Pharmacy", "Gulshan", "Dhaka"],
  ["Padma Medicine Store", "Mohammadpur", "Dhaka"],
  ["Care Plus Drug House", "Agrabad", "Chattogram"],
  ["Karnaphuli Medicine Point", "Nasirabad", "Chattogram"],
  ["City Health Pharmacy", "Zindabazar", "Sylhet"],
  ["Meghna Drug Centre", "Shaheb Bazar", "Rajshahi"],
  ["Jamuna Health Pharmacy", "Sonadanga", "Khulna"],
];

// ------------------------------------------------------------------ helpers
function mulberry32(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const random = mulberry32(PRNG_SEED);
const randomInt = (min, max) => min + Math.floor(random() * (max - min + 1));

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** D8: tablets/capsules → brand-strength; other forms append the form. */
function medicineSlug(brand, strength, form) {
  const base = `${slugify(brand.replace(/\s+/g, "-"))}-${slugify(strength.replace(/\s*\+\s*/g, "-").replace(/\//g, "-"))}`;
  return form === "tablet" || form === "capsule" ? base : `${base}-${form}`;
}

const FORM_LABEL = {
  tablet: "tablet",
  capsule: "capsule",
  suspension: "oral suspension",
  syrup: "syrup",
  inhaler: "inhaler",
};

function pickAvailability() {
  const r = random();
  if (r < 0.72) return "in_stock";
  if (r < 0.86) return "limited";
  if (r < 0.94) return "out_of_stock";
  return "unknown";
}

/** Sample pharmacy price: up to 8% below the sample pack price, rounded to ৳0.25. */
function samplePrice(base) {
  const discount = random() < 0.35 ? 0 : random() * 0.08;
  return Math.max(0.25, Math.round(base * (1 - discount) * 4) / 4);
}

function sampleDate() {
  return new Date(PRICE_DATE_FROM + randomInt(0, PRICE_DATE_DAYS - 1) * 86_400_000).toISOString();
}

// ------------------------------------------------------------------ build
const generics = Object.entries(GENERICS).map(([key, [name, description]]) => ({
  id: `gen_${key.replace(/-/g, "_")}`,
  slug: key,
  name,
  description,
}));
const genericIdByKey = Object.fromEntries(generics.map((g) => [g.slug, g.id]));
const genericNameByKey = Object.fromEntries(Object.entries(GENERICS).map(([k, [n]]) => [k, n]));

const manufacturers = Object.entries(MANUFACTURERS).map(([key, name]) => ({
  id: `mfr_${key}`,
  slug: slugify(name.replace(/\s+/g, "-").replace(/\.$/, "")),
  name,
}));

const medicines = [];
const basePrices = new Map();
for (const [
  brand,
  genericKey,
  mfrKey,
  strength,
  form,
  packQty,
  packUnit,
  price,
  note,
] of CATALOGUE) {
  const slug = medicineSlug(brand, strength, form);
  const id = `med_${slug.replace(/-/g, "_")}`;
  const description = [
    `${brand} ${strength} ${FORM_LABEL[form]} by ${MANUFACTURERS[mfrKey]}, containing ${genericNameByKey[genericKey]}.`,
    note,
  ]
    .filter(Boolean)
    .join(" ");
  medicines.push({
    id,
    slug,
    brandName: brand,
    genericId: genericIdByKey[genericKey],
    manufacturerId: `mfr_${mfrKey}`,
    strength,
    dosageForm: form,
    packSize: { quantity: packQty, unit: packUnit },
    category: CATEGORY[genericKey],
    description,
    prescriptionRequired: PRESCRIPTION_REQUIRED.has(genericKey),
    updatedAt: CATALOGUE_UPDATED_AT,
  });
  basePrices.set(id, price);
}

const pharmacies = PHARMACIES.map(([name, area, city]) => {
  const slug = slugify(name.replace(/\s+/g, "-"));
  return {
    id: `ph_${slug.replace(/-/g, "_")}`,
    slug,
    name,
    area,
    city,
    address: `Sample address, ${area}, ${city}`,
    description: "Fictional pharmacy created for this demonstration. Not a real business.",
  };
});

const prices = [];
for (const medicine of medicines) {
  if (UNPRICED.has(medicine.slug)) continue;
  const count = randomInt(MIN_PHARMACIES_PER_MEDICINE, MAX_PHARMACIES_PER_MEDICINE);
  const shuffled = [...pharmacies].sort(() => random() - 0.5).slice(0, count);
  for (const pharmacy of shuffled) {
    prices.push({
      id: `price_${medicine.id.slice(4)}__${pharmacy.id.slice(3)}`,
      medicineId: medicine.id,
      pharmacyId: pharmacy.id,
      amount: samplePrice(basePrices.get(medicine.id)),
      currency: "BDT",
      availability: pickAvailability(),
      source: "sample",
      updatedAt: sampleDate(),
    });
  }
}

/** Curated homepage list (ids). */
const POPULAR_SLUGS = [
  "napa-500mg",
  "ace-500mg",
  "seclo-20mg",
  "fexo-120mg",
  "monas-10mg",
  "sergel-20mg",
  "alatrol-10mg",
  "zimax-500mg",
];
const bySlug = new Map(medicines.map((m) => [m.slug, m.id]));
const popularMedicineIds = POPULAR_SLUGS.map((slug) => {
  const id = bySlug.get(slug);
  if (!id) throw new Error(`Unknown popular slug: ${slug}`);
  return id;
});

// ------------------------------------------------------------------ write
mkdirSync(OUT_DIR, { recursive: true });
const write = (name, data) =>
  writeFileSync(join(OUT_DIR, name), `${JSON.stringify(data, null, 2)}\n`, "utf8");
write("generics.json", generics);
write("manufacturers.json", manufacturers);
write("medicines.json", medicines);
write("pharmacies.json", pharmacies);
write("prices.json", prices);
write("popular.json", popularMedicineIds);

console.log(
  `Seed data: ${medicines.length} medicines, ${generics.length} generics, ` +
    `${manufacturers.length} manufacturers, ${pharmacies.length} pharmacies, ${prices.length} prices.`,
);
