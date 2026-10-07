import Link from "@/i18n/link";
import type { SpecialtyListItem } from "@/domain/read-models";
import { getLocale, getT } from "@/i18n/server";
import { routes } from "@/lib/routes";
import { practitionerPlural, specialtyCounts } from "./specialty-text";

export function SpecialtyList({ items }: { items: SpecialtyListItem[] }) {
  const t = getT();
  const lang = getLocale();
  return (
    <ul className="border-t border-slate-200">
      {items.map((item) => (
        <li key={item.specialty.id} className="border-b border-slate-200 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            <Link href={routes.specialty(item.specialty.slug)} className="hover:underline">
              {item.specialty.name}
            </Link>
          </h2>
          <p className="text-sm text-slate-700">{practitionerPlural(item.specialty.practitionerTitle, lang)}</p>
          <p className="mt-1 text-slate-700">{item.specialty.description}</p>
          <p className="mt-1 text-sm text-slate-600">{t("specialty.counts.listed", { counts: specialtyCounts(item, t) })}</p>
        </li>
      ))}
    </ul>
  );
}
