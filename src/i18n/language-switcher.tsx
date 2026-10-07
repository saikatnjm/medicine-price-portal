"use client";

import NextLink from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { LOCALE_LABELS, localizePath, stripLocale, type Locale } from "./config";
import { useLocale, useT } from "./client";

const OTHER: Record<Locale, Locale> = { en: "bn", bn: "en" };

/** Switches the current page to the other language (keeps path and query). */
export function LanguageSwitcher() {
  const lang = useLocale();
  const t = useT();
  const pathname = usePathname() ?? "/";
  const search = useSearchParams()?.toString() ?? "";
  const target = OTHER[lang];
  const href = localizePath(stripLocale(pathname), target) + (search ? `?${search}` : "");
  return (
    <NextLink
      href={href}
      hrefLang={target}
      lang={target}
      className="inline-flex min-h-11 items-center rounded-full border border-slate-300 px-3 text-sm font-medium text-slate-800 hover:border-brand-600 hover:text-brand-800"
      aria-label={t("layout.switchLanguage", { language: LOCALE_LABELS[target] })}
    >
      {LOCALE_LABELS[target]}
    </NextLink>
  );
}
