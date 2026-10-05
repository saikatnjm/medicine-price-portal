/**
 * Healthcare directory domain: locations, specialties, facilities (hospitals,
 * clinics, diagnostic centres…) and doctors. Storage-independent, like ./types.
 */
import type { ID, ISODateString, Provenance, ProvenanceStatus } from "./types";

// ------------------------------------------------------------- data quality

/**
 * Review state of a directory record (see scripts/data/lib/quality.mjs).
 * active: shown and indexable; needs_review: shown with a notice, noindex;
 * excluded: kept for audit, hidden from the site.
 */
export const REVIEW_STATUSES = ["active", "needs_review", "excluded"] as const;
export type ReviewStatus = (typeof REVIEW_STATUSES)[number];

/** Quality fields shared by facilities and pharmacies. Absent reviewStatus means "active". */
export interface RecordQuality {
  reviewStatus?: ReviewStatus;
  /** Machine-readable reasons, e.g. "possible_duplicate", "name_cleaned". */
  qualityFlags?: string[];
  /** Original source name when pasted category/address text was trimmed from it. */
  sourceName?: string;
}

export function reviewStatusOf(record: RecordQuality): ReviewStatus {
  return record.reviewStatus ?? "active";
}

// ------------------------------------------------------------------ locations

export const LOCATION_LEVELS = ["division", "district", "area"] as const;
export type LocationLevel = (typeof LOCATION_LEVELS)[number];

/**
 * Administrative place: division (8) → district (64) → area (upazila / thana,
 * e.g. "Dhanmondi"). Records reference their district and, when known, area.
 */
export interface Location {
  id: ID;
  slug: string;
  /** English name without the "Division"/"District"/"Thana" suffix, e.g. "Dhaka". */
  name: string;
  nameBn?: string;
  level: LocationLevel;
  /** Division of a district; district of an area. */
  parentId?: ID;
}

// ---------------------------------------------------------------- specialties

/** Curated, controlled list of medical specialties (see scripts/data/taxonomy). */
export interface Specialty {
  id: ID;
  slug: string;
  /** e.g. "Cardiology". */
  name: string;
  /** e.g. "Cardiologist". */
  practitionerTitle: string;
  /** Short, neutral description of the field. Not medical advice. */
  description: string;
  /** Extra search terms, e.g. "heart", "cardiologist". */
  aliases: string[];
}

// ----------------------------------------------------------------- facilities

export const FACILITY_KINDS = [
  "hospital",
  "clinic",
  "diagnostic_centre",
  "dental_clinic",
  "doctors_practice",
  "health_centre",
  "blood_bank",
  "other_facility",
] as const;
export type FacilityKind = (typeof FACILITY_KINDS)[number];

export const OWNERSHIP_TYPES = ["government", "private", "non_profit", "military"] as const;
export type Ownership = (typeof OWNERSHIP_TYPES)[number];

export interface Coordinates {
  lat: number;
  lon: number;
}

/**
 * Optional link to a Google Maps place. Only the place id may be stored long
 * term under Google's terms; ratings are not stored (see docs/DECISIONS.md).
 */
export interface GooglePlaceRef {
  placeId: string;
  /** When the place id was last confirmed. */
  lastChecked: ISODateString;
}

/**
 * Structured address shared by facilities, pharmacies and doctor chambers.
 * Country is always Bangladesh. Every field is optional: only published values are stored.
 */
export interface PostalLocation {
  districtId?: ID;
  /** Upazila / thana location id, assigned from the record's coordinates. */
  areaId?: ID;
  /** Neighbourhood as published (may be finer than the area, e.g. "Panthapath"). */
  locality?: string;
  /** City or town as published. */
  city?: string;
  address?: string;
  postalCode?: string;
  coordinates?: Coordinates;
}

/**
 * A healthcare facility other than a pharmacy. Every optional field is present
 * only when the source publishes it (never inferred).
 */
export interface Facility extends PostalLocation, RecordQuality {
  id: ID;
  slug: string;
  name: string;
  /** Name in another script when both are published (e.g. Bangla). */
  altName?: string;
  kind: FacilityKind;
  ownership?: Ownership;
  phone?: string;
  website?: string;
  email?: string;
  /** Only when the source states it explicitly. */
  emergency?: boolean;
  beds?: number;
  openingHours?: string;
  specialtyIds: ID[];
  google?: GooglePlaceRef;
  updatedAt: ISODateString;
  provenance: Provenance;
}

// -------------------------------------------------------------------- doctors

/** A place where a doctor consults (hospital, clinic or private chamber). */
export interface DoctorChamber extends PostalLocation {
  /** Directory facility, when the chamber is in one. */
  facilityId?: ID;
  /** Name as published (used when there is no directory facility). */
  facilityName?: string;
  facilityKind?: FacilityKind;
  phone?: string;
  appointmentPhone?: string;
  appointmentUrl?: string;
  /** e.g. "Sat–Thu". */
  consultationDays?: string;
  /** e.g. "5 pm – 9 pm". */
  consultationHours?: string;
}

/** How a doctor record was verified (required on every doctor; see docs/DOCTOR-DATA.md). */
export const DOCTOR_VERIFICATION_METHODS = ["official_profile", "doctor_provided", "registry"] as const;
export type DoctorVerificationMethod = (typeof DOCTOR_VERIFICATION_METHODS)[number];

/**
 * A doctor profile. Only verified or consented data may be stored. Provenance
 * must have status "verified", a verificationMethod, verifiedAt and recordUrl.
 * The dataset is empty until records are imported with `npm run data:import-doctors`.
 */
export interface Doctor {
  id: ID;
  slug: string;
  name: string;
  specialtyIds: ID[];
  qualifications?: string;
  designation?: string;
  /** Short text supplied by the source (max ~500 characters). */
  profileSummary?: string;
  /** Public practice phone only, never a personal number. */
  phone?: string;
  /** Primary hospital or organisation name when it is not a directory facility. */
  organization?: string;
  /** Ordered; the first is the primary chamber. */
  chambers: DoctorChamber[];
  updatedAt: ISODateString;
  provenance: Provenance;
}

export const FACILITY_KIND_LABEL: Record<FacilityKind, string> = {
  hospital: "Hospital",
  clinic: "Clinic",
  diagnostic_centre: "Diagnostic centre",
  dental_clinic: "Dental clinic",
  doctors_practice: "Doctor's practice",
  health_centre: "Health centre",
  blood_bank: "Blood bank",
  other_facility: "Other healthcare facility",
};

/** Extra search words per kind (e.g. "dentist" finds dental clinics). */
export const FACILITY_KIND_SEARCH_TERMS: Record<FacilityKind, string> = {
  hospital: "hospital",
  clinic: "clinic",
  diagnostic_centre: "diagnostic centre center laboratory lab",
  dental_clinic: "dental clinic dentist",
  doctors_practice: "doctor doctors practice chamber",
  health_centre: "health centre center community clinic union family welfare",
  blood_bank: "blood bank donation",
  other_facility: "healthcare facility",
};

export const OWNERSHIP_LABEL: Record<Ownership, string> = {
  government: "Government",
  private: "Private",
  non_profit: "Non-profit",
  military: "Military",
};

/**
 * A facility page is worth indexing only when it has information beyond a
 * name and district (avoids thin pages).
 */
export function hasPublicDetails(record: {
  address?: string;
  phone?: string;
  website?: string;
  specialtyIds?: readonly string[];
  beds?: number;
  openingHours?: string;
}): boolean {
  return Boolean(
    record.address ||
      record.phone ||
      record.website ||
      record.beds ||
      record.openingHours ||
      (record.specialtyIds && record.specialtyIds.length > 0),
  );
}

/** Short, plain-language label for what a record's data represents. Never claims more than its status. */
export const TRUST_LABEL: Record<ProvenanceStatus, string> = {
  registered: "Official registry",
  unverified: "Community-mapped",
  needs_review: "Needs review",
  verified: "Source verified",
  user_reported: "User reported",
};

export function trustLabelOf(provenance: Pick<Provenance, "status">): string {
  return TRUST_LABEL[provenance.status];
}

/** A record is indexable only when it is active and has information beyond a name. */
export function isIndexableRecord(record: RecordQuality & Parameters<typeof hasPublicDetails>[0]): boolean {
  return reviewStatusOf(record) === "active" && hasPublicDetails(record);
}
