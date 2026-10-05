import type { Metadata } from "next";
import { loadPharmacyListData } from "@/components/pharmacy/pharmacy-list-data";
import { PharmacyListView, pharmacyListCopy, pharmacyListPath } from "@/components/pharmacy/pharmacy-list-view";
import type { SearchParamValue } from "@/lib/search-params";
import { pageMetadata } from "@/lib/seo";

interface Props {
  searchParams: Promise<Record<string, SearchParamValue>>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const data = await loadPharmacyListData(null, await searchParams);
  if (!data) return { title: "Pharmacies" };
  const { title, description } = pharmacyListCopy(data);
  return pageMetadata({ title, description, path: pharmacyListPath(data), indexable: data.indexable });
}

export default async function PharmaciesPage({ searchParams }: Props) {
  const data = await loadPharmacyListData(null, await searchParams);
  if (!data) throw new Error("Pharmacy list could not be loaded");
  return <PharmacyListView data={data} />;
}
