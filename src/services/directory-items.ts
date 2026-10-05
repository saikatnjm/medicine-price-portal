/** Builds directory list items (place, specialties, chambers, distance) from entities. */
import type { Coordinates, Doctor, DoctorChamber, Facility } from "../domain/healthcare";
import type {
  ChamberView,
  DoctorListItem,
  FacilityListItem,
  PharmacyListItem,
} from "../domain/read-models";
import type { Pharmacy } from "../domain/types";
import { distanceKm, isValidCoordinates } from "../lib/geo";
import type { Repositories } from "../repositories";
import type { PlaceResolver } from "./places";

type Repos = Pick<Repositories, "specialties" | "facilities">;

function distanceFrom(near: Coordinates | null | undefined, c: Coordinates | null | undefined): number | undefined {
  return near && isValidCoordinates(c) ? distanceKm(near, c) : undefined;
}

async function specialtyLookup(repos: Repos, ids: readonly string[]) {
  const specialties = ids.length ? await repos.specialties.findByIds(ids) : [];
  const byId = new Map(specialties.map((s) => [s.id, s]));
  return (wanted: readonly string[]) =>
    wanted.flatMap((id) => {
      const s = byId.get(id);
      return s ? [s] : [];
    });
}

export async function toFacilityItems(
  facilities: readonly Facility[],
  repos: Repos,
  places: PlaceResolver,
  near?: Coordinates | null,
): Promise<FacilityListItem[]> {
  if (facilities.length === 0) return [];
  const specialtiesOf = await specialtyLookup(repos, facilities.flatMap((f) => f.specialtyIds));
  return facilities.map((facility) => ({
    facility,
    place: places.resolve(facility),
    specialties: specialtiesOf(facility.specialtyIds),
    distanceKm: distanceFrom(near, facility.coordinates),
  }));
}

export function toPharmacyItems(
  pharmacies: readonly Pharmacy[],
  places: PlaceResolver,
  near?: Coordinates | null,
): PharmacyListItem[] {
  return pharmacies.map((pharmacy) => ({
    pharmacy,
    place: places.resolve(pharmacy),
    distanceKm: distanceFrom(near, pharmacy.coordinates),
  }));
}

export function toChamberView(
  chamber: DoctorChamber,
  facilityById: ReadonlyMap<string, Facility>,
  places: PlaceResolver,
): ChamberView {
  const facility = chamber.facilityId ? (facilityById.get(chamber.facilityId) ?? null) : null;
  // Chamber fields are specific to the doctor; the facility fills only what the chamber lacks.
  const location = {
    districtId: chamber.districtId ?? facility?.districtId,
    areaId: chamber.areaId ?? facility?.areaId,
    locality: chamber.locality ?? facility?.locality,
  };
  const coordinates = chamber.coordinates ?? facility?.coordinates;
  return {
    chamber,
    facility,
    name: facility?.name ?? chamber.facilityName ?? "Private chamber",
    place: places.resolve(location),
    coordinates: isValidCoordinates(coordinates) ? coordinates : null,
  };
}

export async function toDoctorItems(
  doctors: readonly Doctor[],
  repos: Repos,
  places: PlaceResolver,
  near?: Coordinates | null,
): Promise<DoctorListItem[]> {
  if (doctors.length === 0) return [];
  const [specialtiesOf, facilities] = await Promise.all([
    specialtyLookup(repos, doctors.flatMap((d) => d.specialtyIds)),
    repos.facilities.findByIds(doctors.flatMap((d) => d.chambers.flatMap((c) => (c.facilityId ? [c.facilityId] : [])))),
  ]);
  const facilityById = new Map(facilities.map((f) => [f.id, f]));
  return doctors.map((doctor) => {
    const chambers = doctor.chambers.map((c) => toChamberView(c, facilityById, places));
    // With a `near` point the closest chamber is shown; otherwise the primary (first) one.
    const withDistance = chambers.map((view) => ({ view, km: distanceFrom(near, view.coordinates) }));
    const closest = near
      ? withDistance.filter((c) => c.km !== undefined).sort((a, b) => (a.km ?? 0) - (b.km ?? 0))[0]
      : undefined;
    return {
      doctor,
      specialties: specialtiesOf(doctor.specialtyIds),
      chamber: closest?.view ?? chambers[0] ?? null,
      distanceKm: closest?.km,
    };
  });
}
