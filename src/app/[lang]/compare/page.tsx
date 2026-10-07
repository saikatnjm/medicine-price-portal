import type { Metadata } from "next";
import Link from "@/i18n/link";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { MedicalDisclaimer } from "@/components/common/medical-disclaimer";
import { CompareLanding } from "@/components/retention/compare-landing";
import { Container } from "@/components/ui/container";
import { services } from "@/data";
import type { MedicineDetail } from "@/domain/read-models";
import type { Locale } from "@/i18n/config";
import { getT, initLocale } from "@/i18n/server";
import type { Translator } from "@/i18n/translate";
import { formatMedicineName, formatPackSize, formatPriceRange } from "@/lib/format";
import { routes } from "@/lib/routes";
import { readCompareSlugs } from "@/lib/compare";
import { searchHref, type SearchParamValue } from "@/lib/search-params";
import { pageMetadata, type BreadcrumbItem } from "@/lib/seo";

interface CompareParams {
  params?: Promise<{ lang?: string }>;
}

// Depends on the URL only: never indexed.
export async function generateMetadata({ params }: CompareParams = {}): Promise<Metadata> {
  const lang: Locale = await initLocale(params);
  const t = getT(lang);
  return pageMetadata({
    title: t("medicine.compare.title"),
    description: t("medicine.compare.description"),
    path: routes.compare(),
    indexable: false,
    lang,
  });
}

function priceText(detail: MedicineDetail, t: Translator): string {
  return detail.priceStats
    ? t("medicine.compare.price_text", {
        range: formatPriceRange(detail.priceStats),
        label: t(detail.priceStats.hasSampleData ? "medicine.seo.label_sample" : "medicine.seo.label"),
      })
    : t("medicine.compare.not_available");
}

function compareRows(t: Translator): ReadonlyArray<{ label: string; value: (d: MedicineDetail) => string }> {
  return [
    { label: t("medicine.compare.row_generic"), value: (d) => d.generic.name },
    { label: t("medicine.compare.row_manufacturer"), value: (d) => d.manufacturer.name },
    { label: t("medicine.compare.row_strength"), value: (d) => d.medicine.strength || t("medicine.compare.not_published") },
    { label: t("medicine.compare.row_form"), value: (d) => d.medicine.dosageFormLabel },
    {
      label: t("medicine.compare.row_pack"),
      value: (d) => (d.medicine.packSize ? formatPackSize(d.medicine.packSize) : t("medicine.compare.not_published")),
    },
    { label: t("medicine.compare.row_price"), value: (d) => priceText(d, t) },
  ];
}

export default async function ComparePage({
  params,
  searchParams,
}: CompareParams & { searchParams: Promise<Record<string, SearchParamValue>> }) {
  await initLocale(params);
  const t = getT();
  const title = t("medicine.compare.title");
  const breadcrumbs: BreadcrumbItem[] = [{ name: t("medicine.page.home"), href: routes.home() }, { name: title }];
  const rows = compareRows(t);
  const slugs = readCompareSlugs((await searchParams).m);
  const details = await Promise.all(slugs.map((slug) => services.medicines.getMedicineDetail(slug)));
  const found = details.filter((d): d is MedicineDetail => d !== null);
  const missing = slugs.filter((_, i) => details[i] === null);

  return (
    <Container className="py-8 sm:py-10">
      <Breadcrumbs items={breadcrumbs} />
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">{title}</h1>
      <div className="mt-6 space-y-6">
        {found.length === 0 ? (
          <CompareLanding />
        ) : (
          <>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
                <caption className="sr-only">{t("medicine.compare.caption", { n: found.length })}</caption>
                <thead className="bg-slate-50">
                  <tr>
                    <th scope="col" className="p-3 font-medium text-slate-600">
                      <span className="sr-only">{t("medicine.compare.detail_sr")}</span>
                    </th>
                    {found.map((d) => (
                      <th key={d.medicine.id} scope="col" className="p-3 align-top font-semibold text-slate-900">
                        <Link href={routes.medicine(d.medicine.slug)} className="text-brand-800 hover:underline">
                          {formatMedicineName(d.medicine)}
                        </Link>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.label} className="border-t border-slate-200">
                      <th scope="row" className="p-3 align-top font-medium text-slate-600">
                        {row.label}
                      </th>
                      {found.map((d) => (
                        <td key={d.medicine.id} className="p-3 align-top text-slate-900">
                          {row.value(d)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {missing.length > 0 && (
              <p role="note" className="text-sm text-slate-700">
                {missing.length === 1
                  ? t("medicine.compare.missing.one")
                  : t("medicine.compare.missing.other", { n: missing.length })}
              </p>
            )}
            <p className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <Link href={searchHref(found[0]!.generic.name)} className="inline-flex min-h-11 items-center font-medium text-brand-800 underline">
                {t("medicine.compare.more_generic", { name: found[0]!.generic.name })}
              </Link>
              <Link href={routes.search()} className="inline-flex min-h-11 items-center font-medium text-brand-800 underline">
                {t("medicine.compare.search_another")}
              </Link>
            </p>
          </>
        )}
        <MedicalDisclaimer />
      </div>
    </Container>
  );
}
