/**
 * Aggregate counts over the directory (per location, kind and specialty).
 * Computed from full lists: cheap for the local dataset. An API-backed provider
 * would serve these from an aggregate endpoint instead.
 */
import type { Doctor, Facility, PostalLocation } from "../domain/healthcare";
import type { LocationCounts } from "../domain/read-models";
import type { ID, Pharmacy } from "../domain/types";
import type { Repositories } from "../repositories";
import type { PlaceResolver } from "./places";

/** Combination pages (e.g. /hospitals/dhaka/cardiology) need at least this many records to be indexed. */
export const MIN_COMBINATION_RESULTS = 3;

const emptyCounts = (): LocationCounts => ({ facilityCount: 0, hospitalCount: 0, pharmacyCount: 0, doctorCount: 0 });

export interface DirectoryStats {
  facilities: readonly Facility[];
  pharmacies: readonly Pharmacy[];
  doctors: readonly Doctor[];
  /** Counts per location id (areas, districts and divisions). */
  countsFor(locationId: ID): LocationCounts;
  /** Facility count per specialty id, optionally within a location. */
  facilitiesWithSpecialty(specialtyId: ID, locationId?: ID): number;
  doctorsWithSpecialty(specialtyId: ID, locationId?: ID): number;
}

/**
 * Stats per repositories instance. The local dataset is immutable for the life
 * of the process, so they are computed once; an API-backed provider would
 * replace this with an aggregate endpoint (and its own caching).
 */
const statsCache = new WeakMap<Repositories, Promise<DirectoryStats>>();

export function loadDirectoryStats(repos: Repositories, places: PlaceResolver): Promise<DirectoryStats> {
  let stats = statsCache.get(repos);
  if (!stats) {
    stats = computeDirectoryStats(repos, places);
    statsCache.set(repos, stats);
    // Do not keep a failed computation.
    stats.catch(() => statsCache.delete(repos));
  }
  return stats;
}

async function computeDirectoryStats(repos: Repositories, places: PlaceResolver): Promise<DirectoryStats> {
  const [facilities, pharmacies, doctors] = await Promise.all([
    repos.facilities.listAll(),
    repos.pharmacyDirectory.listAll(),
    repos.doctors.listAll(),
  ]);
  const counts = new Map<ID, LocationCounts>();
  const facilitySpecialty = new Map<string, number>();
  const doctorSpecialty = new Map<string, number>();

  /** The record's area, district and division ids (each once). */
  const placeIds = (record: PostalLocation): ID[] => {
    const place = places.resolve(record);
    return [place.area?.id, place.district?.id, place.division?.id].filter((id): id is ID => Boolean(id));
  };
  const bump = (ids: readonly ID[], field: keyof LocationCounts) => {
    for (const id of ids) {
      const c = counts.get(id) ?? emptyCounts();
      c[field] += 1;
      counts.set(id, c);
    }
  };
  const bumpSpecialty = (map: Map<string, number>, specialtyIds: readonly ID[], ids: readonly ID[]) => {
    for (const s of specialtyIds) for (const key of [s, ...ids.map((id) => `${s}|${id}`)]) map.set(key, (map.get(key) ?? 0) + 1);
  };

  for (const f of facilities) {
    const ids = placeIds(f);
    bump(ids, "facilityCount");
    if (f.kind === "hospital") bump(ids, "hospitalCount");
    bumpSpecialty(facilitySpecialty, f.specialtyIds, ids);
  }
  for (const p of pharmacies) bump(placeIds(p), "pharmacyCount");
  for (const d of doctors) {
    const ids = [...new Set(d.chambers.flatMap(placeIds))];
    bump(ids, "doctorCount");
    bumpSpecialty(doctorSpecialty, d.specialtyIds, ids);
  }

  return {
    facilities,
    pharmacies,
    doctors,
    countsFor: (id) => counts.get(id) ?? emptyCounts(),
    facilitiesWithSpecialty: (s, id) => facilitySpecialty.get(id ? `${s}|${id}` : s) ?? 0,
    doctorsWithSpecialty: (s, id) => doctorSpecialty.get(id ? `${s}|${id}` : s) ?? 0,
  };
}

export function totalOf(c: LocationCounts): number {
  return c.facilityCount + c.pharmacyCount + c.doctorCount;
}
