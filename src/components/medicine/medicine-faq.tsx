import type { ReactNode } from "react";
import { Faq, type FaqItem } from "@/components/common/faq";
import type { MedicineDetail } from "@/domain/read-models";
import { getT } from "@/i18n/server";
import type { Translator } from "@/i18n/translate";
import { formatMedicineName } from "@/lib/format";

function citedList(items: readonly string[], source: string): ReactNode {
  return (
    <>
      <ul className="list-disc space-y-1 pl-5">
        {items.map((item, i) => (
          <li key={`${i}-${item}`}>{item}</li>
        ))}
      </ul>
      <p className="mt-2 text-xs text-slate-600">{source}</p>
    </>
  );
}

/** FAQ items come only from fields that exist: safety answers appear only when the cited record has them. */
export function buildMedicineFaqs(detail: MedicineDetail, t: Translator): FaqItem[] {
  const { medicine, generic, manufacturer, safety } = detail;
  const name = formatMedicineName(medicine);
  const items: FaqItem[] = [
    { question: t("medicine.faq.generic.q", { name }), answer: t("medicine.faq.generic.a", { name, generic: generic.name }) },
    {
      question: t("medicine.faq.maker.q", { name }),
      answer: t("medicine.faq.maker.a", { name, maker: manufacturer.name.replace(/\.$/, "") }),
    },
  ];
  if (safety) {
    const source = t("medicine.faq.source", { source: safety.source });
    if (safety.uses && safety.uses.length > 0) {
      items.push({ question: t("medicine.faq.uses.q", { name }), answer: citedList(safety.uses, source) });
    }
    if (safety.commonSideEffects && safety.commonSideEffects.length > 0) {
      items.push({
        question: t("medicine.faq.common.q", { name }),
        answer: citedList(safety.commonSideEffects, source),
      });
    }
  }
  return items;
}

export function MedicineFaq({ detail }: { detail: MedicineDetail }) {
  return <Faq items={buildMedicineFaqs(detail, getT())} />;
}
