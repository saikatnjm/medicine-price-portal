import Link from "next/link";
import type { FacetOption, SearchResult } from "@/domain/read-models";
import { searchViewHref } from "./search-tabs";

interface FilterSelectProps {
  name: string;
  label: string;
  options: readonly FacetOption[];
}

function FilterSelect({ name, label, options }: FilterSelectProps) {
  const id = `filter-${name}`;
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-slate-800">
        {label}
      </label>
      <select
        id={id}
        name={name}
        defaultValue={options.find((o) => o.selected)?.value ?? ""}
        className="min-h-11 rounded-md border border-slate-300 bg-white px-3 text-base text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
      >
        <option value="">All</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label} ({option.count})
          </option>
        ))}
      </select>
    </div>
  );
}

/**
 * Plain GET form (works without JavaScript). A filter is shown only when the
 * current query's matches have more than one value for it.
 */
export function MedicineFilters({ result }: { result: SearchResult }) {
  if (result.status !== "ok") return null;
  const { facets, appliedFilters, query } = result;
  const selects = [
    { name: "generic", label: "Generic", options: facets.generics },
    { name: "manufacturer", label: "Manufacturer", options: facets.manufacturers },
    { name: "form", label: "Dosage form", options: facets.dosageForms },
  ].filter((select) => select.options.length > 1);
  if (selects.length === 0) return null;

  const hasFilters = Object.keys(appliedFilters).length > 0;
  return (
    <form
      action="/search"
      method="get"
      aria-label="Filter medicines"
      className="mb-6 rounded-md border border-slate-200 bg-slate-50 p-4"
    >
      <input type="hidden" name="q" value={query} />
      <input type="hidden" name="type" value="medicine" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {selects.map((select) => (
          <FilterSelect key={select.name} {...select} />
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          className="inline-flex min-h-11 items-center rounded-md bg-brand-700 px-4 text-sm font-medium text-white hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
        >
          Apply
        </button>
        {hasFilters && (
          <Link
            href={searchViewHref(query, "medicine")}
            className="inline-flex min-h-11 items-center text-sm font-medium text-brand-800 underline"
          >
            Clear filters
          </Link>
        )}
      </div>
    </form>
  );
}
