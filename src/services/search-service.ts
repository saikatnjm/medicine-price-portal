import { FACILITY_KIND_LABEL } from "../domain/healthcare";
import { DOSAGE_FORMS, type DosageForm } from "../domain/types";
import type {
  FacetOption,
  GlobalSearchResult,
  LocationListItem,
  MedicineFacetOptions,
  MedicineFilterValues,
  MedicineSearchFacets,
  SearchGroup,
  SearchIntent,
  SearchResult,
  SpecialtyListItem,
  SuggestionGroup,
} from "../domain/read-models";
import { formatMedicineName } from "../lib/format";
import { routes } from "../lib/routes";
import { cleanSearchQuery, SEARCH_MIN_QUERY_LENGTH, SEARCH_PAGE_SIZE } from "../lib/search-config";
import { normalizeSearchText } from "../lib/text";
import type { DirectoryListParams, Repositories } from "../repositories";
import { toDoctorItems, toFacilityItems, toPharmacyItems } from "./directory-items";
import { loadDirectoryStats } from "./directory-stats";
import { PlaceResolver } from "./places";
import { isStructured, parseSearchIntent } from "./search-intent";
import { toMedicineListItems } from "./summaries";

/** Results per group on the "All" search view. */
export const GLOBAL_GROUP_LIMIT = 5;
export const SUGGESTION_GROUP_LIMIT = 4;

const EMPTY_FACETS: MedicineFacetOptions = { generics: [], manufacturers: [], dosageForms: [] };

const dosageFormLabel = (form: string) => form.charAt(0).toUpperCase() + form.slice(1);

/** Raw filter values as they appear in the URL. */
export type RawMedicineFilters = {
  [K in keyof MedicineFilterValues]?: string | null;
};

function emptyGroup<T>(): SearchGroup<T> {
  return { items: [], total: 0 };
}

export class SearchService {
  constructor(private readonly repos: Repositories) {}

  /** Accepts raw user input (e.g. from the URL); never throws on bad input. */
  async searchMedicines(
    rawQuery: string | null | undefined,
    rawPage: number = 1,
    rawFilters: RawMedicineFilters = {},
  ): Promise<SearchResult> {
    const query = cleanSearchQuery(rawQuery);
    const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;
    const empty = {
      items: [],
      total: 0,
      totalPages: 0,
      page,
      pageSize: SEARCH_PAGE_SIZE,
      query,
      matchedQuery: query,
      facets: EMPTY_FACETS,
      appliedFilters: {},
    };

    if (query.length === 0) return { ...empty, status: "empty_query" };
    if (query.length < SEARCH_MIN_QUERY_LENGTH) return { ...empty, status: "query_too_short" };

    // Unknown filter values are ignored.
    const genericSlug = rawFilters.generic?.trim();
    const manufacturerSlug = rawFilters.manufacturer?.trim();
    const form = DOSAGE_FORMS.find((f) => f === rawFilters.form?.trim());
    const [generic, manufacturer] = await Promise.all([
      genericSlug ? this.repos.generics.findBySlug(genericSlug) : null,
      manufacturerSlug ? this.repos.manufacturers.findBySlug(manufacturerSlug) : null,
    ]);
    const appliedFilters: MedicineFilterValues = {
      ...(generic && { generic: generic.slug }),
      ...(manufacturer && { manufacturer: manufacturer.slug }),
      ...(form && { form }),
    };

    const search = (q: string) =>
      this.repos.medicines.search({
        query: q,
        page,
        pageSize: SEARCH_PAGE_SIZE,
        genericId: generic?.id,
        manufacturerId: manufacturer?.id,
        dosageForm: form,
      });

    let matchedQuery = query;
    let result = await search(query);
    // Nothing matched every word: fall back to the first word ("napa extra" → "napa").
    const firstWord = query.split(" ")[0] ?? "";
    // Facets count matches before filters, so "no facets" means nothing matched at all.
    if (result.facets.generics.length === 0 && firstWord !== query && firstWord.length >= SEARCH_MIN_QUERY_LENGTH) {
      const fallback = await search(firstWord);
      if (fallback.facets.generics.length > 0) {
        result = fallback;
        matchedQuery = firstWord;
      }
    }

    const [items, facets] = await Promise.all([
      toMedicineListItems(result.items, this.repos),
      this.resolveFacets(result.facets, appliedFilters),
    ]);
    return {
      ...result,
      items,
      facets,
      appliedFilters,
      query,
      matchedQuery,
      status: "ok",
      totalPages: Math.ceil(result.total / result.pageSize),
    };
  }

  private async resolveFacets(
    facets: MedicineSearchFacets,
    applied: MedicineFilterValues,
  ): Promise<MedicineFacetOptions> {
    const [generics, manufacturers] = await Promise.all([
      this.repos.generics.findByIds(facets.generics.map((f) => f.id)),
      this.repos.manufacturers.findByIds(facets.manufacturers.map((f) => f.id)),
    ]);
    const genericsById = new Map(generics.map((g) => [g.id, g]));
    const manufacturersById = new Map(manufacturers.map((m) => [m.id, m]));
    // Entries whose entity cannot be resolved are dropped (keeps the facet order).
    const named = (
      facetItems: readonly { id: string; count: number }[],
      byId: ReadonlyMap<string, { slug: string; name: string }>,
      selected: string | undefined,
    ): FacetOption[] =>
      facetItems.flatMap(({ id, count }) => {
        const entity = byId.get(id);
        return entity
          ? [{ value: entity.slug, label: entity.name, count, selected: entity.slug === selected }]
          : [];
      });
    return {
      generics: named(facets.generics, genericsById, applied.generic),
      manufacturers: named(facets.manufacturers, manufacturersById, applied.manufacturer),
      dosageForms: facets.dosageForms.map(({ value, count }) => ({
        value,
        label: dosageFormLabel(value satisfies DosageForm),
        count,
        selected: value === applied.form,
      })),
    };
  }

  /**
   * Grouped search across medicines, doctors, facilities, pharmacies, specialties
   * and locations. Understands "cardiologists in gulshan" style queries.
   */
  async searchAll(rawQuery: string | null | undefined): Promise<GlobalSearchResult> {
    const query = cleanSearchQuery(rawQuery);
    const places = await PlaceResolver.create(this.repos);
    const specialties = await this.repos.specialties.listAll();
    const emptyIntent: SearchIntent = { text: query, entity: null, specialty: null, location: null };
    const empty = (status: GlobalSearchResult["status"]): GlobalSearchResult => ({
      query,
      status,
      intent: emptyIntent,
      medicines: { ...emptyGroup(), matchedQuery: query },
      doctors: emptyGroup(),
      facilities: emptyGroup(),
      pharmacies: emptyGroup(),
      specialties: emptyGroup(),
      locations: emptyGroup(),
      total: 0,
    });
    if (query.length === 0) return empty("empty_query");
    if (query.length < SEARCH_MIN_QUERY_LENGTH) return empty("query_too_short");

    const intent = parseSearchIntent(query, places, specialties);
    const structured = isStructured(intent);
    const list: DirectoryListParams = {
      query: intent.text || undefined,
      locationIds: intent.location ? places.matchIdsOf(intent.location) : undefined,
      page: 1,
      pageSize: GLOBAL_GROUP_LIMIT,
    };
    const wants = (entity: SearchIntent["entity"]) => !intent.entity || intent.entity === entity;
    // Only a free-text part can match a location or specialty by name.
    const textMatches = !structured && intent.text.length >= SEARCH_MIN_QUERY_LENGTH;

    const [medicines, doctors, facilities, pharmacies, stats] = await Promise.all([
      structured ? null : this.searchMedicines(query),
      wants("doctor") ? this.repos.doctors.list({ ...list, specialtyId: intent.specialty?.id }) : null,
      wants("hospital") ? this.repos.facilities.list({ ...list, specialtyId: intent.specialty?.id }) : null,
      wants("pharmacy") && !intent.specialty ? this.repos.pharmacyDirectory.list(list) : null,
      loadDirectoryStats(this.repos, places),
    ]);

    const specialtyItems: SpecialtyListItem[] = (
      intent.specialty
        ? [intent.specialty]
        : textMatches
          ? specialties.filter((s) =>
              normalizeSearchText(`${s.name} ${s.practitionerTitle} ${s.aliases.join(" ")}`)
                .split(" ")
                .some((w) => w.startsWith(normalizeSearchText(intent.text))),
            )
          : []
    ).map((specialty) => ({
      specialty,
      facilityCount: stats.facilitiesWithSpecialty(specialty.id, intent.location?.id),
      doctorCount: stats.doctorsWithSpecialty(specialty.id, intent.location?.id),
    }));
    const locationMatches = intent.location
      ? [intent.location]
      : textMatches
        ? places.search(intent.text)
        : [];
    const locationItems: LocationListItem[] = locationMatches.map((location) => ({
      location,
      ...stats.countsFor(location.id),
    }));

    const groups: Omit<GlobalSearchResult, "query" | "status" | "intent" | "total"> = {
      medicines: medicines
        ? { items: medicines.items.slice(0, GLOBAL_GROUP_LIMIT), total: medicines.total, matchedQuery: medicines.matchedQuery }
        : { ...emptyGroup(), matchedQuery: query },
      doctors: doctors
        ? { items: await toDoctorItems(doctors.items, this.repos, places), total: doctors.total }
        : emptyGroup(),
      facilities: facilities
        ? { items: await toFacilityItems(facilities.items, this.repos, places), total: facilities.total }
        : emptyGroup(),
      pharmacies: pharmacies
        ? { items: toPharmacyItems(pharmacies.items, places), total: pharmacies.total }
        : emptyGroup(),
      specialties: { items: specialtyItems.slice(0, GLOBAL_GROUP_LIMIT), total: specialtyItems.length },
      locations: { items: locationItems.slice(0, GLOBAL_GROUP_LIMIT), total: locationItems.length },
    };
    const total = Object.values(groups).reduce((sum, g) => sum + g.total, 0);
    return { query, status: "ok", intent, ...groups, total };
  }

  /** Small grouped suggestions for the search box (served by /api/suggest). */
  async suggest(rawQuery: string | null | undefined): Promise<SuggestionGroup[]> {
    const result = await this.searchAll(rawQuery);
    if (result.status !== "ok") return [];
    const limit = <T>(items: T[]) => items.slice(0, SUGGESTION_GROUP_LIMIT);
    const places = await PlaceResolver.create(this.repos);
    // While typing "cardiologist in dha", offer places matching the last, unfinished word.
    const lastWord = result.query.split(" ").at(-1) ?? "";
    const locations =
      result.locations.items.length > 0
        ? result.locations.items.map((l) => l.location)
        : result.query.includes(" ") && lastWord.length >= SEARCH_MIN_QUERY_LENGTH
          ? places.search(lastWord)
          : [];
    const locationDetail = (location: (typeof locations)[number]) => {
      if (location.level === "division") return "Division";
      if (location.level === "district") return "District";
      const district = places.get(location.parentId);
      return district ? `Area · ${district.name}` : "Area";
    };
    const groups: SuggestionGroup[] = [
      {
        type: "medicine",
        label: "Medicines",
        items: limit(result.medicines.items).map(({ medicine, generic }) => ({
          type: "medicine",
          label: `${formatMedicineName(medicine)} ${medicine.dosageFormLabel}`.trim(),
          detail: generic.name,
          href: routes.medicine(medicine.slug),
        })),
      },
      {
        type: "doctor",
        label: "Doctors",
        items: limit(result.doctors.items).map(({ doctor, specialties, chamber }) => ({
          type: "doctor",
          label: doctor.name,
          detail: [specialties[0]?.practitionerTitle, chamber?.place.label].filter(Boolean).join(" · ") || undefined,
          href: routes.doctor(doctor.slug),
        })),
      },
      {
        type: "hospital",
        label: "Hospitals & clinics",
        items: limit(result.facilities.items).map(({ facility, place }) => ({
          type: "hospital",
          label: facility.name,
          detail: [FACILITY_KIND_LABEL[facility.kind], place.label].filter(Boolean).join(" · "),
          href: routes.hospital(facility.slug),
        })),
      },
      {
        type: "pharmacy",
        label: "Pharmacies",
        items: limit(result.pharmacies.items).map(({ pharmacy, place }) => ({
          type: "pharmacy",
          label: pharmacy.name,
          detail: place.label || undefined,
          href: routes.pharmacy(pharmacy.slug),
        })),
      },
      {
        type: "specialty",
        label: "Specialties",
        items: limit(result.specialties.items).map(({ specialty }) => ({
          type: "specialty",
          label: specialty.name,
          detail: specialty.practitionerTitle,
          href: routes.specialty(specialty.slug),
        })),
      },
      {
        type: "location",
        label: "Locations",
        items: limit(locations).map((location) => ({
          type: "location",
          label: location.name,
          detail: locationDetail(location),
          href: routes.location(location.slug),
        })),
      },
    ];
    return groups.filter((g) => g.items.length > 0);
  }
}
