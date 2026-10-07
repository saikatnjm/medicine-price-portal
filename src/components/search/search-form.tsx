"use client";

import { useLocale, useT } from "@/i18n/client";
import { localizePath } from "@/i18n/config";
import { SearchIcon } from "@/components/ui/icons";
import { routes } from "@/lib/routes";
import { SearchAutocomplete } from "./search-autocomplete";

interface SearchFormProps {
  defaultValue?: string;
  /** "lg" for the homepage hero, "md" elsewhere. */
  size?: "md" | "lg";
  /** Unique id when more than one form is on a page. */
  id?: string;
  /** Visible/accessible label; defaults to the generic description of what can be searched. */
  label?: string;
}

/**
 * Plain GET form to /search with a suggestion-enhanced input. Works without
 * client-side JavaScript; the query lives in the URL so results are shareable
 * and server-rendered.
 */
export function SearchForm({ defaultValue = "", size = "md", id = "site-search", label }: SearchFormProps) {
  const t = useT();
  const lang = useLocale();
  const inputId = `${id}-input`;
  const large = size === "lg";
  return (
    <form role="search" action={localizePath(routes.search(), lang)} method="get" className="w-full">
      <label
        htmlFor={inputId}
        className="sr-only"
      >
        {label ?? t("search.form.label")}
      </label>
      <div className={`flex gap-2 ${large ? "rounded-full border border-slate-300 bg-white p-1.5 shadow-md focus-within:border-brand-600" : ""}`}>
        <SearchAutocomplete
          inputId={inputId}
          defaultValue={defaultValue}
          placeholder={large ? t("search.form.placeholderLg") : t("search.form.placeholder")}
          className={`w-full min-w-0 bg-white text-slate-900 placeholder:text-slate-500 ${large ? "h-12 rounded-full border-0 px-4 text-base outline-none focus-visible:outline-none sm:text-lg" : "h-11 rounded-lg border border-slate-300 px-3 text-base focus-visible:border-brand-600"}`}
        />
        <button
          type="submit"
          className={`inline-flex shrink-0 items-center justify-center gap-2 bg-brand-700 font-semibold text-white hover:bg-brand-800 ${large ? "h-12 rounded-full px-5 text-base sm:px-7" : "h-11 rounded-lg px-4 text-sm"}`}
        >
          <SearchIcon className="size-5" />
          {t("search.form.submit")}
        </button>
      </div>
    </form>
  );
}
