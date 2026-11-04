import type { BrandInitialPage, BrowseSummary, DarCheckResult } from "../domain/read-models";
import { BRAND_PAGE_SIZE } from "../lib/routes-browse";
import type { Repositories } from "../repositories";
import { toMedicineSummaries } from "./summaries";

/** Brand initials for the A–Z index, in display order. */
export const BRAND_INITIALS = [..."abcdefghijklmnopqrstuvwxyz", "0-9"] as const;

export interface InitialEntry {
  initial: string;
  productCount: number;
}

export function isBrandInitial(value: string): boolean {
  return (BRAND_INITIALS as readonly string[]).includes(value);
}

const BANGLA_DIGITS = "০১২৩৪৫৬৭৮৯";

/**
 * Normalises a DAR number as typed: Bangla digits become Latin, spaces and any dash, slash
 * or dot separators are dropped, and 10 digits are written "000-0000-000" (the form every
 * published DAR number in the registry snapshot has). Returns null for anything else.
 */
export function normalizeDarNumber(raw: string | null | undefined): string | null {
  const latin = (raw ?? "").replace(/[০-৯]/g, (d) => String(BANGLA_DIGITS.indexOf(d)));
  const digits = latin.replace(/[\s\-‐-―−_./]/g, "");
  if (!/^\d{10}$/.test(digits)) return null;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
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

  /** Counts for the A–Z hub and the registration check. */
  async getSummary(): Promise<BrowseSummary> {
    const [medicineCount, genericCounts, companyCounts, initials, sourceIds] = await Promise.all([
      this.repos.medicines.count(),
      this.repos.medicines.countBy("genericId"),
      this.repos.medicines.countBy("manufacturerId"),
      this.listInitials(),
      this.repos.medicines.listSourceIds(),
    ]);
    const sources = await this.repos.sources.findByIds(sourceIds);
    return {
      medicineCount,
      genericCount: genericCounts.size,
      companyCount: companyCounts.size,
      initials,
      source: sources[0] ?? null,
    };
  }

  /**
   * One page of brands starting with `initial` ("a"–"z" or "0-9", lowercase).
   * Null for an unknown initial, an initial without brands or a page out of range.
   */
  async getInitialPage(initial: string, page = 1): Promise<BrandInitialPage | null> {
    if (!isBrandInitial(initial) || !Number.isInteger(page) || page < 1) return null;
    const medicines = await this.repos.medicines.findByBrandInitial(initial);
    const totalPages = Math.ceil(medicines.length / BRAND_PAGE_SIZE);
    if (page > totalPages) return null;

    const slice = medicines.slice((page - 1) * BRAND_PAGE_SIZE, page * BRAND_PAGE_SIZE);
    const generics = await this.repos.generics.findByIds([...new Set(slice.map((m) => m.genericId))]);
    const genericName = new Map(generics.map((g) => [g.id, g.name]));
    return {
      initial,
      page,
      totalPages,
      pageSize: BRAND_PAGE_SIZE,
      total: medicines.length,
      items: slice.map((m) => ({
        slug: m.slug,
        brandName: m.brandName,
        strength: m.strength,
        dosageFormLabel: m.dosageFormLabel,
        genericName: genericName.get(m.genericId) ?? "",
      })),
    };
  }

  /** Exact DAR number lookup in the registry snapshot; accepts raw user input and never throws. */
  async verifyByDar(raw: string | null | undefined): Promise<DarCheckResult> {
    const input = (raw ?? "").replace(/\s+/g, " ").trim().slice(0, 40);
    if (!input) return { input, darNumber: null, status: "empty", matches: [] };
    const darNumber = normalizeDarNumber(input);
    if (!darNumber) return { input, darNumber, status: "invalid", matches: [] };
    const matches = await toMedicineSummaries(await this.repos.medicines.findByDarNumber(darNumber), this.repos);
    return { input, darNumber, status: matches.length > 0 ? "found" : "not_found", matches };
  }
}
