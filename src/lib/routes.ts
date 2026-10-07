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
  /** Medicine comparison; slugs go in the "m" parameter (noindex). */
  compare: (slugs: readonly string[] = []) =>
    slugs.length > 0 ? `/compare?m=${slugs.map(enc).join(",")}` : "/compare",
  suggestApi: () => "/api/suggest",
} as const;
