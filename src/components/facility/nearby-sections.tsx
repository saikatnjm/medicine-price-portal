import { SectionHeading } from "@/components/common/section-heading";
import { FacilityCard, PharmacyCard, ResultList } from "@/components/directory/result-cards";
import type { FacilityListItem, FacilityNearby, PharmacyListItem, PharmacyNearby } from "@/domain/read-models";

/** One nearby group ("Nearby hospitals"); an empty list renders nothing. */
export function NearbyFacilityGroup({ title, id, items }: { title: string; id: string; items: readonly FacilityListItem[] }) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby={id}>
      <SectionHeading id={id}>{title}</SectionHeading>
      <ResultList label={title}>
        {items.map((item) => (
          <FacilityCard key={item.facility.id} item={item} />
        ))}
      </ResultList>
    </section>
  );
}

export function NearbyPharmacyGroup({ title = "Nearby pharmacies", id, items }: { title?: string; id: string; items: readonly PharmacyListItem[] }) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby={id}>
      <SectionHeading id={id}>{title}</SectionHeading>
      <ResultList label={title}>
        {items.map((item) => (
          <PharmacyCard key={item.pharmacy.id} item={item} />
        ))}
      </ResultList>
    </section>
  );
}

/** Nearby healthcare of a facility page, grouped by kind. */
export function FacilityNearbySections({ nearby }: { nearby: FacilityNearby }) {
  return (
    <>
      <NearbyFacilityGroup id="nearby-hospitals" title="Nearby hospitals" items={nearby.hospitals} />
      <NearbyFacilityGroup id="nearby-clinics" title="Nearby clinics" items={nearby.clinics} />
      <NearbyFacilityGroup id="nearby-diagnostic" title="Nearby diagnostic centres" items={nearby.diagnosticCentres} />
      <NearbyPharmacyGroup id="nearby-pharmacies" items={nearby.pharmacies} />
    </>
  );
}

/** Nearby healthcare of a pharmacy page. */
export function PharmacyNearbySections({ nearby }: { nearby: PharmacyNearby }) {
  return (
    <>
      <NearbyFacilityGroup id="nearby-facilities" title="Nearby hospitals & clinics" items={nearby.facilities} />
      <NearbyPharmacyGroup id="nearby-pharmacies" items={nearby.pharmacies} />
    </>
  );
}
