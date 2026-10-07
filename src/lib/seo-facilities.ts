/**
 * SEO copy and structured data for hospitals, clinics and pharmacies.
 * Pure functions over read models; page titles never include the site name
 * (the layout template appends it). Only fields present in the data are emitted.
 */
import {
  FACILITY_KIND_LABEL,
  OWNERSHIP_LABEL,
  type Facility,
  type FacilityKind,
  type Location,
  type PostalLocation,
} from "../domain/healthcare";
import type { FacilityDetail, FacilityKindCount, PharmacyDetail, Place } from "../domain/read-models";
import { pluralize } from "./format";
import { routes } from "./routes";
import { absoluteUrl, type BreadcrumbItem } from "./seo";

type JsonLd = Record<string, unknown>;

// ------------------------------------------------------------------ list pages

/** "Dhaka", "Dhaka Division", "Dhanmondi, Dhaka". */
export function locationScopeName(location: Location, ancestors: readonly Location[] = []): string {
  if (location.level === "division") return `${location.name} Division`;
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
export function facilityListTitle({ scopeName, specialtyName }: FacilityListScope): string {
  if (!scopeName) return specialtyName ? `${specialtyName} Hospitals & Clinics in Bangladesh` : "Hospitals & Clinics in Bangladesh";
  return specialtyName ? `${specialtyName} in ${scopeName}` : `Hospitals in ${scopeName}`;
}

/** The page h1. */
export function facilityListHeading({ scopeName, specialtyName }: FacilityListScope): string {
  const subject = specialtyName ? `${specialtyName} hospitals & clinics` : "Hospitals & clinics";
  return `${subject} in ${scopeName ?? "Bangladesh"}`;
}

const KIND_PLURAL: Record<FacilityKind, [string, string]> = {
  hospital: ["hospital", "hospitals"],
  clinic: ["clinic", "clinics"],
  diagnostic_centre: ["diagnostic centre", "diagnostic centres"],
  dental_clinic: ["dental clinic", "dental clinics"],
  doctors_practice: ["doctor's practice", "doctors' practices"],
  health_centre: ["health centre", "health centres"],
  blood_bank: ["blood bank", "blood banks"],
  other_facility: ["other healthcare facility", "other healthcare facilities"],
};

function kindBreakdown(kindCounts: readonly FacilityKindCount[]): string {
  const top = [...kindCounts].sort((a, b) => b.count - a.count).slice(0, 3);
  const parts = top.map(({ kind, count }) => pluralize(count, ...KIND_PLURAL[kind]));
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0]!;
  return `${parts.slice(0, -1).join(", ")} and ${parts.at(-1)}`;
}

const FACILITY_DATA_CAVEAT =
  "Listings come from community-mapped OpenStreetMap data and have not been verified, so call ahead before visiting.";

export interface FacilityListDescriptionInput extends FacilityListScope {
  total: number;
  kindCounts?: readonly FacilityKindCount[];
}

export function facilityListDescription({ scopeName, specialtyName, total, kindCounts = [] }: FacilityListDescriptionInput): string {
  const where = scopeName ?? "Bangladesh";
  const count = total.toLocaleString("en-US");
  if (total === 0) {
    return `Hospitals and clinics in ${where}. No ${specialtyName ? `${specialtyName.toLowerCase()} ` : ""}listings are available yet.`;
  }
  const subject = specialtyName ? `${specialtyName.toLowerCase()} hospitals and clinics` : "hospitals and clinics";
  const breakdown = !specialtyName && scopeName ? kindBreakdown(kindCounts) : "";
  return `${count} ${subject} in ${where}${breakdown ? `, including ${breakdown}` : ""}. Find addresses, phone numbers and directions. ${FACILITY_DATA_CAVEAT}`;
}

export function pharmacyListTitle(scopeName?: string): string {
  return scopeName ? `Pharmacies in ${scopeName}` : "Pharmacies in Bangladesh";
}

export function pharmacyListHeading(scopeName?: string): string {
  return `Pharmacies in ${scopeName ?? "Bangladesh"}`;
}

export function pharmacyListDescription(scopeName: string | undefined, total: number): string {
  const where = scopeName ?? "Bangladesh";
  if (total === 0) return `Pharmacies in ${where}. No listings are available yet.`;
  return `${total.toLocaleString("en-US")} pharmacies in ${where} with addresses, phone numbers and directions where published. Medicine prices and stock are not available yet. ${FACILITY_DATA_CAVEAT}`;
}

/** Divisions are labelled "Dhaka Division" so they are not confused with the same-name district. */
export function crumbName(location: Location): string {
  return location.level === "division" ? `${location.name} Division` : location.name;
}

/** Home › Hospitals › Dhaka Division › Dhaka › Dhanmondi › Cardiology (last item is the current page). */
export function directoryListBreadcrumbs(
  type: "hospitals" | "pharmacies",
  location?: Location,
  ancestors: readonly Location[] = [],
  specialty?: { name: string },
): BreadcrumbItem[] {
  const base = type === "hospitals" ? routes.hospitals : routes.pharmacies;
  const rootName = type === "hospitals" ? "Hospitals" : "Pharmacies";
  const items: BreadcrumbItem[] = [{ name: "Home", href: routes.home() }];
  if (!location) return [...items, { name: rootName }];
  items.push({ name: rootName, href: base() });
  for (const a of ancestors) items.push({ name: crumbName(a), href: base(a.slug) });
  items.push(specialty ? { name: crumbName(location), href: base(location.slug) } : { name: crumbName(location) });
  if (specialty) items.push({ name: specialty.name });
  return items;
}

export interface ListItemRef {
  name: string;
  path: string;
}

/** CollectionPage with an ItemList of the entries on the current page (names and URLs only). */
export function directoryListJsonLd(input: { name: string; description: string; path: string; items: readonly ListItemRef[] }): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    inLanguage: "en",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: input.items.length,
      itemListElement: input.items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        url: absoluteUrl(item.path),
      })),
    },
  };
}

// -------------------------------------------------------------- facility pages

function hasText(value: string | undefined | null): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function describeKind(facility: Facility): string {
  const kind = FACILITY_KIND_LABEL[facility.kind].toLowerCase();
  return facility.ownership ? `${OWNERSHIP_LABEL[facility.ownership].toLowerCase()} ${kind}` : kind;
}

function withArticle(phrase: string): string {
  return /^[aeiou]/i.test(phrase) ? `an ${phrase}` : `a ${phrase}`;
}

/** Most specific short place name for titles: area, else district. */
function shortPlace(place: Place): string | undefined {
  return place.area?.name ?? place.district?.name;
}

/** "ABC Eye Hospital, Gazipur — Location, Contact & Details" (the place is omitted when unknown). */
export function facilityTitle(detail: FacilityDetail): string {
  const where = shortPlace(detail.place);
  const base = where ? `${detail.facility.name}, ${where}` : detail.facility.name;
  return `${base} — Location, Contact & Details`;
}

export function facilityDescription(detail: FacilityDetail): string {
  const { facility, place, specialties } = detail;
  const where = place.label ? ` in ${place.label}` : "";
  const parts = [`${facility.name} is ${withArticle(describeKind(facility))}${where}.`];
  if (specialties.length > 0) {
    parts.push(`Departments and specialties listed: ${specialties.slice(0, 5).map((s) => s.name).join(", ")}.`);
  }
  const contact = [
    facility.phone && "phone number",
    facility.website && "website",
    facility.address && "address",
    facility.openingHours && "opening hours",
  ].filter(Boolean);
  if (contact.length > 0) parts.push(`Lists ${contact.join(", ")} and directions where published.`);
  parts.push("Community-mapped information that may be out of date; call ahead before visiting.");
  return parts.join(" ");
}

export function facilityBreadcrumbs(detail: FacilityDetail): BreadcrumbItem[] {
  return entityBreadcrumbs("hospitals", detail.facility.name, detail.place);
}

const TITLE_MAX = 60;

/** "Alpha Pharmacy, Dhanmondi — Location & Contact"; shortened for long names. */
export function pharmacyTitle(detail: PharmacyDetail): string {
  const where = shortPlace(detail.place);
  const base = where ? `${detail.pharmacy.name}, ${where}` : detail.pharmacy.name;
  for (const suffix of [" — Location & Contact", " — Pharmacy"]) {
    if (base.length + suffix.length <= TITLE_MAX) return base + suffix;
  }
  return base;
}

export function pharmacyDescription(detail: PharmacyDetail): string {
  const { pharmacy, place, prices, hasSampleData } = detail;
  const where = place.label ? ` in ${place.label}` : "";
  const published = [
    pharmacy.address && "address",
    pharmacy.phone && "phone number",
    pharmacy.openingHours && "opening hours",
    (pharmacy.address || pharmacy.coordinates) && "directions",
  ].filter(Boolean);
  const listed = published.length > 0 ? ` Lists ${published.join(", ")} where published.` : "";
  const priceNote =
    prices.length > 0
      ? hasSampleData
        ? " Sample price entries are demonstration data, not live prices."
        : ""
      : " Medicine prices and stock are not available yet.";
  return `${pharmacy.name} is a pharmacy${where}.${listed}${priceNote} Community-mapped information that may be out of date; call ahead before visiting.`;
}

export function pharmacyBreadcrumbs(detail: PharmacyDetail): BreadcrumbItem[] {
  return entityBreadcrumbs("pharmacies", detail.pharmacy.name, detail.place);
}

/** Home › Hospitals › <District> › <Name>. */
function entityBreadcrumbs(type: "hospitals" | "pharmacies", name: string, place: Place): BreadcrumbItem[] {
  const base = type === "hospitals" ? routes.hospitals : routes.pharmacies;
  const items: BreadcrumbItem[] = [
    { name: "Home", href: routes.home() },
    { name: type === "hospitals" ? "Hospitals" : "Pharmacies", href: base() },
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
): JsonLd {
  const address = postalAddress(record, place);
  return {
    "@context": "https://schema.org",
    name: record.name,
    ...(hasText(record.altName) ? { alternateName: record.altName } : {}),
    url: absoluteUrl(path),
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
export function facilityJsonLd(detail: FacilityDetail): JsonLd {
  const { facility, place, specialties } = detail;
  return {
    ...sharedOrganizationFields(facility, place, routes.hospital(facility.slug)),
    "@type": FACILITY_SCHEMA_TYPE[facility.kind],
    ...(specialties.length > 0 ? { medicalSpecialty: specialties.map((s) => s.name) } : {}),
  };
}

export function pharmacyJsonLd(detail: PharmacyDetail): JsonLd {
  const { pharmacy, place } = detail;
  return {
    ...sharedOrganizationFields(pharmacy, place, routes.pharmacy(pharmacy.slug)),
    "@type": "Pharmacy",
  };
}
