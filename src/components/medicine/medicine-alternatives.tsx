import Link from "@/i18n/link";
import { SectionHeading } from "@/components/common/section-heading";
import { MedicineList } from "@/components/medicine/medicine-list";
import type { MedicineDetail } from "@/domain/read-models";
import { getT } from "@/i18n/server";
import { searchHref } from "@/lib/search-params";

const ALTERNATIVES_ID = "alternatives";
const OTHER_FORMS_ID = "other-forms";

function MoreLink({ shown, total, query }: { shown: number; total: number; query: string }) {
  const t = getT();
  if (total <= shown) return null;
  return (
    <p className="mt-3 text-sm text-slate-700">
      {t("medicine.alt.showing", { shown, total })}{" "}
      <Link href={searchHref(query)} className="font-medium text-brand-800 underline">
        {t("medicine.alt.see_all", { query })}
      </Link>
    </p>
  );
}

/**
 * Same-generic brands, presented strictly as an informational comparison.
 */
export function MedicineAlternatives({ detail }: { detail: MedicineDetail }) {
  const t = getT();
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
                ? `${t(alternativesTotal === 1 ? "medicine.alt.intro.one" : "medicine.alt.intro.other", {
                    n: alternativesTotal.toLocaleString("en-US"),
                    product: productLabel,
                  })} `
                : ""}
              {t("medicine.alt.disclaimer")}
            </>
          }
        >
          {t("medicine.alt.heading")}
        </SectionHeading>
        {alternatives.length > 0 ? (
          <>
            <MedicineList items={alternatives} />
            <MoreLink shown={alternatives.length} total={alternativesTotal} query={generic.name} />
          </>
        ) : (
          <p className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700">
            {t("medicine.alt.none", { product: productLabel })}
          </p>
        )}
      </section>

      {otherForms.length > 0 && (
        <section aria-labelledby={OTHER_FORMS_ID}>
          <SectionHeading
            id={OTHER_FORMS_ID}
            description={t("medicine.alt.other_desc", { generic: generic.name })}
          >
            {t("medicine.alt.other_heading")}
          </SectionHeading>
          <MedicineList items={otherForms} />
          <MoreLink shown={otherForms.length} total={otherFormsTotal} query={generic.name} />
        </section>
      )}
    </>
  );
}
