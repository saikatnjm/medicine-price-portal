/** Serialisable marker data passed from list views (server) to the results map (client). */
import { FACILITY_KIND_LABEL } from "../domain/healthcare";
import type { FacilityListItem, PharmacyListItem } from "../domain/read-models";
import { isValidCoordinates } from "./geo";
import { routes } from "./routes";

export interface MapMarker {
  id: string;
  name: string;
  href: string;
  lat: number;
  lon: number;
  /** Short text shown under the name in the popup, e.g. "Hospital · Dhanmondi, Dhaka". */
  label: string;
}

function joinLabel(kind: string, place: string): string {
  return place ? `${kind} · ${place}` : kind;
}

/** Markers for the given page of facilities; records without valid coordinates are skipped. */
export function facilityMarkers(items: readonly FacilityListItem[]): MapMarker[] {
  const markers: MapMarker[] = [];
  for (const { facility, place } of items) {
    const c = facility.coordinates;
    if (!isValidCoordinates(c)) continue;
    markers.push({
      id: facility.id,
      name: facility.name,
      href: routes.hospital(facility.slug),
      lat: c.lat,
      lon: c.lon,
      label: joinLabel(FACILITY_KIND_LABEL[facility.kind], place.label),
    });
  }
  return markers;
}

/** Markers for the given page of pharmacies; records without valid coordinates are skipped. */
export function pharmacyMarkers(items: readonly PharmacyListItem[]): MapMarker[] {
  const markers: MapMarker[] = [];
  for (const { pharmacy, place } of items) {
    const c = pharmacy.coordinates;
    if (!isValidCoordinates(c)) continue;
    markers.push({
      id: pharmacy.id,
      name: pharmacy.name,
      href: routes.pharmacy(pharmacy.slug),
      lat: c.lat,
      lon: c.lon,
      label: joinLabel("Pharmacy", place.label),
    });
  }
  return markers;
}
