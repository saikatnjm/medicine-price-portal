import Link from "@/i18n/link";
import type { DivisionWithDistricts, LocationCounts } from "@/domain/read-models";
import { CategoryTile } from "@/components/ui/category-tile";
import { getT } from "@/i18n/server";
import type { Translator } from "@/i18n/translate";
import { routes } from "@/lib/routes";
import { doctorCountText, facilityCountText, pharmacyCountText } from "@/components/specialty/specialty-text";

export function locationCountsText(c: LocationCounts, t: Translator = getT()): string {
  const parts: string[] = [];
  if (c.facilityCount > 0) parts.push(facilityCountText(t, c.facilityCount));
  if (c.pharmacyCount > 0) parts.push(pharmacyCountText(t, c.pharmacyCount));
  if (c.doctorCount > 0) parts.push(doctorCountText(t, c.doctorCount));
  return parts.length > 0 ? parts.join(" · ") : t("location.counts.none");
}

/** Divisions with their districts and counts. */
export function LocationTree({ divisions }: { divisions: DivisionWithDistricts[] }) {
  const t = getT();
  return (
    <div className="space-y-8">
      {divisions.map(({ division, districts, ...counts }) => (
        <section key={division.id} aria-labelledby={`division-${division.slug}`}>
          <h2 id={`division-${division.slug}`} className="text-xl font-semibold text-slate-900">
            <Link href={routes.location(division.slug)} className="hover:underline">
              {t("location.place.division", { name: division.name })}
            </Link>
          </h2>
          <p className="text-sm text-slate-600">{locationCountsText(counts, t)}</p>
          <ul className="mt-3 grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
            {districts.map(({ location, ...c }) => (
              <li key={location.id} className="flex min-w-0 gap-3">
                <CategoryTile type="location" size="sm" />
                <div className="min-w-0">
                  <Link href={routes.location(location.slug)} className="font-medium text-brand-800 hover:underline">
                    {location.name}
                  </Link>
                  <span className="block text-sm text-slate-600">{locationCountsText(c, t)}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
