"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { useEffect } from "react";
import { sanitizePageLocation } from "@/lib/analytics";

type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}

/**
 * Sends one page_view per client-side navigation. Automatic page views are off
 * (send_page_view: false) so every URL passes through sanitizePageLocation first.
 */
function PageViewTracker({ measurementId }: { measurementId: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();

  useEffect(() => {
    const location = sanitizePageLocation(window.location.href);
    if (!location) return;
    window.gtag?.("event", "page_view", {
      send_to: measurementId,
      page_location: location,
      page_title: document.title,
    });
  }, [measurementId, pathname, search]);

  return null;
}

/** Loads gtag.js after the page is interactive. Rendered only when a measurement id is configured. */
export function GoogleAnalytics({ measurementId }: { measurementId: string }) {
  const id = JSON.stringify(measurementId);
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config',${id},{send_page_view:false});`}
      </Script>
      <PageViewTracker measurementId={measurementId} />
    </>
  );
}
