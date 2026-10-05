import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { loadPharmacyListData } from "@/components/pharmacy/pharmacy-list-data";
import { PharmacyListView, pharmacyListCopy, pharmacyListPath } from "@/components/pharmacy/pharmacy-list-view";
import type { SearchParamValue } from "@/lib/search-params";
import { pageMetadata } from "@/lib/seo";

interface Props {
  params: Promise<{ location: string }>;
  searchParams: Promise<Record<string, SearchParamValue>>;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const data = await loadPharmacyListData((await params).location, await searchParams);
  if (!data) return { title: "Location not found" };
  const { title, description } = pharmacyListCopy(data);
  return pageMetadata({ title, description, path: pharmacyListPath(data), indexable: data.indexable });
}

export default async function PharmaciesInLocationPage({ params, searchParams }: Props) {
  const data = await loadPharmacyListData((await params).location, await searchParams);
  if (!data) notFound();
  return <PharmacyListView data={data} />;
}
