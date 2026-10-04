/**
 * Core domain types.
 *
 * These describe stored entities independently of where they come from
 * (local seed data today, a Django REST API later). They intentionally
 * contain no presentation fields. IDs are opaque strings so any backend
 * (UUID, integer, slug) can supply them.
 */

export type ID = string;

/** ISO-8601 date-time string, e.g. "2026-10-01T00:00:00Z". */
export type ISODateString = string;

export const DOSAGE_FORMS = [
  "tablet",
  "capsule",
  "syrup",
  "suspension",
  "injection",
  "cream",
  "ointment",
  "drops",
  "inhaler",
] as const;
export type DosageForm = (typeof DOSAGE_FORMS)[number];

export const AVAILABILITY_STATUSES = ["in_stock", "limited", "out_of_stock", "unknown"] as const;
export type AvailabilityStatus = (typeof AVAILABILITY_STATUSES)[number];

/**
 * Where a price record came from. Only non-"sample" data may ever be
 * presented as real. The UI must derive "sample data" labelling from this.
 */
export const PRICE_SOURCES = ["sample", "manual", "integration"] as const;
export type PriceSource = (typeof PRICE_SOURCES)[number];

export type CurrencyCode = "BDT";

/** A generic (active ingredient composition). A combination product is its own generic. */
export interface Generic {
  id: ID;
  slug: string;
  name: string;
  description?: string;
}

export interface Manufacturer {
  id: ID;
  slug: string;
  name: string;
}

export interface PackSize {
  /** Number of units in the priced pack, e.g. 10. */
  quantity: number;
  /** Unit label, e.g. "tablets", "ml". */
  unit: string;
}

export interface Medicine {
  id: ID;
  slug: string;
  brandName: string;
  genericId: ID;
  manufacturerId: ID;
  /** Human-readable strength, e.g. "500 mg" or "120 mg/5 ml". */
  strength: string;
  dosageForm: DosageForm;
  /** The pack that MedicinePrice.amount refers to. */
  packSize: PackSize;
  category: string;
  description?: string;
  prescriptionRequired: boolean;
  updatedAt: ISODateString;
}

export interface Pharmacy {
  id: ID;
  slug: string;
  name: string;
  area: string;
  city: string;
  address?: string;
  phone?: string;
  website?: string;
  description?: string;
}

export interface MedicinePrice {
  id: ID;
  medicineId: ID;
  pharmacyId: ID;
  /** Price for one Medicine.packSize, in major currency units (e.g. 12.5 = ৳12.50). */
  amount: number;
  currency: CurrencyCode;
  availability: AvailabilityStatus;
  source: PriceSource;
  updatedAt: ISODateString;
}

/** Generic pagination envelope, compatible with DRF/Meilisearch style paging. */
export interface Page<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
