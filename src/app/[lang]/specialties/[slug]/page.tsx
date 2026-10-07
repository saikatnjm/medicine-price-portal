import type { Metadata } from "next";
import Link from "@/i18n/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { JsonLd } from "@/components/common/json-ld";
import { SectionHeading } from "@/components/common/section-heading";
import { DoctorsEmptyNotice } from "@/components/doctor/doctors-empty-notice";
import { buildHref } from "@/components/directory/pagination";
import { DoctorCard, FacilityCard, ResultList } from "@/components/directory/result-cards";
import { InformationNotice } from "@/components/specialty/information-notice";
import {
  practitionerPlural,
  practitionerPluralLower,
  specialtyCounts,
  specialtyDescription,
  specialtyJsonLd,
  specialtyTitle,
} from "@/components/specialty/specialty-text";
import { Container } from "@/components/ui/container";
import { services } from "@/data";
import { DEFAULT_LOCALE } from "@/i18n/config";
import { getT, initLocale } from "@/i18n/server";
import { routes } from "@/lib/routes";
import { breadcrumbJsonLd, pageMetadata, type BreadcrumbItem } from "@/lib/seo";

interface SpecialtyPageProps {
  params: Promise<{ slug: string; lang?: string }>;
}

const getSpecialty = cache((slug: string) => services.specialties.getSpecialtyDetail(slug));

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const specialties = await services.specialties.listSpecialties();
  return specialties.map(({ specialty }) => ({ slug: specialty.slug }));
}

export async function generateMetadata({ params }: SpecialtyPageProps): Promise<Metadata> {
  const lang = await initLocale(params);
  const detail = await getSpecialty((await params).slug);
  if (!detail) return { title: getT(lang)("specialty.notFound.title") };
  return pageMetadata({
    title: specialtyTitle(detail.specialty, lang),
    description: specialtyDescription(detail, lang),
    path: routes.specialty(detail.specialty.slug),
    lang,
  });
}

export default async function SpecialtyPage({ params }: SpecialtyPageProps) {
  const lang = await initLocale(params);
  const t = getT(lang);
  const detail = await getSpecialty((await params).slug);
  if (!detail) notFound();

  const { specialty, facilities, doctors, topLocations, related } = detail;
  const path = routes.specialty(specialty.slug);
  const breadcrumbs: BreadcrumbItem[] = [
    { name: t("specialty.crumb.home"), href: routes.home() },
    { name: t("specialty.crumb.specialties"), href: routes.specialties() },
    { name: specialty.name },
  ];

  const combinations = await services.directory.listCombinations();
  const indexableHospitals = new Set(
    combinations.filter((c) => c.type === "hospitals" && c.specialtySlug === specialty.slug).map((c) => c.locationSlug),
  );
  const seeAllFacilities = buildHref(routes.hospitals(), { specialty: specialty.slug });

  return (
    <Container className="py-8 sm:py-10">
      <JsonLd data={[specialtyJsonLd(detail, lang), breadcrumbJsonLd(breadcrumbs, path, lang)]} />
      <Breadcrumbs items={breadcrumbs} />
      <div className="mt-4 space-y-10">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{specialty.name}</h1>
          <p className="max-w-3xl text-slate-700">{specialty.description}</p>
          <p className="text-slate-700">
            <span className="font-medium">{t("specialty.page.practitioner")}</span> {specialty.practitionerTitle}
            {lang === DEFAULT_LOCALE && <> ({practitionerPluralLower(specialty.practitionerTitle, lang)})</>}
          </p>
          <p className="text-sm text-slate-600">
            {t("specialty.counts.listedIn", { counts: specialtyCounts(detail, t) })}
          </p>
        </header>

        <section aria-labelledby="specialty-facilities">
          <SectionHeading id="specialty-facilities" description={t("specialty.page.facilitiesDesc")}>
            {t("specialty.page.facilitiesHeading", { name: specialty.name })}
          </SectionHeading>
          {facilities.length > 0 ? (
            <>
              <ResultList label={t("specialty.page.facilitiesLabel", { name: specialty.name })}>
                {facilities.map((item) => (
                  <FacilityCard key={item.facility.id} item={item} />
                ))}
              </ResultList>
              <p className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
                <Link href={seeAllFacilities} className="font-medium text-brand-800 underline">
                  {t("specialty.page.seeAllFacilities", { n: detail.facilityCount })}
                </Link>
                <span className="text-sm text-slate-600">
                  {t("specialty.page.mapNote")}
                </span>
              </p>
            </>
          ) : (
            <p className="text-slate-700">
              {t("specialty.page.noFacilities")}{" "}
              <Link href={routes.hospitals()} className="font-medium text-brand-800 underline">
                {t("specialty.page.browseAll")}
              </Link>
              {t("doctor.dot")}
            </p>
          )}
        </section>

        <section aria-labelledby="specialty-doctors">
          <SectionHeading id="specialty-doctors">{practitionerPlural(specialty.practitionerTitle, lang)}</SectionHeading>
          {doctors.length > 0 ? (
            <>
              <ResultList label={practitionerPlural(specialty.practitionerTitle, lang)}>
                {doctors.map((item) => (
                  <DoctorCard key={item.doctor.id} item={item} />
                ))}
              </ResultList>
              <p className="mt-4">
                <Link
                  href={buildHref(routes.doctors(), { specialty: specialty.slug })}
                  className="font-medium text-brand-800 underline"
                >
                  {t("specialty.page.seeAllDoctors", { n: detail.doctorCount })}
                </Link>
              </p>
            </>
          ) : (
            <DoctorsEmptyNotice />
          )}
        </section>

        {topLocations.length > 0 && (
          <section aria-labelledby="specialty-locations">
            <SectionHeading id="specialty-locations" description={t("specialty.page.whereDesc")}>
              {t("specialty.page.whereHeading", { name: specialty.name })}
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
                  <span className="text-sm text-slate-600">{t("specialty.page.listed", { n: count })}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {related.length > 0 && (
          <section aria-labelledby="related-specialties">
            <SectionHeading id="related-specialties">{t("specialty.page.related")}</SectionHeading>
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
