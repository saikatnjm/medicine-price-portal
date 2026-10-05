import { FACILITY_KINDS, hasPublicDetails, type Facility, type FacilityKind } from "../domain/healthcare";
import type {
  DirectoryFilters,
  DirectoryIndexEntry,
  DirectoryListResult,
  FacilityDetail,
  FacilityKindCount,
  FacilityListItem,
} from "../domain/read-models";
import { parseNearParam } from "../lib/geo";
import { cleanSearchQuery } from "../lib/search-config";
import type { DirectoryListParams, Repositories } from "../repositories";
import { toDoctorItems, toFacilityItems, toPharmacyItems } from "./directory-items";
import { DIRECTORY_PAGE_SIZE, PlaceResolver, toPage, totalPages } from "./places";

/** Detail page "nearby" sections. */
export const NEARBY_LIMIT = 6;
export const NEARBY_RADIUS_KM = 5;
const DETAIL_DOCTOR_LIMIT = 12;

/** Raw list input as it arrives from the URL; every field is optional and validated here. */
export interface DirectoryListInput {
  query?: string | null;
  /** Location slug (division, district or area). */
  location?: string | null;
  /** "lat,lon" from the "near me" control. */
  near?: string | null;
  page?: number;
  pageSize?: number;
}

export interface FacilityListInput extends DirectoryListInput {
  kind?: string | null;
  specialty?: string | null;
  emergency?: boolean;
}

export type { DirectoryListResult };

export function isFacilityKind(value: string | null | undefined): value is FacilityKind {
  return (FACILITY_KINDS as readonly string[]).includes(value ?? "");
}

/** Resolves the URL input shared by all directory lists. Never throws. */
export async function resolveDirectoryInput(
  repos: Repositories,
  places: PlaceResolver,
  input: DirectoryListInput,
): Promise<{ filters: DirectoryFilters; params: DirectoryListParams }> {
  const query = cleanSearchQuery(input.query);
  const location = input.location ? await repos.locations.findBySlug(input.location) : null;
  const near = parseNearParam(input.near);
  const page = toPage(input.page);
  const pageSize = input.pageSize ?? DIRECTORY_PAGE_SIZE;
  return {
    filters: { query, kind: null, location, specialty: null, facility: null, emergencyOnly: false, near },
    params: {
      query: query || undefined,
      locationIds: location ? places.matchIdsOf(location) : undefined,
      near: near ?? undefined,
      page,
      pageSize,
    },
  };
}

/** Hospitals, clinics, diagnostic centres and other non-pharmacy facilities. */
export class FacilityService {
  constructor(private readonly repos: Repositories) {}

  /** Filtered list for /hospitals and combination pages. Never throws on bad input. */
  async listFacilities(input: FacilityListInput = {}): Promise<DirectoryListResult<FacilityListItem>> {
    const places = await PlaceResolver.create(this.repos);
    const { filters, params } = await resolveDirectoryInput(this.repos, places, input);
    const kind = isFacilityKind(input.kind) ? input.kind : null;
    const specialty = input.specialty ? await this.repos.specialties.findBySlug(input.specialty) : null;
    const emergencyOnly = input.emergency === true;
    const result = await this.repos.facilities.list({
      ...params,
      kind: kind ?? undefined,
      specialtyId: specialty?.id,
      emergencyOnly,
    });
    return {
      filters: { ...filters, kind, specialty, emergencyOnly },
      results: {
        ...result,
        items: await toFacilityItems(result.items, this.repos, places, filters.near),
        totalPages: totalPages(result.total, params.pageSize),
      },
    };
  }

  /** Returns null for unknown slugs (the page renders a 404). */
  async getFacilityDetail(slug: string): Promise<FacilityDetail | null> {
    const facility = await this.repos.facilities.findBySlug(slug);
    if (!facility) return null;
    const places = await PlaceResolver.create(this.repos);
    const nearby = this.nearbyParams(facility);
    const [[item], sources, doctors, nearbyFacilities, nearbyPharmacies] = await Promise.all([
      toFacilityItems([facility], this.repos, places),
      this.repos.sources.findByIds([facility.provenance.sourceId]),
      this.repos.doctors.list({ facilityId: facility.id, page: 1, pageSize: DETAIL_DOCTOR_LIMIT }),
      nearby ? this.repos.facilities.list({ ...nearby, pageSize: NEARBY_LIMIT + 1 }) : null,
      nearby ? this.repos.pharmacyDirectory.list({ ...nearby, pageSize: NEARBY_LIMIT }) : null,
    ]);
    if (!item) return null;
    const near = facility.coordinates ?? null;
    return {
      ...item,
      source: sources[0] ?? null,
      indexable: hasPublicDetails(facility),
      doctors: await toDoctorItems(doctors.items, this.repos, places),
      nearbyFacilities: await toFacilityItems(
        (nearbyFacilities?.items ?? []).filter((f) => f.id !== facility.id).slice(0, NEARBY_LIMIT),
        this.repos,
        places,
        near,
      ),
      nearbyPharmacies: toPharmacyItems(nearbyPharmacies?.items ?? [], places, near),
    };
  }

  /** Nearby = within NEARBY_RADIUS_KM when the facility has coordinates, else same area/district. */
  private nearbyParams(facility: Facility): Omit<DirectoryListParams, "pageSize"> | null {
    if (facility.coordinates) return { near: facility.coordinates, radiusKm: NEARBY_RADIUS_KM, page: 1 };
    const locationId = facility.areaId ?? facility.districtId;
    return locationId ? { locationIds: [locationId], page: 1 } : null;
  }

  async countByKind(filter?: (f: Facility) => boolean): Promise<FacilityKindCount[]> {
    const all = await this.repos.facilities.listAll();
    const counts = new Map<FacilityKind, number>();
    for (const f of all) if (!filter || filter(f)) counts.set(f.kind, (counts.get(f.kind) ?? 0) + 1);
    return FACILITY_KINDS.flatMap((kind) => {
      const count = counts.get(kind) ?? 0;
      return count > 0 ? [{ kind, count }] : [];
    });
  }

  /** Indexable facility pages only (thin records are noindex and left out of the sitemap). */
  async listIndex(): Promise<DirectoryIndexEntry[]> {
    const all = await this.repos.facilities.listAll();
    return all.filter((f) => hasPublicDetails(f)).map(({ slug, updatedAt }) => ({ slug, updatedAt }));
  }
}
