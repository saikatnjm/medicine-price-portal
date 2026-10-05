import Link from "next/link";
import type { SpecialtyListItem } from "@/domain/read-models";
import { pluralize } from "@/lib/format";
import { routes } from "@/lib/routes";
import { pluralTitle } from "@/lib/seo-directory";

export function specialtyCounts(item: Pick<SpecialtyListItem, "facilityCount" | "doctorCount">): string {
  return [
    pluralize(item.facilityCount, "facility", "facilities"),
    pluralize(item.doctorCount, "doctor", "doctors"),
  ].join(" · ");
}

export function SpecialtyList({ items }: { items: SpecialtyListItem[] }) {
  return (
    <ul className="border-t border-slate-200">
      {items.map((item) => (
        <li key={item.specialty.id} className="border-b border-slate-200 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            <Link href={routes.specialty(item.specialty.slug)} className="hover:underline">
              {item.specialty.name}
            </Link>
          </h2>
          <p className="text-sm text-slate-700">{pluralTitle(item.specialty.practitionerTitle)}</p>
          <p className="mt-1 text-slate-700">{item.specialty.description}</p>
          <p className="mt-1 text-sm text-slate-600">{specialtyCounts(item)} listed</p>
        </li>
      ))}
    </ul>
  );
}
