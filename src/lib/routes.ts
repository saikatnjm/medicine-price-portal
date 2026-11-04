/** Single source of truth for public URL paths. */
const enc = encodeURIComponent;

/** "/hospitals", "/hospitals/dhaka", "/hospitals/dhaka/cardiology". */
function listPath(base: string, locationSlug?: string, specialtySlug?: string): string {
  // Specialty without a location is a filter on the national list (not a separate landing page).
  if (!locationSlug) return specialtySlug ? `${base}?specialty=${enc(specialtySlug)}` : base;
  return specialtySlug ? `${base}/${enc(locationSlug)}/${enc(specialtySlug)}` : `${base}/${enc(locationSlug)}`;
}

export const routes = {
  home: () => "/",
  search: () => "/search",
  about: () => "/about",
  medicine: (slug: string) => `/medicine/${enc(slug)}`,
  pharmacy: (slug: string) => `/pharmacy/${enc(slug)}`,
  hospital: (slug: string) => `/hospital/${enc(slug)}`,
  doctor: (slug: string) => `/doctor/${enc(slug)}`,
  /** Hospitals, clinics and other facilities, optionally in a location / with a specialty. */
  hospitals: (locationSlug?: string, specialtySlug?: string) => listPath("/hospitals", locationSlug, specialtySlug),
  pharmacies: (locationSlug?: string) => listPath("/pharmacies", locationSlug),
  doctors: (locationSlug?: string, specialtySlug?: string) => listPath("/doctors", locationSlug, specialtySlug),
  specialties: () => "/specialties",
  specialty: (slug: string) => `/specialties/${enc(slug)}`,
  locations: () => "/locations",
  location: (slug: string) => `/locations/${enc(slug)}`,
  saved: () => "/saved",
  /** Generic (active ingredient) hub and pages, e.g. /generics/paracetamol. */
  generics: () => "/generics",
  generic: (slug: string) => `/generics/${enc(slug)}`,
  /** Pharmaceutical company (manufacturer) hub and pages. */
  companies: () => "/companies",
  company: (slug: string) => `/companies/${enc(slug)}`,
  /** Dosage form hub and pages, e.g. /dosage-forms/tablet. */
  dosageForms: () => "/dosage-forms",
  dosageForm: (form: string) => `/dosage-forms/${enc(form)}`,
  /** Brand A–Z index: /medicines and /medicines/a … /medicines/z, /medicines/0-9. */
  medicines: (initial?: string) => (initial ? `/medicines/${enc(initial)}` : "/medicines"),
  /** DGDA registration (DAR number) check. */
  verify: () => "/verify",
  /** Editorial guides. */
  guides: () => "/guides",
  guide: (slug: string) => `/guides/${enc(slug)}`,
  /** Emergency hospitals by division. */
  emergency: () => "/emergency",
  /** Medicine comparison; slugs go in the "m" parameter (noindex). */
  compare: (slugs: readonly string[] = []) =>
    slugs.length > 0 ? `/compare?m=${slugs.map(enc).join(",")}` : "/compare",
  suggestApi: () => "/api/suggest",
} as const;
