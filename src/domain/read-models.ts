/**
 * Read models returned by application services to the UI.
 * They combine domain entities for a specific use case and are never stored.
 */
import type {
  Generic,
  ISODateString,
  Manufacturer,
  Medicine,
  MedicinePrice,
  Page,
  Pharmacy,
} from "./types";

export interface MedicineSummary {
  medicine: Medicine;
  generic: Generic;
  manufacturer: Manufacturer;
}

export interface PriceStats {
  lowest: number;
  highest: number;
  /** Number of price records (pharmacies) the stats are based on. */
  count: number;
  /** True when any underlying price is sample data. */
  hasSampleData: boolean;
}

/** A medicine as shown in lists (search results, popular, alternatives). */
export interface MedicineListItem extends MedicineSummary {
  priceStats: PriceStats | null;
}

export interface PriceWithPharmacy {
  price: MedicinePrice;
  pharmacy: Pharmacy;
}

export interface MedicineDetail extends MedicineSummary {
  /** Sorted by amount ascending, then pharmacy name. */
  prices: PriceWithPharmacy[];
  priceStats: PriceStats | null;
  /** Other brands with the same generic, strength and dosage form. Informational only. */
  alternatives: MedicineListItem[];
  /** Same generic in a different strength or dosage form (any brand, including this one). */
  otherForms: MedicineListItem[];
  /** True when any shown price is sample/demo data. */
  hasSampleData: boolean;
}

export interface PharmacyPriceEntry {
  price: MedicinePrice;
  medicine: Medicine;
}

export interface PharmacyDetail {
  pharmacy: Pharmacy;
  /** Sorted by brand name, then strength. */
  prices: PharmacyPriceEntry[];
  hasSampleData: boolean;
}

/** Minimal data for static params and the sitemap. */
export interface MedicineIndexEntry {
  slug: string;
  updatedAt: ISODateString;
}

export type SearchStatus = "ok" | "empty_query" | "query_too_short";

export interface SearchResult extends Page<MedicineListItem> {
  /** Cleaned query actually searched. */
  query: string;
  status: SearchStatus;
  totalPages: number;
}
