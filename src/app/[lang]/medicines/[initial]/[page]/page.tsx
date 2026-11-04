import type { Metadata } from "next";
import { initialPageMetadata, renderInitialPage } from "@/components/browse/initial-page";
import { initLocale } from "@/i18n/server";
import { parsePageSegment } from "@/lib/routes-browse";

interface InitialPagedProps {
  params: Promise<{ lang?: string; initial: string; page: string }>;
}

/** Pages ≥ 2 render on first request and are then cached; "1", "02", "x" and out-of-range pages 404. */
export async function generateStaticParams(): Promise<{ initial: string; page: string }[]> {
  return [];
}

export const dynamicParams = true;

export async function generateMetadata({ params }: InitialPagedProps): Promise<Metadata> {
  const lang = await initLocale(params);
  const { initial, page } = await params;
  return initialPageMetadata(initial, parsePageSegment(page), lang);
}

export default async function MedicinesInitialPagedPage({ params }: InitialPagedProps) {
  const lang = await initLocale(params);
  const { initial, page } = await params;
  return renderInitialPage(initial, parsePageSegment(page), lang);
}
