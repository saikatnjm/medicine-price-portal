import Link from "next/link";
import type { Place } from "@/domain/read-models";
import { routes } from "@/lib/routes";

/** "More in <area/district>" links to the matching lists and location page. */
export function MoreInArea({ place, type }: { place: Place; type: "hospitals" | "pharmacies" }) {
  const links = [place.area, place.district].flatMap((l, i, all) => (l && all.findIndex((x) => x?.slug === l.slug) === i ? [l] : []));
  if (links.length === 0) return null;
  return (
    <nav aria-label="More in this area" className="space-y-2 border-t border-slate-200 pt-6">
      <h2 className="text-lg font-semibold text-slate-900">More in this area</h2>
      <ul className="flex flex-col gap-1">
        {links.map((l) => (
          <li key={l.slug} className="flex flex-wrap gap-x-4 gap-y-1">
            <Link href={type === "hospitals" ? routes.hospitals(l.slug) : routes.pharmacies(l.slug)} className="text-brand-800 underline underline-offset-2">
              {type === "hospitals" ? "Hospitals & clinics" : "Pharmacies"} in {l.name}
            </Link>
            <Link href={type === "hospitals" ? routes.pharmacies(l.slug) : routes.hospitals(l.slug)} className="text-brand-800 underline underline-offset-2">
              {type === "hospitals" ? "Pharmacies" : "Hospitals & clinics"} in {l.name}
            </Link>
            <Link href={routes.location(l.slug)} className="text-brand-800 underline underline-offset-2">
              About {l.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
