import { SectionHeading } from "@/components/common/section-heading";
import { FacilityCard, PharmacyCard, ResultList } from "@/components/directory/result-cards";
import type { FacilityListItem, PharmacyListItem } from "@/domain/read-models";

/** "Nearby hospitals & clinics" — empty lists render nothing. */
export function NearbyFacilities({ items, headingId = "nearby-facilities" }: { items: readonly FacilityListItem[]; headingId?: string }) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby={headingId}>
      <SectionHeading id={headingId}>Nearby hospitals &amp; clinics</SectionHeading>
      <ResultList label="Nearby hospitals and clinics">
        {items.map((item) => (
          <FacilityCard key={item.facility.id} item={item} />
        ))}
      </ResultList>
    </section>
  );
}

export function NearbyPharmacies({ items, headingId = "nearby-pharmacies" }: { items: readonly PharmacyListItem[]; headingId?: string }) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby={headingId}>
      <SectionHeading id={headingId}>Nearby pharmacies</SectionHeading>
      <ResultList label="Nearby pharmacies">
        {items.map((item) => (
          <PharmacyCard key={item.pharmacy.id} item={item} />
        ))}
      </ResultList>
    </section>
  );
}
