import { SectionHeading } from "@/components/common/section-heading";
import { CompactList, FacilityRow, PharmacyRow } from "./compact-rows";
import { getT } from "@/i18n/server";
import type { FacilityListItem, FacilityNearby, PharmacyListItem, PharmacyNearby } from "@/domain/read-models";

/** One nearby group ("Nearby hospitals"); an empty list renders nothing. */
export function NearbyFacilityGroup({ title, id, items }: { title: string; id: string; items: readonly FacilityListItem[] }) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby={id}>
      <SectionHeading id={id}>{title}</SectionHeading>
      <CompactList label={title}>
        {items.map((item) => (
          <FacilityRow key={item.facility.id} item={item} />
        ))}
      </CompactList>
    </section>
  );
}

export function NearbyPharmacyGroup({ title, id, items }: { title?: string; id: string; items: readonly PharmacyListItem[] }) {
  if (items.length === 0) return null;
  const heading = title ?? getT()("facility.nearby.pharmacies");
  return (
    <section aria-labelledby={id}>
      <SectionHeading id={id}>{heading}</SectionHeading>
      <CompactList label={heading}>
        {items.map((item) => (
          <PharmacyRow key={item.pharmacy.id} item={item} />
        ))}
      </CompactList>
    </section>
  );
}

/** Nearby healthcare of a facility page, grouped by kind. */
export function FacilityNearbySections({ nearby }: { nearby: FacilityNearby }) {
  const t = getT();
  return (
    <>
      <NearbyFacilityGroup id="nearby-hospitals" title={t("facility.nearby.hospitals")} items={nearby.hospitals} />
      <NearbyFacilityGroup id="nearby-clinics" title={t("facility.nearby.clinics")} items={nearby.clinics} />
      <NearbyFacilityGroup id="nearby-diagnostic" title={t("facility.nearby.diagnostic")} items={nearby.diagnosticCentres} />
      <NearbyPharmacyGroup id="nearby-pharmacies" items={nearby.pharmacies} />
    </>
  );
}

/** Nearby healthcare of a pharmacy page. */
export function PharmacyNearbySections({ nearby }: { nearby: PharmacyNearby }) {
  const t = getT();
  return (
    <>
      <NearbyFacilityGroup id="nearby-facilities" title={t("facility.nearby.hospitalsAndClinics")} items={nearby.facilities} />
      <NearbyPharmacyGroup id="nearby-pharmacies" items={nearby.pharmacies} />
    </>
  );
}
