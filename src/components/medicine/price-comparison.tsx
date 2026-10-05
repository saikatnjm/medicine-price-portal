import Link from "next/link";
import { AvailabilityStatus } from "@/components/common/availability-status";
import { SectionHeading } from "@/components/common/section-heading";
import type { MedicineDetail } from "@/domain/read-models";
import {
  formatDate,
  formatPackSize,
  formatPlace,
  formatPrice,
  formatPriceRange,
  formatUnitPrice,
  pluralize,
  pricesLabel,
} from "@/lib/format";
import { routes } from "@/lib/routes";

const HEADING_ID = "price-comparison";

/**
 * Pharmacy prices, lowest first. Shows a clear "not available yet" state when no
 * sourced price data exists (prices are never invented). A responsive list rather than
 * a wide table so it stays readable on narrow screens.
 */
export function PriceComparison({ detail }: { detail: MedicineDetail }) {
  const { medicine, prices, priceStats } = detail;
  const packLabel = medicine.packSize ? `per pack of ${formatPackSize(medicine.packSize)}` : "";

  return (
    <section aria-labelledby={HEADING_ID}>
      <SectionHeading
        id={HEADING_ID}
        description={
          priceStats
            ? `${pricesLabel(priceStats.hasSampleData)} ${formatPriceRange(priceStats)}${packLabel ? ` ${packLabel}` : ""}, from ${pluralize(priceStats.count, "pharmacy", "pharmacies")}. Lowest first.`
            : undefined
        }
      >
        Price comparison
      </SectionHeading>

      {prices.length === 0 || !priceStats ? (
        <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700">
          <p className="font-medium text-slate-900">Price information coming soon.</p>
          <p className="mt-1 text-sm">
            We only show prices from a verified source, and none is available for this medicine yet.
            Prices and availability vary by pharmacy.
          </p>
          <p className="mt-2 text-sm">
            <Link href={routes.pharmacies()} className="font-medium text-brand-800 underline">
              Browse pharmacies
            </Link>{" "}
            (listings only, without prices).
          </p>
        </div>
      ) : (
        <ol className="divide-y divide-slate-200 border-y border-slate-200">
          {prices.map(({ price, pharmacy }) => {
            const isLowest = price.amount === priceStats.lowest;
            const unitPrice = formatUnitPrice(price.amount, medicine);
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
                      Lowest listed
                    </p>
                  )}
                  <p className="mt-1 text-xs text-slate-500">
                    {price.source === "sample" ? "Sample" : "Updated"} ·{" "}
                    {formatDate(price.updatedAt)}
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
