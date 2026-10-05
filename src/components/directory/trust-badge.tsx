import { reviewStatusOf, trustLabelOf, type RecordQuality } from "@/domain/healthcare";
import type { Provenance } from "@/domain/types";

/** Small text badge for how reliable a record is ("Community-mapped"). Never colour-only. */
export function TrustBadge({ provenance }: { provenance: Pick<Provenance, "status"> }) {
  return (
    <span className="inline-flex items-center rounded border border-slate-300 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-700">
      <span className="sr-only">Data status: </span>
      {trustLabelOf(provenance)}
    </span>
  );
}

/** Neutral notice for records flagged during import; renders nothing for active records. */
export function ReviewNotice({ record }: { record: RecordQuality }) {
  if (reviewStatusOf(record) !== "needs_review") return null;
  return (
    <p role="note" className="max-w-3xl rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-800">
      Some details of this listing look inconsistent and are awaiting review.
    </p>
  );
}
