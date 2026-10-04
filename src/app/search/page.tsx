import type { Metadata } from "next";
import { SearchForm } from "@/components/search/search-form";
import { SearchResults } from "@/components/search/search-results";
import { Container } from "@/components/ui/container";
import { services } from "@/data";
import { cleanSearchQuery } from "@/lib/search-config";
import { firstParam, parsePageParam, type SearchParamValue } from "@/lib/search-params";
import { pageRobots } from "@/lib/seo";

interface SearchPageProps {
  searchParams: Promise<Record<string, SearchParamValue>>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const query = cleanSearchQuery(firstParam((await searchParams).q));
  return {
    title: query ? `Search results for “${query}”` : "Search medicines",
    // Search result pages are not indexed: they duplicate medicine pages.
    robots: pageRobots(false),
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const result = await services.search.searchMedicines(
    firstParam(params.q),
    parsePageParam(params.page),
  );
  const needsSuggestions =
    result.status === "empty_query" || (result.status === "ok" && result.total === 0);
  const suggestions = needsSuggestions ? await services.medicines.listPopularMedicines() : [];

  return (
    <Container className="py-8 sm:py-10">
      <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
        {result.query ? `Results for “${result.query}”` : "Search medicines"}
      </h1>
      <div className="mt-4 mb-6 max-w-2xl">
        <SearchForm defaultValue={result.query} />
      </div>
      <SearchResults result={result} suggestions={suggestions} />
    </Container>
  );
}
