import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { cache } from "react";
import { CompanyView, companyMetadata } from "@/components/company/company-view";
import { services } from "@/data";
import { localizePath } from "@/i18n/config";
import { getT, initLocale } from "@/i18n/server";
import { routes } from "@/lib/routes";
import { parsePageSegment } from "@/lib/routes-catalog";

interface CompanyListPageProps {
  params: Promise<{ slug: string; page: string; lang?: string }>;
}

/** Pages 2..N of a company's medicine list; page 1 lives at the company URL. */
const getCompanyPage = cache(async (slug: string, segment: string) => {
  const page = parsePageSegment(segment);
  return page ? services.companies.getCompanyDetail(slug, page) : null;
});

/** Rendered on first request and cached. */
export async function generateStaticParams(): Promise<{ slug: string; page: string }[]> {
  return [];
}

export const dynamicParams = true;

export async function generateMetadata({ params }: CompanyListPageProps): Promise<Metadata> {
  const lang = await initLocale(params);
  const { slug, page } = await params;
  const detail = await getCompanyPage(slug, page);
  if (!detail) return { title: getT(lang)("company.notFound.heading") };
  return companyMetadata(detail, lang);
}

export default async function CompanyListPage({ params }: CompanyListPageProps) {
  const lang = await initLocale(params);
  const { slug, page } = await params;
  if (page === "1") permanentRedirect(localizePath(routes.company(slug), lang));
  const detail = await getCompanyPage(slug, page);
  if (!detail) notFound();
  return <CompanyView detail={detail} lang={lang} />;
}
