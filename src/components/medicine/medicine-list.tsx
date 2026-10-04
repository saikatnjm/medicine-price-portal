import Link from "next/link";
import { PrescriptionTag } from "@/components/common/prescription-tag";
import type { MedicineListItem } from "@/domain/read-models";
import { formatDosageForm, formatMedicineName, formatPrice, pluralize } from "@/lib/format";
import { routes } from "@/lib/routes";

interface MedicineListProps {
  items: readonly MedicineListItem[];
  /** Heading level for each item title, to keep the page outline correct. */
  headingLevel?: "h2" | "h3";
}

/** Compact, scannable list of medicines used for search results, popular items and alternatives. */
export function MedicineList({ items, headingLevel = "h3" }: MedicineListProps) {
  const Heading = headingLevel;
  return (
    <ul className="divide-y divide-slate-200 border-y border-slate-200">
      {items.map(({ medicine, generic, manufacturer, priceStats }) => (
        <li
          key={medicine.id}
          className="relative flex flex-col gap-1 py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6"
        >
          <div className="min-w-0">
            <Heading className="text-base font-semibold text-slate-900">
              <Link
                href={routes.medicine(medicine.slug)}
                className="text-brand-800 underline-offset-2 hover:underline after:absolute after:inset-0"
              >
                {formatMedicineName(medicine)}
              </Link>
            </Heading>
            <p className="text-sm text-slate-700">
              {generic.name} · {formatDosageForm(medicine.dosageForm)}
            </p>
            <p className="text-sm text-slate-600">{manufacturer.name}</p>
            {medicine.prescriptionRequired && (
              <div className="mt-1">
                <PrescriptionTag required />
              </div>
            )}
          </div>
          <p className="shrink-0 text-sm text-slate-700 sm:text-right">
            {priceStats ? (
              <>
                <span className="text-slate-600">
                  {priceStats.hasSampleData ? "Sample price from " : "From "}
                </span>
                <span className="font-semibold text-slate-900">
                  {formatPrice(priceStats.lowest)}
                </span>
                <span className="block text-xs text-slate-600">
                  at {pluralize(priceStats.count, "pharmacy", "pharmacies")}
                </span>
              </>
            ) : (
              <span className="text-slate-600">No prices listed</span>
            )}
          </p>
        </li>
      ))}
    </ul>
  );
}
