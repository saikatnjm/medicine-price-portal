import type {
  DivisionWithDistricts,
  LocationDetail,
  LocationListItem,
} from "../domain/read-models";
import { FACILITY_KINDS, type Location } from "../domain/healthcare";
import type { Repositories } from "../repositories";
import { toDoctorItems, toFacilityItems, toPharmacyItems } from "./directory-items";
import { loadDirectoryStats, totalOf, type DirectoryStats } from "./directory-stats";
import { PlaceResolver } from "./places";

const DETAIL_LIST_LIMIT = 6;
const collator = new Intl.Collator("en", { sensitivity: "base" });

function byActivityThenName(a: LocationListItem, b: LocationListItem): number {
  return Number(totalOf(b) > 0) - Number(totalOf(a) > 0) || collator.compare(a.location.name, b.location.name);
}

export class LocationService {
  constructor(private readonly repos: Repositories) {}

  private item(stats: DirectoryStats, location: Location): LocationListItem {
    return { location, ...stats.countsFor(location.id) };
  }

  /** Divisions with their districts and counts, for /locations and the homepage. */
  async listLocationTree(): Promise<DivisionWithDistricts[]> {
    const places = await PlaceResolver.create(this.repos);
    const stats = await loadDirectoryStats(this.repos, places);
    return places
      .divisions()
      .sort((a, b) => collator.compare(a.name, b.name))
      .map((division) => ({
        division,
        ...stats.countsFor(division.id),
        districts: places
          .childrenOf(division.id)
          .map((d) => this.item(stats, d))
          .sort((a, b) => collator.compare(a.location.name, b.location.name)),
      }));
  }

  /** Returns null for unknown slugs (the page renders a 404). */
  async getLocationDetail(slug: string): Promise<LocationDetail | null> {
    const location = await this.repos.locations.findBySlug(slug);
    if (!location) return null;
    const places = await PlaceResolver.create(this.repos);
    const stats = await loadDirectoryStats(this.repos, places);
    const locationIds = places.matchIdsOf(location);
    const list = { locationIds, page: 1, pageSize: DETAIL_LIST_LIMIT };

    const [hospitals, clinics, diagnosticCentres, facilities, pharmacies, doctors, specialties] = await Promise.all([
      this.repos.facilities.list({ ...list, kind: "hospital" }),
      this.repos.facilities.list({ ...list, kinds: ["clinic", "health_centre"] }),
      this.repos.facilities.list({ ...list, kind: "diagnostic_centre" }),
      this.repos.facilities.list(list),
      this.repos.pharmacyDirectory.list(list),
      this.repos.doctors.list(list),
      this.repos.specialties.listAll(),
    ]);
    // Hospitals first, then other facilities, without duplicates.
    const seen = new Set(hospitals.items.map((f) => f.id));
    const shownFacilities = [...hospitals.items, ...facilities.items.filter((f) => !seen.has(f.id))].slice(
      0,
      DETAIL_LIST_LIMIT,
    );
    const counts = stats.countsFor(location.id);
    const kindCounts = this.kindCounts(stats, places, location);

    return {
      location,
      ...counts,
      ancestors: places.ancestorsOf(location),
      children: places
        .childrenOf(location.id)
        .map((c) => this.item(stats, c))
        .sort(byActivityThenName),
      kindCounts,
      facilities: await toFacilityItems(shownFacilities, this.repos, places),
      hospitals: await toFacilityItems(hospitals.items, this.repos, places),
      clinics: await toFacilityItems(clinics.items, this.repos, places),
      diagnosticCentres: await toFacilityItems(diagnosticCentres.items, this.repos, places),
      pharmacies: toPharmacyItems(pharmacies.items, places),
      doctors: await toDoctorItems(doctors.items, this.repos, places),
      specialties: specialties
        .map((specialty) => ({
          specialty,
          facilityCount: stats.facilitiesWithSpecialty(specialty.id, location.id),
          doctorCount: stats.doctorsWithSpecialty(specialty.id, location.id),
        }))
        .filter((s) => s.facilityCount + s.doctorCount > 0)
        .sort((a, b) => b.facilityCount + b.doctorCount - (a.facilityCount + a.doctorCount)),
      indexable: totalOf(counts) > 0,
    };
  }

  private kindCounts(stats: DirectoryStats, places: PlaceResolver, location: Location) {
    const counts = new Map<string, number>();
    for (const f of stats.facilities)
      if (places.contains(location, f)) counts.set(f.kind, (counts.get(f.kind) ?? 0) + 1);
    return FACILITY_KINDS.flatMap((kind) => {
      const count = counts.get(kind) ?? 0;
      return count > 0 ? [{ kind, count }] : [];
    });
  }

  /** Locations with at least one record (sitemap; empty locations are noindex). */
  async listIndexable(): Promise<LocationListItem[]> {
    const places = await PlaceResolver.create(this.repos);
    const stats = await loadDirectoryStats(this.repos, places);
    return places.all.map((l) => this.item(stats, l)).filter((l) => totalOf(l) > 0);
  }
}
