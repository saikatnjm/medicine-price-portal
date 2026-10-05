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
import { Container } from "@/components/ui/container";
import { routes } from "@/lib/routes";
import { breadcrumbJsonLd } from "@/lib/seo";
import {
  directoryListBreadcrumbs,
  directoryListJsonLd,
  locationScopeName,
  pharmacyListDescription,
  pharmacyListHeading,
  pharmacyListTitle,
} from "@/lib/seo-facilities";
import type { PharmacyListData } from "./pharmacy-list-data";

export function pharmacyScopeName(data: PharmacyListData): string | undefined {
  return data.location ? locationScopeName(data.location.location, data.location.ancestors) : undefined;
}

export function pharmacyListCopy(data: PharmacyListData) {
  const scopeName = pharmacyScopeName(data);
  return {
    title: pharmacyListTitle(scopeName),
    heading: pharmacyListHeading(scopeName),
    description: pharmacyListDescription(scopeName, data.list.results.total),
  };
}

export function pharmacyListPath(data: PharmacyListData): string {
  return routes.pharmacies(data.location?.location.slug);
}

/** Shared by /pharmacies and /pharmacies/[location]. */
export function PharmacyListView({ data }: { data: PharmacyListData }) {
  const { params, list, location } = data;
  const { results, filters } = list;
  const path = pharmacyListPath(data);
  const { heading, description } = pharmacyListCopy(data);
  const scopeName = pharmacyScopeName(data);
  const breadcrumbs = directoryListBreadcrumbs("pharmacies", location?.location, location?.ancestors);
  const hrefFor = (page: number) =>
    buildHref(path, { q: params.q, location: location ? undefined : params.location, near: params.near, page });

  return (
    <Container className="py-8 sm:py-10">
      <JsonLd data={breadcrumbJsonLd(breadcrumbs, path)} />
      {results.items.length > 0 && data.indexable && (
        <JsonLd
          data={directoryListJsonLd({
            name: heading,
            description,
            path,
            items: results.items.map(({ pharmacy }) => ({ name: pharmacy.name, path: routes.pharmacy(pharmacy.slug) })),
          })}
        />
      )}
      <Breadcrumbs items={breadcrumbs} />
      <header className="mt-4 mb-6 max-w-3xl space-y-3">
        <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">{heading}</h1>
        <p className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800">
          Medicine prices and stock are not available for these pharmacies yet. This list shows where pharmacies are, not
          what they sell or charge.
        </p>
      </header>

      <div className="space-y-4">
        <DirectoryFilterForm
          action={path}
          idPrefix="pharmacies"
          query={params.q}
          queryLabel="Pharmacy name"
          queryPlaceholder="Search by pharmacy name"
          locations={
            location ? undefined : { tree: data.tree, selected: filters.location?.slug ?? "", selectedName: filters.location?.name, countOf: "pharmacyCount" }
          }
          clearHref={data.hasParams ? path : undefined}
        />
        <Suspense fallback={null}>
          <NearMeButton />
        </Suspense>
      </div>

      <section aria-label="Results" className="mt-6 space-y-3">
        {results.total === 0 ? (
          <EmptyResults
            datasetEmpty={data.datasetEmpty}
            hasFilters={data.hasParams}
            noun="pharmacies"
            scopeName={scopeName}
            clearHref={data.hasParams ? path : routes.pharmacies()}
          />
        ) : (
          <>
            <ResultCount total={results.total} page={results.page} pageSize={results.pageSize} noun="pharmacies" singular="pharmacy" />
            <ResultList label="Pharmacies">
              {results.items.map((item) => (
                <PharmacyCard key={item.pharmacy.id} item={item} headingLevel="h2" />
              ))}
            </ResultList>
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
