import type { Metadata } from "next";
import { loadPharmacyListData } from "@/components/pharmacy/pharmacy-list-data";
import { PharmacyListView, pharmacyListCopy, pharmacyListPath } from "@/components/pharmacy/pharmacy-list-view";
import { getT, initLocale } from "@/i18n/server";
import type { SearchParamValue } from "@/lib/search-params";
import { pageMetadata } from "@/lib/seo";

interface Props {
  params?: Promise<{ lang?: string }>;
  searchParams: Promise<Record<string, SearchParamValue>>;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const lang = await initLocale(params);
  const data = await loadPharmacyListData(null, await searchParams);
  if (!data) return { title: getT(lang)("facility.page.pharmacies") };
  const { title, description } = pharmacyListCopy(data, lang);
  return pageMetadata({ title, description, path: pharmacyListPath(data), indexable: data.indexable, lang });
}

export default async function PharmaciesPage({ params, searchParams }: Props) {
  await initLocale(params);
  const data = await loadPharmacyListData(null, await searchParams);
  if (!data) throw new Error("Pharmacy list could not be loaded");
  return <PharmacyListView data={data} />;
}
