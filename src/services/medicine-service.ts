import { isSameProductForm } from "../domain/medicine";
import type {
  CatalogSummary,
  MedicineDetail,
  MedicineIndexEntry,
  MedicineListItem,
  PriceWithPharmacy,
} from "../domain/read-models";
import type { MedicinePrice } from "../domain/types";
import type { Repositories } from "../repositories";
import { computePriceStats, toMedicineListItems, toMedicineSummaries } from "./summaries";

/** Maximum items per related list on a medicine page; the rest are reachable via search. */
export const RELATED_LIST_LIMIT = 30;

function comparePrices(a: PriceWithPharmacy, b: PriceWithPharmacy): number {
  return a.price.amount - b.price.amount || a.pharmacy.name.localeCompare(b.pharmacy.name, "en");
}

export class MedicineService {
  constructor(private readonly repos: Repositories) {}

  /** Returns null for unknown slugs (the page renders a 404). */
  async getMedicineDetail(slug: string): Promise<MedicineDetail | null> {
    const medicine = await this.repos.medicines.findBySlug(slug);
    if (!medicine) return null;

    const [summaries, rawPrices, sameGeneric, sources] = await Promise.all([
      toMedicineSummaries([medicine], this.repos),
      this.repos.prices.listByMedicine(medicine.id),
      this.repos.medicines.findByGeneric(medicine.genericId),
      this.repos.sources.findByIds([medicine.provenance.sourceId]),
    ]);
    const summary = summaries[0];
    if (!summary) return null;

    const others = sameGeneric.filter((m) => m.id !== medicine.id);
    const sameForm = others.filter((m) => isSameProductForm(m, medicine));
    const differentForm = others.filter((m) => !isSameProductForm(m, medicine));
    const [prices, alternatives, otherForms] = await Promise.all([
      this.attachPharmacies(rawPrices),
      toMedicineListItems(sameForm.slice(0, RELATED_LIST_LIMIT), this.repos),
      toMedicineListItems(differentForm.slice(0, RELATED_LIST_LIMIT), this.repos),
    ]);

    return {
      ...summary,
      prices,
      priceStats: computePriceStats(prices.map((p) => p.price)),
      alternatives,
      alternativesTotal: sameForm.length,
      otherForms,
      otherFormsTotal: differentForm.length,
      hasSampleData: prices.some((p) => p.price.source === "sample"),
      source: sources[0] ?? null,
    };
  }

  async listPopularMedicines(): Promise<MedicineListItem[]> {
    return toMedicineListItems(await this.repos.medicines.listPopular(), this.repos);
  }

  async getCatalogSummary(): Promise<CatalogSummary> {
    const [medicineCount, sourceIds, priceCount] = await Promise.all([
      this.repos.medicines.count(),
      this.repos.medicines.listSourceIds(),
      this.repos.prices.count(),
    ]);
    // Only the sources medicines come from (not the directory's OpenStreetMap source).
    const sources = await this.repos.sources.findByIds(sourceIds);
    return { medicineCount, sources, hasPrices: priceCount > 0 };
  }

  async listMedicineIndex(): Promise<MedicineIndexEntry[]> {
    return this.repos.medicines.listIndex();
  }

  private async attachPharmacies(prices: readonly MedicinePrice[]): Promise<PriceWithPharmacy[]> {
    const pharmacies = await this.repos.pharmacies.findByIds(prices.map((p) => p.pharmacyId));
    const pharmacyById = new Map(pharmacies.map((p) => [p.id, p]));
    return prices
      .flatMap((price) => {
        const pharmacy = pharmacyById.get(price.pharmacyId);
        return pharmacy ? [{ price, pharmacy }] : [];
      })
      .sort(comparePrices);
  }
}
