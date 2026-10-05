import type { Metadata } from "next";
import { FacilityListView, facilityListCopy, facilityListPath } from "@/components/facility/facility-list-view";
import { loadFacilityListData } from "@/components/facility/facility-list-data";
import type { SearchParamValue } from "@/lib/search-params";
import { pageMetadata } from "@/lib/seo";

interface HospitalsPageProps {
  searchParams: Promise<Record<string, SearchParamValue>>;
}

export async function generateMetadata({ searchParams }: HospitalsPageProps): Promise<Metadata> {
  const data = await loadFacilityListData({}, await searchParams);
  if (!data) return { title: "Hospitals & clinics" };
  const { title, description } = facilityListCopy(data);
  return pageMetadata({ title, description, path: facilityListPath(data), indexable: data.indexable });
}

export default async function HospitalsPage({ searchParams }: HospitalsPageProps) {
  const data = await loadFacilityListData({}, await searchParams);
  if (!data) throw new Error("Hospital list could not be loaded");
  return <FacilityListView data={data} />;
}
