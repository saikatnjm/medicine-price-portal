import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { JsonLd } from "@/components/common/json-ld";
import { SampleDataNotice } from "@/components/common/sample-data-notice";
import { PharmacyOverview } from "@/components/pharmacy/pharmacy-overview";
import { PharmacyPriceList } from "@/components/pharmacy/pharmacy-price-list";
import { Container } from "@/components/ui/container";
import { services } from "@/data";
import { routes } from "@/lib/routes";
import {
  breadcrumbJsonLd,
  openGraph,
  pharmacyDescription,
  pharmacyTitle,
  type BreadcrumbItem,
} from "@/lib/seo";

interface PharmacyPageProps {
  params: Promise<{ slug: string }>;
}

const getPharmacyDetail = cache((slug: string) => services.pharmacies.getPharmacyDetail(slug));

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const pharmacies = await services.pharmacies.listPharmacies();
  return pharmacies.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PharmacyPageProps): Promise<Metadata> {
  const detail = await getPharmacyDetail((await params).slug);
  if (!detail) return { title: "Pharmacy not found" };

  const title = pharmacyTitle(detail);
  const description = pharmacyDescription(detail);
  const path = routes.pharmacy(detail.pharmacy.slug);
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: openGraph(path, title, description),
  };
}

export default async function PharmacyPage({ params }: PharmacyPageProps) {
  const detail = await getPharmacyDetail((await params).slug);
  if (!detail) notFound();

  const { pharmacy } = detail;
  const breadcrumbs: BreadcrumbItem[] = [
    { name: "Home", href: routes.home() },
    { name: pharmacy.name },
  ];

  return (
    <Container className="py-8 sm:py-10">
      {/* No LocalBusiness schema: pilot pharmacies are fictional. */}
      <JsonLd data={breadcrumbJsonLd(breadcrumbs, routes.pharmacy(pharmacy.slug))} />
      <Breadcrumbs items={breadcrumbs} />
      <div className="mt-4 space-y-10">
        <PharmacyOverview pharmacy={pharmacy} />
        {detail.hasSampleData && <SampleDataNotice />}
        <PharmacyPriceList prices={detail.prices} hasSampleData={detail.hasSampleData} />
        <nav aria-label="Next steps" className="border-t border-slate-200 pt-6">
          <Link href={routes.search()} className="font-medium text-brand-800 underline">
            Search medicines
          </Link>
        </nav>
      </div>
    </Container>
  );
}
