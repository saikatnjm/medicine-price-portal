import { hasSafetyContent } from "../../domain/medicine-safety";
import type { MedicineSearchFacets } from "../../domain/read-models";
import type { ID, Medicine, Page } from "../../domain/types";
import type {
  GenericRepository,
  ManufacturerRepository,
  MedicineRepository,
  MedicineSafetyRepository,
  MedicineSearchParams,
  PharmacyRepository,
  PriceRepository,
  Repositories,
  SourceRepository,
} from "../../repositories";
import type { LocalDataset } from "./dataset";
import { createLocalDirectoryRepositories, withoutExcluded } from "./directory-repositories";
import {
  applyFilters,
  buildSearchIndex,
  compareMedicines,
  computeFacets,
  searchIndex,
} from "./search";

function byKey<T, K extends keyof T>(items: readonly T[], key: K): Map<T[K], T> {
  return new Map(items.map((item) => [item[key], item]));
}

function pickByIds<T>(map: ReadonlyMap<ID, T>, ids: readonly ID[]): T[] {
  return [...new Set(ids)].flatMap((id) => {
    const item = map.get(id);
    return item ? [item] : [];
  });
}

function groupBy<T>(items: readonly T[], key: (item: T) => ID): Map<ID, T[]> {
  const groups = new Map<ID, T[]>();
  for (const item of items) {
    const k = key(item);
    const group = groups.get(k);
    if (group) group.push(item);
    else groups.set(k, [item]);
  }
  return groups;
}

/** Builds repositories backed by an in-memory dataset (seed data or a test fixture). */
export function createLocalRepositories(source: LocalDataset): Repositories {
  const dataset = withoutExcluded(source);
  let medicineSourceIds: string[] | null = null;
  const medicinesById = byKey(dataset.medicines, "id");
  const medicinesBySlug = byKey(dataset.medicines, "slug");
  const genericsById = byKey(dataset.generics, "id");
  const genericsBySlug = byKey(dataset.generics, "slug");
  const manufacturersById = byKey(dataset.manufacturers, "id");
  const manufacturersBySlug = byKey(dataset.manufacturers, "slug");
  const pharmaciesById = byKey(dataset.pharmacies, "id");
  const pharmaciesBySlug = byKey(dataset.pharmacies, "slug");
  const pricesByMedicine = groupBy(dataset.prices, (p) => p.medicineId);
  const pricesByPharmacy = groupBy(dataset.prices, (p) => p.pharmacyId);
  const sourcesById = byKey(dataset.sources, "id");
  // Built lazily: pages that never search do not pay for indexing the catalogue.
  let searchIdx: ReturnType<typeof buildSearchIndex> | null = null;
  let medicinesByGeneric: Map<ID, Medicine[]> | null = null;

  const medicines: MedicineRepository = {
    async findBySlug(slug) {
      return medicinesBySlug.get(slug) ?? null;
    },
    async findByIds(ids) {
      return pickByIds(medicinesById, ids);
    },
    async search({
      query,
      page,
      pageSize,
      ...filters
    }: MedicineSearchParams): Promise<Page<Medicine> & { facets: MedicineSearchFacets }> {
      searchIdx ??= buildSearchIndex(dataset.medicines, genericsById);
      const matches = searchIndex(searchIdx, query);
      const facets = computeFacets(matches, genericsById, manufacturersById);
      const all = applyFilters(matches, filters);
      const start = (page - 1) * pageSize;
      return {
        items: all.slice(start, start + pageSize),
        total: all.length,
        page,
        pageSize,
        facets,
      };
    },
    async findByGeneric(genericId) {
      medicinesByGeneric ??= groupBy(dataset.medicines, (m) => m.genericId);
      return [...(medicinesByGeneric.get(genericId) ?? [])].sort(compareMedicines);
    },
    async listPopular() {
      return pickByIds(medicinesById, dataset.popularMedicineIds);
    },
    async listIndex() {
      return dataset.medicines.map(({ slug, updatedAt }) => ({ slug, updatedAt }));
    },
    async count() {
      return dataset.medicines.length;
    },
    async listSourceIds() {
      medicineSourceIds ??= [...new Set(dataset.medicines.map((m) => m.provenance.sourceId))].sort();
      return [...medicineSourceIds];
    },
  };

  const generics: GenericRepository = {
    async findBySlug(slug) {
      return genericsBySlug.get(slug) ?? null;
    },
    async findByIds(ids) {
      return pickByIds(genericsById, ids);
    },
  };

  const manufacturers: ManufacturerRepository = {
    async findBySlug(slug) {
      return manufacturersBySlug.get(slug) ?? null;
    },
    async findByIds(ids) {
      return pickByIds(manufacturersById, ids);
    },
  };

  const pharmacies: PharmacyRepository = {
    async findBySlug(slug) {
      return pharmaciesBySlug.get(slug) ?? null;
    },
    async findByIds(ids) {
      return pickByIds(pharmaciesById, ids);
    },
    async listAll() {
      return [...dataset.pharmacies].sort((a, b) => a.name.localeCompare(b.name, "en"));
    },
  };

  const prices: PriceRepository = {
    async listByMedicine(medicineId) {
      return [...(pricesByMedicine.get(medicineId) ?? [])];
    },
    async listByMedicines(medicineIds) {
      return [...new Set(medicineIds)].flatMap((id) => pricesByMedicine.get(id) ?? []);
    },
    async listByPharmacy(pharmacyId) {
      return [...(pricesByPharmacy.get(pharmacyId) ?? [])];
    },
    async count() {
      return dataset.prices.length;
    },
  };

  const sources: SourceRepository = {
    async findByIds(ids) {
      return pickByIds(sourcesById, ids);
    },
    async listAll() {
      return [...dataset.sources];
    },
  };

  // Only reviewed records with something to show are served.
  const safetyBySlug = new Map(
    (dataset.safety ?? [])
      .filter((info) => info.verificationStatus === "source_cited" && hasSafetyContent(info) && info.licenceNote)
      .map((info) => [info.genericSlug, info]),
  );
  const safety: MedicineSafetyRepository = {
    async findByGenericSlug(slug) {
      return safetyBySlug.get(slug) ?? null;
    },
    async count() {
      return safetyBySlug.size;
    },
  };

  return {
    safety,
    medicines,
    generics,
    manufacturers,
    pharmacies,
    prices,
    sources,
    ...createLocalDirectoryRepositories(dataset),
  };
}
