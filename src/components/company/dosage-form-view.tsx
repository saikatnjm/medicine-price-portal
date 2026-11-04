import type { Metadata } from "next";
import Link from "@/i18n/link";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { JsonLd } from "@/components/common/json-ld";
import { SectionHeading } from "@/components/common/section-heading";
import { Pagination } from "@/components/directory/pagination";
import { Container } from "@/components/ui/container";
import { HeroCard } from "@/components/ui/hero-card";
import type { DosageFormDetail } from "@/domain/read-models";
import type { Locale } from "@/i18n/config";
import { getT } from "@/i18n/server";
import { routes } from "@/lib/routes";
import { dosageFormPage } from "@/lib/routes-catalog";
import { breadcrumbJsonLd, pageMetadata, type BreadcrumbItem } from "@/lib/seo";
import {
  companiesText,
  companyName,
  dosageFormDescription,
  dosageFormTitle,
  formatCount,
  formLabel,
  genericsText,
  pageRange,
  productsText,
} from "./catalog-text";
import { CatalogTable, CountChips, LINK_CLASS, TD_CLASS, TH_CLASS } from "./catalog-ui";

export function dosageFormMetadata(detail: DosageFormDetail, lang: Locale): Metadata {
  const t = getT(lang);
  return pageMetadata({
    title: dosageFormTitle(t, detail),
    description: dosageFormDescription(t, detail),
    path: dosageFormPage(detail.form, detail.pagination.page),
    indexable: detail.indexable,
    lang,
  });
}

/** Dosage-form page: page 1 at /dosage-forms/x, later brand-list pages at /dosage-forms/x/2 ... */
export function DosageFormView({ detail, lang }: { detail: DosageFormDetail; lang: Locale }) {
  const t = getT(lang);
  const { form, pagination } = detail;
  const { page, totalPages } = pagination;
  const forms = formLabel(t, form, true);
  const path = dosageFormPage(form, page);
  const breadcrumbs: BreadcrumbItem[] = [
    { name: t("company.crumb.home"), href: routes.home() },
    { name: t("company.crumb.forms"), href: routes.dosageForms() },
    ...(page > 1
      ? [{ name: forms, href: routes.dosageForm(form) }, { name: t("company.crumb.page", { page }) }]
      : [{ name: forms }]),
  ];

  return (
    <Container className="py-8 sm:py-10">
      <JsonLd data={breadcrumbJsonLd(breadcrumbs, path, lang)} />
      <Breadcrumbs items={breadcrumbs} />
      <div className="mt-4 space-y-10">
        <HeroCard>
          <header className="space-y-3">
            <p className="text-sm font-semibold text-pine">{t("company.form.chip")}</p>
            <h1 className="break-words">
              {page > 1
                ? t("company.form.headingPaged", { forms, page, total: totalPages })
                : t("company.form.heading", { forms })}
            </h1>
            <p className="max-w-3xl text-slate-700">
              {t("company.form.intro", {
                products: productsText(t, detail.productCount),
                generics: genericsText(t, detail.genericCount),
                companies: companiesText(t, detail.companyCount),
              })}
            </p>
            {page === 1 && detail.labels.length > 1 && (
              <div>
                <p className="mb-1 text-sm text-slate-600">{t("company.form.labels")}</p>
                <p className="text-sm text-slate-700">
                  {detail.labels.map(({ item, count }) => `${item} (${formatCount(count)})`).join(" · ")}
                </p>
              </div>
            )}
          </header>
        </HeroCard>

        {page === 1 && (
          <>
            <section aria-labelledby="form-generics">
              <SectionHeading id="form-generics" description={t("company.form.topGenericsDesc")}>
                {t("company.form.topGenerics")}
              </SectionHeading>
              <CountChips items={detail.topGenerics} href={(g) => routes.generic(g.slug)} name={(g) => g.name} />
            </section>
            <section aria-labelledby="form-companies">
              <SectionHeading id="form-companies" description={t("company.form.topCompaniesDesc")}>
                {t("company.form.topCompanies")}
              </SectionHeading>
              <CountChips items={detail.topCompanies} href={(m) => routes.company(m.slug)} name={companyName} />
            </section>
          </>
        )}

        <section aria-labelledby="form-products">
          <SectionHeading
            id="form-products"
            description={`${t("company.form.productsDesc")} ${t("company.showing", { n: formatCount(detail.productCount), ...pageRange(pagination, detail.productCount) })}`}
          >
            {t("company.form.products")}
          </SectionHeading>
          <CatalogTable
            label={t("company.form.products")}
            head={
              <>
                <th scope="col" className={TH_CLASS}>{t("company.table.brand")}</th>
                <th scope="col" className={TH_CLASS}>{t("company.table.strength")}</th>
                <th scope="col" className={TH_CLASS}>{t("company.table.generic")}</th>
                <th scope="col" className={TH_CLASS}>{t("company.table.company")}</th>
              </>
            }
          >
            <tbody>
              {detail.products.map(({ medicine, generic, manufacturer }) => (
                <tr key={medicine.id} className="border-t border-slate-100">
                  <td className={TD_CLASS}>
                    <Link href={routes.medicine(medicine.slug)} className={LINK_CLASS}>
                      {medicine.brandName}
                    </Link>
                  </td>
                  <td className={TD_CLASS}>{medicine.strength}</td>
                  <td className={TD_CLASS}>{generic.name}</td>
                  <td className={TD_CLASS}>{companyName(manufacturer)}</td>
                </tr>
              ))}
            </tbody>
          </CatalogTable>
          <Pagination
            page={page}
            totalPages={totalPages}
            hrefFor={(p) => dosageFormPage(form, p)}
            label={t("company.pagination")}
          />
        </section>

        <p className="text-sm text-slate-600">{t("company.notice")}</p>
        <p className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href={routes.dosageForms()} className="font-medium text-brand-800 underline">
            {t("company.form.allForms")}
          </Link>
          <Link href={routes.companies()} className="font-medium text-brand-800 underline">
            {t("company.page.allCompanies")}
          </Link>
        </p>
      </div>
    </Container>
  );
}
