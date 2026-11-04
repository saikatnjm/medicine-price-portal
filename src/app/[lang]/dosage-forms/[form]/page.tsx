import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { DosageFormView, dosageFormMetadata } from "@/components/company/dosage-form-view";
import { services } from "@/data";
import { getT, initLocale } from "@/i18n/server";

interface DosageFormPageProps {
  params: Promise<{ form: string; lang?: string }>;
}

const getForm = cache((form: string) => services.companies.getDosageFormDetail(form, 1));

export async function generateStaticParams(): Promise<{ form: string }[]> {
  return (await services.companies.listDosageForms()).map(({ form }) => ({ form }));
}

export const dynamicParams = true;

export async function generateMetadata({ params }: DosageFormPageProps): Promise<Metadata> {
  const lang = await initLocale(params);
  const detail = await getForm((await params).form);
  if (!detail) return { title: getT(lang)("company.notFound.heading") };
  return dosageFormMetadata(detail, lang);
}

export default async function DosageFormPage({ params }: DosageFormPageProps) {
  const lang = await initLocale(params);
  const detail = await getForm((await params).form);
  if (!detail) notFound();
  return <DosageFormView detail={detail} lang={lang} />;
}
