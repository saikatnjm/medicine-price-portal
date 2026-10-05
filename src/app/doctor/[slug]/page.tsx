import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { JsonLd } from "@/components/common/json-ld";
import { SectionHeading } from "@/components/common/section-heading";
import { ChamberSection } from "@/components/doctor/chamber-section";
import { buildHref } from "@/components/directory/pagination";
import { DoctorCard, ResultList } from "@/components/directory/result-cards";
import { DoctorActions } from "@/components/doctor/doctor-actions";
import { DoctorSource } from "@/components/doctor/doctor-source";
import { InformationNotice } from "@/components/specialty/information-notice";
import { Container } from "@/components/ui/container";
import { services } from "@/data";
import { routes } from "@/lib/routes";
import { breadcrumbJsonLd, pageMetadata, type BreadcrumbItem } from "@/lib/seo";
import { doctorDescription, doctorJsonLd, doctorTitle } from "@/lib/seo-directory";

interface DoctorPageProps {
  params: Promise<{ slug: string }>;
}

const getDoctorDetail = cache((slug: string) => services.doctors.getDoctorDetail(slug));

/** Doctor pages are rendered on demand. */
export const dynamicParams = true;

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return [];
}

export async function generateMetadata({ params }: DoctorPageProps): Promise<Metadata> {
  const detail = await getDoctorDetail((await params).slug);
  if (!detail) return { title: "Doctor not found" };
  return pageMetadata({
    title: doctorTitle(detail),
    description: doctorDescription(detail),
    path: routes.doctor(detail.doctor.slug),
  });
}

export default async function DoctorPage({ params }: DoctorPageProps) {
  const detail = await getDoctorDetail((await params).slug);
  if (!detail) notFound();

  const { doctor, specialties, chambers, related, source } = detail;
  const path = routes.doctor(doctor.slug);
  const district = chambers[0]?.place.district ?? null;
  const primarySpecialty = specialties[0] ?? null;

  const breadcrumbs: BreadcrumbItem[] = [
    { name: "Home", href: routes.home() },
    { name: "Doctors", href: routes.doctors() },
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
    ...(district ? [{ label: `Healthcare in ${district.name}`, href: routes.location(district.slug) }] : []),
    ...(district && primarySpecialty
      ? [
          {
            label: `${primarySpecialty.name} in ${district.name}`,
            href: routes.hospitals(district.slug, primarySpecialty.slug),
          },
        ]
      : []),
  ];

  return (
    <Container className="py-8 sm:py-10">
      <JsonLd data={[doctorJsonLd(detail), breadcrumbJsonLd(breadcrumbs, path)]} />
      <Breadcrumbs items={breadcrumbs} />
      <div className="mt-4 space-y-10">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{doctor.name}</h1>
          {doctor.designation && <p className="text-lg text-slate-800">{doctor.designation}</p>}
          {specialties.length > 0 && (
            <p className="text-slate-800">
              <span className="sr-only">Specialties: </span>
              {specialties.map((s, i) => (
                <span key={s.id}>
                  {i > 0 && ", "}
                  <Link href={routes.specialty(s.slug)} className="font-medium text-brand-800 underline">
                    {s.practitionerTitle}
                  </Link>
                </span>
              ))}
            </p>
          )}
          {doctor.organization && <p className="text-slate-700">{doctor.organization}</p>}
          {doctor.qualifications && (
            <p className="text-slate-700">
              <span className="font-medium">Qualifications:</span> {doctor.qualifications}
            </p>
          )}
          {doctor.profileSummary && <p className="max-w-prose pt-1 text-slate-800">{doctor.profileSummary}</p>}
          <div className="pt-2">
            <DoctorActions name={doctor.name} chambers={chambers} doctorPhone={doctor.phone} />
          </div>
        </header>

        {chambers.length > 0 ? (
          <section aria-label="Chambers" className="space-y-8">
            {chambers.map((view, index) => (
              <ChamberSection key={`${view.name}-${index}`} view={view} index={index} total={chambers.length} />
            ))}
          </section>
        ) : (
          <p className="text-slate-700">No chamber details are published for this doctor.</p>
        )}

        {related.length > 0 && (
          <section aria-labelledby="related-doctors">
            <SectionHeading id="related-doctors">
              {primarySpecialty ? `Other ${primarySpecialty.practitionerTitle.toLowerCase()} profiles` : "Related doctors"}
            </SectionHeading>
            <ResultList label="Related doctors">
              {related.map((item) => (
                <DoctorCard key={item.doctor.id} item={item} />
              ))}
            </ResultList>
          </section>
        )}

        {(primarySpecialty || placeLinks.length > 0) && (
          <nav aria-label="Related pages" className="flex flex-wrap gap-x-6 gap-y-2 border-t border-slate-200 pt-6">
            {primarySpecialty && (
              <Link href={routes.specialty(primarySpecialty.slug)} className="font-medium text-brand-800 underline">
                About {primarySpecialty.name}
              </Link>
            )}
            {placeLinks.map((l) => (
              <Link key={l.href} href={l.href} className="font-medium text-brand-800 underline">
                {l.label}
              </Link>
            ))}
          </nav>
        )}

        <div className="space-y-4 border-t border-slate-200 pt-6">
          <DoctorSource doctor={doctor} source={source} />
          <InformationNotice />
        </div>
      </div>
    </Container>
  );
}
