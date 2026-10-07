import Link from "next/link";

export function ResultCount({
  total,
  page,
  pageSize,
  noun,
  singular,
}: {
  total: number;
  page: number;
  pageSize: number;
  noun: string;
  /** Used when total is 1. */
  singular: string;
}) {
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);
  return (
    <p className="text-base font-medium text-slate-900" role="status">
      {total <= pageSize
        ? `${total.toLocaleString("en-US")} ${total === 1 ? singular : noun}`
        : `Showing ${from.toLocaleString("en-US")}–${to.toLocaleString("en-US")} of ${total.toLocaleString("en-US")} ${noun}`}
    </p>
  );
}

interface EmptyResultsProps {
  /** Nothing of this kind has been imported at all. */
  datasetEmpty: boolean;
  hasFilters: boolean;
  noun: string;
  scopeName?: string;
  clearHref: string;
}

/** Two distinct empty states: no data at all, and no matches. */
export function EmptyResults({ datasetEmpty, hasFilters, noun, scopeName, clearHref }: EmptyResultsProps) {
  const box = "rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-slate-800";
  if (datasetEmpty) {
    return (
      <div className={box}>
        <p className="font-medium">No {noun} are available yet.</p>
        <p className="mt-1 text-sm text-slate-700">
          This directory is filled from community-mapped OpenStreetMap data and that import has not run on this site yet.
        </p>
      </div>
    );
  }
  return (
    <div className={box}>
      <p className="font-medium">
        {hasFilters ? `No ${noun} match your search.` : `No ${noun} are listed${scopeName ? ` for ${scopeName}` : ""} yet.`}
      </p>
      <p className="mt-1 text-sm text-slate-700">Check the spelling, or try a wider location or fewer filters.</p>
      <p className="mt-3">
        <Link href={clearHref} className="font-medium text-brand-800 underline underline-offset-2">
          {hasFilters ? "Clear filters" : "Browse all"}
        </Link>
      </p>
    </div>
  );
}
