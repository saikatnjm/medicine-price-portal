/**
 * Titles, descriptions and structured data for doctor, specialty and location
 * pages. Pure functions; page titles never include the site name (the layout
 * template appends it). JSON-LD contains only fields present in the data.
 */
import type { Location, Specialty } from "../domain/healthcare";
import type { DoctorDetail, LocationDetail, SpecialtyDetail } from "../domain/read-models";
import { formatPlace, pluralize } from "./format";
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
export function placeName(location: Location, ancestors: readonly Location[] = []): string {
  if (location.level === "division") return `${location.name} Division`;
  const district = location.level === "area" ? ancestors.find((a) => a.level === "district") : null;
  return formatPlace(location.name, district?.name);
}

// -------------------------------------------------------------------- doctors

export function doctorsListHeading(specialty: Specialty | null, place: string | null): string {
  const who = specialty ? pluralTitle(specialty.practitionerTitle) : "Doctors";
  return `${who} in ${place ?? "Bangladesh"}`;
}

export function doctorsListDescription(specialty: Specialty | null, place: string | null, total: number): string {
  const who = specialty ? pluralTitle(specialty.practitionerTitle).toLowerCase() : "doctors";
  const where = place ?? "Bangladesh";
  if (total === 0) {
    return `Doctor profiles are only listed from verified or consented sources. Browse hospitals and clinics in ${where} instead.`;
  }
  return `Find ${who} in ${where}: ${pluralize(total, "listed profile", "listed profiles")} with chamber addresses, consultation times and appointment contacts.`;
}

export function doctorTitle(detail: DoctorDetail): string {
  const title = detail.specialties[0]?.practitionerTitle;
  const place = detail.chambers[0]?.place.label;
  return [detail.doctor.name, [title, place ? `in ${place}` : null].filter(Boolean).join(" ")]
    .filter(Boolean)
    .join(" — ");
}

export function doctorDescription(detail: DoctorDetail): string {
  const { doctor, specialties, chambers } = detail;
  const title = specialties[0]?.practitionerTitle.toLowerCase();
  const place = chambers[0]?.place.label;
  const parts = [`${doctor.name}${title ? `, ${title}` : ""}${place ? ` in ${place}` : ""}.`];
  if (doctor.designation) parts.push(`${doctor.designation}.`);
  if (doctor.qualifications) parts.push(`Qualifications: ${doctor.qualifications}.`);
  if (chambers.length > 0) parts.push("Chamber addresses, consultation times and appointment contacts.");
  return parts.join(" ");
}

export function doctorJsonLd(detail: DoctorDetail): JsonLd {
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
    url: absoluteUrl(routes.doctor(doctor.slug)),
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

export const SPECIALTIES_TITLE = "Medical Specialties — Find Hospitals & Clinics in Bangladesh";
export const SPECIALTIES_DESCRIPTION =
  "Browse medical specialties such as cardiology, paediatrics and orthopaedics, and find the hospitals and clinics in Bangladesh that list them.";

export function specialtyTitle(specialty: Specialty): string {
  return `${specialty.name} — ${pluralTitle(specialty.practitionerTitle)}, Hospitals & Clinics in Bangladesh`;
}

export function specialtyDescription(detail: SpecialtyDetail): string {
  const { specialty, facilityCount, doctorCount } = detail;
  const found: string[] = [];
  if (facilityCount > 0) found.push(pluralize(facilityCount, "hospital or clinic", "hospitals and clinics"));
  if (doctorCount > 0) found.push(pluralize(doctorCount, "doctor", "doctors"));
  const listed = found.length > 0 ? ` ${found.join(" and ")} listed in Bangladesh.` : "";
  return `${specialty.name}: ${specialty.description}${listed}`.slice(0, 300);
}

export function specialtyJsonLd(detail: SpecialtyDetail): JsonLd {
  const { specialty } = detail;
  return {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: specialtyTitle(specialty),
    url: absoluteUrl(routes.specialty(specialty.slug)),
    description: specialty.description,
    about: { "@type": "MedicalSpecialty", name: specialty.name },
  };
}

// ------------------------------------------------------------------- locations

export const LOCATIONS_TITLE = "Healthcare Locations — Hospitals & Pharmacies by Division and District";
export const LOCATIONS_DESCRIPTION =
  "Browse hospitals, clinics and pharmacies in Bangladesh by division and district.";

export function locationHeading(detail: LocationDetail): string {
  return `Healthcare in ${placeName(detail.location, detail.ancestors)}`;
}

export function locationTitle(detail: LocationDetail): string {
  return `Hospitals, Pharmacies & Doctors in ${placeName(detail.location, detail.ancestors)}`;
}

/** Counts sentence built only from real numbers. */
export function locationSummary(detail: LocationDetail): string {
  const place = placeName(detail.location, detail.ancestors);
  const parts: string[] = [];
  if (detail.facilityCount > 0) {
    const hospitals = detail.hospitalCount > 0 ? ` (${pluralize(detail.hospitalCount, "hospital", "hospitals")})` : "";
    parts.push(`${pluralize(detail.facilityCount, "hospital, clinic or other facility", "hospitals, clinics and other facilities")}${hospitals}`);
  }
  if (detail.pharmacyCount > 0) parts.push(pluralize(detail.pharmacyCount, "pharmacy", "pharmacies"));
  if (detail.doctorCount > 0) parts.push(pluralize(detail.doctorCount, "doctor", "doctors"));
  if (parts.length === 0) return `No healthcare records are listed for ${place} yet.`;
  const list = parts.length > 1 ? `${parts.slice(0, -1).join(", ")} and ${parts.at(-1)}` : parts[0];
  return `Our directory lists ${list} in ${place}.`;
}

export function locationDescription(detail: LocationDetail): string {
  return locationSummary(detail) + " Addresses, phone numbers and directions where published.";
}
