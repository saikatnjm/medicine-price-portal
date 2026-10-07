import type { Metadata, Viewport } from "next";
import { Suspense, type ReactNode } from "react";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { pageRobots, SOCIAL_IMAGE, twitterCard } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    images: [SOCIAL_IMAGE],
  },
  // Search Console "HTML tag" verification; renders nothing unless the variable is set.
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
  twitter: twitterCard(siteConfig.name, siteConfig.description),
  robots: pageRobots(true),
};

export const viewport: Viewport = {
  themeColor: "#0f766e",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2"
        >
          Skip to main content
        </a>
        <SiteHeader />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        {siteConfig.gaMeasurementId && (
          // Suspense: the page-view tracker reads search params on the client.
          <Suspense fallback={null}>
            <GoogleAnalytics measurementId={siteConfig.gaMeasurementId} />
          </Suspense>
        )}
      </body>
    </html>
  );
}
