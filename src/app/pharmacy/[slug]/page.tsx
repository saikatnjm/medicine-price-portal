import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { JsonLd } from "@/components/common/json-ld";
import { LocationBlock } from "@/components/directory/location-block";
import { SourceAttribution } from "@/components/directory/source-attribution";
import { ContactDetails } from "@/components/facility/contact-details";
import { CorrectionHint } from "@/components/facility/correction-hint";
import { MoreInArea } from "@/components/facility/more-in-area";
import { NearbyFacilities, NearbyPharmacies } from "@/components/facility/nearby-sections";
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
        <PharmacyOverview detail={detail} />
        <div className="grid gap-10 lg:grid-cols-2">
          <ContactDetails phone={pharmacy.phone} website={pharmacy.website} openingHours={pharmacy.openingHours} />
          <LocationBlock
            name={pharmacy.name}
            address={pharmacy.address}
            placeLabel={place.label}
            postalCode={pharmacy.postalCode}
            coordinates={pharmacy.coordinates}
            google={pharmacy.google}
          />
        </div>
        <PharmacyPricesSection detail={detail} />
        <NearbyPharmacies items={detail.nearbyPharmacies} />
        <NearbyFacilities items={detail.nearbyFacilities} />
        <MoreInArea place={place} type="pharmacies" />
        <div className="space-y-2 border-t border-slate-200 pt-6">
          <SourceAttribution source={detail.source} provenance={pharmacy.provenance} />
          <CorrectionHint provenance={pharmacy.provenance} />
        </div>
      </div>
    </Container>
  );
}
