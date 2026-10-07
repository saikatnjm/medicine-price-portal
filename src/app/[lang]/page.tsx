import type { Metadata } from "next";
import { CategoryLinks } from "@/components/home/category-links";
import { ExampleQueries } from "@/components/home/example-queries";
import { DataSourcesNote } from "@/components/home/data-sources-note";
import { DivisionLinks } from "@/components/home/division-links";
import { ContinueSection } from "@/components/retention/continue-section";
import { HomeNearMe } from "@/components/home/home-near-me";
import { PopularMedicines } from "@/components/home/popular-medicines";

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
  const [popular, summary, divisions] = await Promise.all([
    services.medicines.listPopularMedicines(),
    services.directory.getSummary(),
    services.locations.listLocationTree(),
  ]);

  return (
    <>
      <JsonLd data={websiteJsonLd(lang)} />
      <div className="border-b border-slate-200 bg-gradient-to-b from-brand-50 to-white">
        <Container className="py-12 sm:py-16">
          <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">{t("layout.siteName")}</h1>
          <p className="mt-3 max-w-2xl text-lg text-slate-700">
            {t("home.tagline")}
          </p>
          <div className="mt-7 max-w-3xl">
            <SearchForm size="lg" id="home-search" label={t("home.searchLabel")} />
          </div>
          <div className="mt-5">
            <ExampleQueries />
          </div>
        </Container>
      </div>
      <Container className="space-y-12 py-10">
        <ContinueSection />
        <CategoryLinks summary={summary} />
        <section aria-labelledby="near-you" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 id="near-you" className="text-xl font-semibold text-slate-900">
            {t("home.nearYou.title")}
          </h2>
          <p className="mt-1 mb-4 max-w-2xl text-sm text-slate-700">
            {t("home.nearYou.desc")}
          </p>
          <HomeNearMe showDoctors={summary.doctorCount > 0} />
        </section>
        <DivisionLinks divisions={divisions} />
        <PopularMedicines items={popular} />
        <DataSourcesNote />
      </Container>
    </>
  );
}
