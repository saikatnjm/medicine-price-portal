import Link from "@/i18n/link";
import { SectionHeading } from "@/components/common/section-heading";
import type { FacilityDetail } from "@/domain/read-models";
import { getT } from "@/i18n/server";
import { routes } from "@/lib/routes";

/** Specialties listed for the facility, linking to the specialty page and the district list. */
export function FacilityDepartments({ detail }: { detail: FacilityDetail }) {
  const t = getT();
  const { specialties, place } = detail;
  if (specialties.length === 0) return null;
  const district = place.district;
  return (
    <section aria-labelledby="departments" className="scroll-mt-20">
      <SectionHeading id="departments" description={t("facility.departments.description")}>
        {t("facility.departments.heading")}
      </SectionHeading>
      <ul className="flex flex-wrap gap-2">
        {specialties.map((s) => (
          <li key={s.id} className="flex flex-wrap items-center gap-x-3 rounded-full bg-cat-specialty-bg px-4 py-1.5 text-sm">
            <Link href={routes.specialty(s.slug)} className="inline-flex min-h-8 items-center font-medium text-cat-specialty-fg hover:underline">
              {s.name}
            </Link>
            {district && (
              <Link href={routes.hospitals(district.slug, s.slug)} className="text-slate-600 underline underline-offset-2">
                {t("facility.departments.in", { name: district.name })}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
