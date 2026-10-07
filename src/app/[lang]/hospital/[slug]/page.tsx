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
import { services } from "@/data";
import { getT, initLocale } from "@/i18n/server";
import { trustLabel } from "@/lib/directory-labels";
import { routes } from "@/lib/routes";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import {
  facilityBreadcrumbs,
  facilityDescription,
  facilityJsonLd,
  facilityTitle,
} from "@/lib/seo-facilities";

interface FacilityPageProps {
  params: Promise<{ lang?: string; slug: string }>;
}

const getFacilityDetail = cache((slug: string) => services.facilities.getFacilityDetail(slug));

// Large record set: render on demand instead of pre-rendering thousands of pages.
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return [];
}
export const dynamicParams = true;

export async function generateMetadata({ params }: FacilityPageProps): Promise<Metadata> {
  const lang = await initLocale(params);
  const detail = await getFacilityDetail((await params).slug);
  if (!detail) return { title: getT(lang)("facility.notFound.title") };
  return pageMetadata({
    title: facilityTitle(detail, lang),
    description: facilityDescription(detail, lang),
    path: routes.hospital(detail.facility.slug),
    indexable: detail.indexable,
    lang,
  });
}

export default async function FacilityPage({ params }: FacilityPageProps) {
  const lang = await initLocale(params);
  const t = getT();
  const detail = await getFacilityDetail((await params).slug);
  if (!detail) notFound();

  const { facility, place } = detail;
  const path = routes.hospital(facility.slug);
  const breadcrumbs = facilityBreadcrumbs(detail, lang);
  const placeSlug = place.area?.slug ?? place.district?.slug;

  return (
    <Container className="py-8 sm:py-10">
      <JsonLd data={[facilityJsonLd(detail, lang), breadcrumbJsonLd(breadcrumbs, path, lang)]} />
      <Breadcrumbs items={breadcrumbs} />
      <div className="mt-4 space-y-10">
        <HeroCard>
          <FacilityOverview detail={detail} />
          <QuickActions
            entity="hospital"
            slug={facility.slug}
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
          entity="hospital"
          slug={facility.slug}
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
            { label: t("facility.next.anotherHospital"), href: routes.hospitals(placeSlug) },
            { label: t("facility.next.nearbyPharmacies"), href: routes.pharmacies(placeSlug) },
            { label: t("facility.next.anotherLocation"), href: routes.locations() },
          ]}
        />
        <Faq
          items={[
            ...(facility.coordinates || facility.address
              ? [
                  {
                    question: t("facility.faq.directions.q", { name: facility.name }),
                    answer: t("facility.faq.directions.a"),
                  },
                ]
              : []),
            {
              question: t("facility.faq.verified.q", { name: facility.name }),
              answer:
                facility.provenance.status === "unverified"
                  ? t("facility.faq.verified.unverified")
                  : t("facility.faq.verified.other", { label: trustLabel(t, facility.provenance.status) }),
            },
          ]}
        />
        <div className="space-y-6 border-t border-slate-200 pt-6">
          <SourceSection source={detail.source} provenance={facility.provenance} sourceName={facility.sourceName} />
          <ReportIssue entity="hospital" slug={facility.slug} name={facility.name} path={path} provenance={facility.provenance} />
          <p className="text-sm text-slate-600">{t("facility.disclaimer")}</p>
        </div>
      </div>
    </Container>
  );
}
