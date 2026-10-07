import type { Metadata } from "next";
import Link from "@/i18n/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { JsonLd } from "@/components/common/json-ld";
import { SectionHeading } from "@/components/common/section-heading";
import { DoctorsEmptyNotice } from "@/components/doctor/doctors-empty-notice";
import { buildHref } from "@/components/directory/pagination";
import { CompactList, DoctorRow, FacilityRow } from "@/components/facility/compact-rows";
import { InformationNotice } from "@/components/specialty/information-notice";
import {
  practitionerPlural,
  practitionerPluralLower,
  specialtyCounts,
  specialtyDescription,
  specialtyJsonLd,
  specialtyTitle,
} from "@/components/specialty/specialty-text";
import { CHIP_CLASS, INDEX_CHIP_CLASS } from "@/components/ui/chip";
import { Container } from "@/components/ui/container";
import { EntityTile, HeroCard } from "@/components/ui/hero-card";
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
      <div className="mt-4 space-y-8">
        <HeroCard>
          <header className="flex gap-4">
            <EntityTile kind="specialty" size="lg" />
            <div className="min-w-0 space-y-2">
              <h1>{specialty.name}</h1>
              <p className="max-w-3xl text-slate-700">{specialty.description}</p>
              <p className="text-slate-700">
                <span className="font-medium">{t("specialty.page.practitioner")}</span> {specialty.practitionerTitle}
                {lang === DEFAULT_LOCALE && <> ({practitionerPluralLower(specialty.practitionerTitle, lang)})</>}
              </p>
              <p className="text-sm text-slate-600">
                {t("specialty.counts.listedIn", { counts: specialtyCounts(detail, t) })}
              </p>
            </div>
          </header>
        </HeroCard>

        <section aria-labelledby="specialty-facilities">
          <SectionHeading id="specialty-facilities" description={t("specialty.page.facilitiesDesc")}>
            {t("specialty.page.facilitiesHeading", { name: specialty.name })}
          </SectionHeading>
          {facilities.length > 0 ? (
            <>
              <CompactList label={t("specialty.page.facilitiesLabel", { name: specialty.name })}>
                {facilities.map((item) => (
                  <FacilityRow key={item.facility.id} item={item} />
                ))}
              </CompactList>
              <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                <Link href={seeAllFacilities} className={INDEX_CHIP_CLASS}>
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
              <CompactList label={practitionerPlural(specialty.practitionerTitle, lang)}>
                {doctors.map((item) => (
                  <DoctorRow key={item.doctor.id} item={item} />
                ))}
              </CompactList>
              <p className="mt-3">
                <Link
                  href={buildHref(routes.doctors(), { specialty: specialty.slug })}
                  className={INDEX_CHIP_CLASS}
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
            <ul className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
              {topLocations.map(({ location, count }) => (
                <li key={location.id} className="flex flex-wrap items-center gap-x-2">
                  <Link
                    href={
                      indexableHospitals.has(location.slug)
                        ? routes.hospitals(location.slug, specialty.slug)
                        : routes.location(location.slug)
                    }
                    className={CHIP_CLASS}
                  >
                    {location.name}
                  </Link>
                  <span className="text-sm text-slate-600">{t("specialty.page.listed", { n: count })}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {related.length > 0 && (
          <section aria-labelledby="related-specialties">
            <SectionHeading id="related-specialties">{t("specialty.page.related")}</SectionHeading>
            <ul className="flex flex-wrap gap-2">
              {related.map((r) => (
                <li key={r.id}>
                  <Link href={routes.specialty(r.slug)} className={CHIP_CLASS}>
                    {r.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <InformationNotice />
      </div>
    </Container>
  );
}
