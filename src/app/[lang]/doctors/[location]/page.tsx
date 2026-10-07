import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { DoctorListPage } from "@/components/doctor/doctor-list-page";
import { doctorsListDescription, doctorsListHeading } from "@/components/doctor/doctor-text";
import { placeName } from "@/components/location/location-text";
import { services } from "@/data";
import { getT, initLocale } from "@/i18n/server";
import { routes } from "@/lib/routes";
import { type SearchParamValue } from "@/lib/search-params";
import { pageMetadata, type BreadcrumbItem } from "@/lib/seo";

interface Props {
  params: Promise<{ location: string; lang?: string }>;
  searchParams: Promise<Record<string, SearchParamValue>>;
}

const getLocation = cache((slug: string) => services.locations.getLocationDetail(slug));

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const lang = await initLocale(params);
  const { location: slug } = await params;
  const detail = await getLocation(slug);
  if (!detail) return { title: getT(lang)("location.notFound.title") };
  const place = placeName(detail.location, detail.ancestors, lang);
  const indexable =
    Object.keys(await searchParams).length === 0 && (await services.directory.isIndexableCombination("doctors", slug));
  return pageMetadata({
    title: doctorsListHeading(null, place, lang),
    description: doctorsListDescription(null, place, detail.doctorCount, lang),
    path: routes.doctors(slug),
    indexable,
    lang,
  });
}

export default async function DoctorsInLocationPage({ params, searchParams }: Props) {
  const lang = await initLocale(params);
  const t = getT(lang);
  const { location: slug } = await params;
  const detail = await getLocation(slug);
  if (!detail) notFound();
  const place = placeName(detail.location, detail.ancestors, lang);
  const breadcrumbs: BreadcrumbItem[] = [
    { name: t("doctor.crumb.home"), href: routes.home() },
    { name: t("doctor.crumb.doctors"), href: routes.doctors() },
    { name: place },
  ];
  return (
    <DoctorListPage
      heading={doctorsListHeading(null, place, lang)}
      intro={doctorsListDescription(null, place, detail.doctorCount, lang)}
      breadcrumbs={breadcrumbs}
      basePath={routes.doctors(slug)}
      fixedLocation={slug}
      searchParams={await searchParams}
    />
  );
}
