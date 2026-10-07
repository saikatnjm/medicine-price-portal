import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { JsonLd } from "@/components/common/json-ld";
import { GooglePlaceInfo } from "@/components/directory/google-place-info";
import { LocationBlock } from "@/components/directory/location-block";
import { ReportIssue } from "@/components/directory/report-issue";
import { SourceSection } from "@/components/directory/source-attribution";
import { ContactDetails } from "@/components/facility/contact-details";
import { FacilityDepartments } from "@/components/facility/facility-departments";
import { FacilityDoctors } from "@/components/facility/facility-doctors";
import { FacilityOverview } from "@/components/facility/facility-overview";
import { MoreInArea } from "@/components/facility/more-in-area";
import { FacilityNearbySections } from "@/components/facility/nearby-sections";
import { QuickActions } from "@/components/facility/quick-actions";
import { Faq } from "@/components/common/faq";
import { NextSteps } from "@/components/common/next-steps";
import { EntityToolbar } from "@/components/retention/entity-toolbar";
import { Container } from "@/components/ui/container";
import { HeroCard } from "@/components/ui/hero-card";
import { trustLabelOf } from "@/domain/healthcare";
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
  const placeSlug = place.area?.slug ?? place.district?.slug;

  return (
    <Container className="py-8 sm:py-10">
      <JsonLd data={[facilityJsonLd(detail), breadcrumbJsonLd(breadcrumbs, path)]} />
      <Breadcrumbs items={breadcrumbs} />
      <div className="mt-4 space-y-10">
        <HeroCard>
          <FacilityOverview detail={detail} />
          <QuickActions
            name={facility.name}
            phone={facility.phone}
            website={facility.website}
            address={facility.address}
            coordinates={facility.coordinates}
            google={facility.google}
          />
          <EntityToolbar
            type="hospital"
            slug={facility.slug}
            name={facility.name}
            subtitle={place.label || undefined}
            path={path}
          />
        </HeroCard>
        <LocationBlock
          name={facility.name}
          address={facility.address}
          placeLabel={place.label}
          postalCode={facility.postalCode}
          coordinates={facility.coordinates}
          google={facility.google}
        />
        <GooglePlaceInfo google={facility.google} name={facility.name} />
        <ContactDetails
          phone={facility.phone}
          website={facility.website}
          email={facility.email}
          openingHours={facility.openingHours}
          beds={facility.beds}
          omitWhenEmpty
        />
        <FacilityDepartments detail={detail} />
        <FacilityDoctors doctors={detail.doctors} facilityName={facility.name} />
        <FacilityNearbySections nearby={detail.nearby} />
        <MoreInArea place={place} type="hospitals" />
        <NextSteps
          links={[
            { label: "Find another hospital", href: routes.hospitals(placeSlug) },
            { label: "Find nearby pharmacies", href: routes.pharmacies(placeSlug) },
            { label: "Explore another location", href: routes.locations() },
          ]}
        />
        <Faq
          items={[
            ...(facility.coordinates || facility.address
              ? [
                  {
                    question: `How can I get directions to ${facility.name}?`,
                    answer: "Use the Directions button at the top of this page. It opens Google Maps in a new tab with the listed location as the destination.",
                  },
                ]
              : []),
            {
              question: `Is the information about ${facility.name} verified?`,
              answer:
                facility.provenance.status === "unverified"
                  ? "No. This listing comes from community-mapped OpenStreetMap data that we have not independently verified. Phone numbers, opening hours and services may be out of date, so call ahead before you visit."
                  : `This listing is marked "${trustLabelOf(facility.provenance)}". See Source & verification below for where it comes from. Please still confirm details with the facility before you visit.`,
            },
          ]}
        />
        <div className="space-y-6 border-t border-slate-200 pt-6">
          <SourceSection source={detail.source} provenance={facility.provenance} sourceName={facility.sourceName} />
          <ReportIssue name={facility.name} path={path} provenance={facility.provenance} />
          <p className="text-sm text-slate-600">
            This page is general information, not medical advice. In an emergency, call a local emergency number or go to
            the nearest hospital.
          </p>
        </div>
      </div>
    </Container>
  );
}
