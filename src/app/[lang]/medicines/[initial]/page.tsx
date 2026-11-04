import type { Metadata } from "next";
import { initialPageMetadata, renderInitialPage } from "@/components/browse/initial-page";
import { services } from "@/data";
import { initLocale } from "@/i18n/server";

interface InitialPageProps {
  params: Promise<{ lang?: string; initial: string }>;
}

/** The 27 first pages are prerendered; unknown initials 404. */
export async function generateStaticParams(): Promise<{ initial: string }[]> {
  return (await services.browse.listInitials()).map(({ initial }) => ({ initial }));
}

export const dynamicParams = true;

export async function generateMetadata({ params }: InitialPageProps): Promise<Metadata> {
  const lang = await initLocale(params);
  return initialPageMetadata((await params).initial, 1, lang);
}

export default async function MedicinesInitialPage({ params }: InitialPageProps) {
  const lang = await initLocale(params);
  return renderInitialPage((await params).initial, 1, lang);
}
