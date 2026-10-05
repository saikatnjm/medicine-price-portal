import Link from "next/link";
import type { DivisionWithDistricts } from "@/domain/read-models";
import { pluralize } from "@/lib/format";
import { routes } from "@/lib/routes";

export function DivisionLinks({ divisions }: { divisions: readonly DivisionWithDistricts[] }) {
  if (divisions.length === 0) return null;
  return (
    <section aria-labelledby="browse-divisions">
      <h2 id="browse-divisions" className="text-xl font-semibold text-slate-900">
        Browse by division
      </h2>
      <ul className="mt-4 grid grid-cols-2 gap-x-6 sm:grid-cols-3 lg:grid-cols-4">
        {divisions.map(({ division, facilityCount }) => (
          <li key={division.id} className="border-b border-slate-200">
            <Link href={routes.location(division.slug)} className="group block min-h-14 py-3">
              <span className="block font-medium text-brand-800 group-hover:underline">
                {division.name}
              </span>
              {facilityCount > 0 && (
                <span className="block text-sm text-slate-600">
                  {pluralize(facilityCount, "facility", "facilities")}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
