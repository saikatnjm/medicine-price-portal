import Link from "@/i18n/link";
import type { SpecialtyListItem } from "@/domain/read-models";
import { getT } from "@/i18n/server";
import { CHIP_CLASS, INDEX_CHIP_CLASS } from "@/components/ui/chip";
import { ChevronIcon } from "@/components/ui/icons";
import { routes } from "@/lib/routes";

const MAX_SPECIALTIES = 10;

/** Specialties with the most listed hospitals and clinics (data-driven, never hand-picked). */
export function popularSpecialties(items: readonly SpecialtyListItem[], limit = MAX_SPECIALTIES): SpecialtyListItem[] {
  return items
    .filter((item) => item.facilityCount > 0)
    .sort((a, b) => b.facilityCount - a.facilityCount || a.specialty.name.localeCompare(b.specialty.name))
    .slice(0, limit);
}

export function SpecialtyLinks({ items }: { items: readonly SpecialtyListItem[] }) {
  const t = getT();
  const top = popularSpecialties(items);
  if (top.length === 0) return null;
  return (
    <section aria-labelledby="browse-specialties">
      <h2 id="browse-specialties" className="text-xl font-semibold text-ink">
        {t("layout.home.browseSpecialty")}
      </h2>
      <ul className="mt-4 flex flex-wrap gap-2">
        {top.map(({ specialty }) => (
          <li key={specialty.id}>
            <Link href={routes.specialty(specialty.slug)} className={CHIP_CLASS}>
              {specialty.name}
            </Link>
          </li>
        ))}
        <li>
          <Link href={routes.specialties()} className={INDEX_CHIP_CLASS}>
            {t("home.cat.specialties")}
            <ChevronIcon className="size-4" />
          </Link>
        </li>
      </ul>
    </section>
  );
}
