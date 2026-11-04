import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { JsonLd } from "@/components/common/json-ld";
import { Container } from "@/components/ui/container";
import { services } from "@/data";
import type { BrandInitialCount, BrandInitialPage } from "@/domain/read-models";
import type { Locale } from "@/i18n/config";
import { getT } from "@/i18n/server";
import { routes } from "@/lib/routes";
import { medicinesPage } from "@/lib/routes-browse";
import { breadcrumbJsonLd, pageMetadata, type BreadcrumbItem } from "@/lib/seo";
import { BrandList, fmt, initialLabel, LetterNav, PageLinks } from "./brand-index";

/** Shared by /medicines/[initial] (page 1) and /medicines/[initial]/[page] (pages ≥ 2). */
export const getInitialPage = cache((initial: string, page: number) => services.browse.getInitialPage(initial, page));

export async function initialPageMetadata(initial: string, page: number | null, lang: Locale): Promise<Metadata> {
  const t = getT(lang);
  const data = page ? await getInitialPage(initial, page) : null;
  if (!data) return { title: t("browse.crumb.medicines") };
  const letter = initialLabel(initial, t);
  const vars = { letter, page: data.page, total: data.totalPages, n: fmt(data.total) };
  return pageMetadata({
    title: t(data.page > 1 ? "browse.initial.titlePage" : "browse.initial.title", vars),
    description: t(data.page > 1 ? "browse.initial.descriptionPage" : "browse.initial.description", vars),
    // Every page is self-canonical and indexable: together they link to every medicine page.
    path: medicinesPage(initial, data.page),
    lang,
  });
}

/** Renders one page of an initial; unknown initials, invalid (null) and out-of-range pages 404. */
export async function renderInitialPage(initial: string, page: number | null, lang: Locale) {
  const [data, initials] = await Promise.all([
    page ? getInitialPage(initial, page) : null,
    services.browse.listInitials(),
  ]);
  if (!data) notFound();
  return <InitialPageView data={data} initials={initials} lang={lang} />;
}

function InitialPageView({ data, initials, lang }: { data: BrandInitialPage; initials: BrandInitialCount[]; lang: Locale }) {
  const t = getT(lang);
  const { initial } = data;
  const letter = initialLabel(initial, t);
  const path = medicinesPage(initial, data.page);
  const breadcrumbs: BreadcrumbItem[] = [
    { name: t("browse.crumb.home"), href: routes.home() },
    { name: t("browse.crumb.medicines"), href: routes.medicines() },
    ...(data.page > 1
      ? [{ name: letter, href: routes.medicines(initial) }, { name: t("browse.crumb.page", { page: data.page }) }]
      : [{ name: letter }]),
  ];
  const from = (data.page - 1) * data.pageSize + 1;
  const to = from + data.items.length - 1;

  return (
    <Container className="py-8 sm:py-10">
      <JsonLd data={breadcrumbJsonLd(breadcrumbs, path, lang)} />
      <Breadcrumbs items={breadcrumbs} />
      <h1 className="mt-4 text-2xl font-semibold text-slate-900 sm:text-3xl">
        {t("browse.initial.heading", { letter })}
        {data.page > 1 && <span className="text-slate-600"> · {t("browse.crumb.page", { page: data.page })}</span>}
      </h1>
      <p className="mt-2 text-sm text-slate-700">
        {t("browse.initial.showing", { from: fmt(from), to: fmt(to), n: fmt(data.total) })}
      </p>
      <div className="mt-4">
        <LetterNav initials={initials} current={initial} />
      </div>
      <div className="mt-6">
        <BrandList items={data.items} label={t("browse.initial.listLabel", { letter })} />
      </div>
      <PageLinks initial={initial} page={data.page} totalPages={data.totalPages} />
      <p className="mt-8 text-sm text-slate-600">{t("browse.note")}</p>
    </Container>
  );
}
