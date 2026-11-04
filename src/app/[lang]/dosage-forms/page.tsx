import type { Metadata } from "next";
import Link from "@/i18n/link";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { JsonLd } from "@/components/common/json-ld";
import { formatCount, formLabel, productsText } from "@/components/company/catalog-text";
import { Container } from "@/components/ui/container";
import { services } from "@/data";
import { getT, initLocale } from "@/i18n/server";
import { routes } from "@/lib/routes";
import { breadcrumbJsonLd, pageMetadata, type BreadcrumbItem } from "@/lib/seo";

interface DosageFormsPageProps {
  params?: Promise<{ lang?: string }>;
}

export async function generateMetadata({ params }: DosageFormsPageProps): Promise<Metadata> {
  const lang = await initLocale(params);
  const t = getT(lang);
  const forms = await services.companies.listDosageForms();
  const total = forms.reduce((sum, f) => sum + f.productCount, 0);
  return pageMetadata({
    title: t("company.forms.title"),
    description: t("company.forms.description", { n: formatCount(total) }),
    path: routes.dosageForms(),
    lang,
  });
}

export default async function DosageFormsPage({ params }: DosageFormsPageProps) {
  const lang = await initLocale(params);
  const t = getT(lang);
  const breadcrumbs: BreadcrumbItem[] = [
    { name: t("company.crumb.home"), href: routes.home() },
    { name: t("company.crumb.forms") },
  ];
  const forms = [...(await services.companies.listDosageForms())].sort((a, b) => b.productCount - a.productCount);
  return (
    <Container className="py-8 sm:py-10">
      <JsonLd data={breadcrumbJsonLd(breadcrumbs, routes.dosageForms(), lang)} />
      <Breadcrumbs items={breadcrumbs} />
      <h1 className="mt-4">{t("company.forms.heading")}</h1>
      <p className="mt-2 max-w-3xl text-slate-700">{t("company.forms.intro")}</p>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {forms.map(({ form, productCount }) => (
          <li key={form}>
            <Link
              href={routes.dosageForm(form)}
              className="flex min-h-14 items-center justify-between gap-3 rounded-2xl bg-mist px-4 py-3 transition-colors hover:bg-brand-100"
            >
              <span className="font-medium text-ink">{formLabel(t, form, true)}</span>
              <span className="text-sm text-slate-600">{productsText(t, productCount)}</span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-sm text-slate-600">{t("company.notice")}</p>
      <p className="mt-4">
        <Link href={routes.companies()} className="font-medium text-brand-800 underline">
          {t("company.page.allCompanies")}
        </Link>
      </p>
    </Container>
  );
}
