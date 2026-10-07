import { getT } from "@/i18n/server";

/** Reminder that directory pages are informational. Not medical advice. */
export function InformationNotice() {
  const t = getT();
  return <p className="text-sm text-slate-600">{t("specialty.notice")}</p>;
}
