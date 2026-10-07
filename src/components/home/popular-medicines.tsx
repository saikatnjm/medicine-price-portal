import Link from "@/i18n/link";
import type { MedicineListItem } from "@/domain/read-models";
import { formatMedicineName } from "@/lib/format";
import { getT } from "@/i18n/server";
import { routes } from "@/lib/routes";
import { CategoryTile } from "@/components/ui/category-tile";

export function PopularMedicines({ items }: { items: readonly MedicineListItem[] }) {
  const t = getT();
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="popular-medicines">
      <h2 id="popular-medicines" className="text-xl font-semibold text-ink">
        {t("home.popularMedicines")}
      </h2>
      <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ medicine, generic }) => (
          <li key={medicine.id}>
            <Link
              href={routes.medicine(medicine.slug)}
              className="group flex h-full items-start gap-3 rounded-2xl bg-mist p-4 transition-colors hover:bg-brand-100"
            >
              <CategoryTile type="medicine" size="sm" />
              <span className="min-w-0">
                <span className="block font-semibold text-ink">
                  {formatMedicineName(medicine)}
                </span>
                <span className="block text-sm text-slate-600">{generic.name}</span>
                {medicine.dosageFormLabel && <span className="mt-1 block text-xs text-slate-600">{medicine.dosageFormLabel}</span>}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
