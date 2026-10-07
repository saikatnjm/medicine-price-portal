import { SectionHeading } from "@/components/common/section-heading";
import type { MedicineDetail } from "@/domain/read-models";
import { getLocale, getT } from "@/i18n/server";
import { formatPackSize } from "@/lib/format";
import { formatDateIn } from "@/lib/format-locale";

const HEADING_ID = "medicine-information";

/** Additional information as a definition list. Fields a source does not publish are omitted. */
export function MedicineFacts({ detail }: { detail: MedicineDetail }) {
  const t = getT();
  const { medicine, generic, manufacturer, source } = detail;
  const facts: [string, string | undefined][] = [
    [t("medicine.facts.brand"), medicine.brandName],
    [t("medicine.facts.registered"), medicine.registeredName],
    [t("medicine.facts.generic"), generic.name],
    [t("medicine.facts.strength"), medicine.strength || undefined],
    [t("medicine.facts.form"), medicine.dosageFormLabel],
    [t("medicine.facts.pack"), medicine.packSize && formatPackSize(medicine.packSize)],
    [t("medicine.facts.manufacturer"), manufacturer.name],
    [t("medicine.facts.category"), medicine.category],
    [
      t("medicine.facts.prescription"),
      medicine.prescriptionRequired === undefined
        ? undefined
        : medicine.prescriptionRequired
          ? t("medicine.facts.rx_yes")
          : t("medicine.facts.rx_no"),
    ],
    [t("medicine.facts.dar"), medicine.provenance.darNumber],
  ];

  return (
    <section aria-labelledby={HEADING_ID}>
      <SectionHeading id={HEADING_ID}>{t("medicine.facts.heading")}</SectionHeading>
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
          {t("medicine.facts.source")}{" "}
          <a href={source.url} className="text-brand-800 underline" rel="noopener">
            {source.name}
          </a>{" "}
          ({source.publisher}), {t("medicine.facts.source_note", { date: formatDateIn(source.retrievedAt, getLocale()) })}
        </p>
      )}
    </section>
  );
}
