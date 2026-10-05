/**
 * Repository interfaces: the boundary between application services and data sources.
 *
 * Current implementation: src/data/local (bundled seed data).
 * Future implementation: an API-backed provider calling the Django REST API.
 *
 * All methods are async so a network-backed implementation is a drop-in replacement.
 * Methods are deliberately coarse (batch lookups, search) so an API implementation
 * does not need many round-trips per page.
 */
import type {
  Coordinates,
  Doctor,
  Facility,
  FacilityKind,
  Location,
  Specialty,
} from "../domain/healthcare";
import type { MedicineIndexEntry } from "../domain/read-models";
import type {
  DataSource,
  Generic,
  ID,
  Manufacturer,
  Medicine,
  MedicinePrice,
  Page,
  Pharmacy,
} from "../domain/types";

export interface MedicineSearchParams {
  /** Cleaned, non-empty query. */
  query: string;
  page: number;
  pageSize: number;
}

export interface MedicineRepository {
  findBySlug(slug: string): Promise<Medicine | null>;
  findByIds(ids: readonly ID[]): Promise<Medicine[]>;
  /** All medicines with the given generic, in deterministic order. */
  findByGeneric(genericId: ID): Promise<Medicine[]>;
  /** Matches brand name, generic name, strength and slug; deterministically ordered. */
  search(params: MedicineSearchParams): Promise<Page<Medicine>>;
  /** Curated list for the homepage, in display order. */
  listPopular(): Promise<Medicine[]>;
  listIndex(): Promise<MedicineIndexEntry[]>;
  count(): Promise<number>;
  /** Ids of the data sources medicine records come from. */
  listSourceIds(): Promise<ID[]>;
}

export interface GenericRepository {
  findByIds(ids: readonly ID[]): Promise<Generic[]>;
}

export interface ManufacturerRepository {
  findByIds(ids: readonly ID[]): Promise<Manufacturer[]>;
}

export interface PharmacyRepository {
  findBySlug(slug: string): Promise<Pharmacy | null>;
  findByIds(ids: readonly ID[]): Promise<Pharmacy[]>;
  /** All pharmacies, sorted by name. */
  listAll(): Promise<Pharmacy[]>;
}

export interface PriceRepository {
  listByMedicine(medicineId: ID): Promise<MedicinePrice[]>;
  listByMedicines(medicineIds: readonly ID[]): Promise<MedicinePrice[]>;
  listByPharmacy(pharmacyId: ID): Promise<MedicinePrice[]>;
  count(): Promise<number>;
}

export interface SourceRepository {
  findByIds(ids: readonly ID[]): Promise<DataSource[]>;
  listAll(): Promise<DataSource[]>;
}

export interface Repositories extends DirectoryRepositories {
  medicines: MedicineRepository;
  generics: GenericRepository;
  manufacturers: ManufacturerRepository;
  pharmacies: PharmacyRepository;
  prices: PriceRepository;
  sources: SourceRepository;
}

// ---------------------------------------------------------- healthcare directory

export interface DirectoryListParams {
  /** Free-text query (name, area, district, specialty terms). */
  query?: string;
  /** Records whose district or area is one of these location ids. */
  locationIds?: readonly ID[];
  /**
   * Sort by distance from this point (nearest first) and drop records without
   * coordinates. Distances are computed server-side; the point is not stored.
   */
  near?: Coordinates;
  /** With `near`: only records within this radius. */
  radiusKm?: number;
  page: number;
  pageSize: number;
}

export interface FacilityListParams extends DirectoryListParams {
  kind?: FacilityKind;
  specialtyId?: ID;
  /** Only facilities whose source states emergency services. */
  emergencyOnly?: boolean;
}

export interface DoctorListParams extends DirectoryListParams {
  specialtyId?: ID;
  facilityId?: ID;
}

export interface FacilityRepository {
  findBySlug(slug: string): Promise<Facility | null>;
  findByIds(ids: readonly ID[]): Promise<Facility[]>;
  /** Filtered, deterministically ordered page (text matches ranked first). */
  list(params: FacilityListParams): Promise<Page<Facility>>;
  /** All facilities, for aggregates and the sitemap. */
  listAll(): Promise<Facility[]>;
}

export interface PharmacyDirectoryRepository {
  list(params: DirectoryListParams): Promise<Page<Pharmacy>>;
  /** All directory pharmacies, for aggregates and the sitemap. */
  listAll(): Promise<Pharmacy[]>;
}

export interface LocationRepository {
  findBySlug(slug: string): Promise<Location | null>;
  findByIds(ids: readonly ID[]): Promise<Location[]>;
  listAll(): Promise<Location[]>;
}

export interface SpecialtyRepository {
  findBySlug(slug: string): Promise<Specialty | null>;
  findByIds(ids: readonly ID[]): Promise<Specialty[]>;
  listAll(): Promise<Specialty[]>;
}

export interface DoctorRepository {
  findBySlug(slug: string): Promise<Doctor | null>;
  list(params: DoctorListParams): Promise<Page<Doctor>>;
  listAll(): Promise<Doctor[]>;
}

export interface DirectoryRepositories {
  facilities: FacilityRepository;
  pharmacyDirectory: PharmacyDirectoryRepository;
  locations: LocationRepository;
  specialties: SpecialtyRepository;
  doctors: DoctorRepository;
}
