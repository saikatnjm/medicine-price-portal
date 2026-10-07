/**
 * Titles, descriptions and structured data for doctor, specialty and location
 * pages. Pure functions; page titles never include the site name (the layout
 * template appends it). JSON-LD contains only fields present in the data.
 */
import type { Location, Specialty } from "../domain/healthcare";
import type { DoctorDetail, LocationDetail, SpecialtyDetail } from "../domain/read-models";
import { DEFAULT_LOCALE, localizePath, type Locale } from "../i18n/config";
import { createT } from "../i18n/translate";
import { countOf, divisionName, joinAnd, lowerFor, ofPlace } from "./directory-labels";
import { formatPlace } from "./format";
import { routes } from "./routes";
import { absoluteUrl } from "./seo";

type JsonLd = Record<string, unknown>;

/** "Cardiologist" → "Cardiologists", "ENT specialist" → "ENT specialists", "Surgery" → "Surgeries". */
export function pluralTitle(title: string): string {
  const t = title.trim();
  if (/[^aeiou]y$/i.test(t)) return `${t.slice(0, -1)}ies`;
  if (/(s|x|z|ch|sh)$/i.test(t)) return `${t}es`;
  return `${t}s`;
}

/**
 * Readable place name: area → "Dhanmondi, Dhaka", district → "Dhaka",
 * division → "Dhaka Division". `ancestors` is outermost first.
 */
export function placeName(location: Location, ancestors: readonly Location[] = [], lang: Locale = DEFAULT_LOCALE): string {
  if (location.level === "division") return divisionName(createT(lang), location.name);
  const district = location.level === "area" ? ancestors.find((a) => a.level === "district") : null;
  return formatPlace(location.name, district?.name);
}

// -------------------------------------------------------------------- doctors

/** Practitioner title in the plural (English only; Bangla uses the title as published). */
function practitioners(specialty: Specialty | null, lang: Locale): string {
  if (!specialty) return createT(lang)("directory.seo.doctors");
  return lang === DEFAULT_LOCALE ? pluralTitle(specialty.practitionerTitle) : specialty.practitionerTitle;
}

export function doctorsListHeading(specialty: Specialty | null, place: string | null, lang: Locale = DEFAULT_LOCALE): string {
  const t = createT(lang);
  return t("directory.seo.doctorsHeading", { who: practitioners(specialty, lang), where: ofPlace(t, place) });
}

export function doctorsListDescription(specialty: Specialty | null, place: string | null, total: number, lang: Locale = DEFAULT_LOCALE): string {
  const t = createT(lang);
  const who = lowerFor(practitioners(specialty, lang), lang);
  const where = ofPlace(t, place);
  if (total === 0) return t("directory.seo.doctorsNone", { where });
  return t("directory.seo.doctorsFind", {
    who,
    where,
    count: countOf(t, total, "directory.n.profile.one", "directory.n.profile.other"),
  });
}

export function doctorTitle(detail: DoctorDetail, lang: Locale = DEFAULT_LOCALE): string {
  const t = createT(lang);
  const title = detail.specialties[0]?.practitionerTitle;
  const place = detail.chambers[0]?.place.label;
  return [detail.doctor.name, [title, place ? t("directory.seo.inPlace", { place }) : null].filter(Boolean).join(" ")]
    .filter(Boolean)
    .join(" — ");
}

export function doctorDescription(detail: DoctorDetail, lang: Locale = DEFAULT_LOCALE): string {
  const t = createT(lang);
  const stop = t("directory.stop");
  const { doctor, specialties, chambers } = detail;
  const rawTitle = specialties[0]?.practitionerTitle;
  const title = rawTitle ? lowerFor(rawTitle, lang) : undefined;
  const place = chambers[0]?.place.label;
  const parts = [
    `${doctor.name}${title ? `, ${title}` : ""}${place ? ` ${t("directory.seo.inPlace", { place })}` : ""}${stop}`,
  ];
  if (doctor.designation) parts.push(`${doctor.designation}${stop}`);
  if (doctor.qualifications) parts.push(t("directory.seo.qualifications", { value: doctor.qualifications }));
  if (chambers.length > 0) parts.push(t("directory.seo.chambers"));
  return parts.join(" ");
}

export function doctorJsonLd(detail: DoctorDetail, lang: Locale = DEFAULT_LOCALE): JsonLd {
  const { doctor, specialties, chambers } = detail;
  const first = chambers[0];
  const address = first
    ? {
        "@type": "PostalAddress",
        ...(first.chamber.address ? { streetAddress: first.chamber.address } : {}),
        ...((first.place.area ?? first.place.district)
          ? { addressLocality: (first.place.area ?? first.place.district)?.name }
          : {}),
        ...(first.place.division ? { addressRegion: first.place.division.name } : {}),
        ...(first.chamber.postalCode ? { postalCode: first.chamber.postalCode } : {}),
        addressCountry: "BD",
      }
    : null;
  return {
    "@context": "https://schema.org",
    "@type": "Physician",
    name: doctor.name,
    url: absoluteUrl(localizePath(routes.doctor(doctor.slug), lang)),
    ...(doctor.designation ? { jobTitle: doctor.designation } : {}),
    ...(doctor.profileSummary ? { description: doctor.profileSummary } : {}),
    ...(specialties.length > 0 ? { medicalSpecialty: specialties.map((s) => s.name) } : {}),
    ...(first?.chamber.appointmentPhone || first?.chamber.phone || doctor.phone
      ? { telephone: first?.chamber.appointmentPhone ?? first?.chamber.phone ?? doctor.phone }
      : {}),
    ...(doctor.organization || first?.facility
      ? { worksFor: { "@type": "MedicalOrganization", name: first?.facility?.name ?? doctor.organization } }
      : {}),
    ...(address ? { address } : {}),
  };
}

// ----------------------------------------------------------------- specialties

export function specialtiesTitle(lang: Locale = DEFAULT_LOCALE): string {
  return createT(lang)("directory.seo.specialtiesTitle");
}
export function specialtiesDescription(lang: Locale = DEFAULT_LOCALE): string {
  return createT(lang)("directory.seo.specialtiesDescription");
}
export const SPECIALTIES_TITLE = specialtiesTitle();
export const SPECIALTIES_DESCRIPTION = specialtiesDescription();

export function specialtyTitle(specialty: Specialty, lang: Locale = DEFAULT_LOCALE): string {
  return createT(lang)("directory.seo.specialtyTitle", { name: specialty.name });
}

export function specialtyDescription(detail: SpecialtyDetail, lang: Locale = DEFAULT_LOCALE): string {
  const t = createT(lang);
  const { specialty, facilityCount, doctorCount } = detail;
  const found: string[] = [];
  if (facilityCount > 0) found.push(countOf(t, facilityCount, "directory.n.hospitalOrClinic.one", "directory.n.hospitalOrClinic.other"));
  if (doctorCount > 0) found.push(countOf(t, doctorCount, "directory.n.doctor.one", "directory.n.doctor.other"));
  const listed = found.length > 0 ? ` ${t("directory.seo.specialtyListed", { found: joinAnd(t, found) })}` : "";
  return `${specialty.name}: ${specialty.description}${listed}`.slice(0, 300);
}

export function specialtyJsonLd(detail: SpecialtyDetail, lang: Locale = DEFAULT_LOCALE): JsonLd {
  const { specialty } = detail;
  return {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: specialtyTitle(specialty, lang),
    url: absoluteUrl(localizePath(routes.specialty(specialty.slug), lang)),
    description: specialty.description,
    about: { "@type": "MedicalSpecialty", name: specialty.name },
  };
}

// ------------------------------------------------------------------- locations

export function locationsTitle(lang: Locale = DEFAULT_LOCALE): string {
  return createT(lang)("directory.seo.locationsTitle");
}
export function locationsDescription(lang: Locale = DEFAULT_LOCALE): string {
  return createT(lang)("directory.seo.locationsDescription");
}
export const LOCATIONS_TITLE = locationsTitle();
export const LOCATIONS_DESCRIPTION = locationsDescription();

export function locationHeading(detail: LocationDetail, lang: Locale = DEFAULT_LOCALE): string {
  return createT(lang)("directory.seo.locationHeading", { place: placeName(detail.location, detail.ancestors, lang) });
}

export function locationTitle(detail: LocationDetail, lang: Locale = DEFAULT_LOCALE): string {
  return createT(lang)("directory.seo.locationTitle", { place: placeName(detail.location, detail.ancestors, lang) });
}

/** Counts sentence built only from real numbers. */
export function locationSummary(detail: LocationDetail, lang: Locale = DEFAULT_LOCALE): string {
  const t = createT(lang);
  const place = placeName(detail.location, detail.ancestors, lang);
  const parts: string[] = [];
  if (detail.facilityCount > 0) {
    const hospitals =
      detail.hospitalCount > 0 ? ` (${countOf(t, detail.hospitalCount, "directory.n.hospital.one", "directory.n.hospital.other")})` : "";
    parts.push(`${countOf(t, detail.facilityCount, "directory.n.facility.one", "directory.n.facility.other")}${hospitals}`);
  }
  if (detail.pharmacyCount > 0) parts.push(countOf(t, detail.pharmacyCount, "directory.n.pharmacy.one", "directory.n.pharmacy.other"));
  if (detail.doctorCount > 0) parts.push(countOf(t, detail.doctorCount, "directory.n.doctor.one", "directory.n.doctor.other"));
  if (parts.length === 0) return t("directory.seo.locationNone", { place });
  return t("directory.seo.locationSummary", { list: joinAnd(t, parts), place });
}

export function locationDescription(detail: LocationDetail, lang: Locale = DEFAULT_LOCALE): string {
  return `${locationSummary(detail, lang)} ${createT(lang)("directory.seo.locationTail")}`;
}
