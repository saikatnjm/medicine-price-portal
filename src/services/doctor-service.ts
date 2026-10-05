import type { DirectoryIndexEntry, DoctorDetail, DoctorListItem } from "../domain/read-models";
import type { Repositories } from "../repositories";
import { toChamberView, toDoctorItems } from "./directory-items";
import {
  resolveDirectoryInput,
  type DirectoryListInput,
  type DirectoryListResult,
} from "./facility-service";
import { PlaceResolver, totalPages } from "./places";

const RELATED_LIMIT = 6;

export interface DoctorListInput extends DirectoryListInput {
  specialty?: string | null;
  /** Facility slug. */
  hospital?: string | null;
}

/**
 * Doctor profiles. Only verified or consented records are ever stored, and no
 * such source exists yet, so lists are empty and the UI says so honestly.
 */
export class DoctorService {
  constructor(private readonly repos: Repositories) {}

  async listDoctors(input: DoctorListInput = {}): Promise<DirectoryListResult<DoctorListItem>> {
    const places = await PlaceResolver.create(this.repos);
    const { filters, params } = await resolveDirectoryInput(this.repos, places, input);
    const [specialty, facility] = await Promise.all([
      input.specialty ? this.repos.specialties.findBySlug(input.specialty) : null,
      input.hospital ? this.repos.facilities.findBySlug(input.hospital) : null,
    ]);
    const result = await this.repos.doctors.list({
      ...params,
      specialtyId: specialty?.id,
      facilityId: facility?.id,
    });
    return {
      filters: { ...filters, specialty, facility },
      results: {
        ...result,
        items: await toDoctorItems(result.items, this.repos, places, filters.near),
        totalPages: totalPages(result.total, params.pageSize),
      },
    };
  }

  /** Returns null for unknown slugs (the page renders a 404). */
  async getDoctorDetail(slug: string): Promise<DoctorDetail | null> {
    const doctor = await this.repos.doctors.findBySlug(slug);
    if (!doctor) return null;
    const places = await PlaceResolver.create(this.repos);
    const firstSpecialty = doctor.specialtyIds[0];
    const [specialties, facilities, sources, related] = await Promise.all([
      this.repos.specialties.findByIds(doctor.specialtyIds),
      this.repos.facilities.findByIds(doctor.chambers.flatMap((c) => (c.facilityId ? [c.facilityId] : []))),
      this.repos.sources.findByIds([doctor.provenance.sourceId]),
      firstSpecialty
        ? this.repos.doctors.list({ specialtyId: firstSpecialty, page: 1, pageSize: RELATED_LIMIT + 1 })
        : null,
    ]);
    const facilityById = new Map(facilities.map((f) => [f.id, f]));
    return {
      doctor,
      specialties,
      chambers: doctor.chambers.map((c) => toChamberView(c, facilityById, places)),
      source: sources[0] ?? null,
      related: await toDoctorItems(
        (related?.items ?? []).filter((d) => d.id !== doctor.id).slice(0, RELATED_LIMIT),
        this.repos,
        places,
      ),
    };
  }

  async listIndex(): Promise<DirectoryIndexEntry[]> {
    const all = await this.repos.doctors.listAll();
    return all.map(({ slug, updatedAt }) => ({ slug, updatedAt }));
  }
}
