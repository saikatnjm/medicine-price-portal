import type { Metadata } from "next";
import { FacilityListView, facilityListCopy, facilityListPath } from "@/components/facility/facility-list-view";
import { loadFacilityListData } from "@/components/facility/facility-list-data";
import { getT, initLocale } from "@/i18n/server";
import type { SearchParamValue } from "@/lib/search-params";
import { pageMetadata } from "@/lib/seo";

interface HospitalsPageProps {
  params?: Promise<{ lang?: string }>;
  searchParams: Promise<Record<string, SearchParamValue>>;
}

export async function generateMetadata({ params, searchParams }: HospitalsPageProps): Promise<Metadata> {
  const lang = await initLocale(params);
  const data = await loadFacilityListData({}, await searchParams);
  if (!data) return { title: getT(lang)("facility.page.hospitals") };
  const { title, description } = facilityListCopy(data, lang);
  return pageMetadata({ title, description, path: facilityListPath(data), indexable: data.indexable, lang });
}

export default async function HospitalsPage({ params, searchParams }: HospitalsPageProps) {
  await initLocale(params);
  const data = await loadFacilityListData({}, await searchParams);
  if (!data) throw new Error("Hospital list could not be loaded");
  return <FacilityListView data={data} />;
}
