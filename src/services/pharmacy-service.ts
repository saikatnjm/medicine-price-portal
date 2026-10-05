import { hasPublicDetails } from "../domain/healthcare";
import type {
  DirectoryIndexEntry,
  PharmacyDetail,
  PharmacyListItem,
  PharmacyPriceEntry,
} from "../domain/read-models";
import type { Pharmacy } from "../domain/types";
import type { Repositories } from "../repositories";
import { toFacilityItems, toPharmacyItems } from "./directory-items";
import {
  NEARBY_LIMIT,
  NEARBY_RADIUS_KM,
  resolveDirectoryInput,
  type DirectoryListInput,
  type DirectoryListResult,
} from "./facility-service";
import { PlaceResolver, totalPages } from "./places";

function compareEntries(a: PharmacyPriceEntry, b: PharmacyPriceEntry): number {
  return (
    a.medicine.brandName.localeCompare(b.medicine.brandName, "en") ||
    a.medicine.strength.localeCompare(b.medicine.strength, "en", { numeric: true })
  );
}

export class PharmacyService {
  constructor(private readonly repos: Repositories) {}

  /** Returns null for unknown slugs (the page renders a 404). */
  async getPharmacyDetail(slug: string): Promise<PharmacyDetail | null> {
    const pharmacy = await this.repos.pharmacies.findBySlug(slug);
    if (!pharmacy) return null;
    const places = await PlaceResolver.create(this.repos);

    const locationId = pharmacy.areaId ?? pharmacy.districtId;
    const nearby = pharmacy.coordinates
      ? { near: pharmacy.coordinates, radiusKm: NEARBY_RADIUS_KM, page: 1 }
      : locationId
        ? { locationIds: [locationId], page: 1 }
        : null;
    const [rawPrices, sources, nearbyPharmacies, nearbyFacilities] = await Promise.all([
      this.repos.prices.listByPharmacy(pharmacy.id),
      this.repos.sources.findByIds([pharmacy.provenance.sourceId]),
      nearby ? this.repos.pharmacyDirectory.list({ ...nearby, pageSize: NEARBY_LIMIT + 1 }) : null,
      nearby ? this.repos.facilities.list({ ...nearby, pageSize: NEARBY_LIMIT }) : null,
    ]);
    const medicines = await this.repos.medicines.findByIds(rawPrices.map((p) => p.medicineId));
    const medicineById = new Map(medicines.map((m) => [m.id, m]));
    const prices: PharmacyPriceEntry[] = rawPrices
      .flatMap((price) => {
        const medicine = medicineById.get(price.medicineId);
        return medicine ? [{ price, medicine }] : [];
      })
      .sort(compareEntries);
    const near = pharmacy.coordinates ?? null;

    return {
      pharmacy,
      prices,
      hasSampleData: prices.some((p) => p.price.source === "sample"),
      place: places.resolve(pharmacy),
      source: sources[0] ?? null,
      indexable: hasPublicDetails(pharmacy) || prices.length > 0,
      nearbyPharmacies: toPharmacyItems(
        (nearbyPharmacies?.items ?? []).filter((p) => p.id !== pharmacy.id).slice(0, NEARBY_LIMIT),
        places,
        near,
      ),
      nearbyFacilities: await toFacilityItems(nearbyFacilities?.items ?? [], this.repos, places, near),
    };
  }

  /** Filtered list for /pharmacies and /pharmacies/[location]. Never throws on bad input. */
  async listPharmacies(input: DirectoryListInput = {}): Promise<DirectoryListResult<PharmacyListItem>> {
    const places = await PlaceResolver.create(this.repos);
    const { filters, params } = await resolveDirectoryInput(this.repos, places, input);
    const result = await this.repos.pharmacyDirectory.list(params);
    return {
      filters,
      results: {
        ...result,
        items: toPharmacyItems(result.items, places, filters.near),
        totalPages: totalPages(result.total, params.pageSize),
      },
    };
  }

  async listAll(): Promise<Pharmacy[]> {
    return this.repos.pharmacyDirectory.listAll();
  }

  /** Indexable pharmacy pages only (thin records are noindex and left out of the sitemap). */
  async listIndex(): Promise<DirectoryIndexEntry[]> {
    const [all, priceCount] = await Promise.all([
      this.repos.pharmacyDirectory.listAll(),
      this.repos.prices.count(),
    ]);
    // Pharmacies with price records are useful pages even without contact details.
    const withPrices = new Set<string>();
    if (priceCount > 0) {
      const lists = await Promise.all(all.map((p) => this.repos.prices.listByPharmacy(p.id)));
      for (const list of lists) for (const price of list) withPrices.add(price.pharmacyId);
    }
    return all
      .filter((p) => hasPublicDetails(p) || withPrices.has(p.id))
      .map(({ slug, updatedAt }) => ({ slug, updatedAt }));
  }
}
