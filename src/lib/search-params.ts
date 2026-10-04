/** Helpers for reading Next.js `searchParams` safely. */

export type SearchParamValue = string | string[] | undefined;

/** First value of a possibly repeated query parameter. */
export function firstParam(value: SearchParamValue): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/** Positive integer page number; anything else becomes 1. */
export function parsePageParam(value: SearchParamValue): number {
  const raw = firstParam(value);
  if (!raw || !/^\d+$/.test(raw)) return 1;
  const page = Number.parseInt(raw, 10);
  return page > 0 ? page : 1;
}

/** Builds a /search URL. */
export function searchHref(query: string, page = 1): string {
  const params = new URLSearchParams({ q: query });
  if (page > 1) params.set("page", String(page));
  return `/search?${params.toString()}`;
}
