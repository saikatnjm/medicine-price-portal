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
  params: Promise<{ location: string; specialty: string; lang?: string }>;
  searchParams: Promise<Record<string, SearchParamValue>>;
}

const getLocation = cache((slug: string) => services.locations.getLocationDetail(slug));
const getSpecialty = cache((slug: string) => services.specialties.getSpecialtyDetail(slug));
const countDoctors = cache(async (location: string, specialty: string) =>
  (await services.doctors.listDoctors({ location, specialty, pageSize: 1 })).results.total,
);

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const lang = await initLocale(params);
  const { location: locationSlug, specialty: specialtySlug } = await params;
  const [location, specialty] = await Promise.all([getLocation(locationSlug), getSpecialty(specialtySlug)]);
  if (!location || !specialty) return { title: getT(lang)("doctor.notFound.list") };
  const place = placeName(location.location, location.ancestors, lang);
  const total = await countDoctors(locationSlug, specialtySlug);
  const indexable =
    Object.keys(await searchParams).length === 0 &&
    (await services.directory.isIndexableCombination("doctors", locationSlug, specialtySlug));
  return pageMetadata({
    title: doctorsListHeading(specialty.specialty, place, lang),
    description: doctorsListDescription(specialty.specialty, place, total, lang),
    path: routes.doctors(locationSlug, specialtySlug),
    indexable,
    lang,
  });
}

export default async function DoctorsInLocationSpecialtyPage({ params, searchParams }: Props) {
  const lang = await initLocale(params);
  const t = getT(lang);
  const { location: locationSlug, specialty: specialtySlug } = await params;
  const [location, specialty] = await Promise.all([getLocation(locationSlug), getSpecialty(specialtySlug)]);
  if (!location || !specialty) notFound();
  const place = placeName(location.location, location.ancestors, lang);
  const total = await countDoctors(locationSlug, specialtySlug);
  const breadcrumbs: BreadcrumbItem[] = [
    { name: t("doctor.crumb.home"), href: routes.home() },
    { name: t("doctor.crumb.doctors"), href: routes.doctors() },
    { name: place, href: routes.doctors(locationSlug) },
    { name: specialty.specialty.name },
  ];
  return (
    <DoctorListPage
      heading={doctorsListHeading(specialty.specialty, place, lang)}
      intro={doctorsListDescription(specialty.specialty, place, total, lang)}
      breadcrumbs={breadcrumbs}
      basePath={routes.doctors(locationSlug, specialtySlug)}
      fixedLocation={locationSlug}
      fixedSpecialty={specialtySlug}
      searchParams={await searchParams}
    />
  );
}
