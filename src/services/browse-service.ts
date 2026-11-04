import type { Repositories } from "../repositories";

/** Brand initials for the A–Z index, in display order. */
export const BRAND_INITIALS = [..."abcdefghijklmnopqrstuvwxyz", "0-9"] as const;

export interface InitialEntry {
  initial: string;
  productCount: number;
}

/** Brand A–Z index and DGDA registration (DAR number) lookup. */
export class BrowseService {
  constructor(private readonly repos: Repositories) {}

  /** Initials with at least one brand. */
  async listInitials(): Promise<InitialEntry[]> {
    const entries = await Promise.all(
      BRAND_INITIALS.map(async (initial) => ({
        initial,
        productCount: (await this.repos.medicines.findByBrandInitial(initial)).length,
      })),
    );
    return entries.filter((e) => e.productCount > 0);
  }
}
