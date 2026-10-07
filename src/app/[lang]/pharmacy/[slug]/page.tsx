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
import { MoreInArea } from "@/components/facility/more-in-area";
import { PharmacyNearbySections } from "@/components/facility/nearby-sections";
import { QuickActions } from "@/components/facility/quick-actions";
import { PharmacyOverview } from "@/components/pharmacy/pharmacy-overview";
import { PharmacyPricesSection } from "@/components/pharmacy/pharmacy-prices-section";
import { Faq } from "@/components/common/faq";
import { NextSteps } from "@/components/common/next-steps";
import { EntityToolbar } from "@/components/retention/entity-toolbar";
import { Container } from "@/components/ui/container";
import { HeroCard } from "@/components/ui/hero-card";
import { services } from "@/data";
import type { ProvenanceStatus } from "@/domain/types";
import type { MessageKey } from "@/i18n/messages";
import { getT, initLocale } from "@/i18n/server";
import { routes } from "@/lib/routes";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import {
  pharmacyPageBreadcrumbs,
  pharmacyPageDescription,
  pharmacyPageJsonLd,
  pharmacyPageTitle,
} from "@/lib/seo-pharmacy";

interface PharmacyPageProps {
  params: Promise<{ lang?: string; slug: string }>;
}

const TRUST_KEY: Record<ProvenanceStatus, MessageKey> = {
  registered: "pharmacy.trust.registered",
  unverified: "pharmacy.trust.unverified",
  needs_review: "pharmacy.trust.needs_review",
  verified: "pharmacy.trust.verified",
  user_reported: "pharmacy.trust.user_reported",
};

const getPharmacyDetail = cache((slug: string) => services.pharmacies.getPharmacyDetail(slug));

// Large record set: render on demand instead of pre-rendering every pharmacy.
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return [];
}
export const dynamicParams = true;

export async function generateMetadata({ params }: PharmacyPageProps): Promise<Metadata> {
  const lang = await initLocale(params);
  const detail = await getPharmacyDetail((await params).slug);
  if (!detail) return { title: getT(lang)("pharmacy.page.not_found_title") };
  return pageMetadata({
    title: pharmacyPageTitle(detail, lang),
    description: pharmacyPageDescription(detail, lang),
    path: routes.pharmacy(detail.pharmacy.slug),
    indexable: detail.indexable,
    lang,
  });
}

export default async function PharmacyPage({ params }: PharmacyPageProps) {
  const lang = await initLocale(params);
  const t = getT(lang);
  const detail = await getPharmacyDetail((await params).slug);
  if (!detail) notFound();

  const { pharmacy, place } = detail;
  const path = routes.pharmacy(pharmacy.slug);
  const breadcrumbs = pharmacyPageBreadcrumbs(detail, lang);
  const placeSlug = place.area?.slug ?? place.district?.slug;

  return (
    <Container className="py-8 sm:py-10">
      <JsonLd data={[pharmacyPageJsonLd(detail, lang), breadcrumbJsonLd(breadcrumbs, path, lang)]} />
      <Breadcrumbs items={breadcrumbs} />
      <div className="mt-4 space-y-10">
        <HeroCard>
          <PharmacyOverview detail={detail} />
          <QuickActions
            name={pharmacy.name}
            phone={pharmacy.phone}
            address={pharmacy.address}
            coordinates={pharmacy.coordinates}
            google={pharmacy.google}
            showMapLink
          />
          <EntityToolbar
            type="pharmacy"
            slug={pharmacy.slug}
            name={pharmacy.name}
            subtitle={place.label || undefined}
            path={path}
          />
        </HeroCard>
        <LocationBlock
          name={pharmacy.name}
          address={pharmacy.address}
          placeLabel={place.label}
          postalCode={pharmacy.postalCode}
          coordinates={pharmacy.coordinates}
          google={pharmacy.google}
        />
        <GooglePlaceInfo google={pharmacy.google} name={pharmacy.name} />
        <ContactDetails
          phone={pharmacy.phone}
          website={pharmacy.website}
          openingHours={pharmacy.openingHours}
          omitWhenEmpty
        />
        <PharmacyPricesSection detail={detail} />
        <PharmacyNearbySections nearby={detail.nearby} />
        <Faq
          items={[
            ...(pharmacy.coordinates || pharmacy.address
              ? [
                  {
                    question: t("pharmacy.page.faq_directions_q", { name: pharmacy.name }),
                    answer: t("pharmacy.page.faq_directions_a"),
                  },
                ]
              : []),
            {
              question: t("pharmacy.page.faq_prices_q"),
              answer: t(detail.prices.length === 0 ? "pharmacy.page.faq_prices_none" : "pharmacy.page.faq_prices_sample"),
            },
            {
              question: t("pharmacy.page.faq_verified_q", { name: pharmacy.name }),
              answer:
                pharmacy.provenance.status === "unverified"
                  ? t("pharmacy.page.faq_verified_no")
                  : t("pharmacy.page.faq_verified_other", { label: t(TRUST_KEY[pharmacy.provenance.status]) }),
            },
          ]}
        />
        <MoreInArea place={place} type="pharmacies" />
        <NextSteps
          links={[
            { label: t("pharmacy.page.next_nearby"), href: routes.pharmacies(placeSlug) },
            { label: t("pharmacy.page.next_hospital"), href: routes.hospitals(placeSlug) },
            { label: t("pharmacy.page.next_search"), href: routes.search() },
          ]}
        />
        <div className="space-y-6 border-t border-slate-200 pt-6">
          <SourceSection source={detail.source} provenance={pharmacy.provenance} sourceName={pharmacy.sourceName} />
          <ReportIssue name={pharmacy.name} path={path} provenance={pharmacy.provenance} />
        </div>
      </div>
    </Container>
  );
}
