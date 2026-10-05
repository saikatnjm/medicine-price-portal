import type { Location, Specialty } from "../domain/healthcare";
import type { SpecialtyDetail, SpecialtyListItem } from "../domain/read-models";
import type { Repositories } from "../repositories";
import { toDoctorItems, toFacilityItems } from "./directory-items";
import { loadDirectoryStats } from "./directory-stats";
import { PlaceResolver } from "./places";

const DETAIL_LIST_LIMIT = 12;
const TOP_LOCATIONS = 10;

/** Related specialties: curated pairs first, then shared aliases. Small and deterministic. */
const RELATED: Record<string, readonly string[]> = {
  cardiology: ["internal-medicine", "nephrology"],
  "gynaecology-obstetrics": ["paediatrics"],
  paediatrics: ["gynaecology-obstetrics"],
};

export class SpecialtyService {
  constructor(private readonly repos: Repositories) {}

  async listSpecialties(): Promise<SpecialtyListItem[]> {
    const places = await PlaceResolver.create(this.repos);
    const [specialties, stats] = await Promise.all([
      this.repos.specialties.listAll(),
      loadDirectoryStats(this.repos, places),
    ]);
    return specialties.map((specialty) => ({
      specialty,
      facilityCount: stats.facilitiesWithSpecialty(specialty.id),
      doctorCount: stats.doctorsWithSpecialty(specialty.id),
    }));
  }

  /** Returns null for unknown slugs (the page renders a 404). */
  async getSpecialtyDetail(slug: string): Promise<SpecialtyDetail | null> {
    const specialty = await this.repos.specialties.findBySlug(slug);
    if (!specialty) return null;
    const places = await PlaceResolver.create(this.repos);
    const [stats, facilities, doctors, all] = await Promise.all([
      loadDirectoryStats(this.repos, places),
      this.repos.facilities.list({ specialtyId: specialty.id, page: 1, pageSize: DETAIL_LIST_LIMIT }),
      this.repos.doctors.list({ specialtyId: specialty.id, page: 1, pageSize: DETAIL_LIST_LIMIT }),
      this.repos.specialties.listAll(),
    ]);
    const topLocations: Array<{ location: Location; count: number }> = places.all
      .filter((l) => l.level === "district")
      .map((location) => ({
        location,
        count:
          stats.facilitiesWithSpecialty(specialty.id, location.id) +
          stats.doctorsWithSpecialty(specialty.id, location.id),
      }))
      .filter((l) => l.count > 0)
      .sort((a, b) => b.count - a.count || a.location.name.localeCompare(b.location.name))
      .slice(0, TOP_LOCATIONS);
    const relatedSlugs = RELATED[specialty.slug] ?? [];
    const related: Specialty[] = relatedSlugs.flatMap((s) => all.filter((x) => x.slug === s));

    return {
      specialty,
      facilityCount: stats.facilitiesWithSpecialty(specialty.id),
      doctorCount: stats.doctorsWithSpecialty(specialty.id),
      facilities: await toFacilityItems(facilities.items, this.repos, places),
      doctors: await toDoctorItems(doctors.items, this.repos, places),
      topLocations,
      related,
    };
  }
}
