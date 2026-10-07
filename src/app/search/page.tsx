import type { Metadata } from "next";
import { GlobalSearchResults } from "@/components/search/global-search-results";
import { SearchForm } from "@/components/search/search-form";
import { MedicineFilters } from "@/components/search/medicine-filters";
import { SearchResults } from "@/components/search/search-results";
import { searchViewHref, SearchTabs, type SearchView } from "@/components/search/search-tabs";
import { SearchRecorder } from "@/components/retention/search-recorder";
import { Container } from "@/components/ui/container";
import { services } from "@/data";
import { routes } from "@/lib/routes";
import { cleanSearchQuery } from "@/lib/search-config";
import { firstParam, parsePageParam, type SearchParamValue } from "@/lib/search-params";
import { pageMetadata } from "@/lib/seo";

interface SearchPageProps {
  searchParams: Promise<Record<string, SearchParamValue>>;
}

function parseView(value: SearchParamValue): SearchView {
  return firstParam(value) === "medicine" ? "medicine" : "all";
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const query = cleanSearchQuery(firstParam((await searchParams).q));
  return pageMetadata({
    title: query ? `Search results for “${query}”` : "Search",
    description: "Search medicines, hospitals, clinics, pharmacies, specialties and places in Bangladesh.",
    // Search result pages are never indexed; the canonical is the clean /search path.
    path: routes.search(),
    indexable: false,
  });
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const view = parseView(params.type);
  const query = cleanSearchQuery(firstParam(params.q));

  const medicineResult =
    view === "medicine"
      ? await services.search.searchMedicines(query, parsePageParam(params.page), {
          generic: firstParam(params.generic),
          manufacturer: firstParam(params.manufacturer),
          form: firstParam(params.form),
        })
      : null;
  const globalResult = view === "all" ? await services.search.searchAll(query) : null;

  const needsSuggestions = medicineResult
    ? medicineResult.status === "empty_query" ||
      (medicineResult.status === "ok" &&
        medicineResult.total === 0 &&
        medicineResult.facets.generics.length === 0)
    : globalResult !== null && (globalResult.status === "empty_query" || globalResult.total === 0);
  const suggestions = needsSuggestions ? await services.medicines.listPopularMedicines() : [];

  const resultCount = needsSuggestions
    ? 0
    : medicineResult
      ? medicineResult.status === "ok"
        ? medicineResult.total
        : 0
      : (globalResult?.total ?? 0);

  return (
    <Container className="py-8 sm:py-10">
      <SearchRecorder query={query} results={resultCount} />
      <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
        {query ? `Results for “${query}”` : "Search"}
      </h1>
      <div className="mt-4 mb-6 max-w-2xl">
        <SearchForm defaultValue={query} />
      </div>
      <SearchTabs query={query} active={view} />
      {medicineResult ? (
        <>
          <MedicineFilters result={medicineResult} />
          <SearchResults
            result={medicineResult}
            suggestions={suggestions}
            pageHref={(q, page) =>
              searchViewHref(q, "medicine", page, medicineResult.appliedFilters)
            }
          />
        </>
      ) : globalResult ? (
        <GlobalSearchResults result={globalResult} suggestions={suggestions} />
      ) : null}
    </Container>
  );
}
