/**
 * Core domain types.
 *
 * These describe stored entities independently of where they come from
 * (local seed data today, a Django REST API later). They intentionally
 * contain no presentation fields. IDs are opaque strings so any backend
 * (UUID, integer, slug) can supply them.
 */
import type { GooglePlaceRef, PostalLocation, RecordQuality } from "./healthcare";

export type ID = string;

/** ISO-8601 date-time string, e.g. "2026-10-01T00:00:00Z". */
export type ISODateString = string;

/**
 * Controlled dosage-form categories. The precise registered form (e.g. "SR Tablet",
 * "Eye Drops") is kept in Medicine.dosageFormLabel. Keep in sync with
 * scripts/data/lib/normalize.mjs (enforced by tests/data-pipeline.test.ts).
 */
export const DOSAGE_FORMS = [
  "tablet",
  "capsule",
  "syrup",
  "suspension",
  "solution",
  "drops",
  "injection",
  "inhaler",
  "spray",
  "cream",
  "ointment",
  "gel",
  "lotion",
  "powder",
  "granules",
  "suppository",
  "patch",
  "mouthwash",
  "shampoo",
  "other",
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

/**
 * - registered: present in an official registry (e.g. DGDA); not independently checked further.
 * - unverified: community or secondary source (e.g. OpenStreetMap); not checked by us.
 * - needs_review: flagged during import for manual review.
 * - verified: confirmed by us against an authoritative source (no records yet).
 */
export const PROVENANCE_STATUSES = ["registered", "unverified", "needs_review", "verified", "user_reported"] as const;
export type ProvenanceStatus = (typeof PROVENANCE_STATUSES)[number];

/** Where a record came from. Never claim more than the source supports. */
export interface Provenance {
  sourceId: ID;
  /** Record identifier in the source system. */
  recordId: string;
  /** DGDA registration (DAR) number, when the source value passed quality checks. */
  darNumber?: string;
  /** Link to the record at the source, when one exists. */
  recordUrl?: string;
  status: ProvenanceStatus;
  /** When the source last changed (e.g. the OpenStreetMap snapshot time). */
  sourceUpdatedAt?: ISODateString;
  /** When we last fetched/checked the record from the source. */
  lastCheckedAt?: ISODateString;
  /** How a verified record was checked, e.g. "official_website", "doctor_provided". */
  verificationMethod?: string;
  /** When a person verified the record (verified status only). */
  verifiedAt?: ISODateString;
}

export interface DataSource {
  id: ID;
  name: string;
  publisher: string;
  url: string;
  apiUrl?: string;
  /** Licence and attribution text, when the source requires it (e.g. ODbL). */
  licence?: string;
  licenceUrl?: string;
  attribution?: string;
  retrievedAt: ISODateString;
  note?: string;
}

export interface Medicine {
  id: ID;
  slug: string;
  /** Brand as displayed (strength suffix removed when it duplicates `strength`). */
  brandName: string;
  /** Name exactly as registered, when it differs from `brandName`. */
  registeredName?: string;
  genericId: ID;
  manufacturerId: ID;
  /** Strength as registered, e.g. "500 mg" or "200 mg/5 mL". Empty when not published. */
  strength: string;
  dosageForm: DosageForm;
  /** Precise registered dosage form, e.g. "SR Tablet", "Eye Drops". */
  dosageFormLabel: string;
  /** Optional fields: only present when a source publishes them. */
  packSize?: PackSize;
  category?: string;
  description?: string;
  prescriptionRequired?: boolean;
  updatedAt: ISODateString;
  provenance: Provenance;
}

/**
 * A pharmacy. Location fields come from PostalLocation and are present only
 * when the source publishes them.
 */
export interface Pharmacy extends PostalLocation, RecordQuality {
  id: ID;
  slug: string;
  name: string;
  /** Name in another script when both are published (e.g. Bangla). */
  altName?: string;
  phone?: string;
  website?: string;
  openingHours?: string;
  description?: string;
  google?: GooglePlaceRef;
  updatedAt: ISODateString;
  provenance: Provenance;
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
