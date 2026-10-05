/**
 * Map links and embeds. Uses only official, key-free URL formats:
 * - Google Maps URLs (https://developers.google.com/maps/documentation/urls) for
 *   "View on Google Maps" and "Get directions". These open Google Maps at our
 *   coordinates or address; they are not verified Google places unless the
 *   record has a stored place id.
 * - OpenStreetMap's embeddable map for the optional preview, or the Google Maps
 *   Embed API when NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY is configured.
 */
import type { Coordinates, GooglePlaceRef } from "../domain/healthcare";
import { isValidCoordinates } from "./geo";

export interface MapTarget {
  name: string;
  /** Address text used when there are no coordinates. */
  address?: string;
  coordinates?: Coordinates;
  google?: GooglePlaceRef;
}

export interface MapLinks {
  /** Opens the place (or point) in Google Maps. */
  viewUrl: string;
  /** Opens Google Maps directions to the place. */
  directionsUrl: string;
  /** True only when a stored Google place id backs the link. */
  isGooglePlace: boolean;
  /** True when the destination is an exact point, false when it is an address search. */
  hasExactLocation: boolean;
}

const GOOGLE_MAPS = "https://www.google.com/maps";

/** Links for a record, or null when there is nothing reliable to point at. */
export function mapLinksFor(target: MapTarget): MapLinks | null {
  const point = isValidCoordinates(target.coordinates) ? target.coordinates : null;
  const address = target.address?.trim();
  if (!point && !address) return null;

  const destination = point ? `${point.lat},${point.lon}` : `${target.name}, ${address}, Bangladesh`;
  const view = new URLSearchParams({ api: "1", query: target.google ? target.name : destination });
  const directions = new URLSearchParams({ api: "1", destination });
  if (target.google) {
    view.set("query_place_id", target.google.placeId);
    directions.set("destination_place_id", target.google.placeId);
  }
  return {
    viewUrl: `${GOOGLE_MAPS}/search/?${view.toString()}`,
    directionsUrl: `${GOOGLE_MAPS}/dir/?${directions.toString()}`,
    isGooglePlace: Boolean(target.google),
    hasExactLocation: Boolean(point),
  };
}

export interface MapEmbed {
  src: string;
  provider: "google" | "openstreetmap";
  /** Full-page map link matching the embed provider (also the attribution target). */
  fullMapUrl: string;
}

/** Iframe source for a small preview map around a point; null without coordinates. */
export function mapEmbedFor(
  target: MapTarget,
  googleEmbedKey: string | undefined = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY,
): MapEmbed | null {
  if (!isValidCoordinates(target.coordinates)) return null;
  const { lat, lon } = target.coordinates;
  const key = googleEmbedKey?.trim();
  if (key) {
    const q = target.google ? `place_id:${target.google.placeId}` : `${lat},${lon}`;
    const params = new URLSearchParams({ key, q, zoom: "16" });
    return {
      src: `https://www.google.com/maps/embed/v1/place?${params.toString()}`,
      provider: "google",
      fullMapUrl: `${GOOGLE_MAPS}/search/?api=1&query=${lat},${lon}`,
    };
  }
  const d = 0.004;
  const bbox = [lon - d, lat - d * 0.8, lon + d, lat + d * 0.8].map((n) => n.toFixed(5)).join(",");
  return {
    src: `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`,
    provider: "openstreetmap",
    fullMapUrl: `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=17/${lat}/${lon}`,
  };
}
