/**
 * Read models returned by application services to the UI.
 * They combine domain entities for a specific use case and are never stored.
 */
import type { MedicineSafetyInfo } from "./medicine-safety";
import type {
  Coordinates,
  Doctor,
  DoctorChamber,
  Facility,
  FacilityKind,
  Location,
  Specialty,
} from "./healthcare";
import type {
  DataSource,
  DosageForm,
  Generic,
  ID,
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
  /** Source-cited safety information for the generic; null when no reviewed record exists. */
  safety: MedicineSafetyInfo | null;
  /** Sorted by amount ascending, then pharmacy name. */
  prices: PriceWithPharmacy[];
  priceStats: PriceStats | null;
  /** Same generic, strength and precise dosage form (first page). Informational only. */
  alternatives: MedicineListItem[];
  alternativesTotal: number;
  /** Same generic in a different strength or dosage form (first page; any brand, including this one). */
  otherForms: MedicineListItem[];
  otherFormsTotal: number;
  /** True when any shown price is sample/demo data. */
  hasSampleData: boolean;
  /** Where the medicine information comes from. */
  source: DataSource | null;
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
  place: Place;
  source: DataSource | null;
  /** False for thin records (name and district only): render with noindex. */
  indexable: boolean;
  nearby: PharmacyNearby;
}

/** Minimal data for static params and the sitemap. */
export interface MedicineIndexEntry {
  slug: string;
  updatedAt: ISODateString;
}

/** Headline facts about the catalogue, for contextual data disclosure. */
export interface CatalogSummary {
  medicineCount: number;
  sources: DataSource[];
  hasPrices: boolean;
}

export type SearchStatus = "ok" | "empty_query" | "query_too_short";

/** Number of matching medicines per facet value, before filters are applied. */
export interface MedicineSearchFacets {
  generics: { id: ID; count: number }[];
  manufacturers: { id: ID; count: number }[];
  dosageForms: { value: DosageForm; count: number }[];
}

/** One selectable filter option. `value` is what goes in the URL (slug or dosage form). */
export interface FacetOption {
  value: string;
  label: string;
  count: number;
  selected: boolean;
}

export interface MedicineFacetOptions {
  generics: FacetOption[];
  manufacturers: FacetOption[];
  dosageForms: FacetOption[];
}

/** Applied medicine filters as URL values (generic slug, manufacturer slug, dosage form). */
export interface MedicineFilterValues {
  generic?: string;
  manufacturer?: string;
  form?: string;
}

export interface SearchResult extends Page<MedicineListItem> {
  /** Filter options for all matches of the query (before filters); empty with no matches. */
  facets: MedicineFacetOptions;
  /** Filters that were recognised and applied. */
  appliedFilters: MedicineFilterValues;
  /** Cleaned query as entered. */
  query: string;
  /**
   * Query that produced the results. Differs from `query` when nothing matched
   * every word and the search fell back to the first word ("napa extra" → "napa").
   */
  matchedQuery: string;
  status: SearchStatus;
  totalPages: number;
}

// --------------------------------------------------------- healthcare directory

/** Resolved administrative place of a record. */
export interface Place {
  area: Location | null;
  district: Location | null;
  division: Location | null;
  /** Most specific readable place, e.g. "Panthapath, Dhanmondi, Dhaka"; empty when unknown. */
  label: string;
}

/** Shared by list items that can be sorted by distance from a visitor. */
export interface Distance {
  /** Kilometres from the requested point; present only for `near` queries. */
  distanceKm?: number;
}

export interface FacilityListItem extends Distance {
  facility: Facility;
  place: Place;
  specialties: Specialty[];
}

export interface FacilityDetail extends FacilityListItem {
  source: DataSource | null;
  /** False for thin records (name and district only): render with noindex. */
  indexable: boolean;
  /** Doctors with a chamber at this facility (first page). */
  doctors: DoctorListItem[];
  /** Closest other records by group (by coordinates within a radius, else same area/district). */
  nearby: FacilityNearby;
}

/** Nearby records of a facility page, closest first; every list may be empty. */
export interface FacilityNearby {
  hospitals: FacilityListItem[];
  /** Clinics and health centres. */
  clinics: FacilityListItem[];
  diagnosticCentres: FacilityListItem[];
  pharmacies: PharmacyListItem[];
}

/** Nearby records of a pharmacy page, closest first. */
export interface PharmacyNearby {
  /** Hospitals, clinics and health centres. */
  facilities: FacilityListItem[];
  pharmacies: PharmacyListItem[];
}

export interface PharmacyListItem extends Distance {
  pharmacy: Pharmacy;
  place: Place;
}

export interface ChamberView {
  chamber: DoctorChamber;
  /** Directory facility, when the chamber is in one. */
  facility: Facility | null;
  /** Chamber name: facility name or published name. */
  name: string;
  place: Place;
  coordinates: Coordinates | null;
}

export interface DoctorListItem extends Distance {
  doctor: Doctor;
  specialties: Specialty[];
  /** Primary chamber, if any. */
  chamber: ChamberView | null;
}

export interface DoctorDetail {
  doctor: Doctor;
  specialties: Specialty[];
  chambers: ChamberView[];
  source: DataSource | null;
  /** Other doctors in the first specialty (first few). */
  related: DoctorListItem[];
}

export type DirectoryPage<T> = Page<T> & { totalPages: number };

/** Applied list filters, resolved from URL values (unknown values become null). */
export interface DirectoryFilters {
  query: string;
  kind: FacilityKind | null;
  location: Location | null;
  specialty: Specialty | null;
  /** Doctors list: facility filter. */
  facility: Facility | null;
  emergencyOnly: boolean;
  /** Rounded visitor position for "near me" sorting. */
  near: Coordinates | null;
}

export interface DirectoryListResult<T> {
  filters: DirectoryFilters;
  results: DirectoryPage<T>;
}

export interface FacilityKindCount {
  kind: FacilityKind;
  count: number;
}

export interface LocationCounts {
  facilityCount: number;
  hospitalCount: number;
  pharmacyCount: number;
  doctorCount: number;
}

export interface LocationListItem extends LocationCounts {
  location: Location;
}

export interface DivisionWithDistricts extends LocationCounts {
  division: Location;
  districts: LocationListItem[];
}

export interface LocationDetail extends LocationCounts {
  location: Location;
  /** Division → district → area chain above this location (outermost first). */
  ancestors: Location[];
  /** Districts of a division, areas of a district (with counts, non-empty first). */
  children: LocationListItem[];
  kindCounts: FacilityKindCount[];
  /** First few of each, hospitals first. */
  facilities: FacilityListItem[];
  /** First few hospitals only. */
  hospitals: FacilityListItem[];
  /** First few clinics and health centres. */
  clinics: FacilityListItem[];
  diagnosticCentres: FacilityListItem[];
  pharmacies: PharmacyListItem[];
  doctors: DoctorListItem[];
  /** Specialties offered by facilities here (from facility data). */
  specialties: SpecialtyListItem[];
  /** False when the location has no healthcare records (rendered noindex). */
  indexable: boolean;
}

export interface SpecialtyListItem {
  specialty: Specialty;
  facilityCount: number;
  doctorCount: number;
}

export interface SpecialtyDetail extends SpecialtyListItem {
  facilities: FacilityListItem[];
  doctors: DoctorListItem[];
  /** Districts with the most facilities for this specialty. */
  topLocations: Array<{ location: Location; count: number }>;
  related: Specialty[];
}

/** Counts shown on the homepage and in navigation. */
export interface DirectorySummary {
  medicineCount: number;
  facilityCount: number;
  hospitalCount: number;
  pharmacyCount: number;
  doctorCount: number;
  specialtyCount: number;
  districtCount: number;
  areaCount: number;
  sources: DataSource[];
}

export interface DirectoryIndexEntry {
  slug: string;
  updatedAt: ISODateString;
}

/** Location/specialty combination landing pages with enough records to index. */
export interface CombinationIndexEntry {
  type: "hospitals" | "pharmacies" | "doctors";
  locationSlug: string;
  specialtySlug?: string;
  count: number;
}

export const SEARCH_TYPES = ["all", "medicine", "hospital", "pharmacy", "doctor", "specialty", "location"] as const;
export type SearchType = (typeof SEARCH_TYPES)[number];

export interface SearchGroup<T> {
  items: T[];
  total: number;
}

/** What a query was understood as ("cardiologists in gulshan"). */
export interface SearchIntent {
  /** Text left after removing recognised parts; may be empty. */
  text: string;
  entity: "doctor" | "hospital" | "pharmacy" | null;
  specialty: Specialty | null;
  location: Location | null;
  /** Set for "doctors at <facility name>" queries. */
  facility?: Facility | null;
}

/** Grouped results across the whole directory. */
export interface GlobalSearchResult {
  query: string;
  status: SearchStatus;
  intent: SearchIntent;
  medicines: SearchGroup<MedicineListItem> & { matchedQuery: string };
  doctors: SearchGroup<DoctorListItem>;
  facilities: SearchGroup<FacilityListItem>;
  pharmacies: SearchGroup<PharmacyListItem>;
  specialties: SearchGroup<SpecialtyListItem>;
  locations: SearchGroup<LocationListItem>;
  /** Sum of all group totals. */
  total: number;
}

export interface SuggestionItem {
  type: Exclude<SearchType, "all">;
  label: string;
  /** Secondary text, e.g. generic name or place. */
  detail?: string;
  href: string;
}

export interface SuggestionGroup {
  type: Exclude<SearchType, "all">;
  label: string;
  items: SuggestionItem[];
}
