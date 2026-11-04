import type { Metadata } from "next";
import Link from "@/i18n/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { Faq, type FaqItem } from "@/components/common/faq";
import { JsonLd } from "@/components/common/json-ld";
import { MedicalDisclaimer } from "@/components/common/medical-disclaimer";
import { SectionHeading } from "@/components/common/section-heading";
import {
  brandCountText,
  companyCountText,
  formLabel,
  formsText,
  genericDescription,
  genericJsonLd,
  genericTitle,
  productCountText,
  shortProductCountText,
} from "@/components/generic/generic-text";
import { CHIP_CLASS, INDEX_CHIP_CLASS } from "@/components/ui/chip";
import { Container } from "@/components/ui/container";
import { EntityTile, HeroCard } from "@/components/ui/hero-card";
import { services } from "@/data";
import type { GenericCount } from "@/domain/read-models";
import { getT, initLocale } from "@/i18n/server";
import { formatDateIn } from "@/lib/format-locale";
import { routes } from "@/lib/routes";
import { searchHref } from "@/lib/search-params";
import { breadcrumbJsonLd, pageMetadata, type BreadcrumbItem } from "@/lib/seo";

interface GenericPageProps {
  params: Promise<{ lang?: string; slug: string }>;
}

/** Deduplicates the lookup between generateMetadata and the page render. */
const getGenericDetail = cache((slug: string) => services.generics.getGenericDetail(slug));

/** Number of generic pages prerendered at build time; the rest render on first request and are cached. */
const PRERENDERED_GENERICS = 50;

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const top = await services.generics.listTopGenerics(PRERENDERED_GENERICS);
  return top.map(({ generic }) => ({ slug: generic.slug }));
}

export const dynamicParams = true;

export async function generateMetadata({ params }: GenericPageProps): Promise<Metadata> {
  const lang = await initLocale(params);
  const detail = await getGenericDetail((await params).slug);
  if (!detail) return { title: getT(lang)("generic.page.not_found_title") };
  return pageMetadata({
    title: genericTitle(detail, lang),
    description: genericDescription(detail, lang),
    path: routes.generic(detail.generic.slug),
    indexable: detail.indexable,
    lang,
  });
}

const TABLE_CLASS =
  "w-full text-left text-sm [&_td]:border-t [&_td]:border-slate-100 [&_td]:py-2 [&_td]:pr-3 [&_td]:align-top [&_th]:pb-1 [&_th]:pr-3 [&_th]:text-xs [&_th]:font-medium [&_th]:text-slate-600 [&_a]:text-brand-800 [&_a]:underline-offset-2 [&_a:hover]:underline [&_td:first-child]:font-medium [&_td:last-child]:whitespace-nowrap [&_td:last-child]:text-slate-700 [&_td:last-child]:tabular-nums";

function GenericChips({ items }: { items: readonly GenericCount[] }) {
  const t = getT();
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map(({ generic, productCount }) => (
        <li key={generic.id}>
          <Link href={routes.generic(generic.slug)} className={CHIP_CLASS}>
            {generic.name}
            <span className="font-normal text-slate-600">({shortProductCountText(t, productCount)})</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default async function GenericPage({ params }: GenericPageProps) {
  const lang = await initLocale(params);
  const t = getT(lang);
  const detail = await getGenericDetail((await params).slug);
  if (!detail) notFound();

  const { generic, groups, forms, strengths, topCompanies, combinations, ingredients, sources } = detail;
  const name = generic.name;
  const path = routes.generic(generic.slug);
  const breadcrumbs: BreadcrumbItem[] = [
    { name: t("generic.crumb.home"), href: routes.home() },
    { name: t("generic.crumb.generics"), href: routes.generics() },
    { name },
  ];
  const counts = {
    name,
    products: productCountText(t, detail.productCount),
    brands: brandCountText(t, detail.brandCount),
    companies: companyCountText(t, detail.companyCount),
  };
  const allForms = formsText(t, detail);
  const allStrengths = strengths.join(", ");

  const faq: FaqItem[] = [
    { question: t("generic.faq.count_q", { name }), answer: t("generic.faq.count_a", counts) },
    {
      question: t("generic.faq.forms_q", { name }),
      answer: (
        <>
          {t("generic.faq.forms_a", { forms: allForms })}
          {strengths.length > 0 && <> {t("generic.faq.strengths_a", { strengths: allStrengths })}</>}
        </>
      ),
    },
    ...(detail.companyCount > 1
      ? [
          {
            question: t("generic.faq.companies_q", { name }),
            answer: t("generic.faq.companies_a", {
              list: topCompanies
                .slice(0, 3)
                .map(({ manufacturer, count }) => `${manufacturer.name} (${shortProductCountText(t, count)})`)
                .join(", "),
            }),
          },
        ]
      : []),
    ...(detail.productCount > 1
      ? [{ question: t("generic.faq.switch_q", { name }), answer: t("generic.faq.switch_a") }]
      : []),
  ];

  return (
    <Container className="py-8 sm:py-10">
      <JsonLd data={[genericJsonLd(detail, lang), breadcrumbJsonLd(breadcrumbs, path, lang)]} />
      <Breadcrumbs items={breadcrumbs} />

      <div className="mt-4 space-y-10">
        <HeroCard>
          <header className="flex gap-4">
            <EntityTile kind="medicine" size="lg" />
            <div className="min-w-0 space-y-2">
              <p className="flex flex-wrap gap-2 text-xs font-semibold">
                <span className="rounded-full bg-white px-3 py-1 text-pine">{t("generic.page.chip")}</span>
                <span className="rounded-full bg-white px-3 py-1 text-slate-700">{t("generic.page.status")}</span>
              </p>
              <h1 className="break-words">{t("generic.page.h1", { name })}</h1>
              <p className="max-w-3xl text-slate-700">{t("generic.page.intro", counts)}</p>
              <p className="max-w-3xl text-sm text-slate-700">
                {t("generic.page.intro_forms", { forms: allForms })}
                {strengths.length > 0 && <> {t("generic.page.intro_strengths", { strengths: allStrengths })}</>}
              </p>
            </div>
          </header>
        </HeroCard>

        <section aria-labelledby="generic-products">
          <SectionHeading id="generic-products" description={t("generic.page.products_desc")}>
            {t("generic.page.products_heading", { name })}
          </SectionHeading>
          <div className="space-y-6">
            {groups.map((group) => {
              const heading = `${group.strength || t("generic.page.strength_none")} · ${group.dosageFormLabel}`;
              return (
                <div key={`${group.dosageFormLabel}-${group.strength}-${group.dosageForm}`}>
                  <h3 className="mb-1 font-semibold text-slate-900">
                    {heading}{" "}
                    <span className="text-sm font-normal text-slate-600">
                      ({shortProductCountText(t, group.products.length)})
                    </span>
                  </h3>
                  <div className="overflow-x-auto">
                    <table className={TABLE_CLASS}>
                      <thead>
                        <tr>
                          <th scope="col">{t("generic.page.col_brand")}</th>
                          <th scope="col">{t("generic.page.col_company")}</th>
                          <th scope="col" className="whitespace-nowrap">
                            {t("generic.page.col_dar")}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.products.map(({ medicine, manufacturer }) => (
                          <tr key={medicine.id}>
                            <td>
                              <Link href={routes.medicine(medicine.slug)}>{medicine.brandName}</Link>
                            </td>
                            <td>
                              <Link href={routes.company(manufacturer.slug)}>{manufacturer.name}</Link>
                            </td>
                            <td>
                              {medicine.provenance.darNumber ?? "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section aria-labelledby="generic-forms">
          <SectionHeading id="generic-forms" description={t("generic.page.forms_desc")}>
            {t("generic.page.forms_heading")}
          </SectionHeading>
          <ul className="flex flex-wrap gap-2">
            {forms.map(({ form, count }) => (
              <li key={form}>
                <Link href={routes.dosageForm(form)} className={CHIP_CLASS}>
                  {formLabel(t, form)}
                  <span className="font-normal text-slate-600">({shortProductCountText(t, count)})</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="generic-companies">
          <SectionHeading id="generic-companies" description={t("generic.page.companies_desc", { name })}>
            {t("generic.page.companies_heading", { name })}
          </SectionHeading>
          <ol className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
            {topCompanies.map(({ manufacturer, count }) => (
              <li key={manufacturer.id} className="flex min-h-11 items-center justify-between gap-3 border-b border-slate-100">
                <Link href={routes.company(manufacturer.slug)} className="font-medium text-brand-800 underline-offset-2 hover:underline">
                  {manufacturer.name}
                </Link>
                <span className="shrink-0 text-sm text-slate-600">{shortProductCountText(t, count)}</span>
              </li>
            ))}
          </ol>
        </section>

        {(combinations.length > 0 || ingredients.length > 0) && (
          <section aria-labelledby="generic-related" className="space-y-4">
            <SectionHeading id="generic-related">{t("generic.page.related_heading")}</SectionHeading>
            {ingredients.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-slate-700">{t("generic.page.ingredients_label")}</h3>
                <GenericChips items={ingredients} />
              </div>
            )}
            {combinations.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-slate-700">{t("generic.page.combinations_label", { name })}</h3>
                <GenericChips items={combinations} />
              </div>
            )}
          </section>
        )}

        <Faq items={faq} />

        <section aria-labelledby="generic-source" className="space-y-3">
          <SectionHeading id="generic-source">{t("generic.page.source_heading")}</SectionHeading>
          {sources.map((source) => (
            <p key={source.id} className="text-sm text-slate-600">
              {t("generic.page.source")}{" "}
              <a href={source.url} className="text-brand-800 underline" rel="noopener">
                {source.name}
              </a>{" "}
              ({source.publisher}), {t("generic.page.source_note", { date: formatDateIn(source.retrievedAt, lang) })}
            </p>
          ))}
          <MedicalDisclaimer />
        </section>

        <nav aria-label={t("generic.crumb.generics")} className="flex flex-wrap gap-2">
          <Link href={routes.generics()} className={INDEX_CHIP_CLASS}>
            {t("generic.page.all_generics")}
          </Link>
          <Link href={searchHref(name)} className={INDEX_CHIP_CLASS}>
            {t("generic.page.search_all", { name })}
          </Link>
        </nav>
      </div>
    </Container>
  );
}
