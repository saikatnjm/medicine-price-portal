import { isIndexableRecord } from "../domain/healthcare";
import type { CombinationIndexEntry, DirectorySummary } from "../domain/read-models";
import type { Repositories } from "../repositories";
import { loadDirectoryStats, MIN_COMBINATION_RESULTS } from "./directory-stats";
import { PlaceResolver } from "./places";
import { relatedForLocation, relatedForSpecialty, type RelatedSearch } from "../lib/related-searches";

/** Site-wide directory facts: homepage counts and indexable combination pages. */
export class DirectoryService {
  constructor(private readonly repos: Repositories) {}

  async getSummary(): Promise<DirectorySummary> {
    const places = await PlaceResolver.create(this.repos);
    const [stats, medicineCount, specialties, sources] = await Promise.all([
      loadDirectoryStats(this.repos, places),
      this.repos.medicines.count(),
      this.repos.specialties.listAll(),
      this.repos.sources.listAll(),
    ]);
    return {
      medicineCount,
      facilityCount: stats.facilities.length,
      hospitalCount: stats.facilities.filter((f) => f.kind === "hospital").length,
      pharmacyCount: stats.pharmacies.length,
      doctorCount: stats.doctors.length,
      specialtyCount: specialties.length,
      districtCount: places.all.filter((l) => l.level === "district").length,
      areaCount: places.all.filter((l) => l.level === "area").length,
      sources,
    };
  }

  /**
   * Location (and location × specialty) landing pages with at least
   * MIN_COMBINATION_RESULTS records, so no empty or thin pages are generated.
   */
  async listCombinations(): Promise<CombinationIndexEntry[]> {
    const places = await PlaceResolver.create(this.repos);
    const [stats, specialties] = await Promise.all([
      loadDirectoryStats(this.repos, places),
      this.repos.specialties.listAll(),
    ]);
    const entries: CombinationIndexEntry[] = [];
    for (const location of places.all) {
      const c = stats.countsFor(location.id);
      if (c.facilityCount >= MIN_COMBINATION_RESULTS)
        entries.push({ type: "hospitals", locationSlug: location.slug, count: c.facilityCount });
      if (c.pharmacyCount >= MIN_COMBINATION_RESULTS)
        entries.push({ type: "pharmacies", locationSlug: location.slug, count: c.pharmacyCount });
      if (c.doctorCount >= MIN_COMBINATION_RESULTS)
        entries.push({ type: "doctors", locationSlug: location.slug, count: c.doctorCount });
      for (const s of specialties) {
        const facilities = stats.facilitiesWithSpecialty(s.id, location.id);
        const doctors = stats.doctorsWithSpecialty(s.id, location.id);
        if (facilities >= MIN_COMBINATION_RESULTS)
          entries.push({ type: "hospitals", locationSlug: location.slug, specialtySlug: s.slug, count: facilities });
        if (doctors >= MIN_COMBINATION_RESULTS)
          entries.push({ type: "doctors", locationSlug: location.slug, specialtySlug: s.slug, count: doctors });
      }
    }
    return entries;
  }

  /** "People also search for" links for a specialty page (only existing, indexable pages). */
  async relatedForSpecialty(specialtySlug: string, limit?: number): Promise<RelatedSearch[]> {
    const [places, specialty, combinations] = await Promise.all([
      PlaceResolver.create(this.repos),
      this.repos.specialties.findBySlug(specialtySlug),
      this.listCombinations(),
    ]);
    if (!specialty) return [];
    // Areas share names across districts ("Sadar"), so only divisions and districts are named here.
    const placeName = (slug: string) => {
      const location = places.all.find((l) => l.slug === slug);
      return location && location.level !== "area" ? location.name : undefined;
    };
    return relatedForSpecialty({ specialty, combinations, placeName, limit });
  }

  /** "People also search for" links for a location page. */
  async relatedForLocation(locationSlug: string, placeName: string, limit?: number): Promise<RelatedSearch[]> {
    const [specialties, combinations] = await Promise.all([this.repos.specialties.listAll(), this.listCombinations()]);
    return relatedForLocation({
      locationSlug,
      placeName,
      combinations,
      specialtyOf: (slug) => specialties.find((s) => s.slug === slug),
      limit,
    });
  }

  /** Whether a combination page has enough records to be indexed. */
  async isIndexableCombination(
    type: CombinationIndexEntry["type"],
    locationSlug: string,
    specialtySlug?: string,
  ): Promise<boolean> {
    return (await this.listCombinations()).some(
      (e) => e.type === type && e.locationSlug === locationSlug && e.specialtySlug === specialtySlug,
    );
  }

  /** Facilities with public details, for counts in copy ("1,240 hospitals with contact details"). */
  async countFacilitiesWithDetails(): Promise<number> {
    const all = await this.repos.facilities.listAll();
    return all.filter((f) => isIndexableRecord(f)).length;
  }
}
