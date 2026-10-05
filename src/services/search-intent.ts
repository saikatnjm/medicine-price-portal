/**
 * Deterministic query understanding for directory search: recognises an entity
 * word ("doctors", "hospital", "pharmacy"), a specialty ("cardiologist") and a
 * location ("in Dhanmondi", trailing "Gulshan"). No NLP; unknown words stay text.
 */
import type { Facility, Specialty } from "../domain/healthcare";
import type { SearchIntent } from "../domain/read-models";
import { normalizeSearchText } from "../lib/text";
import type { PlaceResolver } from "./places";

const ENTITY_WORDS: Record<string, SearchIntent["entity"]> = {
  doctor: "doctor",
  doctors: "doctor",
  dr: "doctor",
  physician: "doctor",
  physicians: "doctor",
  specialist: "doctor",
  specialists: "doctor",
  hospital: "hospital",
  hospitals: "hospital",
  clinic: "hospital",
  clinics: "hospital",
  pharmacy: "pharmacy",
  pharmacies: "pharmacy",
  chemist: "pharmacy",
  chemists: "pharmacy",
};
const STOP_WORDS = new Set(["in", "near", "at", "around", "best", "top", "the", "of", "and"]);

/** "cardiologists" → "cardiologist", "pharmacies" → "pharmacy"; conservative. */
export function singular(word: string): string {
  if (word.length > 4 && word.endsWith("ies")) return `${word.slice(0, -3)}y`;
  if (word.length > 3 && word.endsWith("s") && !word.endsWith("ss")) return word.slice(0, -1);
  return word;
}

/** Normalised phrases that identify a specialty (name, practitioner title, aliases). */
function specialtyPhrases(s: Specialty): string[] {
  return [s.name, s.practitionerTitle, ...s.aliases, s.slug.replace(/-/g, " ")]
    .map((p) => normalizeSearchText(p.replace(/\(.*?\)/g, "")))
    .filter((p) => p.length >= 3);
}

/** Longest specialty phrase found as whole words in `words`; returns the matched word span. */
function findSpecialty(words: string[], specialties: readonly Specialty[]) {
  const singularWords = words.map(singular);
  let best: { specialty: Specialty; start: number; length: number; isTitle: boolean; isAlias: boolean } | null =
    null;
  for (const specialty of specialties) {
    const title = normalizeSearchText(specialty.practitionerTitle);
    const primary = new Set(
      [specialty.name, specialty.practitionerTitle, specialty.slug.replace(/-/g, " ")].map((p) =>
        normalizeSearchText(p.replace(/\(.*?\)/g, "")),
      ),
    );
    for (const phrase of specialtyPhrases(specialty)) {
      const target = phrase.split(" ").map(singular);
      for (let i = 0; i + target.length <= words.length; i++) {
        if (target.every((t, j) => singularWords[i + j] === t) && (!best || target.length > best.length)) {
          best = { specialty, start: i, length: target.length, isTitle: phrase === title, isAlias: !primary.has(phrase) };
        }
      }
    }
  }
  return best;
}

/**
 * Resolves a normalised facility name ("square hospital") to a facility. Kept
 * synchronous so parsing stays pure; callers pre-resolve it (see SearchService).
 */
export type FacilityNameLookup = (normalisedName: string) => Facility | null;

/** The normalised words after the last "at" in a query, or null. */
export function facilityCandidate(rawQuery: string): string | null {
  const words = normalizeSearchText(rawQuery).split(" ").filter(Boolean);
  const at = words.lastIndexOf("at");
  return at >= 0 && at < words.length - 1 ? words.slice(at + 1).join(" ") : null;
}

export function parseSearchIntent(
  rawQuery: string,
  places: PlaceResolver,
  specialties: readonly Specialty[],
  facilityByName?: FacilityNameLookup,
): SearchIntent {
  let words = normalizeSearchText(rawQuery).split(" ").filter(Boolean);
  let location: SearchIntent["location"] = null;
  let facility: Facility | null = null;

  // 1. "… in/near/at <place>": everything after the last preposition is a place if it resolves.
  const prepIndex = Math.max(words.lastIndexOf("in"), words.lastIndexOf("near"), words.lastIndexOf("at"));
  if (prepIndex >= 0 && prepIndex < words.length - 1) {
    const candidate = places.findByName(words.slice(prepIndex + 1).join(" "));
    if (candidate) {
      location = candidate;
      words = words.slice(0, prepIndex);
    } else if (words[prepIndex] === "at" && facilityByName) {
      // "doctors at Square Hospital": an exact facility name, not a place.
      const found = facilityByName(words.slice(prepIndex + 1).join(" "));
      if (found) {
        facility = found;
        words = words.slice(0, prepIndex);
      }
    }
  }
  // 2. Otherwise a trailing one- or two-word place ("hospital dhanmondi"), when other words remain.
  if (!location && !facility) {
    for (const n of [2, 1]) {
      if (words.length <= n) continue;
      const candidate = places.findByName(words.slice(-n).join(" "));
      if (candidate) {
        location = candidate;
        words = words.slice(0, -n);
        break;
      }
    }
  }

  // 3. Specialty phrase ("cardiologists", "ear nose throat").
  let specialty: SearchIntent["specialty"] = null;
  let entity: SearchIntent["entity"] = null;
  const found = findSpecialty(words, specialties);
  // Aliases ("heart", "eye") count only when nothing but entity/stop words remains,
  // so names like "National Heart Foundation" stay a name search.
  const aliasLeavesText =
    found?.isAlias &&
    words.some((w, i) => (i < found.start || i >= found.start + found.length) && !ENTITY_WORDS[w] && !STOP_WORDS.has(w));
  if (found && !aliasLeavesText) {
    specialty = found.specialty;
    if (found.isTitle) entity = "doctor";
    words = [...words.slice(0, found.start), ...words.slice(found.start + found.length)];
  }

  // 4. Entity words; the first one wins.
  const rest: string[] = [];
  for (const word of words) {
    const e = ENTITY_WORDS[word];
    if (e) entity ??= e;
    else if (!STOP_WORDS.has(word) || rest.length > 0) rest.push(word);
  }
  // A query that is only a place name ("Dhanmondi") is a location, not text.
  if (!location && !facility && !specialty && !entity && rest.length > 0) {
    const whole = places.findByName(rest.join(" "));
    if (whole) return { text: "", entity: null, specialty: null, location: whole };
  }
  return { text: rest.join(" "), entity, specialty, location, ...(facility ? { facility } : {}) };
}

/** True when the query was understood as more than free text. */
export function isStructured(intent: SearchIntent): boolean {
  return Boolean(intent.entity || intent.specialty || intent.location || intent.facility);
}
