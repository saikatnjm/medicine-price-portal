import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { cache } from "react";
import { DosageFormView, dosageFormMetadata } from "@/components/company/dosage-form-view";
import { services } from "@/data";
import { localizePath } from "@/i18n/config";
import { getT, initLocale } from "@/i18n/server";
import { routes } from "@/lib/routes";
import { parsePageSegment } from "@/lib/routes-catalog";

interface DosageFormListPageProps {
  params: Promise<{ form: string; page: string; lang?: string }>;
}

/** Pages 2..N of a dosage form's brand list; page 1 lives at the dosage-form URL. */
const getFormPage = cache(async (form: string, segment: string) => {
  const page = parsePageSegment(segment);
  return page ? services.companies.getDosageFormDetail(form, page) : null;
});

/** Rendered on first request and cached. */
export async function generateStaticParams(): Promise<{ form: string; page: string }[]> {
  return [];
}

export const dynamicParams = true;

export async function generateMetadata({ params }: DosageFormListPageProps): Promise<Metadata> {
  const lang = await initLocale(params);
  const { form, page } = await params;
  const detail = await getFormPage(form, page);
  if (!detail) return { title: getT(lang)("company.notFound.heading") };
  return dosageFormMetadata(detail, lang);
}

export default async function DosageFormListPage({ params }: DosageFormListPageProps) {
  const lang = await initLocale(params);
  const { form, page } = await params;
  if (page === "1") permanentRedirect(localizePath(routes.dosageForm(form), lang));
  const detail = await getFormPage(form, page);
  if (!detail) notFound();
  return <DosageFormView detail={detail} lang={lang} />;
}
