import type { Generic } from "../domain/types";
import type { Repositories } from "../repositories";
import { SEO_THRESHOLDS } from "../lib/seo-config";

export interface GenericListEntry {
  generic: Generic;
  /** Registered products (all brands, strengths and forms) with this generic. */
  productCount: number;
}

/** Generic (active ingredient) hub: index and per-generic pages. */
export class GenericService {
  constructor(private readonly repos: Repositories) {}

  /** Every generic with at least one product, sorted by name. */
  async listGenerics(): Promise<GenericListEntry[]> {
    const [generics, counts] = await Promise.all([
      this.repos.generics.listAll(),
      this.repos.medicines.countBy("genericId"),
    ]);
    return generics.flatMap((generic) => {
      const productCount = counts.get(generic.id) ?? 0;
      return productCount > 0 ? [{ generic, productCount }] : [];
    });
  }

  /** Generics whose page is indexable (enough products to not be thin content). */
  async listIndexable(): Promise<GenericListEntry[]> {
    return (await this.listGenerics()).filter((e) => e.productCount >= SEO_THRESHOLDS.minCatalogProducts);
  }
}
