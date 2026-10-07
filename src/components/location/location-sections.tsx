import type { ReactNode } from "react";
import Link from "@/i18n/link";
import { SectionHeading } from "@/components/common/section-heading";
import { FacilityCard, ResultList } from "@/components/directory/result-cards";
import type { FacilityListItem } from "@/domain/read-models";

/** "See all …" link under a location section. */
export function SeeAll({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="mr-4 inline-block font-medium text-brand-800 underline">
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
      <ResultList label={title}>
        {items.map((item) => (
          <FacilityCard key={item.facility.id} item={item} />
        ))}
      </ResultList>
      <p className="mt-4">{children}</p>
    </section>
  );
}
