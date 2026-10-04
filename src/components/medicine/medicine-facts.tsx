import { SectionHeading } from "@/components/common/section-heading";
import type { MedicineDetail } from "@/domain/read-models";
import { formatDate, formatDosageForm, formatPackSize } from "@/lib/format";

const HEADING_ID = "medicine-information";

/** Additional information as a definition list. */
export function MedicineFacts({ detail }: { detail: MedicineDetail }) {
  const { medicine, generic, manufacturer } = detail;
  const facts: [string, string][] = [
    ["Brand name", medicine.brandName],
    ["Generic name", generic.name],
    ["Strength", medicine.strength],
    ["Dosage form", formatDosageForm(medicine.dosageForm)],
    ["Pack size", formatPackSize(medicine.packSize)],
    ["Manufacturer", manufacturer.name],
    ["Category", medicine.category],
    [
      "Prescription",
      medicine.prescriptionRequired ? "Prescription medicine" : "Not listed as prescription-only",
    ],
    ["Information updated", formatDate(medicine.updatedAt)],
  ];

  return (
    <section aria-labelledby={HEADING_ID}>
      <SectionHeading id={HEADING_ID}>Medicine information</SectionHeading>
      {medicine.description && <p className="mb-4 text-slate-800">{medicine.description}</p>}
      {generic.description && (
        <p className="mb-4 text-slate-700">
          <span className="font-medium">{generic.name}:</span> {generic.description}
        </p>
      )}
      <dl className="grid grid-cols-1 border-t border-slate-200 sm:grid-cols-2 sm:gap-x-8">
        {facts.map(([term, value]) => (
          <div key={term} className="flex justify-between gap-4 border-b border-slate-200 py-2">
            <dt className="text-sm text-slate-600">{term}</dt>
            <dd className="text-right text-sm font-medium text-slate-900">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
