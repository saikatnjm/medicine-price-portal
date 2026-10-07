import type { CombinationIndexEntry } from "../domain/read-models";
import { DEFAULT_LOCALE } from "../i18n/config";
import { createT, type Translator } from "../i18n/translate";
import { routes } from "./routes";
import { pluralTitle } from "./seo-directory";

/** A "People also search for" link; always points at an existing, indexable route. */
export interface RelatedSearch {
  label: string;
  href: string;
}

interface SpecialtyRef {
  slug: string;
  name: string;
  practitionerTitle: string;
}

const byCountThenLabel = (a: { count: number; label: string }, b: { count: number; label: string }) =>
  b.count - a.count || a.label.localeCompare(b.label);

function strip(items: { count: number; label: string; href: string }[], limit: number): RelatedSearch[] {
  return items
    .sort(byCountThenLabel)
    .slice(0, limit)
    .map(({ label, href }) => ({ label, href }));
}

/** Specialty page: the places where this specialty has enough doctors / facilities to have its own page. */
export function relatedForSpecialty(input: {
  specialty: SpecialtyRef;
  combinations: readonly CombinationIndexEntry[];
  placeName: (locationSlug: string) => string | undefined;
  limit?: number;
  /** Translator for the link labels; English when omitted. */
  t?: Translator;
}): RelatedSearch[] {
  const { specialty, combinations, placeName, limit = 6, t = createT(DEFAULT_LOCALE) } = input;
  const items: { count: number; label: string; href: string }[] = [];
  for (const entry of combinations) {
    if (entry.specialtySlug !== specialty.slug) continue;
    const place = placeName(entry.locationSlug);
    if (!place) continue;
    if (entry.type === "doctors") {
      items.push({ count: entry.count, label: t("common.related.doctorsIn", { who: pluralTitle(specialty.practitionerTitle), place }), href: routes.doctors(entry.locationSlug, specialty.slug) });
    } else if (entry.type === "hospitals") {
      items.push({ count: entry.count, label: t("common.related.specialtyHospitalsIn", { specialty: specialty.name, place }), href: routes.hospitals(entry.locationSlug, specialty.slug) });
    }
  }
  return strip(items, limit);
}

/** Location page: the lists for this place plus its best specialty pages. */
export function relatedForLocation(input: {
  locationSlug: string;
  placeName: string;
  combinations: readonly CombinationIndexEntry[];
  specialtyOf: (slug: string) => SpecialtyRef | undefined;
  limit?: number;
  /** Translator for the link labels; English when omitted. */
  t?: Translator;
}): RelatedSearch[] {
  const { locationSlug, placeName, combinations, specialtyOf, limit = 8, t = createT(DEFAULT_LOCALE) } = input;
  const here = combinations.filter((c) => c.locationSlug === locationSlug);
  const plain: RelatedSearch[] = [];
  const add = (type: CombinationIndexEntry["type"], label: string, href: string) => {
    if (here.some((c) => c.type === type && !c.specialtySlug)) plain.push({ label, href });
  };
  add("hospitals", t("common.related.hospitalsIn", { place: placeName }), routes.hospitals(locationSlug));
  add("pharmacies", t("common.related.pharmaciesIn", { place: placeName }), routes.pharmacies(locationSlug));
  add("doctors", t("common.related.doctorsInPlace", { place: placeName }), routes.doctors(locationSlug));

  const items: { count: number; label: string; href: string }[] = [];
  for (const entry of here) {
    if (!entry.specialtySlug) continue;
    const specialty = specialtyOf(entry.specialtySlug);
    if (!specialty) continue;
    if (entry.type === "doctors") {
      items.push({ count: entry.count, label: t("common.related.doctorsIn", { who: pluralTitle(specialty.practitionerTitle), place: placeName }), href: routes.doctors(locationSlug, specialty.slug) });
    } else if (entry.type === "hospitals") {
      items.push({ count: entry.count, label: t("common.related.specialtyHospitalsIn", { specialty: specialty.name, place: placeName }), href: routes.hospitals(locationSlug, specialty.slug) });
    }
  }
  return [...plain, ...strip(items, Math.max(0, limit - plain.length))];
}
