import { Suspense } from "react";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { JsonLd } from "@/components/common/json-ld";
import { BrowseByLocation, RelatedLocationLinks, SubAreaLinks } from "@/components/facility/browse-links";
import { DirectoryFilterForm } from "@/components/facility/directory-filter-form";
import { EmptyResults, ResultCount } from "@/components/facility/list-status";
import { OsmCredit } from "@/components/facility/osm-credit";
import { NearMeButton } from "@/components/directory/near-me-button";
import { buildHref, Pagination } from "@/components/directory/pagination";
import { PharmacyCard, ResultList } from "@/components/directory/result-cards";
import { ResultsMap } from "@/components/directory/results-map";
import { Container } from "@/components/ui/container";
import type { Locale } from "@/i18n/config";
import { getLocale, getT } from "@/i18n/server";
import { pharmacyMarkers } from "@/lib/map-markers";
import { routes } from "@/lib/routes";
import { breadcrumbJsonLd } from "@/lib/seo";
import {
  pharmacyListBreadcrumbs,
  pharmacyListDescriptionFor,
  pharmacyListJsonLd,
  pharmacyListTitleFor,
  pharmacyScope,
} from "@/lib/seo-pharmacy";
import type { PharmacyListData } from "./pharmacy-list-data";

export function pharmacyScopeName(data: PharmacyListData, lang: Locale = getLocale()): string | undefined {
  return data.location ? pharmacyScope(data.location.location, data.location.ancestors, lang) : undefined;
}

/** Title, heading and description for the list page, in the given language (default: the request language). */
export function pharmacyListCopy(data: PharmacyListData, lang: Locale = getLocale()) {
  const scopeName = pharmacyScopeName(data, lang);
  const title = pharmacyListTitleFor(scopeName, lang);
  return {
    title,
    heading: title,
    description: pharmacyListDescriptionFor(scopeName, data.list.results.total, lang),
  };
}

export function pharmacyListPath(data: PharmacyListData): string {
  return routes.pharmacies(data.location?.location.slug);
}

/** Shared by /pharmacies and /pharmacies/[location]. */
export function PharmacyListView({ data }: { data: PharmacyListData }) {
  const t = getT();
  const lang = getLocale();
  const { params, list, location } = data;
  const { results, filters } = list;
  const path = pharmacyListPath(data);
  const { heading, description } = pharmacyListCopy(data, lang);
  const scopeName = pharmacyScopeName(data, lang);
  const breadcrumbs = pharmacyListBreadcrumbs(location?.location, location?.ancestors, lang);
  const hrefFor = (page: number) =>
    buildHref(path, { q: params.q, location: location ? undefined : params.location, near: params.near, page });

  return (
    <Container className="py-8 sm:py-10">
      <JsonLd data={breadcrumbJsonLd(breadcrumbs, path, lang)} />
      {results.items.length > 0 && data.indexable && (
        <JsonLd
          data={pharmacyListJsonLd(
            {
              name: heading,
              description,
              path,
              items: results.items.map(({ pharmacy }) => ({ name: pharmacy.name, path: routes.pharmacy(pharmacy.slug) })),
            },
            lang,
          )}
        />
      )}
      <Breadcrumbs items={breadcrumbs} />
      <header className="mt-4 mb-6 max-w-3xl space-y-3">
        <h1>{heading}</h1>
        <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-800">
          {t("pharmacy.list.notice")}
        </p>
      </header>

      <div className="space-y-3">
        <DirectoryFilterForm
          action={path}
          idPrefix="pharmacies"
          query={params.q}
          queryLabel={t("pharmacy.list.name_label")}
          queryPlaceholder={t("pharmacy.list.name_placeholder")}
          locations={
            location ? undefined : { tree: data.tree, selected: filters.location?.slug ?? "", selectedName: filters.location?.name, countOf: "pharmacyCount" }
          }
          clearHref={data.hasParams ? path : undefined}
        />
        <Suspense fallback={null}>
          <NearMeButton />
        </Suspense>
      </div>

      <section aria-label={t("pharmacy.list.results")} className="mt-6 space-y-4">
        {results.total === 0 ? (
          <EmptyResults
            datasetEmpty={data.datasetEmpty}
            hasFilters={data.hasParams}
            noun={t("pharmacy.list.noun")}
            scopeName={scopeName}
            clearHref={data.hasParams ? path : routes.pharmacies()}
          />
        ) : (
          <>
            <ResultCount total={results.total} page={results.page} pageSize={results.pageSize} noun={t("pharmacy.list.noun")} singular={t("pharmacy.list.noun_one")} nearest={Boolean(params.near)} />
            <ResultsMap markers={pharmacyMarkers(results.items)}>
              <ResultList label={t("pharmacy.list.list_label")}>
                {results.items.map((item) => (
                  <PharmacyCard key={item.pharmacy.id} item={item} headingLevel="h2" />
                ))}
              </ResultList>
            </ResultsMap>
            <Pagination page={results.page} totalPages={results.totalPages} hrefFor={hrefFor} />
          </>
        )}
      </section>

      <div className="mt-10 space-y-8">
        {location ? (
          <>
            <SubAreaLinks items={location.children} parentName={location.location.name} type="pharmacies" countOf="pharmacyCount" />
            <RelatedLocationLinks locationSlug={location.location.slug} name={location.location.name} type="pharmacies" />
          </>
        ) : (
          <BrowseByLocation tree={data.tree} type="pharmacies" countOf="pharmacyCount" />
        )}
        {!data.datasetEmpty && <OsmCredit />}
      </div>
    </Container>
  );
}
