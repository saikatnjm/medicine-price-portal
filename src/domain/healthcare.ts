/**
 * Healthcare directory domain: locations, specialties, facilities (hospitals,
 * clinics, diagnostic centres…) and doctors. Storage-independent, like ./types.
 */
import type { ID, ISODateString, Provenance } from "./types";

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
  "blood_bank",
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
export interface Facility extends PostalLocation {
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

/**
 * A doctor profile. Only verified or consented data may be stored; no such
 * source exists yet, so the dataset is empty (see docs/DATA-PIPELINE.md).
 */
export interface Doctor {
  id: ID;
  slug: string;
  name: string;
  specialtyIds: ID[];
  qualifications?: string;
  designation?: string;
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
  blood_bank: "Blood bank",
};

/** Extra search words per kind (e.g. "dentist" finds dental clinics). */
export const FACILITY_KIND_SEARCH_TERMS: Record<FacilityKind, string> = {
  hospital: "hospital",
  clinic: "clinic",
  diagnostic_centre: "diagnostic centre center laboratory lab",
  dental_clinic: "dental clinic dentist",
  doctors_practice: "doctor doctors practice chamber",
  blood_bank: "blood bank donation",
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
