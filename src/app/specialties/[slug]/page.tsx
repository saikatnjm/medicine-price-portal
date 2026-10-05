import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { JsonLd } from "@/components/common/json-ld";
import { SectionHeading } from "@/components/common/section-heading";
import { DoctorsEmptyNotice } from "@/components/doctor/doctors-empty-notice";
import { buildHref } from "@/components/directory/pagination";
import { DoctorCard, FacilityCard, ResultList } from "@/components/directory/result-cards";
import { InformationNotice } from "@/components/specialty/information-notice";
import { specialtyCounts } from "@/components/specialty/specialty-list";
import { Container } from "@/components/ui/container";
import { services } from "@/data";
import { routes } from "@/lib/routes";
import { breadcrumbJsonLd, pageMetadata, type BreadcrumbItem } from "@/lib/seo";
import { pluralTitle, specialtyDescription, specialtyJsonLd, specialtyTitle } from "@/lib/seo-directory";

interface SpecialtyPageProps {
  params: Promise<{ slug: string }>;
}

const getSpecialty = cache((slug: string) => services.specialties.getSpecialtyDetail(slug));

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const specialties = await services.specialties.listSpecialties();
  return specialties.map(({ specialty }) => ({ slug: specialty.slug }));
}

export async function generateMetadata({ params }: SpecialtyPageProps): Promise<Metadata> {
  const detail = await getSpecialty((await params).slug);
  if (!detail) return { title: "Specialty not found" };
  return pageMetadata({
    title: specialtyTitle(detail.specialty),
    description: specialtyDescription(detail),
    path: routes.specialty(detail.specialty.slug),
  });
}

export default async function SpecialtyPage({ params }: SpecialtyPageProps) {
  const detail = await getSpecialty((await params).slug);
  if (!detail) notFound();

  const { specialty, facilities, doctors, topLocations, related } = detail;
  const path = routes.specialty(specialty.slug);
  const breadcrumbs: BreadcrumbItem[] = [
    { name: "Home", href: routes.home() },
    { name: "Specialties", href: routes.specialties() },
    { name: specialty.name },
  ];

  const combinations = await services.directory.listCombinations();
  const indexableHospitals = new Set(
    combinations.filter((c) => c.type === "hospitals" && c.specialtySlug === specialty.slug).map((c) => c.locationSlug),
  );
  const seeAllFacilities = buildHref(routes.hospitals(), { specialty: specialty.slug });

  return (
    <Container className="py-8 sm:py-10">
      <JsonLd data={[specialtyJsonLd(detail), breadcrumbJsonLd(breadcrumbs, path)]} />
      <Breadcrumbs items={breadcrumbs} />
      <div className="mt-4 space-y-10">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{specialty.name}</h1>
          <p className="max-w-3xl text-slate-700">{specialty.description}</p>
          <p className="text-slate-700">
            <span className="font-medium">Practitioner:</span> {specialty.practitionerTitle} (
            {pluralTitle(specialty.practitionerTitle).toLowerCase()})
          </p>
          <p className="text-sm text-slate-600">{specialtyCounts(detail)} listed in our directory.</p>
        </header>

        <section aria-labelledby="specialty-facilities">
          <SectionHeading id="specialty-facilities" description="Facilities that list this specialty.">
            Hospitals &amp; clinics offering {specialty.name}
          </SectionHeading>
          {facilities.length > 0 ? (
            <>
              <ResultList label={`Facilities offering ${specialty.name}`}>
                {facilities.map((item) => (
                  <FacilityCard key={item.facility.id} item={item} />
                ))}
              </ResultList>
              <p className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
                <Link href={seeAllFacilities} className="font-medium text-brand-800 underline">
                  See all {detail.facilityCount} facilities
                </Link>
                <span className="text-sm text-slate-600">
                  Mapping data © OpenStreetMap contributors. Community-mapped and not verified; call ahead.
                </span>
              </p>
            </>
          ) : (
            <p className="text-slate-700">
              No facilities with this specialty are listed yet.{" "}
              <Link href={routes.hospitals()} className="font-medium text-brand-800 underline">
                Browse all hospitals &amp; clinics
              </Link>
              .
            </p>
          )}
        </section>

        <section aria-labelledby="specialty-doctors">
          <SectionHeading id="specialty-doctors">{pluralTitle(specialty.practitionerTitle)}</SectionHeading>
          {doctors.length > 0 ? (
            <>
              <ResultList label={pluralTitle(specialty.practitionerTitle)}>
                {doctors.map((item) => (
                  <DoctorCard key={item.doctor.id} item={item} />
                ))}
              </ResultList>
              <p className="mt-4">
                <Link
                  href={buildHref(routes.doctors(), { specialty: specialty.slug })}
                  className="font-medium text-brand-800 underline"
                >
                  See all {detail.doctorCount} doctors
                </Link>
              </p>
            </>
          ) : (
            <DoctorsEmptyNotice />
          )}
        </section>

        {topLocations.length > 0 && (
          <section aria-labelledby="specialty-locations">
            <SectionHeading id="specialty-locations" description="Districts with the most listings for this specialty.">
              Where to find {specialty.name}
            </SectionHeading>
            <ul className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
              {topLocations.map(({ location, count }) => (
                <li key={location.id}>
                  <Link
                    href={
                      indexableHospitals.has(location.slug)
                        ? routes.hospitals(location.slug, specialty.slug)
                        : routes.location(location.slug)
                    }
                    className="font-medium text-brand-800 underline"
                  >
                    {location.name}
                  </Link>{" "}
                  <span className="text-sm text-slate-600">({count} listed)</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {related.length > 0 && (
          <section aria-labelledby="related-specialties">
            <SectionHeading id="related-specialties">Related specialties</SectionHeading>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {related.map((r) => (
                <li key={r.id}>
                  <Link href={routes.specialty(r.slug)} className="font-medium text-brand-800 underline">
                    {r.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="border-t border-slate-200 pt-6">
          <InformationNotice />
        </div>
      </div>
    </Container>
  );
}
