import Link from "next/link";
import { MedicineList } from "@/components/medicine/medicine-list";
import type { MedicineListItem, SearchResult } from "@/domain/read-models";
import { pluralize } from "@/lib/format";
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
  if (items.length === 0) return null;
  return (
    <div className="mt-8">
      <h2 className="mb-2 text-lg font-semibold text-slate-900">Popular medicines</h2>
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
  if (result.totalPages <= 1) return null;
  const { page, totalPages, query } = result;
  return (
    <nav
      aria-label="Search results pages"
      className="mt-6 flex items-center justify-between text-sm"
    >
      {page > 1 ? (
        <Link href={pageHref(query, page - 1)} className="font-medium text-brand-800 underline">
          Previous
        </Link>
      ) : (
        <span />
      )}
      <span className="text-slate-600">
        Page {page} of {totalPages}
      </span>
      {page < totalPages ? (
        <Link href={pageHref(query, page + 1)} className="font-medium text-brand-800 underline">
          Next
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}

/** Renders every search state: prompt, too short, no results, results. */
export function SearchResults({ result, suggestions, pageHref = searchHref }: SearchResultsProps) {
  if (result.status === "empty_query") {
    return (
      <>
        <p className="text-slate-700">
          Enter a brand name (e.g. Napa) or a generic name (e.g. Paracetamol).
        </p>
        <Suggestions items={suggestions} />
      </>
    );
  }

  if (result.status === "query_too_short") {
    return (
      <p role="status" className="text-slate-700">
        Please enter at least {SEARCH_MIN_QUERY_LENGTH} characters.
      </p>
    );
  }

  if (result.total === 0) {
    return (
      <>
        <div role="status" className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="font-medium text-slate-900">No medicines found for “{result.query}”.</p>
          <p className="mt-1 text-slate-700">
            Check the spelling, try the generic name, or search with fewer words.
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
          <>No medicines match every word of “{result.query}”. </>
        )}
        {pluralize(result.total, "medicine", "medicines")} found for “{result.matchedQuery}”
      </p>
      {outOfRange ? (
        <p className="text-slate-700">
          This page has no results.{" "}
          <Link href={pageHref(result.query, 1)} className="text-brand-800 underline">
            Go to the first page
          </Link>
          .
        </p>
      ) : (
        <MedicineList items={result.items} headingLevel="h2" />
      )}
      <Pagination result={result} pageHref={pageHref} />
    </>
  );
}
