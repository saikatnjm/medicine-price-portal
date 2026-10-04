interface PrescriptionTagProps {
  required: boolean;
}

/** Text tag; only shown for prescription medicines. */
export function PrescriptionTag({ required }: PrescriptionTagProps) {
  if (!required) return null;
  return (
    <span className="inline-flex items-center rounded border border-slate-300 px-1.5 py-0.5 text-xs font-medium text-slate-700">
      Prescription medicine
    </span>
  );
}
