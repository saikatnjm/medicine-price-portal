/**
 * Pure helpers for matching our OSM-derived records to Google place IDs.
 * Used by scripts/data/match-google-places.mjs and unit-tested.
 */

export const MAX_DISTANCE_M = 150;
export const MIN_NAME_SIMILARITY = 0.6;

/** Words that carry no identity on their own. */
const STOP_WORDS = new Set(["the", "of", "and", "bd", "ltd", "limited", "pvt", "private"]);

/** Lower-case alphanumeric tokens without stop words. */
export function nameTokens(name) {
  return String(name ?? "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .split(/[^a-z0-9ঀ-৿]+/)
    .filter((token) => token && !STOP_WORDS.has(token));
}

/** Token Jaccard similarity of two names, 0..1. */
export function nameSimilarity(a, b) {
  const left = new Set(nameTokens(a));
  const right = new Set(nameTokens(b));
  if (left.size === 0 || right.size === 0) return 0;
  let shared = 0;
  for (const token of left) if (right.has(token)) shared += 1;
  return shared / (left.size + right.size - shared);
}

/** Great-circle distance in metres. */
export function distanceMetres(a, b) {
  if (!a || !b) return Infinity;
  const rad = (d) => (d * Math.PI) / 180;
  const h =
    Math.sin(rad(b.lat - a.lat) / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(rad(b.lon - a.lon) / 2) ** 2;
  return 2 * 6371000 * Math.asin(Math.sqrt(h));
}

/**
 * Picks the best acceptable candidate: within MAX_DISTANCE_M AND name similarity
 * >= MIN_NAME_SIMILARITY. Candidates: Places API (New) results
 * `{ id, displayName: { text }, location: { latitude, longitude } }`.
 * Returns the place id, or null (never guesses).
 */
export function pickMatch(record, candidates) {
  let best = null;
  for (const place of candidates ?? []) {
    const name = place?.displayName?.text;
    const location = place?.location;
    if (!place?.id || typeof name !== "string" || !location) continue;
    const distance = distanceMetres(record.coordinates, { lat: location.latitude, lon: location.longitude });
    const similarity = nameSimilarity(record.name, name);
    if (distance > MAX_DISTANCE_M || similarity < MIN_NAME_SIMILARITY) continue;
    if (!best || similarity > best.similarity || (similarity === best.similarity && distance < best.distance)) {
      best = { id: place.id, similarity, distance };
    }
  }
  return best ? best.id : null;
}
