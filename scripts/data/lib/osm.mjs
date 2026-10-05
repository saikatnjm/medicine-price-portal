/**
 * Pure normalisation rules for OpenStreetMap healthcare features. No I/O,
 * deterministic, formatting only — nothing is inferred.
 */
import { cleanText, keyOf, slugify } from "./normalize.mjs";

const BENGALI = /[ঀ-৿]/;

/** Facility kind from OSM tags; "pharmacy" is handled as its own domain. */
export function facilityKindOf(tags) {
  const amenity = tags.amenity ?? "";
  const healthcare = tags.healthcare ?? "";
  if (amenity === "pharmacy" || healthcare === "pharmacy") return "pharmacy";
  if (amenity === "hospital" || healthcare === "hospital") return "hospital";
  if (amenity === "dentist" || healthcare === "dentist") return "dental_clinic";
  if (amenity === "doctors" || healthcare === "doctor") return "doctors_practice";
  if (healthcare === "laboratory") return "diagnostic_centre";
  if (healthcare === "blood_donation") return "blood_bank";
  if (amenity === "clinic" || healthcare === "clinic" || healthcare === "centre") return "clinic";
  return null;
}

/** Name in Latin script as the primary name when published; the other script as altName. */
export function namesOf(tags) {
  const en = cleanText(tags["name:en"]);
  const local = cleanText(tags.name);
  const bn = cleanText(tags["name:bn"]);
  const name = en || local || bn;
  const alt = [local, bn].find((candidate) => candidate && keyOf(candidate) !== keyOf(name) && candidate !== name);
  return { name, altName: alt || undefined };
}

/** Names that only describe the category ("Pharmacy", "হাসপাতাল") identify nothing. */
const GENERIC_NAMES = new Set(
  [
    "pharmacy", "pharmacies", "medicine shop", "medical store", "drug store", "drugstore", "hospital",
    "clinic", "medical", "health centre", "health center", "dispensary", "doctor", "doctors", "dentist",
    "dental", "chamber", "diagnostic", "diagnostic centre", "diagnostic center",
    "ফার্মেসী", "ফার্মেসি", "ঔষধালয়", "হাসপাতাল", "ক্লিনিক", "ডাক্তার", "ঔষধের দোকান",
  ].map((n) => n.toLowerCase()),
);

export function isGenericName(name) {
  return GENERIC_NAMES.has(cleanText(name).toLowerCase());
}

/** Names with no letters at all (e.g. coordinates "23.54, 89.16" or a number) are not names. */
export function hasNoLetters(name) {
  return !/[\p{L}]/u.test(cleanText(name));
}

export function ownershipOf(tags) {
  const value = cleanText(tags["operator:type"]).toLowerCase();
  if (["government", "public", "state", "governmental"].includes(value)) return "government";
  if (value === "private") return "private";
  if (["ngo", "non_profit", "private_non_profit", "charitable", "community", "religious", "nonprofit"].includes(value)) {
    return "non_profit";
  }
  if (value === "military") return "military";
  return undefined;
}

export function emergencyOf(tags) {
  if (tags.emergency === "yes") return true;
  if (tags.emergency === "no") return false;
  return undefined;
}

/** Up to three phone numbers, digits/+/spaces/hyphens only. */
export function phoneOf(tags) {
  const raw = [tags.phone, tags["contact:phone"], tags["contact:mobile"]].filter(Boolean).join(";");
  const numbers = raw
    .split(/[;,/]/)
    .map((n) => n.replace(/[^\d+\-\s]/g, "").replace(/\s+/g, " ").trim())
    .filter((n) => n.replace(/\D/g, "").length >= 6);
  return numbers.length ? [...new Set(numbers)].slice(0, 3).join(", ") : undefined;
}

/** Valid http(s) URL; a bare domain gets https://. Anything else is dropped. */
export function websiteOf(tags) {
  let value = cleanText(tags.website ?? tags["contact:website"] ?? tags.url ?? "");
  if (!value) return undefined;
  if (!/^https?:\/\//i.test(value)) {
    if (!/^[\w-]+(\.[\w-]+)+(\/\S*)?$/.test(value)) return undefined;
    value = `https://${value}`;
  }
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

export function emailOf(tags) {
  const value = cleanText(tags.email ?? tags["contact:email"] ?? "");
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? value : undefined;
}

export function bedsOf(tags) {
  return /^\d{1,5}$/.test(tags.beds ?? "") ? Number(tags.beds) : undefined;
}

/** Neighbourhood/area as published (not the district itself). */
export function areaOf(tags, districtName) {
  const area = cleanText(tags["addr:suburb"] ?? tags["addr:neighbourhood"] ?? tags["addr:quarter"] ?? "");
  if (area) return area;
  const city = cleanText(tags["addr:city"] ?? "");
  return city && keyOf(city) !== keyOf(districtName ?? "") ? city : undefined;
}

/** A street address only when street-level parts are published. */
export function addressOf(tags) {
  const full = cleanText(tags["addr:full"] ?? "");
  if (full) return full;
  const street = [tags["addr:housenumber"], tags["addr:street"]].map(cleanText).filter(Boolean).join(" ");
  if (!street) return undefined;
  return [street, tags["addr:suburb"], tags["addr:city"], tags["addr:postcode"]].map(cleanText).filter(Boolean).join(", ");
}

/** OSM healthcare:speciality values (semicolon-separated). */
export function specialityValuesOf(tags) {
  return cleanText(tags["healthcare:speciality"] ?? "")
    .toLowerCase()
    .split(";")
    .map((v) => v.trim().replace(/\s+/g, "_"))
    .filter(Boolean);
}

/** Location display name: "Rangamati Hill District" → "Rangamati". */
export function locationNameOf(name) {
  return cleanText(name).replace(/\s+(hill\s+)?(district|division|zila|zilla|জেলা|বিভাগ)$/iu, "").trim();
}

export function hasBengali(text) {
  return BENGALI.test(text);
}

/** Great-circle distance in metres (for duplicate detection of the same place mapped twice). */
export function distanceMetres(a, b) {
  if (!a || !b) return Infinity;
  const rad = (d) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * 6371000 * Math.asin(Math.sqrt(h));
}

export { slugify };

/** "Dhanmondi Thana" → "Dhanmondi"; "Savar Upazila" → "Savar". */
export function areaNameOf(name) {
  return cleanText(name)
    .replace(/\s+(metropolitan\s+)?(thana|upazila|upazilla|upozila|upojela|subdistrict|sub-district|থানা|উপজেলা)$/iu, "")
    .trim();
}

export function postcodeOf(tags) {
  const code = cleanText(tags["addr:postcode"] ?? "");
  return /^\d{4}$/.test(code) ? code : undefined;
}

/** Bounding box of [lat, lon] ways, for a cheap pre-check before point-in-polygon. */
export function boundsOf(ways) {
  let minLat = Infinity, minLon = Infinity, maxLat = -Infinity, maxLon = -Infinity;
  for (const way of ways)
    for (const [lat, lon] of way) {
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
      if (lon < minLon) minLon = lon;
      if (lon > maxLon) maxLon = lon;
    }
  return { minLat, minLon, maxLat, maxLon };
}

/**
 * Even-odd point-in-polygon over the boundary ways of a relation. Ways need not
 * be assembled into rings: each closed ring contributes the same crossings
 * whatever way order it was split into.
 */
export function pointInWays(point, ways) {
  const { lat: y, lon: x } = point;
  let inside = false;
  for (const way of ways) {
    for (let i = 1; i < way.length; i++) {
      const [yi, xi] = way[i];
      const [yj, xj] = way[i - 1];
      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
    }
  }
  return inside;
}
