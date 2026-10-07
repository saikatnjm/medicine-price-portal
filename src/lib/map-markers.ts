/** Serialisable marker data passed from list views (server) to the results map (client). */
import type { FacilityListItem, PharmacyListItem } from "../domain/read-models";
import { localizePath, type Locale } from "../i18n/config";
import { getLocale } from "../i18n/server";
import { createT } from "../i18n/translate";
import { facilityKindLabel } from "./directory-labels";
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

/** Markers for the given page of facilities (labels and links in the request language unless `lang` is given); records without valid coordinates are skipped. */
export function facilityMarkers(items: readonly FacilityListItem[], lang: Locale = getLocale()): MapMarker[] {
  const t = createT(lang);
  const markers: MapMarker[] = [];
  for (const { facility, place } of items) {
    const c = facility.coordinates;
    if (!isValidCoordinates(c)) continue;
    markers.push({
      id: facility.id,
      name: facility.name,
      href: localizePath(routes.hospital(facility.slug), lang),
      lat: c.lat,
      lon: c.lon,
      label: joinLabel(facilityKindLabel(t, facility.kind), place.label),
    });
  }
  return markers;
}

/** Markers for the given page of pharmacies; records without valid coordinates are skipped. */
export function pharmacyMarkers(items: readonly PharmacyListItem[], lang: Locale = getLocale()): MapMarker[] {
  const t = createT(lang);
  const markers: MapMarker[] = [];
  for (const { pharmacy, place } of items) {
    const c = pharmacy.coordinates;
    if (!isValidCoordinates(c)) continue;
    markers.push({
      id: pharmacy.id,
      name: pharmacy.name,
      href: localizePath(routes.pharmacy(pharmacy.slug), lang),
      lat: c.lat,
      lon: c.lon,
      label: joinLabel(t("directory.card.pharmacy"), place.label),
    });
  }
  return markers;
}
