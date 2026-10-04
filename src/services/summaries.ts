import type { MedicineListItem, MedicineSummary, PriceStats } from "../domain/read-models";
import type { Medicine, MedicinePrice } from "../domain/types";
import type { Repositories } from "../repositories";

export function computePriceStats(prices: readonly MedicinePrice[]): PriceStats | null {
  if (prices.length === 0) return null;
  const amounts = prices.map((p) => p.amount);
  return {
    lowest: Math.min(...amounts),
    highest: Math.max(...amounts),
    count: prices.length,
    hasSampleData: prices.some((p) => p.source === "sample"),
  };
}

/**
 * Resolves generic and manufacturer for a list of medicines using batch lookups.
 * Medicines with missing references are skipped rather than crashing a page.
 */
export async function toMedicineSummaries(
  medicines: readonly Medicine[],
  repos: Pick<Repositories, "generics" | "manufacturers">,
): Promise<MedicineSummary[]> {
  if (medicines.length === 0) return [];
  const [generics, manufacturers] = await Promise.all([
    repos.generics.findByIds(medicines.map((m) => m.genericId)),
    repos.manufacturers.findByIds(medicines.map((m) => m.manufacturerId)),
  ]);
  const genericById = new Map(generics.map((g) => [g.id, g]));
  const manufacturerById = new Map(manufacturers.map((m) => [m.id, m]));

  return medicines.flatMap((medicine) => {
    const generic = genericById.get(medicine.genericId);
    const manufacturer = manufacturerById.get(medicine.manufacturerId);
    return generic && manufacturer ? [{ medicine, generic, manufacturer }] : [];
  });
}

/** Summaries plus sample price range per medicine, for list views. */
export async function toMedicineListItems(
  medicines: readonly Medicine[],
  repos: Pick<Repositories, "generics" | "manufacturers" | "prices">,
): Promise<MedicineListItem[]> {
  if (medicines.length === 0) return [];
  const [summaries, prices] = await Promise.all([
    toMedicineSummaries(medicines, repos),
    repos.prices.listByMedicines(medicines.map((m) => m.id)),
  ]);
  const pricesByMedicine = new Map<string, MedicinePrice[]>();
  for (const price of prices) {
    const list = pricesByMedicine.get(price.medicineId) ?? [];
    list.push(price);
    pricesByMedicine.set(price.medicineId, list);
  }
  return summaries.map((summary) => ({
    ...summary,
    priceStats: computePriceStats(pricesByMedicine.get(summary.medicine.id) ?? []),
  }));
}
