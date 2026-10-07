/**
 * SEO copy and structured data for hospitals, clinics and pharmacies.
 * Pure functions over read models; page titles never include the site name
 * (the layout template appends it). Only fields present in the data are emitted.
 * Every text builder takes an optional trailing `lang` (default English).
 */
import type { MessageKey } from "../i18n/messages";
import { DEFAULT_LOCALE, localizePath, type Locale } from "../i18n/config";
import { createT, type Translator } from "../i18n/translate";
import type { Facility, FacilityKind, Location, PostalLocation } from "../domain/healthcare";
import type { FacilityDetail, FacilityKindCount, PharmacyDetail, Place } from "../domain/read-models";
import { countOf, divisionName, facilityKindPhraseLower, inPlace, joinAnd, lowerFor, ofPlace } from "./directory-labels";
import { routes } from "./routes";
import { absoluteUrl, type BreadcrumbItem } from "./seo";

type JsonLd = Record<string, unknown>;

// ------------------------------------------------------------------ list pages

/** "Dhaka", "Dhaka Division", "Dhanmondi, Dhaka". */
export function locationScopeName(location: Location, ancestors: readonly Location[] = [], lang: Locale = DEFAULT_LOCALE): string {
  if (location.level === "division") return divisionName(createT(lang), location.name);
  if (location.level === "area") {
    const district = ancestors.find((a) => a.level === "district");
    return district ? `${location.name}, ${district.name}` : location.name;
  }
  return location.name;
}

export interface FacilityListScope {
  /** e.g. "Dhanmondi, Dhaka"; omit for the national list. */
  scopeName?: string;
  /** e.g. "Cardiology". */
  specialtyName?: string;
}

/** Page title: "Hospitals in Dhaka", "Cardiology hospitals & clinics in Dhanmondi, Dhaka". */
export function facilityListTitle({ scopeName, specialtyName }: FacilityListScope, lang: Locale = DEFAULT_LOCALE): string {
  const t = createT(lang);
  if (!scopeName) {
    return specialtyName ? t("facility.seo.list.title.nationalSpecialty", { specialty: specialtyName }) : t("facility.seo.list.title.national");
  }
  return specialtyName
    ? t("facility.seo.list.title.scopeSpecialty", { specialty: specialtyName, scope: scopeName })
    : t("facility.seo.list.title.scope", { scope: scopeName });
}

/** The page h1. */
export function facilityListHeading({ scopeName, specialtyName }: FacilityListScope, lang: Locale = DEFAULT_LOCALE): string {
  const t = createT(lang);
  const subject = specialtyName ? t("facility.seo.list.subjectSpecialty", { specialty: specialtyName }) : t("facility.seo.list.subject");
  return t("facility.seo.list.heading", { subject, where: ofPlace(t, scopeName) });
}

const KIND_COUNT_KEYS: Record<FacilityKind, [MessageKey, MessageKey]> = {
  hospital: ["facility.n.hospital.one", "facility.n.hospital.other"],
  clinic: ["facility.n.clinic.one", "facility.n.clinic.other"],
  diagnostic_centre: ["facility.n.diagnostic_centre.one", "facility.n.diagnostic_centre.other"],
  dental_clinic: ["facility.n.dental_clinic.one", "facility.n.dental_clinic.other"],
  doctors_practice: ["facility.n.doctors_practice.one", "facility.n.doctors_practice.other"],
  health_centre: ["facility.n.health_centre.one", "facility.n.health_centre.other"],
  blood_bank: ["facility.n.blood_bank.one", "facility.n.blood_bank.other"],
  other_facility: ["facility.n.other_facility.one", "facility.n.other_facility.other"],
};

function kindBreakdown(t: Translator, kindCounts: readonly FacilityKindCount[]): string {
  const top = [...kindCounts].sort((a, b) => b.count - a.count).slice(0, 3);
  return joinAnd(
    t,
    top.map(({ kind, count }) => countOf(t, count, ...KIND_COUNT_KEYS[kind])),
  );
}

export interface FacilityListDescriptionInput extends FacilityListScope {
  total: number;
  kindCounts?: readonly FacilityKindCount[];
}

export function facilityListDescription(
  { scopeName, specialtyName, total, kindCounts = [] }: FacilityListDescriptionInput,
  lang: Locale = DEFAULT_LOCALE,
): string {
  const t = createT(lang);
  if (total === 0) {
    const where = ofPlace(t, scopeName);
    return specialtyName
      ? t("facility.seo.list.noneSpecialty", { where, specialty: lowerFor(specialtyName, lang) })
      : t("facility.seo.list.none", { where });
  }
  const subject = specialtyName
    ? t("facility.seo.list.descSubjectSpecialty", { specialty: lowerFor(specialtyName, lang) })
    : t("facility.seo.list.descSubject");
  const breakdown = !specialtyName && scopeName ? kindBreakdown(t, kindCounts) : "";
  return t("facility.seo.list.description", {
    count: total.toLocaleString("en-US"),
    subject,
    where: inPlace(t, scopeName),
    including: breakdown ? t("facility.seo.list.including", { breakdown }) : "",
    caveat: t("facility.seo.dataCaveat"),
  });
}

export function pharmacyListTitle(scopeName?: string, lang: Locale = DEFAULT_LOCALE): string {
  const t = createT(lang);
  return scopeName ? t("facility.seo.pharmacy.title.scope", { scope: scopeName }) : t("facility.seo.pharmacy.title.national");
}

export function pharmacyListHeading(scopeName?: string, lang: Locale = DEFAULT_LOCALE): string {
  const t = createT(lang);
  return t("facility.seo.pharmacy.heading", { where: ofPlace(t, scopeName) });
}

export function pharmacyListDescription(scopeName: string | undefined, total: number, lang: Locale = DEFAULT_LOCALE): string {
  const t = createT(lang);
  if (total === 0) return t("facility.seo.pharmacy.none", { where: ofPlace(t, scopeName) });
  return t("facility.seo.pharmacy.description", {
    count: total.toLocaleString("en-US"),
    where: inPlace(t, scopeName),
    caveat: t("facility.seo.dataCaveat"),
  });
}

/** Divisions are labelled "Dhaka Division" so they are not confused with the same-name district. */
export function crumbName(location: Location, lang: Locale = DEFAULT_LOCALE): string {
  return location.level === "division" ? divisionName(createT(lang), location.name) : location.name;
}

/** Home › Hospitals › Dhaka Division › Dhaka › Dhanmondi › Cardiology (last item is the current page). */
export function directoryListBreadcrumbs(
  type: "hospitals" | "pharmacies",
  location?: Location,
  ancestors: readonly Location[] = [],
  specialty?: { name: string },
  lang: Locale = DEFAULT_LOCALE,
): BreadcrumbItem[] {
  const t = createT(lang);
  const base = type === "hospitals" ? routes.hospitals : routes.pharmacies;
  const rootName = type === "hospitals" ? t("directory.crumb.hospitals") : t("directory.crumb.pharmacies");
  const items: BreadcrumbItem[] = [{ name: t("directory.crumb.home"), href: routes.home() }];
  if (!location) return [...items, { name: rootName }];
  items.push({ name: rootName, href: base() });
  for (const a of ancestors) items.push({ name: crumbName(a, lang), href: base(a.slug) });
  items.push(specialty ? { name: crumbName(location, lang), href: base(location.slug) } : { name: crumbName(location, lang) });
  if (specialty) items.push({ name: specialty.name });
  return items;
}

export interface ListItemRef {
  name: string;
  path: string;
}

/** CollectionPage with an ItemList of the entries on the current page (names and URLs only). */
export function directoryListJsonLd(input: {
  name: string;
  description: string;
  path: string;
  items: readonly ListItemRef[];
  lang?: Locale;
}): JsonLd {
  const lang = input.lang ?? DEFAULT_LOCALE;
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: input.name,
    description: input.description,
    url: absoluteUrl(localizePath(input.path, lang)),
    inLanguage: lang,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: input.items.length,
      itemListElement: input.items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        url: absoluteUrl(localizePath(item.path, lang)),
      })),
    },
  };
}

// -------------------------------------------------------------- facility pages

function hasText(value: string | undefined | null): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function describeKind(t: Translator, facility: Facility): string {
  return facilityKindPhraseLower(t, facility.kind, facility.ownership);
}

/** "a private hospital" / "an eye hospital" in English; Bangla has no articles. */
function withArticle(phrase: string, lang: Locale): string {
  if (lang !== DEFAULT_LOCALE) return phrase;
  return /^[aeiou]/i.test(phrase) ? `an ${phrase}` : `a ${phrase}`;
}

/** Most specific short place name for titles: area, else district. */
function shortPlace(place: Place): string | undefined {
  return place.area?.name ?? place.district?.name;
}

/** "ABC Eye Hospital, Gazipur — Location, Contact & Details" (the place is omitted when unknown). */
export function facilityTitle(detail: FacilityDetail, lang: Locale = DEFAULT_LOCALE): string {
  const where = shortPlace(detail.place);
  const base = where ? `${detail.facility.name}, ${where}` : detail.facility.name;
  return createT(lang)("facility.seo.title", { base });
}

export function facilityDescription(detail: FacilityDetail, lang: Locale = DEFAULT_LOCALE): string {
  const t = createT(lang);
  const { facility, place, specialties } = detail;
  const kind = withArticle(describeKind(t, facility), lang);
  const parts = [
    place.label
      ? t("facility.seo.intro.place", { name: facility.name, kind, place: place.label })
      : t("facility.seo.intro", { name: facility.name, kind }),
  ];
  if (specialties.length > 0) {
    parts.push(t("facility.seo.departments", { list: specialties.slice(0, 5).map((s) => s.name).join(", ") }));
  }
  const contact = [
    facility.phone && t("facility.seo.item.phone"),
    facility.website && t("facility.seo.item.website"),
    facility.address && t("facility.seo.item.address"),
    facility.openingHours && t("facility.seo.item.hours"),
  ].filter(Boolean);
  if (contact.length > 0) parts.push(t("facility.seo.lists", { items: contact.join(", ") }));
  parts.push(t("facility.seo.caveat"));
  return parts.join(" ");
}

export function facilityBreadcrumbs(detail: FacilityDetail, lang: Locale = DEFAULT_LOCALE): BreadcrumbItem[] {
  return entityBreadcrumbs("hospitals", detail.facility.name, detail.place, lang);
}

const TITLE_MAX = 60;

/** "Alpha Pharmacy, Dhanmondi — Location & Contact"; shortened for long names. */
export function pharmacyTitle(detail: PharmacyDetail, lang: Locale = DEFAULT_LOCALE): string {
  const t = createT(lang);
  const where = shortPlace(detail.place);
  const base = where ? `${detail.pharmacy.name}, ${where}` : detail.pharmacy.name;
  for (const suffix of [t("facility.seo.pharmacy.suffix.contact"), t("facility.seo.pharmacy.suffix.short")]) {
    if (base.length + suffix.length <= TITLE_MAX) return base + suffix;
  }
  return base;
}

export function pharmacyDescription(detail: PharmacyDetail, lang: Locale = DEFAULT_LOCALE): string {
  const t = createT(lang);
  const { pharmacy, place, prices, hasSampleData } = detail;
  const published = [
    pharmacy.address && t("facility.seo.item.address"),
    pharmacy.phone && t("facility.seo.item.phone"),
    pharmacy.openingHours && t("facility.seo.item.hours"),
    (pharmacy.address || pharmacy.coordinates) && t("facility.seo.item.directions"),
  ].filter(Boolean);
  const parts = [
    place.label
      ? t("facility.seo.pharmacy.intro.place", { name: pharmacy.name, place: place.label })
      : t("facility.seo.pharmacy.intro", { name: pharmacy.name }),
  ];
  if (published.length > 0) parts.push(t("facility.seo.pharmacy.published", { items: published.join(", ") }));
  if (prices.length > 0) {
    if (hasSampleData) parts.push(t("facility.seo.pharmacy.sampleNote"));
  } else {
    parts.push(t("facility.seo.pharmacy.noPrices"));
  }
  parts.push(t("facility.seo.caveat"));
  return parts.join(" ");
}

export function pharmacyBreadcrumbs(detail: PharmacyDetail, lang: Locale = DEFAULT_LOCALE): BreadcrumbItem[] {
  return entityBreadcrumbs("pharmacies", detail.pharmacy.name, detail.place, lang);
}

/** Home › Hospitals › <District> › <Name>. */
function entityBreadcrumbs(type: "hospitals" | "pharmacies", name: string, place: Place, lang: Locale): BreadcrumbItem[] {
  const t = createT(lang);
  const base = type === "hospitals" ? routes.hospitals : routes.pharmacies;
  const items: BreadcrumbItem[] = [
    { name: t("directory.crumb.home"), href: routes.home() },
    { name: type === "hospitals" ? t("directory.crumb.hospitals") : t("directory.crumb.pharmacies"), href: base() },
  ];
  if (place.district) items.push({ name: place.district.name, href: base(place.district.slug) });
  items.push({ name });
  return items;
}

const FACILITY_SCHEMA_TYPE: Record<FacilityKind, string> = {
  hospital: "Hospital",
  clinic: "MedicalClinic",
  dental_clinic: "Dentist",
  diagnostic_centre: "DiagnosticLab",
  doctors_practice: "MedicalOrganization",
  health_centre: "MedicalClinic",
  blood_bank: "MedicalOrganization",
  other_facility: "MedicalOrganization",
};

function postalAddress(record: PostalLocation, place: Place): JsonLd | null {
  const fields: JsonLd = {
    ...(hasText(record.address) ? { streetAddress: record.address } : {}),
    ...(place.area || place.district || hasText(record.locality) || hasText(record.city)
      ? { addressLocality: record.locality ?? record.city ?? place.area?.name ?? place.district?.name }
      : {}),
    ...(place.division ? { addressRegion: place.division.name } : {}),
    ...(hasText(record.postalCode) ? { postalCode: record.postalCode } : {}),
  };
  if (Object.keys(fields).length === 0) return null;
  return { "@type": "PostalAddress", ...fields, addressCountry: "BD" };
}

function sharedOrganizationFields(
  record: PostalLocation & { name: string; altName?: string; phone?: string; website?: string; email?: string },
  place: Place,
  path: string,
  lang: Locale,
): JsonLd {
  const address = postalAddress(record, place);
  return {
    "@context": "https://schema.org",
    name: record.name,
    ...(hasText(record.altName) ? { alternateName: record.altName } : {}),
    url: absoluteUrl(localizePath(path, lang)),
    ...(hasText(record.website) ? { sameAs: record.website } : {}),
    ...(hasText(record.phone) ? { telephone: record.phone } : {}),
    ...(hasText(record.email) ? { email: record.email } : {}),
    ...(address ? { address } : {}),
    ...(record.coordinates
      ? { geo: { "@type": "GeoCoordinates", latitude: record.coordinates.lat, longitude: record.coordinates.lon } }
      : {}),
  };
}

/** Hospital / MedicalClinic / Dentist / DiagnosticLab / MedicalOrganization. No ratings or reviews. */
export function facilityJsonLd(detail: FacilityDetail, lang: Locale = DEFAULT_LOCALE): JsonLd {
  const { facility, place, specialties } = detail;
  return {
    ...sharedOrganizationFields(facility, place, routes.hospital(facility.slug), lang),
    "@type": FACILITY_SCHEMA_TYPE[facility.kind],
    ...(specialties.length > 0 ? { medicalSpecialty: specialties.map((s) => s.name) } : {}),
  };
}

export function pharmacyJsonLd(detail: PharmacyDetail, lang: Locale = DEFAULT_LOCALE): JsonLd {
  const { pharmacy, place } = detail;
  return {
    ...sharedOrganizationFields(pharmacy, place, routes.pharmacy(pharmacy.slug), lang),
    "@type": "Pharmacy",
  };
}
