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
import type { MedicineIndexEntry } from "../domain/read-models";
import type {
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
}

export interface Repositories {
  medicines: MedicineRepository;
  generics: GenericRepository;
  manufacturers: ManufacturerRepository;
  pharmacies: PharmacyRepository;
  prices: PriceRepository;
}
