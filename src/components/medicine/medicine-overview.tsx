import Link from "@/i18n/link";
import { CATEGORY } from "@/components/ui/category";
import { ChevronIcon, PillIcon } from "@/components/ui/icons";
import { FlaskIcon } from "@/components/ui/icons-entity";
import { PrescriptionTag } from "@/components/common/prescription-tag";
import { PRICE_SECTION_ID } from "@/components/medicine/price-comparison";
import type { MedicineDetail } from "@/domain/read-models";
import { getT } from "@/i18n/server";
import { formatMedicineName, formatPackSize } from "@/lib/format";
import { searchHref } from "@/lib/search-params";

const chip = "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold";

/**
 * Page header that answers "what is this?" at a glance: the product (brand, strength, form) and,
 * clearly separated, its generic (the active ingredient), then manufacturer and pack size.
 */
export function MedicineOverview({ detail }: { detail: MedicineDetail }) {
  const t = getT();
  const { medicine, generic, manufacturer, priceStats } = detail;
  const facts: { label: string; value: string }[] = [
    { label: t("medicine.overview.maker"), value: manufacturer.name },
    ...(medicine.packSize
      ? [{ label: t("medicine.overview.pack"), value: formatPackSize(medicine.packSize) }]
      : []),
  ];
  return (
    <header className="space-y-6">
      <div className="space-y-2">
        <p className="flex flex-wrap items-center gap-2">
          <span className={`${chip} ${CATEGORY.medicine.tint}`}>
            <PillIcon className="size-3.5" />
            {t("medicine.overview.brand_chip")}
          </span>
          <PrescriptionTag required={medicine.prescriptionRequired} />
        </p>
        <h1 className="text-3xl font-semibold tracking-tight break-words text-slate-900 sm:text-4xl">
          {formatMedicineName(medicine)}
        </h1>
        <p className="text-lg text-slate-700">{medicine.dosageFormLabel}</p>
      </div>

      <dl className="grid gap-x-10 gap-y-4 rounded-2xl bg-mist p-4 sm:grid-cols-2 sm:p-5">
        <div className="sm:col-span-2">
          <dt>
            <span className={`${chip} bg-mist text-pine`}>
              <FlaskIcon className="size-3.5" />
              {t("medicine.overview.generic_chip")}
            </span>
          </dt>
          <dd className="mt-1 text-xl font-medium break-words text-slate-900">
            <Link href={searchHref(generic.name)} className="text-brand-800 underline underline-offset-2">
              {generic.name}
            </Link>
            <span className="mt-0.5 block text-sm font-normal text-slate-600">
              {t("medicine.overview.generic_hint")}
            </span>
          </dd>
        </div>
        {facts.map(({ label, value }) => (
          <div key={label}>
            <dt className="text-sm text-slate-600">{label}</dt>
            <dd className="font-medium break-words text-slate-900">{value}</dd>
          </div>
        ))}
      </dl>

      {priceStats && (
        <p>
          <a
            href={`#${PRICE_SECTION_ID}`}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-brand-700 px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-800"
          >
            <ChevronIcon className="size-4 rotate-90" />
            {t("medicine.overview.to_prices")}
          </a>
        </p>
      )}
    </header>
  );
}
