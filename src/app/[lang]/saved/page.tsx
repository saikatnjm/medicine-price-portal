import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { SavedList } from "@/components/retention/saved-list";
import { Container } from "@/components/ui/container";
import { getT, initLocale } from "@/i18n/server";
import { routes } from "@/lib/routes";
import { pageMetadata, type BreadcrumbItem } from "@/lib/seo";

type Props = { params: Promise<{ lang: string }> };

// Personal page (the list lives in the visitor's browser): never indexed.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = await initLocale(params);
  const t = getT(lang);
  return pageMetadata({
    title: t("pages.saved.title"),
    description: t("pages.saved.description"),
    path: routes.saved(),
    indexable: false,
    lang,
  });
}

export default async function SavedPage({ params }: Props) {
  await initLocale(params);
  const t = getT();
  const title = t("pages.saved.title");
  const breadcrumbs: BreadcrumbItem[] = [{ name: t("common.home"), href: routes.home() }, { name: title }];
  return (
    <Container className="py-8 sm:py-10">
      <Breadcrumbs items={breadcrumbs} />
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">{title}</h1>
      <p className="mt-2 max-w-2xl text-slate-700">{t("pages.saved.intro")}</p>
      <div className="mt-6">
        <SavedList />
      </div>
    </Container>
  );
}
