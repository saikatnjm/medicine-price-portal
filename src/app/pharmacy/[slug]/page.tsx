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
import { Container } from "@/components/ui/container";
import { HeroCard } from "@/components/ui/hero-card";
import { trustLabelOf } from "@/domain/healthcare";
import { services } from "@/data";
import { routes } from "@/lib/routes";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { pharmacyBreadcrumbs, pharmacyDescription, pharmacyJsonLd, pharmacyTitle } from "@/lib/seo-facilities";

interface PharmacyPageProps {
  params: Promise<{ slug: string }>;
}

const getPharmacyDetail = cache((slug: string) => services.pharmacies.getPharmacyDetail(slug));

// Large record set: render on demand instead of pre-rendering every pharmacy.
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return [];
}
export const dynamicParams = true;

export async function generateMetadata({ params }: PharmacyPageProps): Promise<Metadata> {
  const detail = await getPharmacyDetail((await params).slug);
  if (!detail) return { title: "Pharmacy not found" };
  return pageMetadata({
    title: pharmacyTitle(detail),
    description: pharmacyDescription(detail),
    path: routes.pharmacy(detail.pharmacy.slug),
    indexable: detail.indexable,
  });
}

export default async function PharmacyPage({ params }: PharmacyPageProps) {
  const detail = await getPharmacyDetail((await params).slug);
  if (!detail) notFound();

  const { pharmacy, place } = detail;
  const path = routes.pharmacy(pharmacy.slug);
  const breadcrumbs = pharmacyBreadcrumbs(detail);

  return (
    <Container className="py-8 sm:py-10">
      <JsonLd data={[pharmacyJsonLd(detail), breadcrumbJsonLd(breadcrumbs, path)]} />
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
                    question: `How can I get directions to ${pharmacy.name}?`,
                    answer: "Use the Directions button at the top of this page. It opens Google Maps in a new tab with the listed location as the destination.",
                  },
                ]
              : []),
            {
              question: "Does this page show medicine prices or stock?",
              answer:
                detail.prices.length === 0
                  ? "No. Medicine prices and stock are not available for this pharmacy. Call the pharmacy to ask."
                  : "Only sample price entries are shown. They are demonstration data, not live prices or stock. Call the pharmacy to confirm.",
            },
            {
              question: `Is the information about ${pharmacy.name} verified?`,
              answer:
                pharmacy.provenance.status === "unverified"
                  ? "No. This listing comes from community-mapped OpenStreetMap data that we have not independently verified. Opening hours and contact details may be out of date, so call ahead before you visit."
                  : `This listing is marked "${trustLabelOf(pharmacy.provenance)}". See Source & verification below for where it comes from.`,
            },
          ]}
        />
        <MoreInArea place={place} type="pharmacies" />
        <div className="space-y-6 border-t border-slate-200 pt-6">
          <SourceSection source={detail.source} provenance={pharmacy.provenance} sourceName={pharmacy.sourceName} />
          <ReportIssue name={pharmacy.name} path={path} provenance={pharmacy.provenance} />
        </div>
      </div>
    </Container>
  );
}
