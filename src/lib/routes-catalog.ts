/**
 * Path-segment pagination for long catalogue lists. Page 1 is the base URL; later pages are
 * "/companies/x/2", "/dosage-forms/tablet/3" (crawlable; robots.txt blocks "?page=" URLs).
 * Kept apart from routes.ts so it can be merged into `routes` later.
 */
import { routes } from "./routes";

const paged = (base: string, page: number) => (page <= 1 ? base : `${base}/${page}`);

export const companyPage = (slug: string, page: number) => paged(routes.company(slug), page);
export const dosageFormPage = (form: string, page: number) => paged(routes.dosageForm(form), page);

/**
 * Page number from a "[page]" path segment: only canonical integers >= 2 ("2", "15").
 * "1" (served at the base URL), "01", "2.0", "abc" and negatives give null.
 */
export function parsePageSegment(segment: string): number | null {
  return /^[1-9]\d{0,5}$/.test(segment) && segment !== "1" ? Number(segment) : null;
}
