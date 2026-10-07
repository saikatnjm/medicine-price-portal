import Link from "next/link";
import type { MedicineListItem } from "@/domain/read-models";
import { formatMedicineName } from "@/lib/format";
import { routes } from "@/lib/routes";
import { PillIcon } from "@/components/ui/icons";

export function PopularMedicines({ items }: { items: readonly MedicineListItem[] }) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="popular-medicines">
      <h2 id="popular-medicines" className="text-xl font-semibold text-slate-900">
        Popular medicines
      </h2>
      <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ medicine, generic }) => (
          <li key={medicine.id}>
            <Link
              href={routes.medicine(medicine.slug)}
              className="group flex h-full items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-brand-600 hover:shadow-md"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                <PillIcon className="size-5" />
              </span>
              <span className="min-w-0">
                <span className="block font-semibold text-slate-900 group-hover:text-brand-800">
                  {formatMedicineName(medicine)}
                </span>
                <span className="block text-sm text-slate-600">{generic.name}</span>
                <span className="mt-1 block text-xs text-slate-500">{medicine.dosageFormLabel}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
