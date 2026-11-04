import { DOSAGE_FORMS, type DosageForm, type Manufacturer } from "../domain/types";
import type { Repositories } from "../repositories";
import { SEO_THRESHOLDS } from "../lib/seo-config";

export interface CompanyListEntry {
  manufacturer: Manufacturer;
  productCount: number;
}

export interface DosageFormListEntry {
  form: DosageForm;
  productCount: number;
}

/** Pharmaceutical company (manufacturer) and dosage-form hubs. */
export class CompanyService {
  constructor(private readonly repos: Repositories) {}

  /** Every manufacturer with at least one product, sorted by name. */
  async listCompanies(): Promise<CompanyListEntry[]> {
    const [manufacturers, counts] = await Promise.all([
      this.repos.manufacturers.listAll(),
      this.repos.medicines.countBy("manufacturerId"),
    ]);
    return manufacturers.flatMap((manufacturer) => {
      const productCount = counts.get(manufacturer.id) ?? 0;
      return productCount > 0 ? [{ manufacturer, productCount }] : [];
    });
  }

  async listIndexable(): Promise<CompanyListEntry[]> {
    return (await this.listCompanies()).filter((e) => e.productCount >= SEO_THRESHOLDS.minCatalogProducts);
  }

  /** Dosage forms with at least one product, in DOSAGE_FORMS order. */
  async listDosageForms(): Promise<DosageFormListEntry[]> {
    const counts = await this.repos.medicines.countBy("dosageForm");
    return DOSAGE_FORMS.flatMap((form) => {
      const productCount = counts.get(form) ?? 0;
      return productCount > 0 ? [{ form, productCount }] : [];
    });
  }
}
