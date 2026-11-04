import type { Metadata } from "next";
import { CategoryLinks } from "@/components/home/category-links";
import { ExampleQueries } from "@/components/home/example-queries";
import { DataSourcesNote } from "@/components/home/data-sources-note";
import { DivisionLinks } from "@/components/home/division-links";
import { ContinueSection } from "@/components/retention/continue-section";
import { HomeCallouts } from "@/components/home/home-callouts";
import { HomeNearMe } from "@/components/home/home-near-me";
import { PopularMedicines } from "@/components/home/popular-medicines";
import { RegistryBrowse } from "@/components/home/registry-browse";
import { SpecialtyLinks } from "@/components/home/specialty-links";
import { SearchForm } from "@/components/search/search-form";
import { Container } from "@/components/ui/container";
import { services } from "@/data";
import { getT, initLocale } from "@/i18n/server";
import { routes } from "@/lib/routes";
import { JsonLd } from "@/components/common/json-ld";
import { languageAlternates, openGraph, twitterCard, websiteJsonLd } from "@/lib/seo";

interface HomePageProps {
  params?: Promise<{ lang?: string }>;
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const lang = await initLocale(params);
  const t = getT(lang);
  const title = `${t("layout.siteName")} – ${t("home.metaTitleSuffix")}`;
  const description = t("layout.siteDescription");
  return {
    title: { absolute: title },
    description,
    alternates: languageAlternates(routes.home(), lang),
    openGraph: openGraph(routes.home(), title, description, lang),
    twitter: twitterCard(title, description),
  };
}

export default async function HomePage({ params }: HomePageProps = {}) {
  const lang = await initLocale(params);
  const t = getT(lang);
  const [popular, summary, divisions, specialties, initials, generics, companies, dosageForms] = await Promise.all([
    services.medicines.listPopularMedicines(),
    services.directory.getSummary(),
    services.locations.listLocationTree(),
    services.specialties.listSpecialties(),
    services.browse.listInitials(),
    services.generics.listGenerics(),
    services.companies.listCompanies(),
    services.companies.listDosageForms(),
  ]);

  return (
    <>
      <JsonLd data={websiteJsonLd(lang)} />
      <div className="bg-mist">
        <Container className="py-10 sm:py-14">
          <h1 className="max-w-3xl">{t("layout.siteName")}</h1>
          <p className="mt-3 max-w-2xl text-lg text-slate-700">{t("home.tagline")}</p>
          <div className="mt-6 max-w-3xl">
            <SearchForm size="lg" id="home-search" label={t("home.searchLabel")} />
          </div>
          <div className="mt-5">
            <ExampleQueries />
          </div>
        </Container>
      </div>
      <Container className="space-y-10 py-8 sm:space-y-12 sm:py-10">
        <CategoryLinks summary={summary} />
        <ContinueSection />
        <section aria-labelledby="near-you" className="scroll-mt-20 rounded-2xl bg-mist p-5 sm:p-6">
          <h2 id="near-you" className="text-xl font-semibold text-ink">
            {t("home.nearYou.title")}
          </h2>
          <p className="mt-1 mb-4 max-w-2xl text-sm text-slate-700">{t("home.nearYou.desc")}</p>
          <HomeNearMe showDoctors={summary.doctorCount > 0} />
        </section>
        <PopularMedicines items={popular} />
        <RegistryBrowse
          initials={initials.map((entry) => entry.initial)}
          counts={{ generics: generics.length, companies: companies.length, dosageForms: dosageForms.length }}
        />
        <HomeCallouts />
        <SpecialtyLinks items={specialties} />
        <DivisionLinks divisions={divisions} />
        <DataSourcesNote />
      </Container>
    </>
  );
}
