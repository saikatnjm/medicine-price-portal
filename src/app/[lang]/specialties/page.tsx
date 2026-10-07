import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { JsonLd } from "@/components/common/json-ld";
import { SpecialtyList } from "@/components/specialty/specialty-list";
import { InformationNotice } from "@/components/specialty/information-notice";
import { Container } from "@/components/ui/container";
import { services } from "@/data";
import { getT, initLocale } from "@/i18n/server";
import { routes } from "@/lib/routes";
import { breadcrumbJsonLd, pageMetadata, type BreadcrumbItem } from "@/lib/seo";

interface SpecialtiesPageProps {
  params?: Promise<{ lang?: string }>;
}

export async function generateMetadata({ params }: SpecialtiesPageProps): Promise<Metadata> {
  const lang = await initLocale(params);
  const t = getT(lang);
  return pageMetadata({
    title: t("specialty.list.title"),
    description: t("specialty.list.description"),
    path: routes.specialties(),
    lang,
  });
}

export default async function SpecialtiesPage({ params }: SpecialtiesPageProps) {
  const lang = await initLocale(params);
  const t = getT(lang);
  const breadcrumbs: BreadcrumbItem[] = [
    { name: t("specialty.crumb.home"), href: routes.home() },
    { name: t("specialty.crumb.specialties") },
  ];
  const specialties = await services.specialties.listSpecialties();
  return (
    <Container className="py-8 sm:py-10">
      <JsonLd data={breadcrumbJsonLd(breadcrumbs, routes.specialties(), lang)} />
      <Breadcrumbs items={breadcrumbs} />
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">{t("specialty.list.heading")}</h1>
      <p className="mt-2 max-w-3xl text-slate-700">{t("specialty.list.intro")}</p>
      <div className="mt-6 space-y-8">
        {specialties.length > 0 ? (
          <SpecialtyList items={specialties} />
        ) : (
          <p className="text-slate-700">{t("specialty.list.empty")}</p>
        )}
        <InformationNotice />
      </div>
    </Container>
  );
}
