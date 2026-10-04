import { SectionHeading } from "@/components/common/section-heading";
import { MedicineList } from "@/components/medicine/medicine-list";
import type { MedicineDetail } from "@/domain/read-models";
import { formatDosageForm } from "@/lib/format";

const ALTERNATIVES_ID = "alternatives";
const OTHER_FORMS_ID = "other-forms";

/**
 * Same-generic brands, presented strictly as an informational comparison.
 */
export function MedicineAlternatives({ detail }: { detail: MedicineDetail }) {
  const { medicine, generic, alternatives, otherForms } = detail;
  const productLabel = `${generic.name} ${medicine.strength} ${formatDosageForm(medicine.dosageForm).toLowerCase()}`;

  return (
    <>
      <section aria-labelledby={ALTERNATIVES_ID}>
        <SectionHeading
          id={ALTERNATIVES_ID}
          description={
            <>
              Other brands with the same generic, strength and form ({productLabel}). Shown for
              information only, not as a recommendation. Ask your doctor or pharmacist before
              changing any medicine.
            </>
          }
        >
          Same-generic brands
        </SectionHeading>
        {alternatives.length > 0 ? (
          <MedicineList items={alternatives} />
        ) : (
          <p className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700">
            No other brands of {productLabel} are listed.
          </p>
        )}
      </section>

      {otherForms.length > 0 && (
        <section aria-labelledby={OTHER_FORMS_ID}>
          <SectionHeading
            id={OTHER_FORMS_ID}
            description={`${generic.name} in a different strength or dosage form. These are not interchangeable without professional advice.`}
          >
            Other strengths and forms
          </SectionHeading>
          <MedicineList items={otherForms} />
        </section>
      )}
    </>
  );
}
