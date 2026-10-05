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
  params: Promise<{ location: string; specialty: string }>;
  searchParams: Promise<Record<string, SearchParamValue>>;
}

const getLocation = cache((slug: string) => services.locations.getLocationDetail(slug));
const getSpecialty = cache((slug: string) => services.specialties.getSpecialtyDetail(slug));
const countDoctors = cache(async (location: string, specialty: string) =>
  (await services.doctors.listDoctors({ location, specialty, pageSize: 1 })).results.total,
);

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { location: locationSlug, specialty: specialtySlug } = await params;
  const [location, specialty] = await Promise.all([getLocation(locationSlug), getSpecialty(specialtySlug)]);
  if (!location || !specialty) return { title: "Doctors not found" };
  const place = placeName(location.location, location.ancestors);
  const total = await countDoctors(locationSlug, specialtySlug);
  const indexable =
    Object.keys(await searchParams).length === 0 &&
    (await services.directory.isIndexableCombination("doctors", locationSlug, specialtySlug));
  return pageMetadata({
    title: doctorsListHeading(specialty.specialty, place),
    description: doctorsListDescription(specialty.specialty, place, total),
    path: routes.doctors(locationSlug, specialtySlug),
    indexable,
  });
}

export default async function DoctorsInLocationSpecialtyPage({ params, searchParams }: Props) {
  const { location: locationSlug, specialty: specialtySlug } = await params;
  const [location, specialty] = await Promise.all([getLocation(locationSlug), getSpecialty(specialtySlug)]);
  if (!location || !specialty) notFound();
  const place = placeName(location.location, location.ancestors);
  const total = await countDoctors(locationSlug, specialtySlug);
  const breadcrumbs: BreadcrumbItem[] = [
    { name: "Home", href: routes.home() },
    { name: "Doctors", href: routes.doctors() },
    { name: place, href: routes.doctors(locationSlug) },
    { name: specialty.specialty.name },
  ];
  return (
    <DoctorListPage
      heading={doctorsListHeading(specialty.specialty, place)}
      intro={doctorsListDescription(specialty.specialty, place, total)}
      breadcrumbs={breadcrumbs}
      basePath={routes.doctors(locationSlug, specialtySlug)}
      fixedLocation={locationSlug}
      fixedSpecialty={specialtySlug}
      searchParams={await searchParams}
    />
  );
}
