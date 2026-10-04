import type { PharmacyDetail, PharmacyPriceEntry } from "../domain/read-models";
import type { Pharmacy } from "../domain/types";
import type { Repositories } from "../repositories";

function compareEntries(a: PharmacyPriceEntry, b: PharmacyPriceEntry): number {
  return (
    a.medicine.brandName.localeCompare(b.medicine.brandName, "en") ||
    a.medicine.strength.localeCompare(b.medicine.strength, "en", { numeric: true })
  );
}

export class PharmacyService {
  constructor(private readonly repos: Repositories) {}

  /** Returns null for unknown slugs (the page renders a 404). */
  async getPharmacyDetail(slug: string): Promise<PharmacyDetail | null> {
    const pharmacy = await this.repos.pharmacies.findBySlug(slug);
    if (!pharmacy) return null;

    const rawPrices = await this.repos.prices.listByPharmacy(pharmacy.id);
    const medicines = await this.repos.medicines.findByIds(rawPrices.map((p) => p.medicineId));
    const medicineById = new Map(medicines.map((m) => [m.id, m]));
    const prices: PharmacyPriceEntry[] = rawPrices
      .flatMap((price) => {
        const medicine = medicineById.get(price.medicineId);
        return medicine ? [{ price, medicine }] : [];
      })
      .sort(compareEntries);

    return { pharmacy, prices, hasSampleData: prices.some((p) => p.price.source === "sample") };
  }

  async listPharmacies(): Promise<Pharmacy[]> {
    return this.repos.pharmacies.listAll();
  }
}
