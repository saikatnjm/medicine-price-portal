import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { loadFacilityListData } from "@/components/facility/facility-list-data";
import { FacilityListView, facilityListCopy, facilityListPath } from "@/components/facility/facility-list-view";
import { getT, initLocale } from "@/i18n/server";
import type { SearchParamValue } from "@/lib/search-params";
import { pageMetadata } from "@/lib/seo";

interface Props {
  params: Promise<{ lang?: string; location: string; specialty: string }>;
  searchParams: Promise<Record<string, SearchParamValue>>;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const lang = await initLocale(params);
  const { location, specialty } = await params;
  const data = await loadFacilityListData({ location, specialty }, await searchParams);
  if (!data) return { title: getT(lang)("facility.page.notFound") };
  const { title, description } = facilityListCopy(data, lang);
  return pageMetadata({ title, description, path: facilityListPath(data), indexable: data.indexable, lang });
}

export default async function HospitalsByLocationAndSpecialtyPage({ params, searchParams }: Props) {
  await initLocale(params);
  const { location, specialty } = await params;
  const data = await loadFacilityListData({ location, specialty }, await searchParams);
  if (!data) notFound();
  return <FacilityListView data={data} />;
}
