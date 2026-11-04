import type { CatalogPagination, CompanyDetail, DosageFormDetail } from "@/domain/read-models";
import type { DosageForm, Manufacturer } from "@/domain/types";
import type { Translator } from "@/i18n/translate";

/** Latin digits with thousands separators in both languages. */
export const formatCount = (n: number) => n.toLocaleString("en-US");

/** "Tablet" / "Tablets" (bn has no plural form). */
export function formLabel(t: Translator, form: DosageForm, plural = false): string {
  return plural ? t(`company.form.${form}.other` as const) : t(`company.form.${form}.one` as const);
}

export const productsText = (t: Translator, n: number) =>
  t(n === 1 ? "company.count.products.one" : "company.count.products.other", { n: formatCount(n) });
export const genericsText = (t: Translator, n: number) =>
  t(n === 1 ? "company.count.generics.one" : "company.count.generics.other", { n: formatCount(n) });
export const companiesText = (t: Translator, n: number) =>
  t(n === 1 ? "company.count.companies.one" : "company.count.companies.other", { n: formatCount(n) });

/** Company name without the trailing full stop of "Ltd.", for titles and sentences. */
export const companyName = (m: Manufacturer) => m.name.replace(/\.$/, "");

/** Products on this page, 1-based: { from: 201, to: 400 }. */
export function pageRange(p: CatalogPagination, total: number) {
  return { from: formatCount(p.offset + 1), to: formatCount(Math.min(p.offset + p.pageSize, total)) };
}

export function companyTitle(t: Translator, d: CompanyDetail): string {
  const name = companyName(d.manufacturer);
  const { page, totalPages } = d.pagination;
  if (page > 1) return t("company.page.titlePaged", { name, page, total: totalPages });
  return t(d.productCount === 1 ? "company.page.title.one" : "company.page.title.other", {
    name,
    n: formatCount(d.productCount),
  });
}

export function companyDescription(t: Translator, d: CompanyDetail): string {
  const name = companyName(d.manufacturer);
  const { page, totalPages } = d.pagination;
  if (page > 1) {
    return t("company.page.descriptionPaged", {
      name,
      page,
      total: totalPages,
      n: formatCount(d.productCount),
      ...pageRange(d.pagination, d.productCount),
    });
  }
  return t("company.page.description", {
    name,
    products: productsText(t, d.productCount),
    generics: genericsText(t, d.genericCount),
    forms: d.forms
      .slice(0, 3)
      .map((f) => formLabel(t, f.item, true).toLowerCase())
      .join(", "),
  });
}

export function dosageFormTitle(t: Translator, d: DosageFormDetail): string {
  const forms = formLabel(t, d.form, true);
  const { page, totalPages } = d.pagination;
  return page > 1
    ? t("company.form.titlePaged", { forms, page, total: totalPages })
    : t("company.form.title", { forms, n: formatCount(d.productCount) });
}

export function dosageFormDescription(t: Translator, d: DosageFormDetail): string {
  const forms = formLabel(t, d.form, true);
  const { page, totalPages } = d.pagination;
  if (page > 1) {
    return t("company.form.descriptionPaged", {
      forms,
      page,
      total: totalPages,
      n: formatCount(d.productCount),
      ...pageRange(d.pagination, d.productCount),
    });
  }
  return t("company.form.description", {
    forms,
    products: productsText(t, d.productCount),
    generics: genericsText(t, d.genericCount),
    companies: companiesText(t, d.companyCount),
  });
}
