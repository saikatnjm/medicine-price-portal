import { isUnitDosageForm } from "../../domain/medicine";
import type { Generic, Medicine } from "../../domain/types";
import { normalizeSearchText } from "../../lib/text";

/**
 * In-memory search for the local catalogue (tens of thousands of products).
 * Replaced by the backend / a search engine later; only MedicineRepository.search
 * depends on it. The index is built once and pre-sorted, so a query is a single
 * linear scan with no string collation.
 */

export interface IndexedMedicine {
  medicine: Medicine;
  /** Position in the default (deterministic) display order. */
  order: number;
  brand: string;
  brandWithStrength: string;
  brandCompact: string;
  brandWithStrengthCompact: string;
  generic: string;
  words: string[];
}

const collator = new Intl.Collator("en", { numeric: true, sensitivity: "base" });

const ingredientCount = (medicine: Medicine) => medicine.strength.split("+").length;

/**
 * Brand, then tablets/capsules before other forms, then single-ingredient before
 * combinations, then strength (numeric), then slug. A display order, not a ranking
 * of medical merit.
 */
export function compareMedicines(a: Medicine, b: Medicine): number {
  return (
    collator.compare(a.brandName, b.brandName) ||
    Number(isUnitDosageForm(b)) - Number(isUnitDosageForm(a)) ||
    ingredientCount(a) - ingredientCount(b) ||
    collator.compare(a.strength, b.strength) ||
    collator.compare(a.dosageFormLabel, b.dosageFormLabel) ||
    (a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0)
  );
}

const compact = (text: string) => text.replace(/ /g, "");

export function buildSearchIndex(
  medicines: readonly Medicine[],
  genericsById: ReadonlyMap<string, Generic>,
): IndexedMedicine[] {
  return [...medicines].sort(compareMedicines).map((medicine, order) => {
    const generic = normalizeSearchText(genericsById.get(medicine.genericId)?.name ?? "");
    const brand = normalizeSearchText(medicine.brandName);
    const brandWithStrength = normalizeSearchText(`${medicine.brandName} ${medicine.strength}`);
    const extra = normalizeSearchText(`${medicine.registeredName ?? ""} ${medicine.slug}`);
    return {
      medicine,
      order,
      brand,
      brandWithStrength,
      brandCompact: compact(brand),
      brandWithStrengthCompact: compact(brandWithStrength),
      generic,
      words: [...new Set(`${brandWithStrength} ${generic} ${extra}`.split(" ").filter(Boolean))],
    };
  });
}

/** Lower is better. */
function rank(entry: IndexedMedicine, query: string, compactQuery: string): number {
  if (entry.brand === query || entry.brandCompact === compactQuery) return 0;
  if (
    entry.brand.startsWith(query) ||
    entry.brandWithStrength.startsWith(query) ||
    entry.brandWithStrengthCompact.startsWith(compactQuery)
  ) {
    return 1;
  }
  if (entry.brand.includes(query)) return 2;
  if (entry.generic === query) return 3;
  if (entry.generic.startsWith(query)) return 4;
  return 5;
}

/** Minimum length for matching a query with its spaces removed ("napaextra"). */
const MIN_COMPACT_LENGTH = 3;

/**
 * A medicine matches when every query token is a prefix of some indexed word
 * (brand, strength, generic, registered name, slug), or when the query without
 * spaces is a prefix of the brand without spaces ("napaextra", "cef3").
 * Prefix matching avoids noisy mid-word hits ("ace" inside "paracetamol").
 */
export function searchIndex(index: readonly IndexedMedicine[], rawQuery: string): Medicine[] {
  const query = normalizeSearchText(rawQuery);
  if (!query) return [];
  const tokens = query.split(" ");
  const compactQuery = compact(query);
  const useCompact = compactQuery.length >= MIN_COMPACT_LENGTH;

  const hits: { entry: IndexedMedicine; score: number }[] = [];
  for (const entry of index) {
    const tokenMatch = tokens.every((token) => entry.words.some((word) => word.startsWith(token)));
    const compactMatch =
      useCompact &&
      (entry.brandCompact.startsWith(compactQuery) ||
        entry.brandWithStrengthCompact.startsWith(compactQuery));
    if (tokenMatch || compactMatch) hits.push({ entry, score: rank(entry, query, compactQuery) });
  }
  hits.sort((a, b) => a.score - b.score || a.entry.order - b.entry.order);
  return hits.map(({ entry }) => entry.medicine);
}
