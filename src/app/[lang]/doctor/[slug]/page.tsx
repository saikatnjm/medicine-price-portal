import type { Metadata } from "next";
import Link from "@/i18n/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { JsonLd } from "@/components/common/json-ld";
import { SectionHeading } from "@/components/common/section-heading";
import { ChamberSection } from "@/components/doctor/chamber-section";
import { buildHref } from "@/components/directory/pagination";
import { CompactList, DoctorRow } from "@/components/facility/compact-rows";
import { DoctorAvatar } from "@/components/doctor/doctor-avatar";
import { DoctorActions } from "@/components/doctor/doctor-actions";
import { DoctorSource } from "@/components/doctor/doctor-source";
import { InformationNotice } from "@/components/specialty/information-notice";
import { Container } from "@/components/ui/container";
import { HeroCard } from "@/components/ui/hero-card";
import { services } from "@/data";
import { getT, initLocale } from "@/i18n/server";
import { routes } from "@/lib/routes";
import { breadcrumbJsonLd, pageMetadata, type BreadcrumbItem } from "@/lib/seo";
import { doctorDescription, doctorJsonLd, doctorTitle } from "@/components/doctor/doctor-text";
import { practitionerLower } from "@/components/specialty/specialty-text";

interface DoctorPageProps {
  params: Promise<{ slug: string; lang?: string }>;
}

const getDoctorDetail = cache((slug: string) => services.doctors.getDoctorDetail(slug));

/** Doctor pages are rendered on demand. */
export const dynamicParams = true;

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return [];
}

export async function generateMetadata({ params }: DoctorPageProps): Promise<Metadata> {
  const lang = await initLocale(params);
  const detail = await getDoctorDetail((await params).slug);
  if (!detail) return { title: getT(lang)("doctor.notFound.title") };
  return pageMetadata({
    title: doctorTitle(detail, lang),
    description: doctorDescription(detail, lang),
    path: routes.doctor(detail.doctor.slug),
    lang,
  });
}

export default async function DoctorPage({ params }: DoctorPageProps) {
  const lang = await initLocale(params);
  const t = getT(lang);
  const detail = await getDoctorDetail((await params).slug);
  if (!detail) notFound();

  const { doctor, specialties, chambers, related, source } = detail;
  const path = routes.doctor(doctor.slug);
  const district = chambers[0]?.place.district ?? null;
  const primarySpecialty = specialties[0] ?? null;

  const breadcrumbs: BreadcrumbItem[] = [
    { name: t("doctor.crumb.home"), href: routes.home() },
    { name: t("doctor.crumb.doctors"), href: routes.doctors() },
    ...(district ? [{ name: district.name, href: routes.doctors(district.slug) }] : []),
    ...(primarySpecialty
      ? [
          {
            name: primarySpecialty.name,
            href: district
              ? routes.doctors(district.slug, primarySpecialty.slug)
              : buildHref(routes.doctors(), { specialty: primarySpecialty.slug }),
          },
        ]
      : []),
    { name: doctor.name },
  ];

  const placeLinks = [
    ...(district ? [{ label: t("doctor.page.healthcareIn", { place: district.name }), href: routes.location(district.slug) }] : []),
    ...(district && primarySpecialty
      ? [
          {
            label: t("doctor.page.specialtyIn", { specialty: primarySpecialty.name, place: district.name }),
            href: routes.hospitals(district.slug, primarySpecialty.slug),
          },
        ]
      : []),
  ];

  return (
    <Container className="py-8 sm:py-10">
      <JsonLd data={[doctorJsonLd(detail, lang), breadcrumbJsonLd(breadcrumbs, path, lang)]} />
      <Breadcrumbs items={breadcrumbs} />
      <div className="mt-4 space-y-8">
        <HeroCard>
          <header className="flex gap-4">
            <DoctorAvatar name={doctor.name} />
            <div className="min-w-0 space-y-2">
              <h1 className="text-[1.75rem] leading-9 font-semibold tracking-tight break-words text-slate-900 sm:text-4xl sm:leading-[3rem]">
                {doctor.name}
              </h1>
              {doctor.designation && <p className="text-lg text-slate-800">{doctor.designation}</p>}
              {specialties.length > 0 && (
                <p className="flex flex-wrap items-center gap-2">
                  <span className="sr-only">{t("doctor.page.specialties")} </span>
                  {specialties.map((s) => (
                    <Link
                      key={s.id}
                      href={routes.specialty(s.slug)}
                      className="inline-flex min-h-9 items-center rounded-full bg-cat-specialty-bg px-3.5 text-sm font-medium text-cat-specialty-fg hover:underline"
                    >
                      {s.practitionerTitle}
                    </Link>
                  ))}
                </p>
              )}
              {doctor.organization && <p className="text-slate-700">{doctor.organization}</p>}
              {doctor.qualifications && (
                <p className="text-slate-700">
                  <span className="font-medium">{t("doctor.page.qualifications")}</span> {doctor.qualifications}
                </p>
              )}
              {doctor.profileSummary && <p className="max-w-prose pt-1 text-slate-800">{doctor.profileSummary}</p>}
            </div>
          </header>
          <DoctorActions name={doctor.name} chambers={chambers} doctorPhone={doctor.phone} />
        </HeroCard>

        {chambers.length > 0 ? (
          <section aria-label={t("doctor.page.chambers")} className="space-y-4">
            {chambers.map((view, index) => (
              <ChamberSection key={`${view.name}-${index}`} view={view} index={index} total={chambers.length} />
            ))}
          </section>
        ) : (
          <p className="text-slate-700">{t("doctor.page.noChambers")}</p>
        )}

        {related.length > 0 && (
          <section aria-labelledby="related-doctors">
            <SectionHeading id="related-doctors">
              {primarySpecialty
                ? t("doctor.page.otherProfiles", { title: practitionerLower(primarySpecialty.practitionerTitle, lang) })
                : t("doctor.page.relatedDoctors")}
            </SectionHeading>
            <CompactList label={t("doctor.page.relatedDoctors")}>
              {related.map((item) => (
                <DoctorRow key={item.doctor.id} item={item} />
              ))}
            </CompactList>
          </section>
        )}

        {(primarySpecialty || placeLinks.length > 0) && (
          <nav aria-label={t("doctor.page.relatedPages")} className="flex flex-wrap gap-x-6 gap-y-1">
            {primarySpecialty && (
              <Link href={routes.specialty(primarySpecialty.slug)} className="inline-flex min-h-11 items-center font-medium text-brand-800 underline">
                {t("doctor.page.about", { name: primarySpecialty.name })}
              </Link>
            )}
            {placeLinks.map((l) => (
              <Link key={l.href} href={l.href} className="font-medium text-brand-800 underline">
                {l.label}
              </Link>
            ))}
          </nav>
        )}

        <div className="space-y-4">
          <DoctorSource doctor={doctor} source={source} />
          <InformationNotice />
        </div>
      </div>
    </Container>
  );
}
