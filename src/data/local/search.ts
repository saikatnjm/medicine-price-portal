import { isUnitDosageForm } from "../../domain/medicine";
import type { Generic, Medicine } from "../../domain/types";
import { normalizeSearchText } from "../../lib/text";

/**
 * In-memory search for the Phase-1 dataset. Replaced by the backend /
 * a search engine later; only MedicineRepository.search depends on it.
 */

interface IndexedMedicine {
  medicine: Medicine;
  brand: string;
  brandWithStrength: string;
  generic: string;
  words: string[];
}

export function buildSearchIndex(
  medicines: readonly Medicine[],
  genericsById: ReadonlyMap<string, Generic>,
): IndexedMedicine[] {
  return medicines.map((medicine) => {
    const generic = normalizeSearchText(genericsById.get(medicine.genericId)?.name ?? "");
    const brand = normalizeSearchText(medicine.brandName);
    const brandWithStrength = normalizeSearchText(`${medicine.brandName} ${medicine.strength}`);
    const slug = normalizeSearchText(medicine.slug);
    return {
      medicine,
      brand,
      brandWithStrength,
      generic,
      words: [...new Set(`${brandWithStrength} ${generic} ${slug}`.split(" "))],
    };
  });
}

/** Lower is better. */
function rank(entry: IndexedMedicine, query: string): number {
  if (entry.brand === query) return 0;
  if (entry.brand.startsWith(query) || entry.brandWithStrength.startsWith(query)) return 1;
  if (entry.brand.includes(query)) return 2;
  if (entry.generic.startsWith(query)) return 3;
  return 4;
}

/** Brand, then tablets/capsules before liquids and other forms, then strength (numeric). */
export function compareMedicines(a: Medicine, b: Medicine): number {
  return (
    a.brandName.localeCompare(b.brandName, "en") ||
    Number(isUnitDosageForm(b)) - Number(isUnitDosageForm(a)) ||
    a.strength.localeCompare(b.strength, "en", { numeric: true }) ||
    a.slug.localeCompare(b.slug, "en")
  );
}

/**
 * Every query token must be a prefix of some indexed word (brand, strength,
 * generic, slug). Prefix matching keeps partial search ("nap", "omepra")
 * without noisy mid-word hits ("ace" inside "paracetamol"). Deterministic order.
 */
export function searchIndex(index: readonly IndexedMedicine[], rawQuery: string): Medicine[] {
  const query = normalizeSearchText(rawQuery);
  if (!query) return [];
  const tokens = query.split(" ");

  return index
    .filter((entry) => tokens.every((token) => entry.words.some((word) => word.startsWith(token))))
    .map((entry) => ({ entry, score: rank(entry, query) }))
    .sort((a, b) => a.score - b.score || compareMedicines(a.entry.medicine, b.entry.medicine))
    .map(({ entry }) => entry.medicine);
}
