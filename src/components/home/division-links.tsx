import Link from "@/i18n/link";
import type { DivisionWithDistricts, LocationListItem } from "@/domain/read-models";
import { getT } from "@/i18n/server";
import { ChevronIcon } from "@/components/ui/icons";
import { CHIP_CLASS, INDEX_CHIP_CLASS } from "@/components/ui/chip";
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
      <h2 id="popular-locations" className="text-xl font-semibold text-ink">
        {t("home.popularLocations")}
      </h2>
      <ul className="mt-4 flex flex-wrap gap-2">
        {items.map(({ location }) => (
          <li key={location.id}>
            <Link href={routes.location(location.slug)} className={CHIP_CLASS}>
              {location.name}
            </Link>
          </li>
        ))}
        <li>
          <Link href={routes.locations()} className={INDEX_CHIP_CLASS}>
            {t("home.cat.locations")}
            <ChevronIcon className="size-4" />
          </Link>
        </li>
      </ul>
    </section>
  );
}
