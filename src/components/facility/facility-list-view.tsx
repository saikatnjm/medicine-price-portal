import Link from "next/link";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { JsonLd } from "@/components/common/json-ld";
import { FacilityCard, ResultList } from "@/components/directory/result-cards";
import { ResultsMap } from "@/components/directory/results-map";
import { NearMeButton } from "@/components/directory/near-me-button";
import { buildHref, Pagination } from "@/components/directory/pagination";
import { Container } from "@/components/ui/container";
import { facilityMarkers } from "@/lib/map-markers";
import { routes } from "@/lib/routes";
import {
  directoryListBreadcrumbs,
  directoryListJsonLd,
  facilityListDescription,
  facilityListHeading,
  facilityListTitle,
  locationScopeName,
} from "@/lib/seo-facilities";
import { breadcrumbJsonLd } from "@/lib/seo";
import { BrowseByLocation, RelatedLocationLinks, SubAreaLinks } from "./browse-links";
import { DirectoryFilterForm } from "./directory-filter-form";
import type { FacilityListData } from "./facility-list-data";
import { EmptyResults, ResultCount } from "./list-status";
import { OsmCredit } from "./osm-credit";

/** Scope text for copy, e.g. "Dhanmondi, Dhaka"; undefined for the national list. */
export function facilityScopeName(data: FacilityListData): string | undefined {
  return data.location ? locationScopeName(data.location.location, data.location.ancestors) : undefined;
}

export function facilityListCopy(data: FacilityListData) {
  const scope = { scopeName: facilityScopeName(data), specialtyName: data.specialty?.name };
  return {
    title: facilityListTitle(scope),
    heading: facilityListHeading(scope),
    description: facilityListDescription({ ...scope, total: data.list.results.total, kindCounts: data.kindCounts }),
  };
}

/** Canonical path of the clean (unfiltered) list. */
export function facilityListPath(data: FacilityListData): string {
  return routes.hospitals(data.location?.location.slug, data.specialty?.slug);
}

/** Shared by /hospitals, /hospitals/[location] and /hospitals/[location]/[specialty]. */
export function FacilityListView({ data }: { data: FacilityListData }) {
  const { params, list, location, specialty } = data;
  const { results, filters } = list;
  const path = facilityListPath(data);
  const { heading, description } = facilityListCopy(data);
  const scopeName = facilityScopeName(data);
  const breadcrumbs = directoryListBreadcrumbs("hospitals", location?.location, location?.ancestors, specialty ?? undefined);

  const hrefFor = (page: number) =>
    buildHref(path, {
      q: params.q,
      kind: filters.kind,
      location: location ? undefined : params.location,
      specialty: specialty ? undefined : params.specialty,
      emergency: filters.emergencyOnly ? "1" : undefined,
      near: params.near,
      page,
    });

  return (
    <Container className="py-8 sm:py-10">
      <JsonLd data={breadcrumbJsonLd(breadcrumbs, path)} />
      {results.items.length > 0 && data.indexable && (
        <JsonLd
          data={directoryListJsonLd({
            name: heading,
            description,
            path,
            items: results.items.map(({ facility }) => ({ name: facility.name, path: routes.hospital(facility.slug) })),
          })}
        />
      )}
      <Breadcrumbs items={breadcrumbs} />
      <header className="mt-4 mb-6 max-w-3xl space-y-3">
        <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">{heading}</h1>
        {!data.hasParams && !data.datasetEmpty && results.total > 0 && <p className="text-slate-700">{description}</p>}
        {specialty && (
          <p className="text-slate-700">
            {specialty.description}{" "}
            <Link href={routes.specialty(specialty.slug)} className="text-brand-800 underline underline-offset-2">
              About {specialty.name}
            </Link>
          </p>
        )}
      </header>

      <div className="space-y-4">
        <DirectoryFilterForm
          action={path}
          idPrefix="hospitals"
          query={params.q}
          queryLabel="Name or keyword"
          queryPlaceholder="e.g. Square, eye, diagnostic"
          locations={
            location ? undefined : { tree: data.tree, selected: filters.location?.slug ?? "", selectedName: filters.location?.name, countOf: "facilityCount" }
          }
          kinds={{ counts: data.kindCounts, selected: filters.kind }}
          specialties={specialty ? undefined : { items: data.specialties, selected: filters.specialty?.slug ?? "" }}
          emergency={{ show: data.showEmergency, checked: filters.emergencyOnly }}
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
            noun="hospitals or clinics"
            scopeName={scopeName}
            clearHref={data.hasParams ? path : routes.hospitals()}
          />
        ) : (
          <>
            <ResultCount total={results.total} page={results.page} pageSize={results.pageSize} noun="hospitals and clinics" singular="hospital or clinic" />
            <ResultsMap markers={facilityMarkers(results.items)}>
              <ResultList label="Hospitals and clinics">
                {results.items.map((item) => (
                  <FacilityCard key={item.facility.id} item={item} headingLevel="h2" />
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
            {!specialty && <SubAreaLinks items={location.children} parentName={location.location.name} type="hospitals" countOf="facilityCount" />}
            {specialty && (
              <nav aria-label="All hospitals here">
                <Link href={routes.hospitals(location.location.slug)} className="text-brand-800 underline underline-offset-2">
                  All hospitals &amp; clinics in {scopeName}
                </Link>
              </nav>
            )}
            <RelatedLocationLinks locationSlug={location.location.slug} name={location.location.name} type="hospitals" />
          </>
        ) : (
          <BrowseByLocation tree={data.tree} type="hospitals" countOf="facilityCount" />
        )}
        {!data.datasetEmpty && <OsmCredit />}
      </div>
    </Container>
  );
}
