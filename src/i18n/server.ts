import { cache } from "react";
import { DEFAULT_LOCALE, resolveLocale, type Locale } from "./config";
import { createT, type Translator } from "./translate";

/** Per-request language holder: pages and the layout set it, nested server components read it. */
const holder = cache(() => ({ lang: DEFAULT_LOCALE as Locale }));

export function setLocale(lang: Locale): void {
  holder().lang = lang;
}

export function getLocale(): Locale {
  return holder().lang;
}

/** Translator for server components (pass `lang` where it is known, e.g. generateMetadata). */
export function getT(lang?: Locale): Translator {
  return createT(lang ?? getLocale());
}

/** Reads `lang` from route params, remembers it for this request and returns it. */
export async function initLocale(params?: Promise<{ lang?: string }>): Promise<Locale> {
  const lang = resolveLocale(params ? (await params).lang : undefined);
  setLocale(lang);
  return lang;
}
