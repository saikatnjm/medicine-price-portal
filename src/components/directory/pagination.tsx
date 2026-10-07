import Link from "@/i18n/link";
import { getT } from "@/i18n/server";

interface PaginationProps {
  page: number;
  totalPages: number;
  /** Builds the href for a page number (keeps the current filters). */
  hrefFor: (page: number) => string;
  label?: string;
}

/** Previous / next pagination with the current position announced. */
export function Pagination({ page, totalPages, hrefFor, label }: PaginationProps) {
  if (totalPages <= 1) return null;
  const t = getT();
  const linkClass = "inline-flex min-h-11 items-center rounded-md border border-slate-300 px-4 text-sm font-medium hover:bg-slate-50";
  return (
    <nav aria-label={label ?? t("directory.pagination.label")} className="mt-6 flex items-center justify-between gap-4">
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} className={linkClass} rel="prev">
          {t("directory.pagination.previous")}
        </Link>
      ) : (
        <span />
      )}
      <p className="text-sm text-slate-600">
        {t("directory.pagination.page", { page, total: totalPages })}
      </p>
      {page < totalPages ? (
        <Link href={hrefFor(page + 1)} className={linkClass} rel="next">
          {t("directory.pagination.next")}
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}

/** "/hospitals?location=dhaka&page=2" from a base path and params; empty values are dropped. */
export function buildHref(path: string, params: Record<string, string | number | boolean | null | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined || value === "" || value === false) continue;
    if (key === "page" && Number(value) <= 1) continue;
    search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `${path}?${qs}` : path;
}
