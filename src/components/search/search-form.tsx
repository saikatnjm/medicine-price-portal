import { routes } from "@/lib/routes";
import { SearchAutocomplete } from "./search-autocomplete";

interface SearchFormProps {
  defaultValue?: string;
  /** "lg" for the homepage hero, "md" elsewhere. */
  size?: "md" | "lg";
  /** Unique id when more than one form is on a page. */
  id?: string;
}

/**
 * Plain GET form to /search with a suggestion-enhanced input. Works without
 * client-side JavaScript; the query lives in the URL so results are shareable
 * and server-rendered.
 */
export function SearchForm({ defaultValue = "", size = "md", id = "site-search" }: SearchFormProps) {
  const inputId = `${id}-input`;
  const large = size === "lg";
  return (
    <form role="search" action={routes.search()} method="get" className="w-full">
      <label
        htmlFor={inputId}
        className={large ? "mb-2 block text-sm font-medium text-slate-700" : "sr-only"}
      >
        Search medicines, hospitals, clinics, pharmacies and specialties
      </label>
      <div className="flex gap-2">
        <SearchAutocomplete
          inputId={inputId}
          defaultValue={defaultValue}
          placeholder="e.g. Napa, cardiologist, hospitals in Dhaka"
          className={`w-full min-w-0 rounded-md border border-slate-300 bg-white px-3 text-slate-900 placeholder:text-slate-500 focus-visible:border-brand-600 ${large ? "h-12 text-lg" : "h-11 text-base"}`}
        />
        <button
          type="submit"
          className={`shrink-0 rounded-md bg-brand-700 px-4 font-medium text-white hover:bg-brand-800 ${large ? "h-12 text-base sm:px-6" : "h-11 text-sm"}`}
        >
          Search
        </button>
      </div>
    </form>
  );
}
