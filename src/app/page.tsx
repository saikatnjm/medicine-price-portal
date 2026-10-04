import type { Metadata } from "next";
import { SampleDataNotice } from "@/components/common/sample-data-notice";
import { AboutTheData } from "@/components/home/about-the-data";
import { HowItWorks } from "@/components/home/how-it-works";
import { PopularMedicines } from "@/components/home/popular-medicines";
import { SearchForm } from "@/components/search/search-form";
import { Container } from "@/components/ui/container";
import { services } from "@/data";
import { routes } from "@/lib/routes";
import { openGraph } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: { absolute: `${siteConfig.name} – Compare medicine prices in Bangladesh (pilot)` },
  description: siteConfig.description,
  alternates: { canonical: routes.home() },
  openGraph: openGraph(routes.home(), siteConfig.name, siteConfig.description),
};

export default async function HomePage() {
  const popular = await services.medicines.listPopularMedicines();

  return (
    <>
      <div className="border-b border-slate-200 bg-brand-50/60">
        <Container className="py-12 sm:py-20">
          <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            What medicine are you looking for?
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-700">
            Find a medicine by brand or generic name, check its strength and form, and compare
            pharmacy prices and same-generic brands in one place.
          </p>
          <div className="mt-8 max-w-2xl">
            <SearchForm size="lg" id="home-search" />
          </div>
          <SampleDataNotice className="mt-6 max-w-2xl" />
        </Container>
      </div>
      <Container className="space-y-12 py-12">
        <PopularMedicines items={popular} />
        <HowItWorks />
        <AboutTheData />
      </Container>
    </>
  );
}
