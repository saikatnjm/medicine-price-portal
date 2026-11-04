import type { GenericDetail } from "@/domain/read-models";
import type { DosageForm } from "@/domain/types";
import { DEFAULT_LOCALE, localizePath, type Locale } from "@/i18n/config";
import type { MessageKey } from "@/i18n/messages";
import { createT, type Translator } from "@/i18n/translate";
import { routes } from "@/lib/routes";
import { absoluteUrl } from "@/lib/seo";

/** "{n} …" with the right singular/plural key. Numbers stay Latin with thousands separators. */
function countText(t: Translator, n: number, one: MessageKey, other: MessageKey): string {
  return t(n === 1 ? one : other, { n: n.toLocaleString("en-US") });
}

export const productCountText = (t: Translator, n: number) =>
  countText(t, n, "generic.count.products.one", "generic.count.products.other");
export const shortProductCountText = (t: Translator, n: number) =>
  countText(t, n, "generic.count.short.one", "generic.count.short.other");
export const brandCountText = (t: Translator, n: number) =>
  countText(t, n, "generic.count.brands.one", "generic.count.brands.other");
export const companyCountText = (t: Translator, n: number) =>
  countText(t, n, "generic.count.companies.one", "generic.count.companies.other");

export function formLabel(t: Translator, form: DosageForm): string {
  return t(`generic.form.${form}` as MessageKey);
}

/** "Tablet, Syrup, Injection" (dosage form categories, most products first), optionally capped. */
export function formsText(t: Translator, detail: GenericDetail, limit?: number): string {
  return detail.forms
    .slice(0, limit)
    .map(({ form }) => formLabel(t, form))
    .join(", ");
}

/** First letter for the A–Z index: "a"–"z", otherwise "0-9". */
export function genericInitial(name: string): string {
  const first = name.trim().charAt(0).toLowerCase();
  return first >= "a" && first <= "z" ? first : "0-9";
}

export function genericTitle(detail: GenericDetail, lang: Locale = DEFAULT_LOCALE): string {
  const t = createT(lang);
  const key = detail.productCount === 1 ? "generic.page.title.one" : "generic.page.title.other";
  return t(key, { name: detail.generic.name, n: detail.productCount.toLocaleString("en-US") });
}

export function genericDescription(detail: GenericDetail, lang: Locale = DEFAULT_LOCALE): string {
  const t = createT(lang);
  const forms = formsText(t, detail, 3);
  const only = detail.groups[0]?.products[0];
  if (detail.productCount === 1 && only) {
    return t("generic.page.description.one", {
      name: detail.generic.name,
      brand: only.medicine.brandName,
      company: only.manufacturer.name,
      forms,
    });
  }
  return t("generic.page.description.other", {
    name: detail.generic.name,
    n: detail.productCount.toLocaleString("en-US"),
    brands: brandCountText(t, detail.brandCount),
    companies: companyCountText(t, detail.companyCount),
    forms,
  });
}

/**
 * schema.org Drug for the active ingredient. Only registry facts: name, non-proprietary name,
 * dosage forms and strengths. No prices, offers, indications or ratings.
 */
export function genericJsonLd(detail: GenericDetail, lang: Locale = DEFAULT_LOCALE): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Drug",
    name: detail.generic.name,
    nonProprietaryName: detail.generic.name,
    url: absoluteUrl(localizePath(routes.generic(detail.generic.slug), lang)),
    ...(lang === DEFAULT_LOCALE ? {} : { inLanguage: lang }),
    dosageForm: [...new Set(detail.groups.map((g) => g.dosageFormLabel))],
    ...(detail.strengths.length > 0 ? { availableStrength: detail.strengths.map((value) => ({ "@type": "DrugStrength", description: value })) } : {}),
  };
}
