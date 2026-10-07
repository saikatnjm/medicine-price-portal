import type { Metadata } from "next";
import Link from "@/i18n/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { Faq } from "@/components/common/faq";
import { JsonLd } from "@/components/common/json-ld";
import { SectionHeading } from "@/components/common/section-heading";
import { DoctorsEmptyNotice } from "@/components/doctor/doctors-empty-notice";
import { CompactList, DoctorRow, PharmacyRow } from "@/components/facility/compact-rows";
import { FacilitySection, SeeAll } from "@/components/location/location-sections";
import {
  crumbName,
  locationDescription,
  locationHeading,
  locationSummary,
  locationTitle,
} from "@/components/location/location-text";
import { SubLocations } from "@/components/location/sub-locations";
import { InformationNotice } from "@/components/specialty/information-notice";
import { practitionerPluralLower } from "@/components/specialty/specialty-text";
import { CHIP_CLASS } from "@/components/ui/chip";
import { Container } from "@/components/ui/container";
import { EntityTile, HeroCard } from "@/components/ui/hero-card";
import { services } from "@/data";
import type { FacilityKind } from "@/domain/healthcare";
import { getT, initLocale } from "@/i18n/server";
import { routes } from "@/lib/routes";
import { breadcrumbJsonLd, pageMetadata, type BreadcrumbItem } from "@/lib/seo";

interface LocationPageProps {
  params: Promise<{ slug: string; lang?: string }>;
}

const KIND_LABEL_KEY = {
  hospital: "location.kind.hospital",
  clinic: "location.kind.clinic",
  diagnostic_centre: "location.kind.diagnostic_centre",
  dental_clinic: "location.kind.dental_clinic",
  doctors_practice: "location.kind.doctors_practice",
  health_centre: "location.kind.health_centre",
  blood_bank: "location.kind.blood_bank",
  other_facility: "location.kind.other_facility",
} as const satisfies Record<FacilityKind, string>;

const getLocation = cache((slug: string) => services.locations.getLocationDetail(slug));

/** Location pages are rendered on demand (hundreds of areas). */
export const dynamicParams = true;

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return [];
}

export async function generateMetadata({ params }: LocationPageProps): Promise<Metadata> {
  const lang = await initLocale(params);
  const detail = await getLocation((await params).slug);
  if (!detail) return { title: getT(lang)("location.notFound.title") };
  return pageMetadata({
    title: locationTitle(detail, lang),
    description: locationDescription(detail, lang),
    path: routes.location(detail.location.slug),
    indexable: detail.indexable,
    lang,
  });
}

export default async function LocationPage({ params }: LocationPageProps) {
  const lang = await initLocale(params);
  const t = getT(lang);
  const detail = await getLocation((await params).slug);
  if (!detail) notFound();

  const { location, ancestors, children, hospitals, clinics, diagnosticCentres, pharmacies, doctors, specialties, kindCounts } =
    detail;
  const slug = location.slug;
  const path = routes.location(slug);
  const breadcrumbs: BreadcrumbItem[] = [
    { name: t("location.crumb.home"), href: routes.home() },
    { name: t("location.crumb.locations"), href: routes.locations() },
    ...ancestors.map((a) => ({ name: crumbName(a, lang), href: routes.location(a.slug) })),
    { name: crumbName(location, lang) },
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
      <JsonLd data={breadcrumbJsonLd(breadcrumbs, path, lang)} />
      <Breadcrumbs items={breadcrumbs} />
      <div className="mt-4 space-y-8">
        <HeroCard>
          <header className="flex gap-4">
            <EntityTile kind="location" size="lg" />
            <div className="min-w-0 space-y-2">
              <h1>{locationHeading(detail, lang)}</h1>
              <p className="max-w-3xl text-slate-700">{locationSummary(detail, lang)}</p>
            </div>
          </header>
        </HeroCard>

        {kindCounts.length > 0 && (
          <section aria-labelledby="location-summary">
            <SectionHeading id="location-summary">{t("location.page.facilities")}</SectionHeading>
            <ul className="flex flex-wrap gap-2">
              {kindCounts.map(({ kind, count }) => (
                <li key={kind}>
                  <Link href={kindHref(kind)} className={CHIP_CLASS}>
                    {t(KIND_LABEL_KEY[kind])}
                    <span className="font-normal text-pine/70">{count}</span>
                  </Link>
                </li>
              ))}
              {detail.pharmacyCount > 0 && (
                <li>
                  <Link href={routes.pharmacies(slug)} className={CHIP_CLASS}>
                    {t("location.page.pharmacies")}
                    <span className="font-normal text-pine/70">{detail.pharmacyCount}</span>
                  </Link>
                </li>
              )}
            </ul>
          </section>
        )}

        {!hasRecords && (
          <p className="text-slate-700">{t("location.page.noRecords")}</p>
        )}

        {hospitals.length > 0 && (
          <FacilitySection id="location-hospitals" title={t("location.page.hospitals")} items={hospitals}>
            <SeeAll href={kindHref("hospital")}>
              {t("location.page.seeAllHospitals", { n: countOf("hospital") })}
            </SeeAll>
          </FacilitySection>
        )}

        {clinics.length > 0 && (
          <FacilitySection id="location-clinics" title={t("location.page.clinics")} items={clinics}>
            {countOf("clinic") > 0 && (
              <SeeAll href={kindHref("clinic")}>{t("location.page.seeAllClinics", { n: countOf("clinic") })}</SeeAll>
            )}
            {countOf("health_centre") > 0 && (
              <SeeAll href={kindHref("health_centre")}>
                {t("location.page.seeAllHealthCentres", { n: countOf("health_centre") })}
              </SeeAll>
            )}
          </FacilitySection>
        )}

        {diagnosticCentres.length > 0 && (
          <FacilitySection id="location-diagnostic" title={t("location.page.diagnostic")} items={diagnosticCentres}>
            <SeeAll href={kindHref("diagnostic_centre")}>
              {t("location.page.seeAllDiagnostic", { n: countOf("diagnostic_centre") })}
            </SeeAll>
          </FacilitySection>
        )}

        {pharmacies.length > 0 && (
          <section aria-labelledby="location-pharmacies">
            <SectionHeading id="location-pharmacies">{t("location.page.pharmacies")}</SectionHeading>
            <CompactList label={t("location.page.pharmacies")}>
              {pharmacies.map((item) => (
                <PharmacyRow key={item.pharmacy.id} item={item} />
              ))}
            </CompactList>
            <p className="mt-3">
              <SeeAll href={routes.pharmacies(slug)}>
                {t("location.page.seeAllPharmacies", { n: detail.pharmacyCount })}
              </SeeAll>
            </p>
          </section>
        )}

        <section aria-labelledby="location-doctors">
          <SectionHeading id="location-doctors">{t("location.page.doctors")}</SectionHeading>
          {doctors.length > 0 ? (
            <>
              <CompactList label={t("location.page.doctors")}>
                {doctors.map((item) => (
                  <DoctorRow key={item.doctor.id} item={item} />
                ))}
              </CompactList>
              <p className="mt-3">
                <SeeAll href={routes.doctors(slug)}>
                  {t("location.page.seeAllDoctors", { n: detail.doctorCount })}
                </SeeAll>
              </p>
            </>
          ) : (
            <DoctorsEmptyNotice context={t("location.page.doctorsEmptyContext")} />
          )}
        </section>

        {specialties.length > 0 && (
          <section aria-labelledby="location-specialties">
            <SectionHeading id="location-specialties" description={t("location.page.specialtiesDesc")}>
              {t("location.page.specialties")}
            </SectionHeading>
            <ul className="grid gap-x-6 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
              {specialties.map(({ specialty, facilityCount }) => (
                <li key={specialty.id} className="flex flex-wrap items-center gap-x-2">
                  <Link
                    href={
                      indexableSpecialtyPages.has(specialty.slug)
                        ? routes.hospitals(slug, specialty.slug)
                        : routes.specialty(specialty.slug)
                    }
                    className={CHIP_CLASS}
                  >
                    {specialty.name}
                  </Link>
                  <span className="text-sm text-slate-600">
                    ({practitionerPluralLower(specialty.practitionerTitle, lang)}
                    {facilityCount > 0 ? `, ${t("location.page.specialtyListed", { n: facilityCount })}` : ""})
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {children.length > 0 && (
          <section aria-labelledby="location-children">
            <SectionHeading id="location-children">
              {t(location.level === "division" ? "location.page.districtsIn" : "location.page.areasIn", {
                name: location.name,
              })}
            </SectionHeading>
            <SubLocations items={children} />
          </section>
        )}

        <div className="space-y-3">
          {listsOsm && (
            <p className="text-sm text-slate-600">
              {t("location.page.osmPre")}{" "}
              <a
                href="https://www.openstreetmap.org/copyright"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                {t("location.page.osmLink")}
              </a>
              {t("location.page.osmPost")}
            </p>
          )}
          <InformationNotice />
        </div>
        <Faq
          items={[
            ...(hasRecords
              ? [
                  {
                    question: t("location.faq.findQ", { name: location.name }),
                    answer: (
                      <>
                        {t("location.faq.findPre")}{" "}
                        <Link href={routes.hospitals(slug)} className="font-medium text-brand-800 underline">
                          {t("location.faq.findLink", { name: location.name })}
                        </Link>{" "}
                        {t("location.faq.findPost")}
                      </>
                    ),
                  },
                  {
                    question: t("location.faq.sourceQ"),
                    answer: (
                      <>
                        {t("location.faq.sourceA")}{" "}
                        <Link href={routes.about()} className="font-medium text-brand-800 underline">
                          {t("location.faq.sourceLink")}
                        </Link>
                        {t("location.dot")}
                      </>
                    ),
                  },
                ]
              : []),
          ]}
        />
      </div>
    </Container>
  );
}
