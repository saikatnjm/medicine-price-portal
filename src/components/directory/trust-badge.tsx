import { reviewStatusOf, type RecordQuality } from "@/domain/healthcare";
import type { Provenance } from "@/domain/types";
import { getT } from "@/i18n/server";
import { trustLabel } from "@/lib/directory-labels";

/** Small text badge for how reliable a record is ("Community-mapped"). Never colour-only. */
export function TrustBadge({ provenance }: { provenance: Pick<Provenance, "status"> }) {
  const t = getT();
  return (
    <span className="inline-flex items-center rounded border border-slate-300 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-700">
      <span className="sr-only">{t("directory.trust.dataStatus")}</span>
      {trustLabel(t, provenance.status)}
    </span>
  );
}

/** Neutral notice for records flagged during import; renders nothing for active records. */
export function ReviewNotice({ record }: { record: RecordQuality }) {
  if (reviewStatusOf(record) !== "needs_review") return null;
  const t = getT();
  return (
    <p role="note" className="max-w-3xl rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-800">
      {t("directory.trust.reviewNotice")}
    </p>
  );
}
