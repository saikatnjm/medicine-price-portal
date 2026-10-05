import { cache } from "react";
import { readListParams, type ListParams } from "@/components/facility/list-params";
import { services } from "@/data";
import type {
  DirectoryListResult,
  DivisionWithDistricts,
  LocationDetail,
  PharmacyListItem,
} from "@/domain/read-models";
import type { SearchParamValue } from "@/lib/search-params";

export interface PharmacyListData {
  params: ListParams;
  list: DirectoryListResult<PharmacyListItem>;
  location: LocationDetail | null;
  tree: DivisionWithDistricts[];
  datasetEmpty: boolean;
  hasParams: boolean;
  indexable: boolean;
}

const load = cache(async (key: string): Promise<PharmacyListData | null> => {
  const { scope, params } = JSON.parse(key) as { scope: string | null; params: ListParams };
  const [location, tree, summary] = await Promise.all([
    scope ? services.locations.getLocationDetail(scope) : null,
    services.locations.listLocationTree(),
    services.directory.getSummary(),
  ]);
  if (scope && !location) return null;
  const list = await services.pharmacies.listPharmacies({
    query: params.q,
    location: scope ?? (params.location || undefined),
    near: params.near,
    page: params.page,
  });
  const datasetEmpty = summary.pharmacyCount === 0;
  const hasParams = Boolean(params.q || (!scope && params.location) || params.near || params.page > 1);
  const indexable =
    !hasParams && (scope ? await services.directory.isIndexableCombination("pharmacies", scope) : !datasetEmpty);
  return { params, list, location, tree, datasetEmpty, hasParams, indexable };
});

/** Cached per request so generateMetadata and the page share one load. Null when the location slug is unknown. */
export function loadPharmacyListData(locationSlug: string | null, rawParams: Record<string, SearchParamValue>) {
  return load(JSON.stringify({ scope: locationSlug, params: readListParams(rawParams) }));
}
