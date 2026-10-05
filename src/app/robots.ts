import type { MetadataRoute } from "next";
import { listSitemapIds } from "@/lib/sitemap-ids";
import { siteConfig } from "@/lib/site-config";

export default async function robots(): Promise<MetadataRoute.Robots> {
  if (!siteConfig.indexable) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  const ids = await listSitemapIds();
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/search"] },
    sitemap: ids.map((id) => `${siteConfig.url}/sitemap/${id}.xml`),
    host: siteConfig.url,
  };
}
