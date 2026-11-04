import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { CompanyView, companyMetadata } from "@/components/company/company-view";
import { services } from "@/data";
import { getT, initLocale } from "@/i18n/server";

interface CompanyPageProps {
  params: Promise<{ slug: string; lang?: string }>;
}

const getCompany = cache((slug: string) => services.companies.getCompanyDetail(slug, 1));

/** Only the largest companies are prerendered; the rest render on first request and are cached. */
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return (await services.companies.listRanked()).slice(0, 30).map(({ manufacturer }) => ({ slug: manufacturer.slug }));
}

export const dynamicParams = true;

export async function generateMetadata({ params }: CompanyPageProps): Promise<Metadata> {
  const lang = await initLocale(params);
  const detail = await getCompany((await params).slug);
  if (!detail) return { title: getT(lang)("company.notFound.heading") };
  return companyMetadata(detail, lang);
}

export default async function CompanyPage({ params }: CompanyPageProps) {
  const lang = await initLocale(params);
  const detail = await getCompany((await params).slug);
  if (!detail) notFound();
  return <CompanyView detail={detail} lang={lang} />;
}
