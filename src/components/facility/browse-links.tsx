import Link from "@/i18n/link";
import type { DivisionWithDistricts, LocationListItem } from "@/domain/read-models";
import { getT } from "@/i18n/server";
import { routes } from "@/lib/routes";

type CountKey = "facilityCount" | "pharmacyCount";

const chipClass =
  "inline-flex min-h-11 items-center rounded-md border border-slate-300 px-3 text-sm text-slate-800 hover:bg-slate-50";

function Chip({ href, label, count }: { href: string; label: string; count: number }) {
  return (
    <Link href={href} className={chipClass}>
      {label}
      <span className="ml-1.5 text-slate-600">({count.toLocaleString("en-US")})</span>
    </Link>
  );
}

/** Browse by division and district (only places with records). */
export function BrowseByLocation({
  tree,
  type,
  countOf,
}: {
  tree: readonly DivisionWithDistricts[];
  type: "hospitals" | "pharmacies";
  countOf: CountKey;
}) {
  const t = getT();
  const base = type === "hospitals" ? routes.hospitals : routes.pharmacies;
  const divisions = tree.filter((d) => d[countOf] > 0);
  if (divisions.length === 0) return null;
  return (
    <section aria-labelledby="browse-location" className="space-y-4">
      <h2 id="browse-location" className="text-xl font-semibold text-slate-900">
        {t("facility.browse.byLocation")}
      </h2>
      {divisions.map(({ division, districts, ...counts }) => (
        <div key={division.slug}>
          <h3 className="mb-2 text-base font-semibold text-slate-800">
            <Link href={base(division.slug)} className="underline-offset-2 hover:underline">
              {t("directory.division", { name: division.name })}
            </Link>{" "}
            <span className="font-normal text-slate-600">({counts[countOf].toLocaleString("en-US")})</span>
          </h3>
          <ul className="flex flex-wrap gap-2">
            {districts
              .filter((d) => d[countOf] > 0)
              .map((d) => (
                <li key={d.location.slug}>
                  <Chip href={base(d.location.slug)} label={d.location.name} count={d[countOf]} />
                </li>
              ))}
          </ul>
        </div>
      ))}
    </section>
  );
}

/** Sub-areas (districts of a division, areas of a district) with records. */
export function SubAreaLinks({
  items: areas,
  parentName,
  type,
  countOf,
}: {
  items: readonly LocationListItem[];
  parentName: string;
  type: "hospitals" | "pharmacies";
  countOf: CountKey;
}) {
  const t = getT();
  const base = type === "hospitals" ? routes.hospitals : routes.pharmacies;
  const items = areas.filter((c) => c[countOf] > 0);
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="sub-areas" className="space-y-3">
      <h2 id="sub-areas" className="text-xl font-semibold text-slate-900">
        {t("facility.browse.within", { name: parentName })}
      </h2>
      <ul className="flex flex-wrap gap-2">
        {items.map((c) => (
          <li key={c.location.slug}>
            <Chip href={base(c.location.slug)} label={c.location.name} count={c[countOf]} />
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Cross links from a location list to the other kind of list and the location page. */
export function RelatedLocationLinks({ locationSlug, name, type }: { locationSlug: string; name: string; type: "hospitals" | "pharmacies" }) {
  const t = getT();
  const linkClass = "text-brand-800 underline underline-offset-2";
  return (
    <nav aria-label={t("facility.related.label", { name })} className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
      {type === "hospitals" ? (
        <Link href={routes.pharmacies(locationSlug)} className={linkClass}>
          {t("facility.related.pharmaciesIn", { name })}
        </Link>
      ) : (
        <Link href={routes.hospitals(locationSlug)} className={linkClass}>
          {t("facility.related.hospitalsIn", { name })}
        </Link>
      )}
      <Link href={routes.location(locationSlug)} className={linkClass}>
        {t("facility.related.about", { name })}
      </Link>
    </nav>
  );
}
