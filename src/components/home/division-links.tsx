import Link from "@/i18n/link";
import type { DivisionWithDistricts, LocationListItem } from "@/domain/read-models";
import { getT } from "@/i18n/server";
import { routes } from "@/lib/routes";

const MAX_LOCATIONS = 10;

/** The districts with the most listed healthcare records (data-driven, never a hand-picked list). */
export function popularLocations(divisions: readonly DivisionWithDistricts[], limit = MAX_LOCATIONS): LocationListItem[] {
  return divisions
    .flatMap((d) => d.districts)
    .filter((d) => d.facilityCount + d.pharmacyCount > 0)
    .sort((a, b) => b.facilityCount + b.pharmacyCount - (a.facilityCount + a.pharmacyCount) || a.location.name.localeCompare(b.location.name))
    .slice(0, limit);
}

export function DivisionLinks({ divisions }: { divisions: readonly DivisionWithDistricts[] }) {
  const t = getT();
  const items = popularLocations(divisions);
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="popular-locations">
      <h2 id="popular-locations" className="text-xl font-semibold text-slate-900">
        {t("home.popularLocations")}
      </h2>
      <ul className="mt-4 flex flex-wrap gap-2">
        {items.map(({ location }) => (
          <li key={location.id}>
            <Link
              href={routes.location(location.slug)}
              className="inline-flex min-h-11 items-center rounded-full border border-slate-300 bg-white px-4 text-sm font-medium text-slate-800 shadow-sm hover:border-brand-600 hover:text-brand-800"
            >
              {location.name}
            </Link>
          </li>
        ))}
        <li>
          <Link href={routes.locations()} className="inline-flex min-h-11 items-center px-3 text-sm font-medium text-brand-800 underline underline-offset-2">
            {t("home.allLocations")}
          </Link>
        </li>
      </ul>
    </section>
  );
}
