import Link from "next/link";
import { SectionHeading } from "@/components/common/section-heading";
import { MedicineList } from "@/components/medicine/medicine-list";
import type { MedicineDetail } from "@/domain/read-models";
import { pluralize } from "@/lib/format";
import { searchHref } from "@/lib/search-params";

const ALTERNATIVES_ID = "alternatives";
const OTHER_FORMS_ID = "other-forms";

function MoreLink({ shown, total, query }: { shown: number; total: number; query: string }) {
  if (total <= shown) return null;
  return (
    <p className="mt-3 text-sm text-slate-700">
      Showing {shown} of {total}.{" "}
      <Link href={searchHref(query)} className="font-medium text-brand-800 underline">
        See all {query} medicines
      </Link>
    </p>
  );
}

/**
 * Same-generic brands, presented strictly as an informational comparison.
 */
export function MedicineAlternatives({ detail }: { detail: MedicineDetail }) {
  const { medicine, generic, alternatives, alternativesTotal, otherForms, otherFormsTotal } =
    detail;
  const productLabel = [generic.name, medicine.strength, medicine.dosageFormLabel.toLowerCase()]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <section aria-labelledby={ALTERNATIVES_ID}>
        <SectionHeading
          id={ALTERNATIVES_ID}
          description={
            <>
              {alternativesTotal > 0
                ? `${pluralize(alternativesTotal, "other registered brand", "other registered brands")} with the same generic, strength and form (${productLabel}). `
                : ""}
              Shown for information only, not as a recommendation. Ask your doctor or pharmacist
              before changing any medicine.
            </>
          }
        >
          Same-generic brands
        </SectionHeading>
        {alternatives.length > 0 ? (
          <>
            <MedicineList items={alternatives} />
            <MoreLink shown={alternatives.length} total={alternativesTotal} query={generic.name} />
          </>
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
          <MoreLink shown={otherForms.length} total={otherFormsTotal} query={generic.name} />
        </section>
      )}
    </>
  );
}
