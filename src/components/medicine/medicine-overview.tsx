import Link from "@/i18n/link";
import { PrescriptionTag } from "@/components/common/prescription-tag";
import type { MedicineDetail } from "@/domain/read-models";
import { getT } from "@/i18n/server";
import { formatMedicineName } from "@/lib/format";
import { searchHref } from "@/lib/search-params";

/** Page heading: medicine → generic → strength/form → manufacturer. */
export function MedicineOverview({ detail }: { detail: MedicineDetail }) {
  const t = getT();
  const { medicine, generic, manufacturer } = detail;
  const details = [medicine.strength, medicine.dosageFormLabel, manufacturer.name].filter(Boolean);
  return (
    <header className="space-y-2">
      <h1 className="text-3xl font-semibold tracking-tight break-words text-slate-900 sm:text-4xl">
        {formatMedicineName(medicine)}
      </h1>
      <p className="text-lg break-words text-slate-800">
        <span className="sr-only">{t("medicine.overview.generic_sr")}</span>
        <Link href={searchHref(generic.name)} className="underline underline-offset-2 hover:text-brand-800">
          {generic.name}
        </Link>
      </p>
      <p className="text-slate-700">{details.join(" · ")}</p>
      <PrescriptionTag required={medicine.prescriptionRequired} />
    </header>
  );
}
