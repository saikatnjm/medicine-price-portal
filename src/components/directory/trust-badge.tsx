import { reviewStatusOf, type RecordQuality } from "@/domain/healthcare";
import type { Provenance } from "@/domain/types";
import { InfoIcon, ShieldCheckIcon } from "@/components/ui/icons-entity";
import { getT } from "@/i18n/server";
import { trustLabel } from "@/lib/directory-labels";

/** Pill (icon + text) for how reliable a record is ("Community-mapped"). Never colour-only. */
export function TrustBadge({ provenance }: { provenance: Pick<Provenance, "status"> }) {
  const t = getT();
  const checked = provenance.status === "verified" || provenance.status === "registered";
  const Icon = checked ? ShieldCheckIcon : InfoIcon;
  return (
    <span className="inline-flex min-h-8 items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200">
      <Icon className="size-4 text-brand-700" />
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
    <p role="note" className="max-w-3xl rounded-xl bg-notice-50 px-4 py-2.5 text-sm text-notice-900">
      {t("directory.trust.reviewNotice")}
    </p>
  );
}
