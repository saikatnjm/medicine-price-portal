import { PrescriptionTag } from "@/components/common/prescription-tag";
import type { MedicineDetail } from "@/domain/read-models";
import { formatDosageForm, formatMedicineName } from "@/lib/format";

/** Page heading: medicine → generic → strength/form → manufacturer. */
export function MedicineOverview({ detail }: { detail: MedicineDetail }) {
  const { medicine, generic, manufacturer } = detail;
  return (
    <header className="space-y-2">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
        {formatMedicineName(medicine)}
      </h1>
      <p className="text-lg text-slate-800">
        <span className="sr-only">Generic name: </span>
        {generic.name}
      </p>
      <p className="text-slate-700">
        {medicine.strength} · {formatDosageForm(medicine.dosageForm)} · {manufacturer.name}
      </p>
      <PrescriptionTag required={medicine.prescriptionRequired} />
    </header>
  );
}
