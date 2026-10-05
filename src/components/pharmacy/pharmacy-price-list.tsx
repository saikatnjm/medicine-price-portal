import Link from "next/link";
import { AvailabilityStatus } from "@/components/common/availability-status";
import { SectionHeading } from "@/components/common/section-heading";
import type { PharmacyPriceEntry } from "@/domain/read-models";
import {
  formatMedicineName,
  formatPackSize,
  formatPrice,
  pluralize,
  pricesLabel,
} from "@/lib/format";
import { routes } from "@/lib/routes";

const HEADING_ID = "pharmacy-prices";

interface PharmacyPriceListProps {
  prices: readonly PharmacyPriceEntry[];
  hasSampleData: boolean;
}

export function PharmacyPriceList({ prices, hasSampleData }: PharmacyPriceListProps) {
  return (
    <section aria-labelledby={HEADING_ID}>
      <SectionHeading
        id={HEADING_ID}
        description={
          prices.length > 0
            ? `${pluralize(prices.length, "medicine", "medicines")}, A–Z.`
            : undefined
        }
      >
        {pricesLabel(hasSampleData)} at this pharmacy
      </SectionHeading>
      {prices.length === 0 ? (
        <p className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700">
          No prices are listed for this pharmacy.
        </p>
      ) : (
        <ul className="divide-y divide-slate-200 border-y border-slate-200">
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
