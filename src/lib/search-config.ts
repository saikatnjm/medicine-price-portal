/** Search input rules shared by the search service and the search UI. */

export const SEARCH_MIN_QUERY_LENGTH = 2;
export const SEARCH_MAX_QUERY_LENGTH = 100;
export const SEARCH_PAGE_SIZE = 20;

/** Collapses whitespace and limits length, so the UI shows exactly what is searched. */
export function cleanSearchQuery(rawQuery: string | null | undefined): string {
  return (rawQuery ?? "").replace(/\s+/g, " ").trim().slice(0, SEARCH_MAX_QUERY_LENGTH);
}
