import type { Metadata } from "next";
import Link from "@/i18n/link";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { JsonLd } from "@/components/common/json-ld";
import { SectionHeading } from "@/components/common/section-heading";
import { companiesText, companyName, formatCount, productsText } from "@/components/company/catalog-text";
import { CatalogTable, LINK_CLASS, TD_CLASS, TH_CLASS } from "@/components/company/catalog-ui";
import { Container } from "@/components/ui/container";
import { services } from "@/data";
import { getT, initLocale } from "@/i18n/server";
import { routes } from "@/lib/routes";
import { breadcrumbJsonLd, pageMetadata, type BreadcrumbItem } from "@/lib/seo";

interface CompaniesPageProps {
  params?: Promise<{ lang?: string }>;
}

type CompanyListEntry = Awaited<ReturnType<typeof services.companies.listCompanies>>[number];

/** Rows in the "by number of registered products" table; every company is in the A–Z list. */
const RANKED_ROWS = 50;

/** "A"–"Z", anything else under "#". */
const initialOf = (name: string) => {
  const c = name.trim().charAt(0).toUpperCase();
  return c >= "A" && c <= "Z" ? c : "#";
};

function byInitial(entries: readonly CompanyListEntry[]): [string, CompanyListEntry[]][] {
  const groups = new Map<string, CompanyListEntry[]>();
  for (const e of entries) {
    const key = initialOf(e.manufacturer.name);
    groups.set(key, [...(groups.get(key) ?? []), e]);
  }
  return [...groups].sort(([a], [b]) => (a === "#" ? 1 : b === "#" ? -1 : a.localeCompare(b)));
}

export async function generateMetadata({ params }: CompaniesPageProps): Promise<Metadata> {
  const lang = await initLocale(params);
  const t = getT(lang);
  const n = formatCount((await services.companies.listCompanies()).length);
  return pageMetadata({
    title: t("company.list.title", { n }),
    description: t("company.list.description", { n }),
    path: routes.companies(),
    lang,
  });
}

export default async function CompaniesPage({ params }: CompaniesPageProps) {
  const lang = await initLocale(params);
  const t = getT(lang);
  const breadcrumbs: BreadcrumbItem[] = [
    { name: t("company.crumb.home"), href: routes.home() },
    { name: t("company.crumb.companies") },
  ];
  const [alphabetical, ranked] = await Promise.all([
    services.companies.listCompanies(),
    services.companies.listRanked(),
  ]);
  const totalProducts = alphabetical.reduce((sum, e) => sum + e.productCount, 0);

  return (
    <Container className="py-8 sm:py-10">
      <JsonLd data={breadcrumbJsonLd(breadcrumbs, routes.companies(), lang)} />
      <Breadcrumbs items={breadcrumbs} />
      <h1 className="mt-4">{t("company.list.heading")}</h1>
      <p className="mt-2 max-w-3xl text-slate-700">
        {t("company.list.intro", {
          companies: companiesText(t, alphabetical.length),
          products: productsText(t, totalProducts),
        })}
      </p>
      <p className="mt-3">
        <Link href={routes.dosageForms()} className="font-medium text-brand-800 underline">
          {t("company.list.byForm")}
        </Link>
      </p>

      <div className="mt-8 space-y-10">
        <section aria-labelledby="companies-ranked">
          <SectionHeading id="companies-ranked" description={t("company.list.rankDesc")}>
            {t("company.list.rankHeading")}
          </SectionHeading>
          <CatalogTable
            label={t("company.list.rankHeading")}
            head={
              <>
                <th scope="col" className={`${TH_CLASS} w-12`}>{t("company.table.rank")}</th>
                <th scope="col" className={TH_CLASS}>{t("company.table.company")}</th>
                <th scope="col" className={`${TH_CLASS} text-right`}>{t("company.table.products")}</th>
              </>
            }
          >
            <tbody>
              {ranked.slice(0, RANKED_ROWS).map(({ manufacturer, productCount }, index) => (
                <tr key={manufacturer.id} className="border-t border-slate-100">
                  <td className={`${TD_CLASS} tabular-nums text-slate-600`}>{index + 1}</td>
                  <td className={TD_CLASS}>
                    <Link href={routes.company(manufacturer.slug)} className={LINK_CLASS}>
                      {manufacturer.name}
                    </Link>
                  </td>
                  <td className={`${TD_CLASS} text-right tabular-nums`}>{formatCount(productCount)}</td>
                </tr>
              ))}
            </tbody>
          </CatalogTable>
        </section>

        <section aria-labelledby="companies-az">
          <SectionHeading id="companies-az">{t("company.list.azHeading")}</SectionHeading>
          <div className="space-y-6">
            {byInitial(alphabetical).map(([initial, entries]) => (
              <div key={initial}>
                <h3 className="mb-2 text-lg font-semibold text-ink">{initial}</h3>
                <ul className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
                  {entries.map(({ manufacturer, productCount }) => (
                    <li key={manufacturer.id} className="flex flex-wrap items-baseline gap-x-2">
                      <Link href={routes.company(manufacturer.slug)} className={LINK_CLASS}>
                        {companyName(manufacturer)}
                      </Link>
                      <span className="text-sm text-slate-600">{productsText(t, productCount)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <p className="text-sm text-slate-600">{t("company.notice")}</p>
      </div>
    </Container>
  );
}
