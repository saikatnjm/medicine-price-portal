import type { Specialty } from "@/domain/healthcare";
import type { DoctorDetail } from "@/domain/read-models";
import { DEFAULT_LOCALE, localizePath, type Locale } from "@/i18n/config";
import { createT } from "@/i18n/translate";
import { routes } from "@/lib/routes";
import { absoluteUrl } from "@/lib/seo";
import { doctorJsonLd as doctorJsonLdEn } from "@/lib/seo-directory";
import { countText, practitionerLower, practitionerPlural, practitionerPluralLower } from "@/components/specialty/specialty-text";

export function doctorsListHeading(specialty: Specialty | null, place: string | null, lang: Locale): string {
  const t = createT(lang);
  const who = specialty ? practitionerPlural(specialty.practitionerTitle, lang) : t("doctor.who.any");
  const where = place ? t("doctor.scope.place", { place }) : t("doctor.scope.bangladesh");
  return t("doctor.list.heading", { who, where });
}

export function doctorsListDescription(
  specialty: Specialty | null,
  place: string | null,
  total: number,
  lang: Locale,
): string {
  const t = createT(lang);
  const who = specialty ? practitionerPluralLower(specialty.practitionerTitle, lang) : t("doctor.who.anyLower");
  const where = place ? t("doctor.scope.place", { place }) : t("doctor.scope.bangladesh");
  if (total === 0) return t("doctor.desc.empty", { where });
  const profiles = countText(t, total, "doctor.desc.profiles.one", "doctor.desc.profiles.other");
  return t("doctor.desc.found", { who, where, profiles });
}

export function doctorTitle(detail: DoctorDetail, lang: Locale): string {
  const t = createT(lang);
  const title = detail.specialties[0]?.practitionerTitle;
  const place = detail.chambers[0]?.place.label;
  let tail = "";
  if (title && place) tail = t("doctor.title.titleInPlace", { title, place });
  else if (title) tail = title;
  else if (place) tail = t("doctor.title.inPlace", { place });
  return [detail.doctor.name, tail].filter(Boolean).join(" — ");
}

export function doctorDescription(detail: DoctorDetail, lang: Locale): string {
  const t = createT(lang);
  const { doctor, specialties, chambers } = detail;
  const title = specialties[0]?.practitionerTitle;
  const place = chambers[0]?.place.label;
  const head = title ? `${doctor.name}, ${practitionerLower(title, lang)}` : doctor.name;
  const parts = [place ? t("doctor.desc.introPlace", { head, place }) : t("doctor.desc.intro", { head })];
  if (doctor.designation) parts.push(t("doctor.desc.sentence", { text: doctor.designation }));
  if (doctor.qualifications) parts.push(t("doctor.desc.qualifications", { text: doctor.qualifications }));
  if (chambers.length > 0) parts.push(t("doctor.desc.chambers"));
  return parts.join(" ");
}

/** English JSON-LD unchanged; other languages get the localised URL. */
export function doctorJsonLd(detail: DoctorDetail, lang: Locale): Record<string, unknown> {
  const base = doctorJsonLdEn(detail);
  if (lang === DEFAULT_LOCALE) return base;
  return {
    ...base,
    url: absoluteUrl(localizePath(routes.doctor(detail.doctor.slug), lang)),
    inLanguage: lang,
  };
}
