import Link from "@/i18n/link";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { JsonLd } from "@/components/common/json-ld";
import { DoctorCard, ResultList } from "@/components/directory/result-cards";
import { buildHref, Pagination } from "@/components/directory/pagination";
import { InformationNotice } from "@/components/specialty/information-notice";
import { doctorCountText } from "@/components/specialty/specialty-text";
import { Container } from "@/components/ui/container";
import { services } from "@/data";
import { getLocale, getT } from "@/i18n/server";
import { routes } from "@/lib/routes";
import { firstParam, parsePageParam, type SearchParamValue } from "@/lib/search-params";
import { breadcrumbJsonLd, type BreadcrumbItem } from "@/lib/seo";
import { DoctorFilters } from "./doctor-filters";
import { DoctorsEmptyNotice } from "./doctors-empty-notice";

interface DoctorListPageProps {
  heading: string;
  intro: string;
  breadcrumbs: BreadcrumbItem[];
  /** Canonical path of this page, e.g. "/doctors/dhaka". */
  basePath: string;
  /** Set on /doctors/[location](/[specialty]); the filter form then searches all doctors. */
  fixedLocation?: string;
  fixedSpecialty?: string;
  searchParams: Record<string, SearchParamValue>;
}

/** Shared body of /doctors, /doctors/[location] and /doctors/[location]/[specialty]. */
export async function DoctorListPage({
  heading,
  intro,
  breadcrumbs,
  basePath,
  fixedLocation,
  fixedSpecialty,
  searchParams,
}: DoctorListPageProps) {
  const t = getT();
  const lang = getLocale();
  const query = firstParam(searchParams.q)?.trim() ?? "";
  const location = fixedLocation ?? firstParam(searchParams.location) ?? "";
  const specialty = fixedSpecialty ?? firstParam(searchParams.specialty) ?? "";
  const hospital = firstParam(searchParams.hospital) ?? "";
  const page = parsePageParam(searchParams.page);

  const [summary, tree, specialties] = await Promise.all([
    services.directory.getSummary(),
    services.locations.listLocationTree(),
    services.specialties.listSpecialties(),
  ]);
  const hasDoctors = summary.doctorCount > 0;
  const hospitals = hasDoctors
    ? (await services.facilities.listFacilities({ kind: "hospital", pageSize: 200 })).results.items.map(
        ({ facility }) => ({ slug: facility.slug, name: facility.name }),
      )
    : null;
  const { results } = await services.doctors.listDoctors({
    query,
    location: location || null,
    specialty: specialty || null,
    hospital: hospital || null,
    page,
  });

  const hrefFor = (p: number) =>
    buildHref(basePath, {
      q: query,
      location: fixedLocation ? null : location,
      specialty: fixedSpecialty ? null : specialty,
      hospital,
      page: p,
    });

  return (
    <Container className="py-8 sm:py-10">
      <JsonLd data={breadcrumbJsonLd(breadcrumbs, basePath, lang)} />
      <Breadcrumbs items={breadcrumbs} />
      <h1 className="mt-4">{heading}</h1>
      <p className="mt-2 max-w-3xl text-slate-700">{intro}</p>

      <div className="mt-6 space-y-6">
        {!hasDoctors && <DoctorsEmptyNotice />}
        <DoctorFilters
          query={query}
          location={location}
          specialty={specialty}
          hospital={hospital}
          divisions={tree}
          specialties={specialties.map((s) => s.specialty)}
          hospitals={hospitals}
        />
        {hasDoctors && (
          <section aria-labelledby="doctor-results">
            <h2 id="doctor-results" className="mb-4 text-lg font-semibold text-slate-900">
              {doctorCountText(t, results.total)}
            </h2>
            {results.items.length > 0 ? (
              <>
                <ResultList label={t("doctor.listPage.label")}>
                  {results.items.map((item) => (
                    <DoctorCard key={item.doctor.id} item={item} />
                  ))}
                </ResultList>
                <Pagination page={results.page} totalPages={results.totalPages} hrefFor={hrefFor} label={t("doctor.listPage.pagination")} />
              </>
            ) : (
              <p className="mt-3 text-slate-700">
                {t("doctor.listPage.noMatchPre")}{" "}
                <Link href={routes.specialties()} className="font-medium text-brand-800 underline">
                  {t("doctor.listPage.browseSpecialties")}
                </Link>
                {t("doctor.dot")}
              </p>
            )}
          </section>
        )}
        <InformationNotice />
      </div>
    </Container>
  );
}
