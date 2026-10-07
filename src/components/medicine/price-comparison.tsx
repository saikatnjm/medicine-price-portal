import Link from "@/i18n/link";
import { AvailabilityStatus } from "@/components/common/availability-status";
import { SectionHeading } from "@/components/common/section-heading";
import { isUnitDosageForm } from "@/domain/medicine";
import type { MedicineDetail } from "@/domain/read-models";
import { getLocale, getT } from "@/i18n/server";
import { formatPackSize, formatPlace, formatPrice, formatPriceRange } from "@/lib/format";
import { formatDateIn } from "@/lib/format-locale";
import { routes } from "@/lib/routes";

export const PRICE_SECTION_ID = "price-comparison";
const HEADING_ID = PRICE_SECTION_ID;

/**
 * Pharmacy prices, lowest first. Shows a clear "not available yet" state when no
 * sourced price data exists (prices are never invented). A responsive list rather than
 * a wide table so it stays readable on narrow screens.
 */
export function PriceComparison({ detail }: { detail: MedicineDetail }) {
  const t = getT();
  const lang = getLocale();
  const { medicine, prices, priceStats } = detail;
  const packLabel = medicine.packSize ? t("medicine.price.pack", { size: formatPackSize(medicine.packSize) }) : "";
  const unitPriceOf = (amount: number): string | null =>
    isUnitDosageForm(medicine) && medicine.packSize && medicine.packSize.quantity > 0
      ? t("medicine.price.per_unit", { price: formatPrice(amount / medicine.packSize.quantity), unit: t(medicine.dosageForm === "capsule" ? "medicine.price.unit_capsule" : "medicine.price.unit_tablet") })
      : null;

  return (
    <section aria-labelledby={HEADING_ID}>
      <SectionHeading
        id={HEADING_ID}
        description={
          priceStats
            ? t(priceStats.count === 1 ? "medicine.price.desc.one" : "medicine.price.desc.other", {
                label: t(priceStats.hasSampleData ? "medicine.price.label_sample" : "medicine.price.label"),
                range: formatPriceRange(priceStats),
                pack: packLabel ? ` ${packLabel}` : "",
                n: priceStats.count.toLocaleString("en-US"),
              })
            : undefined
        }
      >
        {t("medicine.price.heading")}
      </SectionHeading>

      {prices.length === 0 || !priceStats ? (
        <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700">
          <p className="font-medium text-slate-900">{t("medicine.price.soon")}</p>
          <p className="mt-1 text-sm">
            {t("medicine.price.soon_body")}
          </p>
          <p className="mt-2 text-sm">
            <Link href={routes.pharmacies()} className="font-medium text-brand-800 underline">
              {t("medicine.price.browse")}
            </Link>{" "}
            {t("medicine.price.listings_only")}
          </p>
        </div>
      ) : (
        <ol className="divide-y divide-slate-200 border-y border-slate-200">
          {prices.map(({ price, pharmacy }) => {
            const isLowest = price.amount === priceStats.lowest;
            const unitPrice = unitPriceOf(price.amount);
            return (
              <li key={price.id} className="flex items-start justify-between gap-4 py-4">
                <div className="min-w-0">
                  <Link
                    href={routes.pharmacy(pharmacy.slug)}
                    className="font-medium text-brand-800 underline-offset-2 hover:underline"
                  >
                    {pharmacy.name}
                  </Link>
                  <p className="text-sm text-slate-600">
                    {formatPlace(pharmacy.locality, pharmacy.city)}
                  </p>
                  <div className="mt-1">
                    <AvailabilityStatus status={price.availability} />
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-lg font-semibold text-slate-900">
                    {formatPrice(price.amount)}
                  </p>
                  {unitPrice && <p className="text-xs text-slate-600">{unitPrice}</p>}
                  {isLowest && (
                    <p className="mt-1 inline-block rounded bg-brand-50 px-1.5 py-0.5 text-xs font-medium text-brand-800">
                      {t("medicine.price.lowest")}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-slate-500">
                    {t(price.source === "sample" ? "medicine.price.sample" : "medicine.price.updated")} ·{" "}
                    {formatDateIn(price.updatedAt, lang)}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
