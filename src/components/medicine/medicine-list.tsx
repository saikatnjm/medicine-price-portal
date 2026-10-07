import Link from "@/i18n/link";
import { PrescriptionTag } from "@/components/common/prescription-tag";
import { CategoryTile } from "@/components/ui/category-tile";
import type { MedicineListItem } from "@/domain/read-models";
import { getT } from "@/i18n/server";
import { formatMedicineName, formatPrice } from "@/lib/format";
import { routes } from "@/lib/routes";

interface MedicineListProps {
  items: readonly MedicineListItem[];
  /** Heading level for each item title, to keep the page outline correct. */
  headingLevel?: "h2" | "h3";
}

/** Compact, scannable list of medicines used for search results, popular items and alternatives. */
export function MedicineList({ items, headingLevel = "h3" }: MedicineListProps) {
  const Heading = headingLevel;
  const t = getT();
  return (
    <ul className="divide-y divide-slate-100">
      {items.map(({ medicine, generic, manufacturer, priceStats }) => (
        <li
          key={medicine.id}
          className="relative flex gap-3 py-4"
        >
          <CategoryTile type="medicine" size="sm" />
          <div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
            <div className="min-w-0">
              <Heading className="text-base font-semibold break-words text-slate-900">
                <Link
                  href={routes.medicine(medicine.slug)}
                  className="text-brand-800 underline-offset-2 hover:underline after:absolute after:inset-0"
                >
                  {formatMedicineName(medicine)}
                </Link>
              </Heading>
              <p className="text-sm text-slate-700">
                {generic.name} · {medicine.dosageFormLabel}
              </p>
              <p className="text-sm text-slate-600">{manufacturer.name}</p>
              {medicine.prescriptionRequired && (
                <div className="mt-1">
                  <PrescriptionTag required />
                </div>
              )}
            </div>
            {priceStats && (
              <p className="shrink-0 text-sm text-slate-700 sm:text-right">
                <span className="text-slate-600">
                  {t(priceStats.hasSampleData ? "medicine.list.sample_from" : "medicine.list.from")}
                </span>
                <span className="font-semibold text-slate-900">{formatPrice(priceStats.lowest)}</span>
                <span className="block text-xs text-slate-600">
                  {t(priceStats.count === 1 ? "medicine.list.at.one" : "medicine.list.at.other", { n: priceStats.count.toLocaleString("en-US") })}
                </span>
              </p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
