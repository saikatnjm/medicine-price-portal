import type { Provenance } from "@/domain/types";

/** Points to the source record so errors can be fixed at the source. */
export function CorrectionHint({ provenance }: { provenance: Provenance }) {
  if (!provenance.recordUrl) return null;
  return (
    <p className="text-sm text-slate-600">
      See something wrong?{" "}
      <a href={provenance.recordUrl} target="_blank" rel="noopener noreferrer" className="underline">
        View or correct this record at the source
      </a>
      . Changes there appear here after the next data update.
    </p>
  );
}
