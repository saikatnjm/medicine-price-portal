import Link from "next/link";
import type { MedicineListItem } from "@/domain/read-models";
import { formatMedicineName } from "@/lib/format";
import { routes } from "@/lib/routes";

export function PopularMedicines({ items }: { items: readonly MedicineListItem[] }) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="popular-medicines">
      <h2 id="popular-medicines" className="text-xl font-semibold text-slate-900">
        Popular medicines
      </h2>
      <ul className="mt-4 grid grid-cols-1 gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ medicine, generic }) => (
          <li key={medicine.id} className="border-b border-slate-200">
            <Link href={routes.medicine(medicine.slug)} className="group block py-3">
              <span className="block font-medium text-brand-800 group-hover:underline">
                {formatMedicineName(medicine)}
              </span>
              <span className="block text-sm text-slate-600">{generic.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
