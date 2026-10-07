import Link from "@/i18n/link";
import { AvailabilityStatus } from "@/components/common/availability-status";
import { SectionHeading } from "@/components/common/section-heading";
import type { PharmacyPriceEntry } from "@/domain/read-models";
import { getT } from "@/i18n/server";
import { formatMedicineName, formatPackSize, formatPrice } from "@/lib/format";
import { routes } from "@/lib/routes";

const HEADING_ID = "pharmacy-prices";

interface PharmacyPriceListProps {
  prices: readonly PharmacyPriceEntry[];
  hasSampleData: boolean;
}

export function PharmacyPriceList({ prices, hasSampleData }: PharmacyPriceListProps) {
  const t = getT();
  return (
    <section aria-labelledby={HEADING_ID}>
      <SectionHeading
        id={HEADING_ID}
        description={
          prices.length > 0
            ? t(prices.length === 1 ? "pharmacy.prices.desc.one" : "pharmacy.prices.desc.other", {
                n: prices.length.toLocaleString("en-US"),
              })
            : undefined
        }
      >
        {t(hasSampleData ? "pharmacy.prices.heading_sample" : "pharmacy.prices.heading")}
      </SectionHeading>
      {prices.length === 0 ? (
        <p className="rounded-xl bg-slate-50 px-4 py-3 text-slate-700">
          {t("pharmacy.prices.none")}
        </p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {prices.map(({ price, medicine }) => (
            <li key={price.id} className="flex items-start justify-between gap-4 py-3">
              <div className="min-w-0">
                <Link
                  href={routes.medicine(medicine.slug)}
                  className="font-medium text-brand-800 underline-offset-2 hover:underline"
                >
                  {formatMedicineName(medicine)}
                </Link>
                <p className="text-sm text-slate-600">
                  {[
                    medicine.dosageFormLabel,
                    medicine.packSize && formatPackSize(medicine.packSize),
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-semibold text-slate-900">{formatPrice(price.amount)}</p>
                <AvailabilityStatus status={price.availability} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
