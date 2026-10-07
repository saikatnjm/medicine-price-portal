import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { JsonLd } from "@/components/common/json-ld";
import { LocationTree } from "@/components/location/location-tree";
import { Container } from "@/components/ui/container";
import { services } from "@/data";
import { getT, initLocale } from "@/i18n/server";
import { routes } from "@/lib/routes";
import { breadcrumbJsonLd, pageMetadata, type BreadcrumbItem } from "@/lib/seo";

interface LocationsPageProps {
  params?: Promise<{ lang?: string }>;
}

export async function generateMetadata({ params }: LocationsPageProps): Promise<Metadata> {
  const lang = await initLocale(params);
  const t = getT(lang);
  return pageMetadata({
    title: t("location.list.title"),
    description: t("location.list.description"),
    path: routes.locations(),
    lang,
  });
}

export default async function LocationsPage({ params }: LocationsPageProps) {
  const lang = await initLocale(params);
  const t = getT(lang);
  const breadcrumbs: BreadcrumbItem[] = [
    { name: t("location.crumb.home"), href: routes.home() },
    { name: t("location.crumb.locations") },
  ];
  const divisions = await services.locations.listLocationTree();
  return (
    <Container className="py-8 sm:py-10">
      <JsonLd data={breadcrumbJsonLd(breadcrumbs, routes.locations(), lang)} />
      <Breadcrumbs items={breadcrumbs} />
      <h1 className="mt-4">{t("location.list.heading")}</h1>
      <p className="mt-2 max-w-3xl text-slate-700">{t("location.list.intro")}</p>
      <div className="mt-8">
        {divisions.length > 0 ? (
          <LocationTree divisions={divisions} />
        ) : (
          <p className="text-slate-700">{t("location.list.empty")}</p>
        )}
      </div>
    </Container>
  );
}
