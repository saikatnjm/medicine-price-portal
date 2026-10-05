/** Coordinate helpers shared by services and UI (dependency-free). */
import type { Coordinates } from "../domain/healthcare";

/** Generous bounding box around Bangladesh, to reject obviously wrong coordinates. */
const BD_BOUNDS = { minLat: 20.3, maxLat: 26.8, minLon: 87.9, maxLon: 92.8 } as const;

export function isValidCoordinates(value: unknown): value is Coordinates {
  if (!value || typeof value !== "object") return false;
  const { lat, lon } = value as Record<string, unknown>;
  return (
    typeof lat === "number" &&
    typeof lon === "number" &&
    Number.isFinite(lat) &&
    Number.isFinite(lon) &&
    Math.abs(lat) <= 90 &&
    Math.abs(lon) <= 180
  );
}

export function isInBangladesh(c: Coordinates): boolean {
  return (
    c.lat >= BD_BOUNDS.minLat && c.lat <= BD_BOUNDS.maxLat && c.lon >= BD_BOUNDS.minLon && c.lon <= BD_BOUNDS.maxLon
  );
}

/** Great-circle distance in kilometres. */
export function distanceKm(a: Coordinates, b: Coordinates): number {
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** "350 m away", "1.2 km away", "14 km away". Approximate by design. */
export function formatDistance(km: number): string {
  if (km < 1) return `${Math.max(50, Math.round((km * 1000) / 50) * 50)} m away`;
  if (km < 10) return `${km.toFixed(1)} km away`;
  return `${Math.round(km)} km away`;
}

/** Number of decimals kept from a visitor's position (~1 km), so precise location never reaches URLs or logs. */
export const NEAR_PRECISION = 2;

export function roundCoordinates(c: Coordinates, decimals = NEAR_PRECISION): Coordinates {
  const f = 10 ** decimals;
  return { lat: Math.round(c.lat * f) / f, lon: Math.round(c.lon * f) / f };
}

/** "23.75,90.38" → coordinates (rounded); null when invalid or outside Bangladesh. */
export function parseNearParam(raw: string | null | undefined): Coordinates | null {
  const match = /^\s*(-?\d{1,2}(?:\.\d+)?)\s*,\s*(-?\d{1,3}(?:\.\d+)?)\s*$/.exec(raw ?? "");
  if (!match) return null;
  const c = roundCoordinates({ lat: Number(match[1]), lon: Number(match[2]) });
  return isValidCoordinates(c) && isInBangladesh(c) ? c : null;
}

export function formatNearParam(c: Coordinates): string {
  const r = roundCoordinates(c);
  return `${r.lat},${r.lon}`;
}
