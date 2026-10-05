import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { JsonLd } from "@/components/common/json-ld";
import { SourceAttribution } from "@/components/directory/source-attribution";
import { LocationBlock } from "@/components/directory/location-block";
import { ContactDetails } from "@/components/facility/contact-details";
import { CorrectionHint } from "@/components/facility/correction-hint";
import { FacilityDepartments } from "@/components/facility/facility-departments";
import { FacilityDoctors } from "@/components/facility/facility-doctors";
import { FacilityOverview } from "@/components/facility/facility-overview";
import { MoreInArea } from "@/components/facility/more-in-area";
import { NearbyFacilities, NearbyPharmacies } from "@/components/facility/nearby-sections";
import { Container } from "@/components/ui/container";
import { services } from "@/data";
import { routes } from "@/lib/routes";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import {
  facilityBreadcrumbs,
  facilityDescription,
  facilityJsonLd,
  facilityTitle,
} from "@/lib/seo-facilities";

interface FacilityPageProps {
  params: Promise<{ slug: string }>;
}

const getFacilityDetail = cache((slug: string) => services.facilities.getFacilityDetail(slug));

// Large record set: render on demand instead of pre-rendering thousands of pages.
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return [];
}
export const dynamicParams = true;

export async function generateMetadata({ params }: FacilityPageProps): Promise<Metadata> {
  const detail = await getFacilityDetail((await params).slug);
  if (!detail) return { title: "Hospital or clinic not found" };
  return pageMetadata({
    title: facilityTitle(detail),
    description: facilityDescription(detail),
    path: routes.hospital(detail.facility.slug),
    indexable: detail.indexable,
  });
}

export default async function FacilityPage({ params }: FacilityPageProps) {
  const detail = await getFacilityDetail((await params).slug);
  if (!detail) notFound();

  const { facility, place } = detail;
  const path = routes.hospital(facility.slug);
  const breadcrumbs = facilityBreadcrumbs(detail);

  return (
    <Container className="py-8 sm:py-10">
      <JsonLd data={[facilityJsonLd(detail), breadcrumbJsonLd(breadcrumbs, path)]} />
      <Breadcrumbs items={breadcrumbs} />
      <div className="mt-4 space-y-10">
        <FacilityOverview detail={detail} />
        <div className="grid gap-10 lg:grid-cols-2">
          <ContactDetails
            phone={facility.phone}
            website={facility.website}
            email={facility.email}
            openingHours={facility.openingHours}
            beds={facility.beds}
          />
          <LocationBlock
            name={facility.name}
            address={facility.address}
            placeLabel={place.label}
            postalCode={facility.postalCode}
            coordinates={facility.coordinates}
            google={facility.google}
          />
        </div>
        <FacilityDepartments detail={detail} />
        <FacilityDoctors doctors={detail.doctors} facilityName={facility.name} />
        <NearbyFacilities items={detail.nearbyFacilities} />
        <NearbyPharmacies items={detail.nearbyPharmacies} />
        <MoreInArea place={place} type="hospitals" />
        <div className="space-y-2 border-t border-slate-200 pt-6">
          <SourceAttribution source={detail.source} provenance={facility.provenance} />
          <CorrectionHint provenance={facility.provenance} />
          <p className="text-sm text-slate-600">
            This page is general information, not medical advice. In an emergency, call a local emergency number or go to
            the nearest hospital.
          </p>
        </div>
      </div>
    </Container>
  );
}
