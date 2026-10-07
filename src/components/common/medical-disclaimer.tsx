import { getT } from "@/i18n/server";

/** General medical-information disclaimer. Not medical advice. */
export function MedicalDisclaimer() {
  const t = getT();
  return <p className="text-sm text-slate-600">{t("common.disclaimer")}</p>;
}
