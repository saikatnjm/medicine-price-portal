import Link from "@/i18n/link";
import type { MedicineFilterValues } from "@/domain/read-models";
import type { MessageKey } from "@/i18n/messages";
import { getT } from "@/i18n/server";

export type SearchView = "all" | "medicine";

const TABS: readonly { view: SearchView; label: MessageKey }[] = [
  { view: "all", label: "search.tabs.all" },
  { view: "medicine", label: "search.tabs.medicine" },
];

export function searchViewHref(
  query: string,
  view: SearchView,
  page = 1,
  filters: MedicineFilterValues = {},
): string {
  const params = new URLSearchParams({ q: query });
  if (view !== "all") params.set("type", view);
  if (view === "medicine") {
    if (filters.generic) params.set("generic", filters.generic);
    if (filters.manufacturer) params.set("manufacturer", filters.manufacturer);
    if (filters.form) params.set("form", filters.form);
  }
  if (page > 1) params.set("page", String(page));
  return `/search?${params.toString()}`;
}

/** Links (not ARIA tabs) that switch between the grouped and the medicine-only view. */
export function SearchTabs({ query, active }: { query: string; active: SearchView }) {
  const t = getT();
  if (!query) return null;
  return (
    <nav aria-label={t("search.tabs.aria")} className="mb-6">
      <ul className="flex gap-2">
        {TABS.map(({ view, label }) => (
          <li key={view}>
            <Link
              href={searchViewHref(query, view)}
              aria-current={view === active ? "page" : undefined}
              className={`inline-flex min-h-11 items-center rounded-md border px-3 text-sm font-medium ${
                view === active
                  ? "border-brand-700 bg-brand-50 text-brand-800"
                  : "border-slate-300 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {t(label)}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
