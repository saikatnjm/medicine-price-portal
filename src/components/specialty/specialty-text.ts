import type { Specialty } from "@/domain/healthcare";
import type { SpecialtyDetail, SpecialtyListItem } from "@/domain/read-models";
import { DEFAULT_LOCALE, localizePath, type Locale } from "@/i18n/config";
import type { MessageKey } from "@/i18n/messages";
import { createT, type Translator } from "@/i18n/translate";
import { routes } from "@/lib/routes";
import { absoluteUrl } from "@/lib/seo";
import { pluralTitle, specialtyJsonLd as specialtyJsonLdEn } from "@/lib/seo-directory";

/** "{n} …" with the right singular/plural key. Numbers stay Latin with thousands separators. */
export function countText(t: Translator, n: number, one: MessageKey, other: MessageKey): string {
  return t(n === 1 ? one : other, { n: n.toLocaleString("en-US") });
}

export function facilityCountText(t: Translator, n: number): string {
  return countText(t, n, "specialty.count.facility.one", "specialty.count.facility.other");
}

export function doctorCountText(t: Translator, n: number): string {
  return countText(t, n, "doctor.count.one", "doctor.count.other");
}

export function pharmacyCountText(t: Translator, n: number): string {
  return countText(t, n, "location.count.pharmacy.one", "location.count.pharmacy.other");
}

/**
 * Plural of a practitioner title. The title is data (English); only English gets the
 * "s" plural, Bangla shows it unchanged.
 */
export function practitionerPlural(title: string, lang: Locale): string {
  return lang === DEFAULT_LOCALE ? pluralTitle(title) : title;
}

export function practitionerPluralLower(title: string, lang: Locale): string {
  return lang === DEFAULT_LOCALE ? pluralTitle(title).toLowerCase() : title;
}

/** Practitioner title in running text ("cardiologist" in English, unchanged in Bangla). */
export function practitionerLower(title: string, lang: Locale): string {
  return lang === DEFAULT_LOCALE ? title.toLowerCase() : title;
}

/** "N facilities · N doctors". */
export function specialtyCounts(
  item: Pick<SpecialtyListItem, "facilityCount" | "doctorCount">,
  t: Translator,
): string {
  return [facilityCountText(t, item.facilityCount), doctorCountText(t, item.doctorCount)].join(" · ");
}

export function specialtyTitle(specialty: Specialty, lang: Locale): string {
  return createT(lang)("specialty.title", { name: specialty.name });
}

export function specialtyDescription(detail: SpecialtyDetail, lang: Locale): string {
  const t = createT(lang);
  const { specialty, facilityCount, doctorCount } = detail;
  const found: string[] = [];
  if (facilityCount > 0) {
    found.push(countText(t, facilityCount, "specialty.desc.facility.one", "specialty.desc.facility.other"));
  }
  if (doctorCount > 0) found.push(doctorCountText(t, doctorCount));
  const listed = found.length > 0 ? t("specialty.desc.listed", { list: found.join(t("specialty.desc.and")) }) : "";
  return `${specialty.name}: ${specialty.description}${listed}`.slice(0, 300);
}

/** English JSON-LD unchanged; other languages get the localised name and URL. */
export function specialtyJsonLd(detail: SpecialtyDetail, lang: Locale): Record<string, unknown> {
  const base = specialtyJsonLdEn(detail);
  if (lang === DEFAULT_LOCALE) return base;
  return {
    ...base,
    name: specialtyTitle(detail.specialty, lang),
    url: absoluteUrl(localizePath(routes.specialty(detail.specialty.slug), lang)),
    inLanguage: lang,
  };
}
