import { normalizeSearchText } from "./text";

/**
 * Recognised alternative spellings of place names (normalised, lowercase) → the name used in our data.
 * Only well-known variants; they never create extra pages, they just resolve to the canonical place.
 */
export const PLACE_ALIASES: Readonly<Record<string, string>> = {
  dacca: "dhaka",
  chittagong: "chattogram",
  chitagong: "chattogram",
  jessore: "jashore",
  comilla: "cumilla",
  barishal: "barisal",
  bogra: "bogura",
  "coxs bazar": "cox s bazar",
  "cox bazar": "cox s bazar",
  narayangonj: "narayanganj",
  mymensing: "mymensingh",
  jhalokati: "jhalokathi",
  maulvibazar: "moulvibazar",
  chapainawabganj: "chapai nawabganj",
  laxmipur: "lakshmipur",
};

/** The canonical normalised name for a normalised alias, or the input when it is not an alias. */
export function canonicalPlaceName(normalised: string): string {
  return PLACE_ALIASES[normalised] ?? normalised;
}

/** Canonical names of aliases that start with a typed prefix ("chitt" → "chattogram"), for autocomplete. */
export function aliasTargetsForPrefix(prefix: string): string[] {
  const q = normalizeSearchText(prefix);
  if (q.length < 3) return [];
  return [...new Set(Object.entries(PLACE_ALIASES).filter(([alias]) => alias.startsWith(q)).map(([, name]) => name))];
}
