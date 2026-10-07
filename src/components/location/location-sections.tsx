import type { ReactNode } from "react";
import Link from "@/i18n/link";
import { SectionHeading } from "@/components/common/section-heading";
import { CompactList, FacilityRow } from "@/components/facility/compact-rows";
import { INDEX_CHIP_CLASS } from "@/components/ui/chip";
import type { FacilityListItem } from "@/domain/read-models";

/** "See all …" link under a location section. */
export function SeeAll({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className={`${INDEX_CHIP_CLASS} mr-2`}>
      {children}
    </Link>
  );
}

/** A titled list of facility cards followed by "See all" links (children). */
export function FacilitySection({
  id,
  title,
  items,
  children,
}: {
  id: string;
  title: string;
  items: readonly FacilityListItem[];
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={id}>
      <SectionHeading id={id}>{title}</SectionHeading>
      <CompactList label={title}>
        {items.map((item) => (
          <FacilityRow key={item.facility.id} item={item} />
        ))}
      </CompactList>
      <p className="mt-3">{children}</p>
    </section>
  );
}
