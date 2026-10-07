import type { Metadata } from "next";
import Link from "@/i18n/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { JsonLd } from "@/components/common/json-ld";
import { SampleDataNotice } from "@/components/common/sample-data-notice";
import { MedicineAlternatives } from "@/components/medicine/medicine-alternatives";
import { MedicineFaq } from "@/components/medicine/medicine-faq";
import { MedicineFacts } from "@/components/medicine/medicine-facts";
import { MedicineOverview } from "@/components/medicine/medicine-overview";
import { MedicineSafety } from "@/components/medicine/medicine-safety";
import { PriceComparison } from "@/components/medicine/price-comparison";
import { RelatedSearches } from "@/components/common/related-searches";
import { ReportIssue } from "@/components/directory/report-issue";
import { EntityToolbar } from "@/components/retention/entity-toolbar";
import { Container } from "@/components/ui/container";
import type { RelatedSearch } from "@/lib/related-searches";
import { services } from "@/data";
import { initLocale, getT } from "@/i18n/server";
import { formatMedicineName } from "@/lib/format";
import { routes } from "@/lib/routes";
import { searchHref } from "@/lib/search-params";
import {
  breadcrumbJsonLd,
  medicineDescription,
  medicineJsonLd,
  medicineTitle,
  pageMetadata,
  type BreadcrumbItem,
} from "@/lib/seo";

interface MedicinePageProps {
  params: Promise<{ lang?: string; slug: string }>;
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
  const lang = await initLocale(params);
  const detail = await getMedicineDetail((await params).slug);
  if (!detail) return { title: getT(lang)("medicine.page.not_found_title") };

  const title = medicineTitle(detail, lang);
  const description = medicineDescription(detail, lang);
  const path = routes.medicine(detail.medicine.slug);
  return pageMetadata({ title, description, path, lang });
}

export default async function MedicinePage({ params }: MedicinePageProps) {
  const lang = await initLocale(params);
  const t = getT(lang);
  const detail = await getMedicineDetail((await params).slug);
  if (!detail) notFound();

  const { medicine, generic } = detail;
  const path = routes.medicine(medicine.slug);
  const breadcrumbs: BreadcrumbItem[] = [
    { name: t("medicine.page.home"), href: routes.home() },
    { name: generic.name, href: searchHref(generic.name) },
    { name: formatMedicineName(medicine) },
  ];

  const related: RelatedSearch[] = [
    { label: t("medicine.page.related_generic", { name: generic.name }), href: searchHref(generic.name) },
    ...(detail.alternativesTotal > 0 ? [{ label: t("medicine.page.related_alts", { name: medicine.brandName }), href: `${path}#alternatives` }] : []),
    { label: t("medicine.page.related_maker", { name: detail.manufacturer.name.replace(/\.$/, "") }), href: searchHref(detail.manufacturer.name.replace(/\.$/, "")) },
  ];

  return (
    <Container className="py-8 sm:py-10">
      {/* Structured breadcrumbs omit the search crumb: search pages are noindex. */}
      <JsonLd
        data={[
          medicineJsonLd(detail, lang),
          breadcrumbJsonLd([breadcrumbs[0]!, breadcrumbs[breadcrumbs.length - 1]!], path, lang),
        ]}
      />
      <Breadcrumbs items={breadcrumbs} />

      <div className="mt-4 space-y-12">
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
        <MedicineSafety detail={detail} />
        <MedicineAlternatives detail={detail} />
        <MedicineFacts detail={detail} />
        <MedicineFaq detail={detail} />
        <ReportIssue entity="medicine" slug={medicine.slug} name={formatMedicineName(medicine)} path={path} provenance={medicine.provenance} />
        <RelatedSearches items={related} />
        <nav
          aria-label={t("medicine.page.next_steps")}
          className="flex flex-wrap gap-x-6 gap-y-2 pt-2"
        >
          <Link
            href={searchHref(medicine.brandName)}
            className="font-medium text-brand-800 underline"
          >
            {t("medicine.page.all_results", { name: medicine.brandName })}
          </Link>
          <Link href={searchHref(generic.name)} className="font-medium text-brand-800 underline">
            {t("medicine.page.all_generic", { name: generic.name })}
          </Link>
          <Link href={routes.search()} className="font-medium text-brand-800 underline">
            {t("medicine.page.search_another")}
          </Link>
        </nav>
      </div>
    </Container>
  );
}
