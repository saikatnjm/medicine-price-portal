import type { ID, Medicine, Page } from "../../domain/types";
import type {
  GenericRepository,
  ManufacturerRepository,
  MedicineRepository,
  MedicineSearchParams,
  PharmacyRepository,
  PriceRepository,
  Repositories,
} from "../../repositories";
import type { LocalDataset } from "./dataset";
import { buildSearchIndex, compareMedicines, searchIndex } from "./search";

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
export function createLocalRepositories(dataset: LocalDataset): Repositories {
  const medicinesById = byKey(dataset.medicines, "id");
  const medicinesBySlug = byKey(dataset.medicines, "slug");
  const genericsById = byKey(dataset.generics, "id");
  const manufacturersById = byKey(dataset.manufacturers, "id");
  const pharmaciesById = byKey(dataset.pharmacies, "id");
  const pharmaciesBySlug = byKey(dataset.pharmacies, "slug");
  const pricesByMedicine = groupBy(dataset.prices, (p) => p.medicineId);
  const pricesByPharmacy = groupBy(dataset.prices, (p) => p.pharmacyId);
  const searchIdx = buildSearchIndex(dataset.medicines, genericsById);

  const medicines: MedicineRepository = {
    async findBySlug(slug) {
      return medicinesBySlug.get(slug) ?? null;
    },
    async findByIds(ids) {
      return pickByIds(medicinesById, ids);
    },
    async search({ query, page, pageSize }: MedicineSearchParams): Promise<Page<Medicine>> {
      const all = searchIndex(searchIdx, query);
      const start = (page - 1) * pageSize;
      return { items: all.slice(start, start + pageSize), total: all.length, page, pageSize };
    },
    async findByGeneric(genericId) {
      return dataset.medicines.filter((m) => m.genericId === genericId).sort(compareMedicines);
    },
    async listPopular() {
      return pickByIds(medicinesById, dataset.popularMedicineIds);
    },
    async listIndex() {
      return dataset.medicines.map(({ slug, updatedAt }) => ({ slug, updatedAt }));
    },
  };

  const generics: GenericRepository = {
    async findByIds(ids) {
      return pickByIds(genericsById, ids);
    },
  };

  const manufacturers: ManufacturerRepository = {
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
  };

  return { medicines, generics, manufacturers, pharmacies, prices };
}
