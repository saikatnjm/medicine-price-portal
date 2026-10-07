import type { Metadata } from "next";
import { CategoryLinks } from "@/components/home/category-links";
import { ExampleQueries } from "@/components/home/example-queries";
import { DataSourcesNote } from "@/components/home/data-sources-note";
import { DivisionLinks } from "@/components/home/division-links";
import { HomeNearMe } from "@/components/home/home-near-me";
import { PopularMedicines } from "@/components/home/popular-medicines";

import { SearchForm } from "@/components/search/search-form";
import { Container } from "@/components/ui/container";
import { services } from "@/data";
import { routes } from "@/lib/routes";
import { JsonLd } from "@/components/common/json-ld";
import { openGraph, twitterCard, websiteJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

const HOME_TITLE = `${siteConfig.name} – Medicines, hospitals, clinics and pharmacies`;

export const metadata: Metadata = {
  title: { absolute: HOME_TITLE },
  description: siteConfig.description,
  alternates: { canonical: routes.home() },
  openGraph: openGraph(routes.home(), HOME_TITLE, siteConfig.description),
  twitter: twitterCard(HOME_TITLE, siteConfig.description),
};

export default async function HomePage() {
  const [popular, summary, divisions] = await Promise.all([
    services.medicines.listPopularMedicines(),
    services.directory.getSummary(),
    services.locations.listLocationTree(),
  ]);

  return (
    <>
      <JsonLd data={websiteJsonLd()} />
      <div className="border-b border-slate-200 bg-gradient-to-b from-brand-50 to-white">
        <Container className="py-12 sm:py-16">
          <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">{siteConfig.name}</h1>
          <p className="mt-3 max-w-2xl text-lg text-slate-700">
            Search medicines, doctors, hospitals, clinics and pharmacies across Bangladesh.
          </p>
          <div className="mt-7 max-w-3xl">
            <SearchForm size="lg" id="home-search" label="What are you looking for?" />
          </div>
          <div className="mt-5">
            <ExampleQueries />
          </div>
        </Container>
      </div>
      <Container className="space-y-12 py-10">
        <CategoryLinks summary={summary} />
        <section aria-labelledby="near-you" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 id="near-you" className="text-xl font-semibold text-slate-900">
            Find healthcare near you
          </h2>
          <p className="mt-1 mb-4 max-w-2xl text-sm text-slate-700">
            Optional. Your browser asks for permission only when you press the button, and your position is not stored.
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
