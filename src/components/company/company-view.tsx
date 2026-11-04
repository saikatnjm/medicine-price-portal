import type { Metadata } from "next";
import Link from "@/i18n/link";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { Faq, type FaqItem } from "@/components/common/faq";
import { JsonLd } from "@/components/common/json-ld";
import { SectionHeading } from "@/components/common/section-heading";
import { Pagination } from "@/components/directory/pagination";
import { WHITE_CHIP_CLASS } from "@/components/ui/chip";
import { Container } from "@/components/ui/container";
import { HeroCard } from "@/components/ui/hero-card";
import type { CompanyDetail } from "@/domain/read-models";
import type { Locale } from "@/i18n/config";
import { getT } from "@/i18n/server";
import { routes } from "@/lib/routes";
import { companyPage } from "@/lib/routes-catalog";
import { breadcrumbJsonLd, pageMetadata, type BreadcrumbItem } from "@/lib/seo";
import {
  companyDescription,
  companyName,
  companyTitle,
  formatCount,
  formLabel,
  genericsText,
  pageRange,
  productsText,
} from "./catalog-text";
import { CatalogTable, CountChips, LINK_CLASS, TD_CLASS, TH_CLASS } from "./catalog-ui";

export function companyMetadata(detail: CompanyDetail, lang: Locale): Metadata {
  const t = getT(lang);
  return pageMetadata({
    title: companyTitle(t, detail),
    description: companyDescription(t, detail),
    path: companyPage(detail.manufacturer.slug, detail.pagination.page),
    indexable: detail.indexable,
    lang,
  });
}

function companyFaq(detail: CompanyDetail, t: ReturnType<typeof getT>): FaqItem[] {
  const name = companyName(detail.manufacturer);
  const counts = { products: productsText(t, detail.productCount), generics: genericsText(t, detail.genericCount) };
  const list = (items: { label: string; count: number }[]) =>
    items.map(({ label, count }) => `${label} (${formatCount(count)})`).join(", ");
  return [
    { question: t("company.faq.count.q", { name }), answer: t("company.faq.count.a", { name, ...counts }) },
    {
      question: t("company.faq.forms.q", { name }),
      answer: t("company.faq.forms.a", {
        list: list(detail.forms.map((f) => ({ label: formLabel(t, f.item, true), count: f.count }))),
      }),
    },
    {
      question: t("company.faq.generics.q", { name }),
      answer: t("company.faq.generics.a", {
        list: list(detail.topGenerics.slice(0, 5).map((g) => ({ label: g.item.name, count: g.count }))),
      }),
    },
    { question: t("company.faq.price.q"), answer: t("company.faq.price.a") },
    { question: t("company.faq.dar.q"), answer: t("company.faq.dar.a") },
  ];
}

/** Company medicine list: page 1 at /companies/x, later pages at /companies/x/2 ... */
export function CompanyView({ detail, lang }: { detail: CompanyDetail; lang: Locale }) {
  const t = getT(lang);
  const { manufacturer, pagination } = detail;
  const { page, totalPages } = pagination;
  const name = companyName(manufacturer);
  const path = companyPage(manufacturer.slug, page);
  const breadcrumbs: BreadcrumbItem[] = [
    { name: t("company.crumb.home"), href: routes.home() },
    { name: t("company.crumb.companies"), href: routes.companies() },
    ...(page > 1
      ? [{ name: manufacturer.name, href: routes.company(manufacturer.slug) }, { name: t("company.crumb.page", { page }) }]
      : [{ name: manufacturer.name }]),
  ];
  // Name only: the registry publishes no other facts about the company.
  const organization = { "@context": "https://schema.org", "@type": "Organization", name: manufacturer.name };

  return (
    <Container className="py-8 sm:py-10">
      <JsonLd data={[organization, breadcrumbJsonLd(breadcrumbs, path, lang)]} />
      <Breadcrumbs items={breadcrumbs} />
      <div className="mt-4 space-y-10">
        <HeroCard>
          <header className="space-y-3">
            <p className="text-sm font-semibold text-pine">{t("company.page.chip")}</p>
            <h1 className="break-words">{companyTitle(t, detail)}</h1>
            <p className="max-w-3xl text-slate-700">
              {t("company.page.intro", {
                name,
                products: productsText(t, detail.productCount),
                generics: genericsText(t, detail.genericCount),
              })}
            </p>
            <div>
              <p className="mb-2 text-sm text-slate-600">{t("company.page.forms")}</p>
              <ul className="flex flex-wrap gap-2">
                {detail.forms.map(({ item, count }) => (
                  <li key={item}>
                    <Link href={routes.dosageForm(item)} className={WHITE_CHIP_CLASS}>
                      {formLabel(t, item, true)}
                      <span className="text-slate-600">· {formatCount(count)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </header>
        </HeroCard>

        {page === 1 && detail.topGenerics.length > 0 && (
          <section aria-labelledby="company-generics">
            <SectionHeading id="company-generics" description={t("company.page.topGenericsDesc")}>
              {t("company.page.topGenerics", { name })}
            </SectionHeading>
            <CountChips items={detail.topGenerics} href={(g) => routes.generic(g.slug)} name={(g) => g.name} />
          </section>
        )}

        <section aria-labelledby="company-products">
          <SectionHeading
            id="company-products"
            description={`${t("company.page.productsDesc")} ${t("company.showing", { n: formatCount(detail.productCount), ...pageRange(pagination, detail.productCount) })}`}
          >
            {t("company.page.products")}
          </SectionHeading>
          <CatalogTable
            label={t("company.page.products")}
            head={
              <>
                <th scope="col" className={TH_CLASS}>{t("company.table.brand")}</th>
                <th scope="col" className={TH_CLASS}>{t("company.table.strength")}</th>
                <th scope="col" className={TH_CLASS}>{t("company.table.form")}</th>
                <th scope="col" className={TH_CLASS}>{t("company.table.dar")}</th>
              </>
            }
          >
            {detail.groups.map(({ generic, products }) => (
              <tbody key={generic.id} className="border-t border-slate-200">
                <tr>
                  <th scope="rowgroup" colSpan={4} className="bg-mist px-3 py-2 text-left">
                    <Link href={routes.generic(generic.slug)} className={LINK_CLASS}>
                      {generic.name}
                    </Link>
                  </th>
                </tr>
                {products.map((m) => (
                  <tr key={m.id} className="border-t border-slate-100">
                    <td className={TD_CLASS}>
                      <Link href={routes.medicine(m.slug)} className={LINK_CLASS}>
                        {m.brandName}
                      </Link>
                    </td>
                    <td className={TD_CLASS}>{m.strength}</td>
                    <td className={TD_CLASS}>{m.dosageFormLabel}</td>
                    <td className={`${TD_CLASS} whitespace-nowrap tabular-nums`}>{m.provenance.darNumber}</td>
                  </tr>
                ))}
              </tbody>
            ))}
          </CatalogTable>
          <Pagination
            page={page}
            totalPages={totalPages}
            hrefFor={(p) => companyPage(manufacturer.slug, p)}
            label={t("company.pagination")}
          />
        </section>

        {page === 1 && <Faq items={companyFaq(detail, t)} />}

        <p className="text-sm text-slate-600">{t("company.notice")}</p>
        <p>
          <Link href={routes.companies()} className="font-medium text-brand-800 underline">
            {t("company.page.allCompanies")}
          </Link>
        </p>
      </div>
    </Container>
  );
}
