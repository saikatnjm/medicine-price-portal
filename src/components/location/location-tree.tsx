import Link from "next/link";
import type { DivisionWithDistricts, LocationCounts } from "@/domain/read-models";
import { pluralize } from "@/lib/format";
import { routes } from "@/lib/routes";

export function locationCountsText(c: LocationCounts): string {
  const parts: string[] = [];
  if (c.facilityCount > 0) parts.push(pluralize(c.facilityCount, "facility", "facilities"));
  if (c.pharmacyCount > 0) parts.push(pluralize(c.pharmacyCount, "pharmacy", "pharmacies"));
  if (c.doctorCount > 0) parts.push(pluralize(c.doctorCount, "doctor", "doctors"));
  return parts.length > 0 ? parts.join(" · ") : "No records yet";
}

/** Divisions with their districts and counts. */
export function LocationTree({ divisions }: { divisions: DivisionWithDistricts[] }) {
  return (
    <div className="space-y-10">
      {divisions.map(({ division, districts, ...counts }) => (
        <section key={division.id} aria-labelledby={`division-${division.slug}`}>
          <h2 id={`division-${division.slug}`} className="text-xl font-semibold text-slate-900">
            <Link href={routes.location(division.slug)} className="hover:underline">
              {division.name} Division
            </Link>
          </h2>
          <p className="text-sm text-slate-600">{locationCountsText(counts)}</p>
          <ul className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
            {districts.map(({ location, ...c }) => (
              <li key={location.id}>
                <Link href={routes.location(location.slug)} className="font-medium text-brand-800 underline">
                  {location.name}
                </Link>
                <span className="block text-sm text-slate-600">{locationCountsText(c)}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
