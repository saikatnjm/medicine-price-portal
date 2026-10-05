import { SectionHeading } from "@/components/common/section-heading";
import type { MedicineDetail } from "@/domain/read-models";
import { formatDate, formatPackSize } from "@/lib/format";

const HEADING_ID = "medicine-information";

/** Additional information as a definition list. Fields a source does not publish are omitted. */
export function MedicineFacts({ detail }: { detail: MedicineDetail }) {
  const { medicine, generic, manufacturer, source } = detail;
  const facts: [string, string | undefined][] = [
    ["Brand name", medicine.brandName],
    ["Registered name", medicine.registeredName],
    ["Generic name", generic.name],
    ["Strength", medicine.strength || undefined],
    ["Dosage form", medicine.dosageFormLabel],
    ["Pack size", medicine.packSize && formatPackSize(medicine.packSize)],
    ["Manufacturer", manufacturer.name],
    ["Category", medicine.category],
    [
      "Prescription",
      medicine.prescriptionRequired === undefined
        ? undefined
        : medicine.prescriptionRequired
          ? "Prescription medicine"
          : "Not prescription-only",
    ],
    ["DGDA registration (DAR) no.", medicine.provenance.darNumber],
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
        {facts
          .filter((fact): fact is [string, string] => Boolean(fact[1]))
          .map(([term, value]) => (
            <div key={term} className="flex justify-between gap-4 border-b border-slate-200 py-2">
              <dt className="text-sm text-slate-600">{term}</dt>
              <dd className="text-right text-sm font-medium break-words text-slate-900">{value}</dd>
            </div>
          ))}
      </dl>
      {source && (
        <p className="mt-4 text-sm text-slate-600">
          Source:{" "}
          <a href={source.url} className="text-brand-800 underline" rel="noopener">
            {source.name}
          </a>{" "}
          ({source.publisher}), retrieved {formatDate(source.retrievedAt)}. Registration data shows
          the product is registered in Bangladesh; it does not confirm current availability.
        </p>
      )}
    </section>
  );
}
