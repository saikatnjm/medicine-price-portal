import { DEFAULT_LOCALE, type Locale } from "../i18n/config";
import { formatDate } from "./format";

const bnDateFormatter = new Intl.DateTimeFormat("bn-BD-u-nu-latn", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Dhaka",
});

/** Language-aware date: English is identical to formatDate ("1 Oct 2026"); Bangla uses Bangla month names with Latin digits. */
export function formatDateIn(iso: string, lang: Locale = DEFAULT_LOCALE): string {
  return lang === "bn" ? bnDateFormatter.format(new Date(iso)) : formatDate(iso);
}
