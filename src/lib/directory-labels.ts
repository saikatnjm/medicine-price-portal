/**
 * Translated labels shared by the directory components and SEO builders: facility kinds, ownership,
 * trust status, counts, dates and distances. Pure functions over a translator (English output is
 * identical to the former hard-coded strings).
 */
import type { FacilityKind, Ownership } from "../domain/healthcare";
import type { ProvenanceStatus } from "../domain/types";
import { DEFAULT_LOCALE, type Locale } from "../i18n/config";
import type { MessageKey } from "../i18n/messages";
import type { Translator } from "../i18n/translate";

const KIND_KEYS: Record<FacilityKind, MessageKey> = {
  hospital: "facility.kind.hospital",
  clinic: "facility.kind.clinic",
  diagnostic_centre: "facility.kind.diagnostic_centre",
  dental_clinic: "facility.kind.dental_clinic",
  doctors_practice: "facility.kind.doctors_practice",
  health_centre: "facility.kind.health_centre",
  blood_bank: "facility.kind.blood_bank",
  other_facility: "facility.kind.other_facility",
};

const OWNERSHIP_KEYS: Record<Ownership, MessageKey> = {
  government: "facility.ownership.government",
  private: "facility.ownership.private",
  non_profit: "facility.ownership.non_profit",
  military: "facility.ownership.military",
};

const TRUST_KEYS: Record<ProvenanceStatus, MessageKey> = {
  registered: "facility.trust.registered",
  unverified: "facility.trust.unverified",
  needs_review: "facility.trust.needs_review",
  verified: "facility.trust.verified",
  user_reported: "facility.trust.user_reported",
};

/** "Hospital", "Diagnostic centre" ... */
export function facilityKindLabel(t: Translator, kind: FacilityKind): string {
  return t(KIND_KEYS[kind]);
}

export function ownershipLabel(t: Translator, ownership: Ownership): string {
  return t(OWNERSHIP_KEYS[ownership]);
}

/** Short badge text for how reliable a record is ("Community-mapped"). */
export function trustLabel(t: Translator, status: ProvenanceStatus): string {
  return t(TRUST_KEYS[status]);
}

/** Lower-case phrase, e.g. "private hospital" (Bangla has no letter case, so it is unchanged). */
export function facilityKindPhraseLower(t: Translator, kind: FacilityKind, ownership?: Ownership): string {
  return [ownership ? ownershipLabel(t, ownership) : null, facilityKindLabel(t, kind).toLowerCase()]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

/** Sentence-case phrase for cards and headers, e.g. "Private hospital". */
export function facilityKindPhrase(t: Translator, kind: FacilityKind, ownership?: Ownership): string {
  const phrase = [ownership ? ownershipLabel(t, ownership) : null, facilityKindLabel(t, kind).toLowerCase()]
    .filter(Boolean)
    .join(" ");
  return phrase.charAt(0).toUpperCase() + phrase.slice(1);
}

/** "1,560 facilities": picks the singular or plural message and formats the number. */
export function countOf(t: Translator, n: number, one: MessageKey, other: MessageKey): string {
  return t(n === 1 ? one : other, { n: n.toLocaleString("en-US") });
}

/** "a, b and c" (the last separator is language specific). */
export function joinAnd(t: Translator, parts: readonly string[]): string {
  if (parts.length <= 1) return parts[0] ?? "";
  return t("directory.listAnd", { list: parts.slice(0, -1).join(", "), last: parts[parts.length - 1] ?? "" });
}

/** Lower-cases English text for use inside a sentence; Bangla and data names are left as they are. */
export function lowerFor(text: string, lang: Locale): string {
  return lang === DEFAULT_LOCALE ? text.toLowerCase() : text;
}

/** "of <place>" form used in headings; the national scope when no place is given. */
export function ofPlace(t: Translator, place?: string | null): string {
  return place ? t("directory.of.place", { name: place }) : t("directory.of.country");
}

/** "in <place>" form used in sentences; the national scope when no place is given. */
export function inPlace(t: Translator, place?: string | null): string {
  return place ? t("directory.in.place", { name: place }) : t("directory.in.country");
}

/** "Dhaka Division" / "Dhaka বিভাগ". */
export function divisionName(t: Translator, name: string): string {
  return t("directory.division", { name });
}

const DATE_LOCALES: Record<Locale, string> = { en: "en-GB", bn: "bn-BD-u-nu-latn" };
const dateFormatters = new Map<Locale, Intl.DateTimeFormat>();

/** "1 Oct 2026" (English) / Bangla month name with Latin digits. */
export function formatDateIn(iso: string, lang: Locale = DEFAULT_LOCALE): string {
  let formatter = dateFormatters.get(lang);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(DATE_LOCALES[lang], {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Dhaka",
    });
    dateFormatters.set(lang, formatter);
  }
  return formatter.format(new Date(iso));
}

/** "150 m away" / "2.4 km away" / "12 km away" (same rounding as lib/geo formatDistance). */
export function formatDistanceT(t: Translator, km: number): string {
  if (km < 1) return t("directory.distance.m", { n: Math.max(50, Math.round((km * 1000) / 50) * 50) });
  if (km < 10) return t("directory.distance.km", { n: km.toFixed(1) });
  return t("directory.distance.km", { n: Math.round(km) });
}
