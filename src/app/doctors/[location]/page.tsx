import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { DoctorListPage } from "@/components/doctor/doctor-list-page";
import { services } from "@/data";
import { routes } from "@/lib/routes";
import { type SearchParamValue } from "@/lib/search-params";
import { pageMetadata, type BreadcrumbItem } from "@/lib/seo";
import { doctorsListDescription, doctorsListHeading, placeName } from "@/lib/seo-directory";

interface Props {
  params: Promise<{ location: string }>;
  searchParams: Promise<Record<string, SearchParamValue>>;
}

const getLocation = cache((slug: string) => services.locations.getLocationDetail(slug));

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { location: slug } = await params;
  const detail = await getLocation(slug);
  if (!detail) return { title: "Location not found" };
  const place = placeName(detail.location, detail.ancestors);
  const indexable =
    Object.keys(await searchParams).length === 0 && (await services.directory.isIndexableCombination("doctors", slug));
  return pageMetadata({
    title: doctorsListHeading(null, place),
    description: doctorsListDescription(null, place, detail.doctorCount),
    path: routes.doctors(slug),
    indexable,
  });
}

export default async function DoctorsInLocationPage({ params, searchParams }: Props) {
  const { location: slug } = await params;
  const detail = await getLocation(slug);
  if (!detail) notFound();
  const place = placeName(detail.location, detail.ancestors);
  const breadcrumbs: BreadcrumbItem[] = [
    { name: "Home", href: routes.home() },
    { name: "Doctors", href: routes.doctors() },
    { name: place },
  ];
  return (
    <DoctorListPage
      heading={doctorsListHeading(null, place)}
      intro={doctorsListDescription(null, place, detail.doctorCount)}
      breadcrumbs={breadcrumbs}
      basePath={routes.doctors(slug)}
      fixedLocation={slug}
      searchParams={await searchParams}
    />
  );
}
