import "server-only";

/**
 * Optional Google Places enrichment (official API only, never required).
 *
 * Google's terms allow storing a place ID long term, but not ratings or review
 * counts. So the dataset keeps only `google.placeId`, and rating details are
 * fetched live, per request, and only when both GOOGLE_PLACES_API_KEY and
 * GOOGLE_PLACES_LIVE_DETAILS=true are set. See docs/DECISIONS.md.
 */

export interface GooglePlaceLiveDetails {
  rating: number;
  userRatingCount: number;
  googleMapsUri: string;
}

const PLACES_ENDPOINT = "https://places.googleapis.com/v1/places";
const FIELD_MASK = "rating,userRatingCount,googleMapsUri";
const TIMEOUT_MS = 2500;

/** Official key-free Google Maps URL for a known place ID. */
export function googleMapsPlaceUrl(placeId: string, name: string): string {
  const query = encodeURIComponent(name);
  return `https://www.google.com/maps/search/?api=1&query=${query}&query_place_id=${encodeURIComponent(placeId)}`;
}

/** True only when a server-side key is set and live details are explicitly enabled. */
export function liveDetailsEnabled(env: Record<string, string | undefined> = process.env): boolean {
  return Boolean(env.GOOGLE_PLACES_API_KEY?.trim()) && env.GOOGLE_PLACES_LIVE_DETAILS === "true";
}

/** Validates the Place Details response shape; returns null for anything unexpected. */
export function parseGooglePlaceDetails(json: unknown): GooglePlaceLiveDetails | null {
  if (typeof json !== "object" || json === null) return null;
  const { rating, userRatingCount, googleMapsUri } = json as Record<string, unknown>;
  if (typeof rating !== "number" || !Number.isFinite(rating) || rating < 0 || rating > 5) return null;
  if (typeof userRatingCount !== "number" || !Number.isInteger(userRatingCount) || userRatingCount < 0) return null;
  if (typeof googleMapsUri !== "string") return null;
  try {
    const url = new URL(googleMapsUri);
    if (url.protocol !== "https:") return null;
  } catch {
    return null;
  }
  return { rating, userRatingCount, googleMapsUri };
}

/**
 * Fetches rating details live (never cached, never stored). Returns null when
 * disabled, on timeout, on a non-2xx response or on an unexpected shape.
 */
export async function fetchGooglePlaceDetails(placeId: string): Promise<GooglePlaceLiveDetails | null> {
  if (!liveDetailsEnabled() || !placeId) return null;
  const apiKey = process.env.GOOGLE_PLACES_API_KEY?.trim();
  if (!apiKey) return null;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(`${PLACES_ENDPOINT}/${encodeURIComponent(placeId)}`, {
      headers: { "X-Goog-Api-Key": apiKey, "X-Goog-FieldMask": FIELD_MASK },
      cache: "no-store",
      signal: controller.signal,
    });
    if (!response.ok) return null;
    return parseGooglePlaceDetails(await response.json());
  } catch {
    // Network error, timeout or invalid JSON: enrichment is optional. Log nothing (the URL contains no key, but keep it quiet).
    return null;
  } finally {
    clearTimeout(timer);
  }
}
