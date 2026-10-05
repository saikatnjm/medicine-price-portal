import { FACILITY_KIND_SEARCH_TERMS, FACILITY_KINDS } from "../../domain/healthcare";
import type { Coordinates, Doctor, Facility, Location, PostalLocation, Specialty } from "../../domain/healthcare";
import type { ID, Pharmacy } from "../../domain/types";
import { distanceKm, isValidCoordinates } from "../../lib/geo";
import type { DirectoryListParams, DirectoryRepositories } from "../../repositories";
import type { LocalDataset } from "./dataset";
import { normalizeSearchText } from "../../lib/text";
import { buildTextIndex, paginate, searchTextIndex, type TextIndexEntry } from "./text-index";

const collator = new Intl.Collator("en", { numeric: true, sensitivity: "base" });
const kindOrder = new Map(FACILITY_KINDS.map((kind, index) => [kind, index]));

function byKey<T extends { id: ID; slug: string }>(items: readonly T[]) {
  return { byId: new Map(items.map((i) => [i.id, i])), bySlug: new Map(items.map((i) => [i.slug, i])) };
}

function pick<T>(map: ReadonlyMap<ID, T>, ids: readonly ID[]): T[] {
  return [...new Set(ids)].flatMap((id) => {
    const item = map.get(id);
    return item ? [item] : [];
  });
}

/** Location ids a record belongs to (its area and district). */
function placeIdsOf(record: PostalLocation): ID[] {
  return [record.areaId, record.districtId].filter((id): id is ID => Boolean(id));
}

function inLocations(locationIds: readonly ID[] | undefined, placeIds: readonly ID[]): boolean {
  return !locationIds || locationIds.length === 0 || placeIds.some((id) => locationIds.includes(id));
}

/**
 * Nearest-first ordering for `near` queries; records without coordinates are
 * dropped. A linear scan is fine at the current data size (docs/DECISIONS.md).
 */
function byDistance<T>(
  items: readonly T[],
  coordinatesOf: (item: T) => Coordinates | undefined,
  { near, radiusKm }: Pick<DirectoryListParams, "near" | "radiusKm">,
): T[] {
  if (!near) return [...items];
  return items
    .flatMap((item) => {
      const c = coordinatesOf(item);
      if (!isValidCoordinates(c)) return [];
      const km = distanceKm(near, c);
      return radiusKm === undefined || km <= radiusKm ? [{ item, km }] : [];
    })
    .sort((a, b) => a.km - b.km)
    .map(({ item }) => item);
}

export function withoutExcluded(dataset: LocalDataset): LocalDataset {
  const visible = <T extends { reviewStatus?: string }>(items: readonly T[]) =>
    items.filter((i) => i.reviewStatus !== "excluded");
  return { ...dataset, facilities: visible(dataset.facilities), pharmacies: visible(dataset.pharmacies) };
}

/** Builds directory repositories (facilities, pharmacies, locations, specialties, doctors). */
export function createLocalDirectoryRepositories(source: LocalDataset): DirectoryRepositories {
  // Excluded records stay in the data files for audit but never reach the site.
  const dataset = withoutExcluded(source);
  const locations = byKey(dataset.locations);
  const specialties = byKey(dataset.specialties);
  const facilities = byKey(dataset.facilities);
  const doctors = byKey(dataset.doctors);

  /** Locality, area, district and division names of a record, for location search terms. */
  const placeWords = (record: PostalLocation) => {
    const area = record.areaId ? locations.byId.get(record.areaId) : undefined;
    const district = record.districtId ? locations.byId.get(record.districtId) : undefined;
    const division = district?.parentId ? locations.byId.get(district.parentId) : undefined;
    return [record.locality, record.city, area?.name, area?.nameBn, district?.name, district?.nameBn, division?.name]
      .filter(Boolean)
      .join(" ");
  };
  const specialtyWords = (ids: readonly ID[]) =>
    pick(specialties.byId, ids)
      .map((s: Specialty) => `${s.name} ${s.practitionerTitle} ${s.aliases.join(" ")}`)
      .join(" ");
  /** A doctor's places and coordinates come from their chambers (or the chamber's facility). */
  const chamberPlaces = (doctor: Doctor) =>
    doctor.chambers.map((c) => {
      const facility = c.facilityId ? facilities.byId.get(c.facilityId) : undefined;
      return { ...facility, ...c, coordinates: c.coordinates ?? facility?.coordinates };
    });

  const byName = <T extends { name: string; slug: string }>(a: T, b: T) =>
    collator.compare(a.name, b.name) || (a.slug < b.slug ? -1 : 1);
  const sortedFacilities = [...dataset.facilities].sort(
    (a, b) => (kindOrder.get(a.kind) ?? 99) - (kindOrder.get(b.kind) ?? 99) || byName(a, b),
  );
  const sortedPharmacies = [...dataset.pharmacies].sort(byName);
  const sortedDoctors = [...dataset.doctors].sort(byName);
  let facilityNames: Map<string, Facility> | null = null;
  let facilityIndex: TextIndexEntry<Facility>[] | null = null;
  let pharmacyIndex: TextIndexEntry<Pharmacy>[] | null = null;
  let doctorIndex: TextIndexEntry<Doctor>[] | null = null;

  return {
    facilities: {
      async findBySlug(slug) {
        return facilities.bySlug.get(slug) ?? null;
      },
      async findByIds(ids) {
        return pick(facilities.byId, ids);
      },
      async findByName(name) {
        // Built once, in display order, so the first of several same-named facilities wins.
        if (!facilityNames) {
          facilityNames = new Map();
          for (const f of sortedFacilities) {
            const key = normalizeSearchText(f.name);
            if (key && !facilityNames.has(key)) facilityNames.set(key, f);
          }
        }
        return facilityNames.get(normalizeSearchText(name)) ?? null;
      },
      async list({ query, kind, kinds, locationIds, specialtyId, emergencyOnly, near, radiusKm, page, pageSize }) {
        facilityIndex ??= buildTextIndex(
          sortedFacilities,
          (f) => `${f.name} ${f.altName ?? ""}`,
          (f) => `${placeWords(f)} ${FACILITY_KIND_SEARCH_TERMS[f.kind]} ${specialtyWords(f.specialtyIds)}`,
        );
        const matches = searchTextIndex(facilityIndex, query).filter(
          (f) =>
            (!kind || f.kind === kind) &&
            (!kinds || kinds.includes(f.kind)) &&
            inLocations(locationIds, placeIdsOf(f)) &&
            (!specialtyId || f.specialtyIds.includes(specialtyId)) &&
            (!emergencyOnly || f.emergency === true),
        );
        return paginate(byDistance(matches, (f) => f.coordinates, { near, radiusKm }), page, pageSize);
      },
      async listAll() {
        return [...sortedFacilities];
      },
    },
    pharmacyDirectory: {
      async list({ query, locationIds, near, radiusKm, page, pageSize }) {
        pharmacyIndex ??= buildTextIndex(
          sortedPharmacies,
          (p) => `${p.name} ${p.altName ?? ""}`,
          (p) => `${placeWords(p)} pharmacy pharmacies drug store`,
        );
        const matches = searchTextIndex(pharmacyIndex, query).filter((p) =>
          inLocations(locationIds, placeIdsOf(p)),
        );
        return paginate(byDistance(matches, (p) => p.coordinates, { near, radiusKm }), page, pageSize);
      },
      async listAll() {
        return [...sortedPharmacies];
      },
    },
    locations: {
      async findBySlug(slug) {
        return locations.bySlug.get(slug) ?? null;
      },
      async findByIds(ids) {
        return pick(locations.byId, ids);
      },
      async listAll() {
        return [...dataset.locations].sort((a: Location, b: Location) => collator.compare(a.name, b.name));
      },
    },
    specialties: {
      async findBySlug(slug) {
        return specialties.bySlug.get(slug) ?? null;
      },
      async findByIds(ids) {
        return pick(specialties.byId, ids);
      },
      async listAll() {
        return [...dataset.specialties].sort((a, b) => collator.compare(a.name, b.name));
      },
    },
    doctors: {
      async findBySlug(slug) {
        return doctors.bySlug.get(slug) ?? null;
      },
      async list({ query, locationIds, specialtyId, facilityId, near, radiusKm, page, pageSize }) {
        doctorIndex ??= buildTextIndex(
          sortedDoctors,
          (d) => d.name.replace(/^(dr|prof|professor)\.?\s+/i, ""),
          (d) =>
            `${d.name} doctor ${specialtyWords(d.specialtyIds)} ${chamberPlaces(d)
              .map((c) => `${c.facilityName ?? c.name ?? ""} ${placeWords(c)}`)
              .join(" ")}`,
        );
        const matches = searchTextIndex(doctorIndex, query).filter(
          (d) =>
            inLocations(locationIds, chamberPlaces(d).flatMap(placeIdsOf)) &&
            (!specialtyId || d.specialtyIds.includes(specialtyId)) &&
            (!facilityId || d.chambers.some((c) => c.facilityId === facilityId)),
        );
        const nearestChamber = (d: Doctor) => {
          if (!near) return undefined;
          return chamberPlaces(d)
            .map((c) => c.coordinates)
            .filter(isValidCoordinates)
            .sort((a, b) => distanceKm(near, a) - distanceKm(near, b))[0];
        };
        return paginate(byDistance(matches, nearestChamber, { near, radiusKm }), page, pageSize);
      },
      async listAll() {
        return [...sortedDoctors];
      },
    },
  };
}
