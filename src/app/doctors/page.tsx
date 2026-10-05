import type { Metadata } from "next";
import { DoctorListPage } from "@/components/doctor/doctor-list-page";
import { services } from "@/data";
import { routes } from "@/lib/routes";
import { type SearchParamValue } from "@/lib/search-params";
import { pageMetadata } from "@/lib/seo";
import { doctorsListDescription, doctorsListHeading } from "@/lib/seo-directory";

interface DoctorsPageProps {
  searchParams: Promise<Record<string, SearchParamValue>>;
}

export async function generateMetadata({ searchParams }: DoctorsPageProps): Promise<Metadata> {
  const [params, summary] = await Promise.all([searchParams, services.directory.getSummary()]);
  const hasParams = Object.keys(params).length > 0;
  return pageMetadata({
    title: doctorsListHeading(null, null),
    description: doctorsListDescription(null, null, summary.doctorCount),
    path: routes.doctors(),
    indexable: summary.doctorCount > 0 && !hasParams,
  });
}

export default async function DoctorsPage({ searchParams }: DoctorsPageProps) {
  const [params, summary] = await Promise.all([searchParams, services.directory.getSummary()]);
  return (
    <DoctorListPage
      heading={doctorsListHeading(null, null)}
      intro={doctorsListDescription(null, null, summary.doctorCount)}
      breadcrumbs={[{ name: "Home", href: routes.home() }, { name: "Doctors" }]}
      basePath={routes.doctors()}
      searchParams={params}
    />
  );
}
