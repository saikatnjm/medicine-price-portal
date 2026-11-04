import { routes } from "./routes";

/** Brands per page on /medicines/[initial]. */
export const BRAND_PAGE_SIZE = 250;

/**
 * Paginated brand A–Z path. Pages are path segments, not ?page= (robots.txt blocks ?page= URLs):
 * page 1 is the base URL "/medicines/a", later pages are "/medicines/a/2".
 */
export function medicinesPage(initial: string, page = 1): string {
  return page > 1 ? `${routes.medicines(initial)}/${page}` : routes.medicines(initial);
}

/**
 * Page number from a path segment. Only canonical spellings of pages ≥ 2 are accepted
 * ("2", not "02", "1", "2.0" or "abc"), so every page has exactly one URL.
 */
export function parsePageSegment(segment: string): number | null {
  if (!/^[1-9]\d{0,5}$/.test(segment)) return null;
  const page = Number(segment);
  return page >= 2 ? page : null;
}
