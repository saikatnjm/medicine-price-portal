/** Single source of truth for public URL paths. */
export const routes = {
  home: () => "/",
  search: () => "/search",
  medicine: (slug: string) => `/medicine/${encodeURIComponent(slug)}`,
  pharmacy: (slug: string) => `/pharmacy/${encodeURIComponent(slug)}`,
} as const;
