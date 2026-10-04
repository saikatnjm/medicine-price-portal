/** Shared, dependency-free text helpers (safe for server and client). */

/**
 * Normalises text for matching: lower-case, punctuation to spaces, collapsed whitespace.
 * Keeps Latin letters, digits and Bengali script so Bangla search can be added later.
 */
export function normalizeSearchText(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKC")
    .replace(/[^a-z0-9ঀ-৿]+/g, " ")
    .trim();
}
