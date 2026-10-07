import { getT } from "@/i18n/server";

interface PrescriptionTagProps {
  /** Only shown when a source states the medicine is prescription-only. */
  required?: boolean;
}

export function PrescriptionTag({ required }: PrescriptionTagProps) {
  if (!required) return null;
  const t = getT();
  return (
    <span className="inline-flex items-center rounded border border-slate-300 px-1.5 py-0.5 text-xs font-medium text-slate-700">
      {t("common.prescription")}
    </span>
  );
}
