import Link from "next/link";
import { SectionHeading } from "@/components/common/section-heading";
import type { FacilityDetail } from "@/domain/read-models";
import { routes } from "@/lib/routes";

/** Specialties listed for the facility, linking to the specialty page and the district list. */
export function FacilityDepartments({ detail }: { detail: FacilityDetail }) {
  const { specialties, place } = detail;
  if (specialties.length === 0) return null;
  const district = place.district;
  return (
    <section aria-labelledby="departments">
      <SectionHeading id="departments" description="Departments and specialties listed in the data source.">
        Departments &amp; specialties
      </SectionHeading>
      <ul className="flex flex-wrap gap-2">
        {specialties.map((s) => (
          <li key={s.id} className="flex flex-wrap items-center gap-x-3 rounded-md border border-slate-200 px-3 py-2 text-sm">
            <Link href={routes.specialty(s.slug)} className="font-medium text-brand-800 underline underline-offset-2">
              {s.name}
            </Link>
            {district && (
              <Link href={routes.hospitals(district.slug, s.slug)} className="text-slate-600 underline underline-offset-2">
                In {district.name}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
