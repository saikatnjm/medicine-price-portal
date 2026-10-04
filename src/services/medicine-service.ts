import { isSameProductForm } from "../domain/medicine";
import type {
  MedicineDetail,
  MedicineIndexEntry,
  MedicineListItem,
  PriceWithPharmacy,
} from "../domain/read-models";
import type { MedicinePrice } from "../domain/types";
import type { Repositories } from "../repositories";
import { computePriceStats, toMedicineListItems, toMedicineSummaries } from "./summaries";

function comparePrices(a: PriceWithPharmacy, b: PriceWithPharmacy): number {
  return a.price.amount - b.price.amount || a.pharmacy.name.localeCompare(b.pharmacy.name, "en");
}

export class MedicineService {
  constructor(private readonly repos: Repositories) {}

  /** Returns null for unknown slugs (the page renders a 404). */
  async getMedicineDetail(slug: string): Promise<MedicineDetail | null> {
    const medicine = await this.repos.medicines.findBySlug(slug);
    if (!medicine) return null;

    const [summaries, rawPrices, sameGeneric] = await Promise.all([
      toMedicineSummaries([medicine], this.repos),
      this.repos.prices.listByMedicine(medicine.id),
      this.repos.medicines.findByGeneric(medicine.genericId),
    ]);
    const summary = summaries[0];
    if (!summary) return null;

    const others = sameGeneric.filter((m) => m.id !== medicine.id);
    const [prices, related] = await Promise.all([
      this.attachPharmacies(rawPrices),
      toMedicineListItems(others, this.repos),
    ]);

    return {
      ...summary,
      prices,
      priceStats: computePriceStats(prices.map((p) => p.price)),
      alternatives: related.filter((item) => isSameProductForm(item.medicine, medicine)),
      otherForms: related.filter((item) => !isSameProductForm(item.medicine, medicine)),
      hasSampleData: prices.some((p) => p.price.source === "sample"),
    };
  }

  async listPopularMedicines(): Promise<MedicineListItem[]> {
    return toMedicineListItems(await this.repos.medicines.listPopular(), this.repos);
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
