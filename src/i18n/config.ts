/** Supported languages. English is served at the root (no prefix); Bangla under /bn. */
export const LOCALES = ["en", "bn"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

/** Unknown or missing values fall back to the default language. */
export function resolveLocale(value: unknown): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

export const LOCALE_LABELS: Record<Locale, string> = { en: "English", bn: "বাংলা" };
/** OpenGraph locale codes. */
export const OG_LOCALES: Record<Locale, string> = { en: "en_US", bn: "bn_BD" };

const PREFIXED = /^\/(en|bn)(?=\/|$|\?|#)/;

/** Removes a leading /en or /bn from a path ("/bn/hospitals" → "/hospitals", "/bn" → "/"). */
export function stripLocale(path: string): string {
  const stripped = path.replace(PREFIXED, "");
  return stripped === "" || stripped.startsWith("?") || stripped.startsWith("#") ? `/${stripped}` : stripped;
}

/**
 * Adds the language prefix to an internal path. English paths are unchanged; "/api" and
 * external or relative URLs are never touched.
 */
export function localizePath(path: string, lang: Locale): string {
  if (lang === DEFAULT_LOCALE) return path;
  if (!path.startsWith("/") || path.startsWith("//") || path.startsWith("/api") || PREFIXED.test(path)) return path;
  if (path === "/") return "/bn";
  return `/${lang}${path}`;
}
