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
import { Container } from "@/components/ui/container";
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
        <div className="space-y-5">
          <PharmacyOverview detail={detail} />
          <QuickActions
            name={pharmacy.name}
            phone={pharmacy.phone}
            address={pharmacy.address}
            coordinates={pharmacy.coordinates}
            google={pharmacy.google}
            showMapLink
          />
        </div>
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
        <MoreInArea place={place} type="pharmacies" />
        <div className="space-y-6 border-t border-slate-200 pt-6">
          <SourceSection source={detail.source} provenance={pharmacy.provenance} sourceName={pharmacy.sourceName} />
          <ReportIssue name={pharmacy.name} path={path} provenance={pharmacy.provenance} />
        </div>
      </div>
    </Container>
  );
}
