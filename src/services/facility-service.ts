import {
  FACILITY_KINDS,
  isIndexableRecord,
  type Facility,
  type FacilityKind,
  type PostalLocation,
} from "../domain/healthcare";
import type {
  DirectoryFilters,
  DirectoryIndexEntry,
  DirectoryListResult,
  FacilityDetail,
  FacilityKindCount,
  FacilityListItem,
  FacilityNearby,
  PharmacyListItem,
  PharmacyNearby,
} from "../domain/read-models";
import type { Pharmacy } from "../domain/types";
import { parseNearParam } from "../lib/geo";
import { cleanSearchQuery } from "../lib/search-config";
import type { DirectoryListParams, Repositories } from "../repositories";
import { toDoctorItems, toFacilityItems, toPharmacyItems } from "./directory-items";
import { DIRECTORY_PAGE_SIZE, PlaceResolver, toPage, totalPages } from "./places";

/** Detail page "nearby" sections. */
export const NEARBY_LIMIT = 5;
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

/** Nearby = within NEARBY_RADIUS_KM when the record has coordinates, else same area/district. */
export function nearbyParams(record: PostalLocation): Omit<DirectoryListParams, "pageSize"> | null {
  if (record.coordinates) return { near: record.coordinates, radiusKm: NEARBY_RADIUS_KM, page: 1 };
  const locationId = record.areaId ?? record.districtId;
  return locationId ? { locationIds: [locationId], page: 1 } : null;
}

async function nearbyFacilityGroup(
  repos: Repositories,
  places: PlaceResolver,
  where: Omit<DirectoryListParams, "pageSize"> | null,
  kinds: readonly FacilityKind[],
  origin: PostalLocation,
  excludeId?: string,
): Promise<FacilityListItem[]> {
  if (!where) return [];
  const result = await repos.facilities.list({ ...where, kinds, pageSize: NEARBY_LIMIT + 1 });
  const items = result.items.filter((f) => f.id !== excludeId).slice(0, NEARBY_LIMIT);
  return toFacilityItems(items, repos, places, origin.coordinates ?? null);
}

async function nearbyPharmacyGroup(
  repos: Repositories,
  places: PlaceResolver,
  where: Omit<DirectoryListParams, "pageSize"> | null,
  origin: PostalLocation,
  excludeId?: string,
): Promise<PharmacyListItem[]> {
  if (!where) return [];
  const result = await repos.pharmacyDirectory.list({ ...where, pageSize: NEARBY_LIMIT + 1 });
  const items = result.items.filter((p) => p.id !== excludeId).slice(0, NEARBY_LIMIT);
  return toPharmacyItems(items, places, origin.coordinates ?? null);
}

/** Nearby hospitals, clinics (and health centres), diagnostic centres and pharmacies of a facility. */
export async function loadFacilityNearby(
  repos: Repositories,
  places: PlaceResolver,
  facility: Facility,
): Promise<FacilityNearby> {
  const where = nearbyParams(facility);
  const [hospitals, clinics, diagnosticCentres, pharmacies] = await Promise.all([
    nearbyFacilityGroup(repos, places, where, ["hospital"], facility, facility.id),
    nearbyFacilityGroup(repos, places, where, ["clinic", "health_centre"], facility, facility.id),
    nearbyFacilityGroup(repos, places, where, ["diagnostic_centre"], facility, facility.id),
    nearbyPharmacyGroup(repos, places, where, facility),
  ]);
  return { hospitals, clinics, diagnosticCentres, pharmacies };
}

/** Nearby hospitals & clinics and pharmacies of a pharmacy. */
export async function loadPharmacyNearby(
  repos: Repositories,
  places: PlaceResolver,
  pharmacy: Pharmacy,
): Promise<PharmacyNearby> {
  const where = nearbyParams(pharmacy);
  const [facilities, pharmacies] = await Promise.all([
    nearbyFacilityGroup(repos, places, where, ["hospital", "clinic", "health_centre"], pharmacy),
    nearbyPharmacyGroup(repos, places, where, pharmacy, pharmacy.id),
  ]);
  return { facilities, pharmacies };
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
    const [[item], sources, doctors, nearby] = await Promise.all([
      toFacilityItems([facility], this.repos, places),
      this.repos.sources.findByIds([facility.provenance.sourceId]),
      this.repos.doctors.list({ facilityId: facility.id, page: 1, pageSize: DETAIL_DOCTOR_LIMIT }),
      loadFacilityNearby(this.repos, places, facility),
    ]);
    if (!item) return null;
    return {
      ...item,
      source: sources[0] ?? null,
      indexable: isIndexableRecord(facility),
      doctors: await toDoctorItems(doctors.items, this.repos, places),
      nearby,
    };
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
    return all.filter((f) => isIndexableRecord(f)).map(({ slug, updatedAt }) => ({ slug, updatedAt }));
  }
}
