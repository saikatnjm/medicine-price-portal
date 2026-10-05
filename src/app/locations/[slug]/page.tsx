import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { JsonLd } from "@/components/common/json-ld";
import { SectionHeading } from "@/components/common/section-heading";
import { DoctorsEmptyNotice } from "@/components/doctor/doctors-empty-notice";
import { DoctorCard, PharmacyCard, ResultList } from "@/components/directory/result-cards";
import { FacilitySection, SeeAll } from "@/components/location/location-sections";
import { SubLocations } from "@/components/location/sub-locations";
import { InformationNotice } from "@/components/specialty/information-notice";
import { Container } from "@/components/ui/container";
import { services } from "@/data";
import { FACILITY_KIND_LABEL, type FacilityKind } from "@/domain/healthcare";
import { routes } from "@/lib/routes";
import { crumbName } from "@/lib/seo-facilities";
import { breadcrumbJsonLd, pageMetadata, type BreadcrumbItem } from "@/lib/seo";
import {
  locationDescription,
  locationHeading,
  locationSummary,
  locationTitle,
  pluralTitle,
} from "@/lib/seo-directory";

interface LocationPageProps {
  params: Promise<{ slug: string }>;
}

const getLocation = cache((slug: string) => services.locations.getLocationDetail(slug));

/** Location pages are rendered on demand (hundreds of areas). */
export const dynamicParams = true;

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return [];
}

export async function generateMetadata({ params }: LocationPageProps): Promise<Metadata> {
  const detail = await getLocation((await params).slug);
  if (!detail) return { title: "Location not found" };
  return pageMetadata({
    title: locationTitle(detail),
    description: locationDescription(detail),
    path: routes.location(detail.location.slug),
    indexable: detail.indexable,
  });
}

export default async function LocationPage({ params }: LocationPageProps) {
  const detail = await getLocation((await params).slug);
  if (!detail) notFound();

  const { location, ancestors, children, hospitals, clinics, diagnosticCentres, pharmacies, doctors, specialties, kindCounts } =
    detail;
  const slug = location.slug;
  const path = routes.location(slug);
  const breadcrumbs: BreadcrumbItem[] = [
    { name: "Home", href: routes.home() },
    { name: "Locations", href: routes.locations() },
    ...ancestors.map((a) => ({ name: crumbName(a), href: routes.location(a.slug) })),
    { name: crumbName(location) },
  ];

  const combinations = await services.directory.listCombinations();
  const indexableSpecialtyPages = new Set(
    combinations
      .filter((c) => c.type === "hospitals" && c.locationSlug === slug && c.specialtySlug)
      .map((c) => c.specialtySlug),
  );
  const listsOsm = kindCounts.length > 0 || pharmacies.length > 0;
  const countOf = (kind: FacilityKind) => kindCounts.find((k) => k.kind === kind)?.count ?? 0;
  const kindHref = (kind: FacilityKind) => `${routes.hospitals(slug)}?kind=${kind}`;
  const hasRecords = kindCounts.length > 0 || detail.pharmacyCount > 0;

  return (
    <Container className="py-8 sm:py-10">
      <JsonLd data={breadcrumbJsonLd(breadcrumbs, path)} />
      <Breadcrumbs items={breadcrumbs} />
      <div className="mt-4 space-y-10">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{locationHeading(detail)}</h1>
          <p className="max-w-3xl text-slate-700">{locationSummary(detail)}</p>
        </header>

        {kindCounts.length > 0 && (
          <section aria-labelledby="location-summary">
            <SectionHeading id="location-summary">Healthcare facilities</SectionHeading>
            <ul className="grid gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
              {kindCounts.map(({ kind, count }) => (
                <li key={kind}>
                  <Link href={kindHref(kind)} className="font-medium text-brand-800 underline">
                    {FACILITY_KIND_LABEL[kind]}
                  </Link>
                  : {count}
                </li>
              ))}
              {detail.pharmacyCount > 0 && (
                <li>
                  <Link href={routes.pharmacies(slug)} className="font-medium text-brand-800 underline">
                    Pharmacies
                  </Link>
                  : {detail.pharmacyCount}
                </li>
              )}
            </ul>
          </section>
        )}

        {!hasRecords && (
          <p className="text-slate-700">No hospitals, clinics or pharmacies are listed for this location yet.</p>
        )}

        {hospitals.length > 0 && (
          <FacilitySection id="location-hospitals" title="Hospitals" items={hospitals}>
            <SeeAll href={kindHref("hospital")}>See all {countOf("hospital")} hospitals</SeeAll>
          </FacilitySection>
        )}

        {clinics.length > 0 && (
          <FacilitySection id="location-clinics" title="Clinics & health centres" items={clinics}>
            {countOf("clinic") > 0 && <SeeAll href={kindHref("clinic")}>See all {countOf("clinic")} clinics</SeeAll>}
            {countOf("health_centre") > 0 && (
              <SeeAll href={kindHref("health_centre")}>See all {countOf("health_centre")} health centres</SeeAll>
            )}
          </FacilitySection>
        )}

        {diagnosticCentres.length > 0 && (
          <FacilitySection id="location-diagnostic" title="Diagnostic centres" items={diagnosticCentres}>
            <SeeAll href={kindHref("diagnostic_centre")}>
              See all {countOf("diagnostic_centre")} diagnostic centres
            </SeeAll>
          </FacilitySection>
        )}

        {pharmacies.length > 0 && (
          <section aria-labelledby="location-pharmacies">
            <SectionHeading id="location-pharmacies">Pharmacies</SectionHeading>
            <ResultList label="Pharmacies">
              {pharmacies.map((item) => (
                <PharmacyCard key={item.pharmacy.id} item={item} />
              ))}
            </ResultList>
            <p className="mt-4">
              <SeeAll href={routes.pharmacies(slug)}>See all {detail.pharmacyCount} pharmacies</SeeAll>
            </p>
          </section>
        )}

        <section aria-labelledby="location-doctors">
          <SectionHeading id="location-doctors">Doctors</SectionHeading>
          {doctors.length > 0 ? (
            <>
              <ResultList label="Doctors">
                {doctors.map((item) => (
                  <DoctorCard key={item.doctor.id} item={item} />
                ))}
              </ResultList>
              <p className="mt-4">
                <SeeAll href={routes.doctors(slug)}>See all {detail.doctorCount} doctors</SeeAll>
              </p>
            </>
          ) : (
            <DoctorsEmptyNotice context="for this location" />
          )}
        </section>

        {specialties.length > 0 && (
          <section aria-labelledby="location-specialties">
            <SectionHeading id="location-specialties" description="Specialties listed by facilities here.">
              Specialties available here
            </SectionHeading>
            <ul className="grid gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
              {specialties.map(({ specialty, facilityCount }) => (
                <li key={specialty.id}>
                  <Link
                    href={
                      indexableSpecialtyPages.has(specialty.slug)
                        ? routes.hospitals(slug, specialty.slug)
                        : routes.specialty(specialty.slug)
                    }
                    className="font-medium text-brand-800 underline"
                  >
                    {specialty.name}
                  </Link>{" "}
                  <span className="text-sm text-slate-600">
                    ({pluralTitle(specialty.practitionerTitle).toLowerCase()}
                    {facilityCount > 0 ? `, ${facilityCount} listed` : ""})
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {children.length > 0 && (
          <section aria-labelledby="location-children">
            <SectionHeading id="location-children">
              {location.level === "division" ? "Districts" : "Areas"} in {location.name}
            </SectionHeading>
            <SubLocations items={children} />
          </section>
        )}

        <div className="space-y-3 border-t border-slate-200 pt-6">
          {listsOsm && (
            <p className="text-sm text-slate-600">
              Hospital, clinic and pharmacy records are community-mapped data ©{" "}
              <a
                href="https://www.openstreetmap.org/copyright"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                OpenStreetMap contributors
              </a>
              . We have not verified them; call ahead before visiting.
            </p>
          )}
          <InformationNotice />
        </div>
      </div>
    </Container>
  );
}
