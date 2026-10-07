"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { DEFAULT_LOCALE, type Locale } from "./config";
import { createT, type Translator } from "./translate";

const LocaleContext = createContext<Locale>(DEFAULT_LOCALE);

export function I18nProvider({ lang, children }: { lang: Locale; children: ReactNode }) {
  return <LocaleContext.Provider value={lang}>{children}</LocaleContext.Provider>;
}

export function useLocale(): Locale {
  return useContext(LocaleContext);
}

/** Translator for client components. Falls back to English without a provider (tests). */
export function useT(): Translator {
  const lang = useLocale();
  return useMemo(() => createT(lang), [lang]);
}
