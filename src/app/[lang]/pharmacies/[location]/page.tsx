import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { loadPharmacyListData } from "@/components/pharmacy/pharmacy-list-data";
import { PharmacyListView, pharmacyListCopy, pharmacyListPath } from "@/components/pharmacy/pharmacy-list-view";
import { getT, initLocale } from "@/i18n/server";
import type { SearchParamValue } from "@/lib/search-params";
import { pageMetadata } from "@/lib/seo";

interface Props {
  params: Promise<{ lang?: string; location: string }>;
  searchParams: Promise<Record<string, SearchParamValue>>;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const lang = await initLocale(params);
  const data = await loadPharmacyListData((await params).location, await searchParams);
  if (!data) return { title: getT(lang)("facility.page.locationNotFound") };
  const { title, description } = pharmacyListCopy(data, lang);
  return pageMetadata({ title, description, path: pharmacyListPath(data), indexable: data.indexable, lang });
}

export default async function PharmaciesInLocationPage({ params, searchParams }: Props) {
  await initLocale(params);
  const data = await loadPharmacyListData((await params).location, await searchParams);
  if (!data) notFound();
  return <PharmacyListView data={data} />;
}
