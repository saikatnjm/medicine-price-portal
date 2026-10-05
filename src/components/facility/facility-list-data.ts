import { cache } from "react";
import { services } from "@/data";
import type { Specialty } from "@/domain/healthcare";
import type {
  DirectoryListResult,
  DivisionWithDistricts,
  FacilityKindCount,
  FacilityListItem,
  LocationDetail,
  SpecialtyListItem,
} from "@/domain/read-models";
import type { SearchParamValue } from "@/lib/search-params";
import { readListParams, type ListParams } from "./list-params";

export interface FacilityScope {
  location?: string;
  specialty?: string;
}

export interface FacilityListData {
  params: ListParams;
  list: DirectoryListResult<FacilityListItem>;
  /** Location fixed by the path (null on /hospitals). */
  location: LocationDetail | null;
  /** Specialty fixed by the path. */
  specialty: Specialty | null;
  tree: DivisionWithDistricts[];
  kindCounts: FacilityKindCount[];
  specialties: SpecialtyListItem[];
  showEmergency: boolean;
  /** No facility exists at all (import has not run). */
  datasetEmpty: boolean;
  /** Any URL filter or page > 1 is applied. */
  hasParams: boolean;
  indexable: boolean;
}

const load = cache(async (key: string): Promise<FacilityListData | null> => {
  const { scope, params } = JSON.parse(key) as { scope: FacilityScope; params: ListParams };

  const [location, allSpecialties, allKinds, tree] = await Promise.all([
    scope.location ? services.locations.getLocationDetail(scope.location) : null,
    services.specialties.listSpecialties(),
    services.facilities.countByKind(),
    services.locations.listLocationTree(),
  ]);
  if (scope.location && !location) return null;
  const specialtyItem = scope.specialty ? allSpecialties.find((s) => s.specialty.slug === scope.specialty) : undefined;
  if (scope.specialty && !specialtyItem) return null;

  const locationSlug = scope.location ?? (params.location || undefined);
  const specialtySlug = scope.specialty ?? (params.specialty || undefined);
  const [list, emergencyProbe] = await Promise.all([
    services.facilities.listFacilities({
      query: params.q,
      kind: params.kind,
      location: locationSlug,
      specialty: specialtySlug,
      emergency: params.emergency,
      near: params.near,
      page: params.page,
    }),
    services.facilities.listFacilities({ location: locationSlug, emergency: true, page: 1, pageSize: 1 }),
  ]);

  const datasetEmpty = allKinds.length === 0;
  const hasParams = Boolean(
    params.q ||
      params.kind ||
      (!scope.location && params.location) ||
      (!scope.specialty && params.specialty) ||
      params.emergency ||
      params.near ||
      params.page > 1,
  );
  const indexable =
    !hasParams &&
    (scope.location
      ? await services.directory.isIndexableCombination("hospitals", scope.location, scope.specialty)
      : !datasetEmpty);

  return {
    params,
    list,
    location,
    specialty: specialtyItem?.specialty ?? null,
    tree,
    kindCounts: location ? location.kindCounts : allKinds,
    specialties: (location ? location.specialties : allSpecialties).filter((s) => s.facilityCount > 0),
    showEmergency: emergencyProbe.results.total > 0 || params.emergency,
    datasetEmpty,
    hasParams,
    indexable,
  };
});

/** Cached per request so generateMetadata and the page share one load. Null when the path scope is unknown. */
export function loadFacilityListData(scope: FacilityScope, rawParams: Record<string, SearchParamValue>) {
  return load(JSON.stringify({ scope, params: readListParams(rawParams) }));
}
