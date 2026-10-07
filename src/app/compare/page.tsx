import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { MedicalDisclaimer } from "@/components/common/medical-disclaimer";
import { CompareLanding } from "@/components/retention/compare-landing";
import { Container } from "@/components/ui/container";
import { services } from "@/data";
import type { MedicineDetail } from "@/domain/read-models";
import { formatMedicineName, formatPackSize, formatPriceRange, pricesLabel } from "@/lib/format";
import { routes } from "@/lib/routes";
import { readCompareSlugs } from "@/lib/compare";
import { searchHref, type SearchParamValue } from "@/lib/search-params";
import { pageMetadata, type BreadcrumbItem } from "@/lib/seo";

const TITLE = "Compare medicines";

// Depends on the URL only: never indexed.
export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: "Compare medicine products side by side: generic name, manufacturer, strength, form, pack and price information.",
  path: routes.compare(),
  indexable: false,
});

const breadcrumbs: BreadcrumbItem[] = [{ name: "Home", href: routes.home() }, { name: TITLE }];

function priceText(detail: MedicineDetail): string {
  return detail.priceStats
    ? `${formatPriceRange(detail.priceStats)} (${pricesLabel(detail.priceStats.hasSampleData).toLowerCase()})`
    : "Not available";
}

const ROWS: ReadonlyArray<{ label: string; value: (d: MedicineDetail) => string }> = [
  { label: "Generic name", value: (d) => d.generic.name },
  { label: "Manufacturer", value: (d) => d.manufacturer.name },
  { label: "Strength", value: (d) => d.medicine.strength || "Not published" },
  { label: "Dosage form", value: (d) => d.medicine.dosageFormLabel },
  { label: "Pack size", value: (d) => (d.medicine.packSize ? formatPackSize(d.medicine.packSize) : "Not published") },
  { label: "Price", value: priceText },
];

export default async function ComparePage({ searchParams }: { searchParams: Promise<Record<string, SearchParamValue>> }) {
  const slugs = readCompareSlugs((await searchParams).m);
  const details = await Promise.all(slugs.map((slug) => services.medicines.getMedicineDetail(slug)));
  const found = details.filter((d): d is MedicineDetail => d !== null);
  const missing = slugs.filter((_, i) => details[i] === null);

  return (
    <Container className="py-8 sm:py-10">
      <Breadcrumbs items={breadcrumbs} />
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">{TITLE}</h1>
      <div className="mt-6 space-y-6">
        {found.length === 0 ? (
          <CompareLanding />
        ) : (
          <>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
                <caption className="sr-only">Side-by-side comparison of {found.length} medicines</caption>
                <thead className="bg-slate-50">
                  <tr>
                    <th scope="col" className="p-3 font-medium text-slate-600">
                      <span className="sr-only">Detail</span>
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
                  {ROWS.map((row) => (
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
                {missing.length === 1 ? "One medicine" : `${missing.length} medicines`} could not be found and{" "}
                {missing.length === 1 ? "was" : "were"} left out.
              </p>
            )}
            <p className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <Link href={searchHref(found[0]!.generic.name)} className="inline-flex min-h-11 items-center font-medium text-brand-800 underline">
                More {found[0]!.generic.name} medicines
              </Link>
              <Link href={routes.search()} className="inline-flex min-h-11 items-center font-medium text-brand-800 underline">
                Search another medicine
              </Link>
            </p>
          </>
        )}
        <MedicalDisclaimer />
      </div>
    </Container>
  );
}
