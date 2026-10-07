import Link from "@/i18n/link";
import { MedicineList } from "@/components/medicine/medicine-list";
import type { MedicineListItem, SearchResult } from "@/domain/read-models";
import { getT } from "@/i18n/server";
import { searchHref } from "@/lib/search-params";
import { SEARCH_MIN_QUERY_LENGTH } from "@/lib/search-config";

interface SearchResultsProps {
  result: SearchResult;
  /** Suggestions shown when there is nothing to display. */
  suggestions: readonly MedicineListItem[];
  /** Builds the URL of another results page; defaults to /search?q=…&page=…. */
  pageHref?: (query: string, page: number) => string;
}

function Suggestions({ items }: { items: readonly MedicineListItem[] }) {
  const t = getT();
  if (items.length === 0) return null;
  return (
    <div className="mt-8">
      <h2 className="mb-2 text-lg font-semibold text-slate-900">{t("search.popularMedicines")}</h2>
      <MedicineList items={items} />
    </div>
  );
}

function Pagination({
  result,
  pageHref,
}: {
  result: SearchResult;
  pageHref: (query: string, page: number) => string;
}) {
  const t = getT();
  if (result.totalPages <= 1) return null;
  const { page, totalPages, query } = result;
  return (
    <nav
      aria-label={t("search.pages.aria")}
      className="mt-6 flex items-center justify-between text-sm"
    >
      {page > 1 ? (
        <Link href={pageHref(query, page - 1)} className="font-medium text-brand-800 underline">
          {t("search.pages.previous")}
        </Link>
      ) : (
        <span />
      )}
      <span className="text-slate-600">
        {t("search.pages.status", { page, total: totalPages })}
      </span>
      {page < totalPages ? (
        <Link href={pageHref(query, page + 1)} className="font-medium text-brand-800 underline">
          {t("search.pages.next")}
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}

/** Renders every search state: prompt, too short, no results, results. */
export function SearchResults({ result, suggestions, pageHref = searchHref }: SearchResultsProps) {
  const t = getT();
  if (result.status === "empty_query") {
    return (
      <>
        <p className="text-slate-700">
          {t("search.promptMedicine")}
        </p>
        <Suggestions items={suggestions} />
      </>
    );
  }

  if (result.status === "query_too_short") {
    return (
      <p role="status" className="text-slate-700">
        {t("search.tooShort", { n: SEARCH_MIN_QUERY_LENGTH })}
      </p>
    );
  }

  if (result.total === 0 && result.facets.generics.length > 0) {
    // The query matches medicines, but the selected filters exclude all of them.
    return (
      <div role="status" className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3">
        <p className="font-medium text-slate-900">
          {t("search.noFilterMatch.title", { query: result.matchedQuery })}
        </p>
        <p className="mt-1 text-slate-700">{t("search.noFilterMatch.hint")}</p>
      </div>
    );
  }

  if (result.total === 0) {
    return (
      <>
        <div role="status" className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="font-medium text-slate-900">{t("search.noMedicines.title", { query: result.query })}</p>
          <p className="mt-1 text-slate-700">
            {t("search.noMedicines.hint")}
          </p>
        </div>
        <Suggestions items={suggestions} />
      </>
    );
  }

  const outOfRange = result.items.length === 0;
  return (
    <>
      <p role="status" className="mb-4 text-slate-700">
        {result.matchedQuery !== result.query && (
          <>{t("search.noMatchEvery", { query: result.query })} </>
        )}
        {t(result.total === 1 ? "search.found.medicine.one" : "search.found.medicine.other", {
          n: result.total.toLocaleString("en-US"),
          query: result.matchedQuery,
        })}
      </p>
      {outOfRange ? (
        <p className="text-slate-700">
          {t("search.noPage")}{" "}
          <Link href={pageHref(result.query, 1)} className="text-brand-800 underline">
            {t("search.firstPage")}
          </Link>
          {t("search.stop")}
        </p>
      ) : (
        <MedicineList items={result.items} headingLevel="h2" />
      )}
      <Pagination result={result} pageHref={pageHref} />
    </>
  );
}
