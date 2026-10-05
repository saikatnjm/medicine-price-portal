import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { loadFacilityListData } from "@/components/facility/facility-list-data";
import { FacilityListView, facilityListCopy, facilityListPath } from "@/components/facility/facility-list-view";
import type { SearchParamValue } from "@/lib/search-params";
import { pageMetadata } from "@/lib/seo";

interface Props {
  params: Promise<{ location: string }>;
  searchParams: Promise<Record<string, SearchParamValue>>;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const data = await loadFacilityListData({ location: (await params).location }, await searchParams);
  if (!data) return { title: "Location not found" };
  const { title, description } = facilityListCopy(data);
  return pageMetadata({ title, description, path: facilityListPath(data), indexable: data.indexable });
}

export default async function HospitalsInLocationPage({ params, searchParams }: Props) {
  const data = await loadFacilityListData({ location: (await params).location }, await searchParams);
  if (!data) notFound();
  return <FacilityListView data={data} />;
}
