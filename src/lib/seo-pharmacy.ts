/**
 * Language-aware SEO copy and structured data for pharmacy pages and lists.
 * English output is identical to the helpers in seo-facilities.ts; Bangla uses message templates.
 * Names, addresses and other record data are never translated.
 */
import type { Location } from "../domain/healthcare";
import type { PharmacyDetail, Place } from "../domain/read-models";
import { DEFAULT_LOCALE, type Locale } from "../i18n/config";
import { createT } from "../i18n/translate";
import { routes } from "./routes";
import type { BreadcrumbItem } from "./seo";
import { directoryListJsonLd, pharmacyJsonLd, type ListItemRef } from "./seo-facilities";

type JsonLd = Record<string, unknown>;

const TITLE_MAX = 60;

function shortPlace(place: Place): string | undefined {
  return place.area?.name ?? place.district?.name;
}

/** "Alpha Pharmacy, Dhanmondi — Location & Contact"; shortened for long names. */
export function pharmacyPageTitle(detail: PharmacyDetail, lang: Locale = DEFAULT_LOCALE): string {
  const t = createT(lang);
  const where = shortPlace(detail.place);
  const base = where ? `${detail.pharmacy.name}, ${where}` : detail.pharmacy.name;
  for (const suffix of [t("pharmacy.seo.suffix_long"), t("pharmacy.seo.suffix_short")]) {
    if (base.length + suffix.length <= TITLE_MAX) return base + suffix;
  }
  return base;
}

export function pharmacyPageDescription(detail: PharmacyDetail, lang: Locale = DEFAULT_LOCALE): string {
  const t = createT(lang);
  const { pharmacy, place, prices, hasSampleData } = detail;
  const intro = place.label
    ? t("pharmacy.seo.intro_place", { name: pharmacy.name, place: place.label })
    : t("pharmacy.seo.intro", { name: pharmacy.name });
  const published = [
    pharmacy.address && t("pharmacy.seo.item_address"),
    pharmacy.phone && t("pharmacy.seo.item_phone"),
    pharmacy.openingHours && t("pharmacy.seo.item_hours"),
    (pharmacy.address || pharmacy.coordinates) && t("pharmacy.seo.item_directions"),
  ].filter(Boolean);
  const parts = [intro];
  if (published.length > 0) parts.push(t("pharmacy.seo.lists", { items: published.join(", ") }));
  if (prices.length === 0) parts.push(t("pharmacy.seo.price_none"));
  else if (hasSampleData) parts.push(t("pharmacy.seo.price_sample"));
  parts.push(t("pharmacy.seo.caveat"));
  return parts.join(" ");
}

/** "Dhaka Division" for divisions, "Dhanmondi, Dhaka" for areas, otherwise the plain name. */
export function pharmacyCrumbName(location: Location, lang: Locale = DEFAULT_LOCALE): string {
  return location.level === "division" ? createT(lang)("pharmacy.seo.division", { name: location.name }) : location.name;
}

export function pharmacyScope(location: Location, ancestors: readonly Location[] = [], lang: Locale = DEFAULT_LOCALE): string {
  if (location.level === "area") {
    const district = ancestors.find((a) => a.level === "district");
    return district ? `${location.name}, ${district.name}` : location.name;
  }
  return pharmacyCrumbName(location, lang);
}

/** Home › Pharmacies › <District> › <Name> for a pharmacy page. */
export function pharmacyPageBreadcrumbs(detail: PharmacyDetail, lang: Locale = DEFAULT_LOCALE): BreadcrumbItem[] {
  const t = createT(lang);
  const items: BreadcrumbItem[] = [
    { name: t("pharmacy.seo.home"), href: routes.home() },
    { name: t("pharmacy.seo.pharmacies"), href: routes.pharmacies() },
  ];
  const { district } = detail.place;
  if (district) items.push({ name: district.name, href: routes.pharmacies(district.slug) });
  items.push({ name: detail.pharmacy.name });
  return items;
}

/** Pharmacy structured data with a language-specific URL. */
export function pharmacyPageJsonLd(detail: PharmacyDetail, lang: Locale = DEFAULT_LOCALE): JsonLd {
  return pharmacyJsonLd(detail, lang);
}

// ------------------------------------------------------------------ list pages

export function pharmacyListTitleFor(scopeName: string | undefined, lang: Locale = DEFAULT_LOCALE): string {
  const t = createT(lang);
  return scopeName ? t("pharmacy.seo.list_title", { scope: scopeName }) : t("pharmacy.seo.list_title_national");
}

export function pharmacyListDescriptionFor(scopeName: string | undefined, total: number, lang: Locale = DEFAULT_LOCALE): string {
  const t = createT(lang);
  if (total === 0) {
    return scopeName ? t("pharmacy.seo.list_desc_empty", { scope: scopeName }) : t("pharmacy.seo.list_desc_empty_national");
  }
  const vars = { count: total.toLocaleString("en-US"), caveat: t("pharmacy.seo.list_caveat") };
  return scopeName ? t("pharmacy.seo.list_desc", { ...vars, scope: scopeName }) : t("pharmacy.seo.list_desc_national", vars);
}

/** Home › Pharmacies › Dhaka Division › Dhaka › Dhanmondi (last item is the current page). */
export function pharmacyListBreadcrumbs(
  location?: Location,
  ancestors: readonly Location[] = [],
  lang: Locale = DEFAULT_LOCALE,
): BreadcrumbItem[] {
  const t = createT(lang);
  const items: BreadcrumbItem[] = [{ name: t("pharmacy.seo.home"), href: routes.home() }];
  if (!location) return [...items, { name: t("pharmacy.seo.pharmacies") }];
  items.push({ name: t("pharmacy.seo.pharmacies"), href: routes.pharmacies() });
  for (const a of ancestors) items.push({ name: pharmacyCrumbName(a, lang), href: routes.pharmacies(a.slug) });
  items.push({ name: pharmacyCrumbName(location, lang) });
  return items;
}

/** CollectionPage for a pharmacy list with language-specific URLs. */
export function pharmacyListJsonLd(
  input: { name: string; description: string; path: string; items: readonly ListItemRef[] },
  lang: Locale = DEFAULT_LOCALE,
): JsonLd {
  return directoryListJsonLd({ ...input, lang });
}
