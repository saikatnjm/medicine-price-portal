import type { Metadata } from "next";
import { DoctorListPage } from "@/components/doctor/doctor-list-page";
import { doctorsListDescription, doctorsListHeading } from "@/components/doctor/doctor-text";
import { services } from "@/data";
import { getT, initLocale } from "@/i18n/server";
import { routes } from "@/lib/routes";
import { type SearchParamValue } from "@/lib/search-params";
import { pageMetadata } from "@/lib/seo";

interface DoctorsPageProps {
  params?: Promise<{ lang?: string }>;
  searchParams: Promise<Record<string, SearchParamValue>>;
}

export async function generateMetadata({ params, searchParams }: DoctorsPageProps): Promise<Metadata> {
  const lang = await initLocale(params);
  const [query, summary] = await Promise.all([searchParams, services.directory.getSummary()]);
  const hasParams = Object.keys(query).length > 0;
  return pageMetadata({
    title: doctorsListHeading(null, null, lang),
    description: doctorsListDescription(null, null, summary.doctorCount, lang),
    path: routes.doctors(),
    indexable: summary.doctorCount > 0 && !hasParams,
    lang,
  });
}

export default async function DoctorsPage({ params, searchParams }: DoctorsPageProps) {
  const lang = await initLocale(params);
  const t = getT(lang);
  const [query, summary] = await Promise.all([searchParams, services.directory.getSummary()]);
  return (
    <DoctorListPage
      heading={doctorsListHeading(null, null, lang)}
      intro={doctorsListDescription(null, null, summary.doctorCount, lang)}
      breadcrumbs={[{ name: t("doctor.crumb.home"), href: routes.home() }, { name: t("doctor.crumb.doctors") }]}
      basePath={routes.doctors()}
      searchParams={query}
    />
  );
}
