import type { MetadataRoute } from "next";
import { listSitemapIds } from "@/lib/sitemap-ids";
import { siteConfig } from "@/lib/site-config";

/**
 * Crawlers that bring no search visitors but crawl the ~95k pages heavily (SEO-tool and AI-training
 * bots). Each uncached page they fetch costs an ISR write and origin transfer on Vercel. Search
 * engines (Googlebot, Bingbot, …) are unaffected. Well-behaved bots honour this; enforce the rest
 * with the Vercel Firewall bot rules.
 */
const BLOCKED_CRAWLERS = [
  "AhrefsBot",
  "SemrushBot",
  "MJ12bot",
  "DotBot",
  "PetalBot",
  "BLEXBot",
  "DataForSeoBot",
  "SeznamBot",
  "GPTBot",
  "ClaudeBot",
  "anthropic-ai",
  "CCBot",
  "Bytespider",
  "Amazonbot",
  "meta-externalagent",
  "PerplexityBot",
  "Google-Extended",
  "Applebot-Extended",
] as const;

export default async function robots(): Promise<MetadataRoute.Robots> {
  if (!siteConfig.indexable) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  const ids = await listSitemapIds();
  return {
    rules: [
      { userAgent: [...BLOCKED_CRAWLERS], disallow: "/" },
      // Search and filter state is never a landing page (those URLs are also noindex).
      { userAgent: "*", allow: "/", disallow: ["/api/", "/search", "/bn/search", "/*?*q=", "/*?*near=", "/*?*page="] },
    ],
    sitemap: [`${siteConfig.url}/sitemap-index.xml`, ...ids.map((id) => `${siteConfig.url}/sitemap/${id}.xml`)],
    host: siteConfig.url,
  };
}
