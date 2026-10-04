import { routes } from "@/lib/routes";
import { SEARCH_MAX_QUERY_LENGTH } from "@/lib/search-config";

interface SearchFormProps {
  defaultValue?: string;
  /** "lg" for the homepage hero, "md" elsewhere. */
  size?: "md" | "lg";
  /** Unique id when more than one form is on a page. */
  id?: string;
}

/**
 * Plain GET form to /search. Works without client-side JavaScript; the query
 * lives in the URL so results are shareable and server-rendered.
 */
export function SearchForm({
  defaultValue = "",
  size = "md",
  id = "medicine-search",
}: SearchFormProps) {
  const inputId = `${id}-input`;
  const large = size === "lg";
  return (
    <form role="search" action={routes.search()} method="get" className="w-full">
      <label
        htmlFor={inputId}
        className={large ? "mb-2 block text-sm font-medium text-slate-700" : "sr-only"}
      >
        Search by brand or generic name
      </label>
      <div className="flex gap-2">
        <input
          id={inputId}
          type="search"
          name="q"
          defaultValue={defaultValue}
          maxLength={SEARCH_MAX_QUERY_LENGTH}
          placeholder="e.g. Napa, Seclo or Paracetamol"
          autoComplete="off"
          enterKeyHint="search"
          className={`min-w-0 flex-1 rounded-md border border-slate-300 bg-white px-3 text-slate-900 placeholder:text-slate-500 focus-visible:border-brand-600 ${large ? "h-12 text-lg" : "h-10 text-base"}`}
        />
        <button
          type="submit"
          className={`shrink-0 rounded-md bg-brand-700 px-4 font-medium text-white hover:bg-brand-800 ${large ? "h-12 text-base sm:px-6" : "h-10 text-sm"}`}
        >
          Search
        </button>
      </div>
    </form>
  );
}
