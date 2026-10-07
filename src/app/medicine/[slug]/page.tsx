import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { JsonLd } from "@/components/common/json-ld";
import { SampleDataNotice } from "@/components/common/sample-data-notice";
import { MedicineAlternatives } from "@/components/medicine/medicine-alternatives";
import { MedicineFacts } from "@/components/medicine/medicine-facts";
import { MedicineOverview } from "@/components/medicine/medicine-overview";
import { PriceComparison } from "@/components/medicine/price-comparison";
import { RelatedSearches } from "@/components/common/related-searches";
import { EntityToolbar } from "@/components/retention/entity-toolbar";
import { Container } from "@/components/ui/container";
import type { RelatedSearch } from "@/lib/related-searches";
import { services } from "@/data";
import { formatMedicineName } from "@/lib/format";
import { routes } from "@/lib/routes";
import { searchHref } from "@/lib/search-params";
import {
  breadcrumbJsonLd,
  medicineDescription,
  medicineJsonLd,
  medicineTitle,
  openGraph,
  type BreadcrumbItem,
} from "@/lib/seo";

interface MedicinePageProps {
  params: Promise<{ slug: string }>;
}

/** Deduplicates the lookup between generateMetadata and the page render. */
const getMedicineDetail = cache((slug: string) => services.medicines.getMedicineDetail(slug));

/**
 * Only the homepage examples are prerendered; the rest of the catalogue
 * (tens of thousands of products) is rendered on first request and then cached.
 */
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const popular = await services.medicines.listPopularMedicines();
  return popular.map(({ medicine }) => ({ slug: medicine.slug }));
}

export const dynamicParams = true;

export async function generateMetadata({ params }: MedicinePageProps): Promise<Metadata> {
  const detail = await getMedicineDetail((await params).slug);
  if (!detail) return { title: "Medicine not found" };

  const title = medicineTitle(detail);
  const description = medicineDescription(detail);
  const path = routes.medicine(detail.medicine.slug);
  return pageMetadata({ title, description, path });
}

export default async function MedicinePage({ params }: MedicinePageProps) {
  const detail = await getMedicineDetail((await params).slug);
  if (!detail) notFound();

  const { medicine, generic } = detail;
  const path = routes.medicine(medicine.slug);
  const breadcrumbs: BreadcrumbItem[] = [
    { name: "Home", href: routes.home() },
    { name: generic.name, href: searchHref(generic.name) },
    { name: formatMedicineName(medicine) },
  ];

  const related: RelatedSearch[] = [
    { label: `${generic.name} medicines`, href: searchHref(generic.name) },
    ...(detail.alternativesTotal > 0 ? [{ label: `${medicine.brandName} alternatives`, href: `${path}#alternatives` }] : []),
    { label: `${detail.manufacturer.name.replace(/\.$/, "")} medicines`, href: searchHref(detail.manufacturer.name.replace(/\.$/, "")) },
  ];

  return (
    <Container className="py-8 sm:py-10">
      {/* Structured breadcrumbs omit the search crumb: search pages are noindex. */}
      <JsonLd
        data={[
          medicineJsonLd(detail),
          breadcrumbJsonLd([breadcrumbs[0]!, breadcrumbs[breadcrumbs.length - 1]!], path),
        ]}
      />
      <Breadcrumbs items={breadcrumbs} />

      <div className="mt-4 space-y-10">
        <MedicineOverview detail={detail} />
        <EntityToolbar
          type="medicine"
          slug={medicine.slug}
          name={formatMedicineName(medicine)}
          subtitle={generic.name}
          path={path}
          compare
        />
        {detail.hasSampleData && <SampleDataNotice />}
        <PriceComparison detail={detail} />
        <MedicineAlternatives detail={detail} />
        <MedicineFacts detail={detail} />
        <RelatedSearches items={related} />
        <nav
          aria-label="Next steps"
          className="flex flex-wrap gap-x-6 gap-y-2 border-t border-slate-200 pt-6"
        >
          <Link
            href={searchHref(medicine.brandName)}
            className="font-medium text-brand-800 underline"
          >
            All results for “{medicine.brandName}”
          </Link>
          <Link href={searchHref(generic.name)} className="font-medium text-brand-800 underline">
            All {generic.name} medicines
          </Link>
          <Link href={routes.search()} className="font-medium text-brand-800 underline">
            Search another medicine
          </Link>
        </nav>
      </div>
    </Container>
  );
}
