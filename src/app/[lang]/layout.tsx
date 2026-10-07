import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { I18nProvider } from "@/i18n/client";
import { isLocale, LOCALES, OG_LOCALES, type Locale } from "@/i18n/config";
import { getT, setLocale } from "@/i18n/server";
import { pageRobots, SOCIAL_IMAGE, twitterCard } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import "../globals.css";

interface LayoutProps {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}

/** Only the supported languages exist; any other first path segment is a 404. */
export const dynamicParams = false;

export function generateStaticParams(): { lang: Locale }[] {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Pick<LayoutProps, "params">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getT(lang);
  const name = t("layout.siteName");
  const description = t("layout.siteDescription");
  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: name, template: `%s | ${name}` },
    description,
    applicationName: name,
    openGraph: {
      type: "website",
      siteName: name,
      locale: lang === "en" ? siteConfig.locale : OG_LOCALES[lang],
      images: [SOCIAL_IMAGE],
    },
    // Search Console "HTML tag" verification; renders nothing unless the variable is set.
    verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
      : undefined,
    twitter: twitterCard(name, description),
    robots: pageRobots(true),
  };
}

export const viewport: Viewport = {
  themeColor: "#0f766e",
};

export default async function RootLayout({ children, params }: Readonly<LayoutProps>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  setLocale(lang);
  const t = getT(lang);
  return (
    <html lang={lang}>
      <body className="flex min-h-dvh flex-col">
        <I18nProvider lang={lang}>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2"
          >
            {t("layout.skipToContent")}
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
        </I18nProvider>
      </body>
    </html>
  );
}
