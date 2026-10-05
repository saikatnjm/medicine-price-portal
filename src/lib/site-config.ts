/**
 * Site-wide configuration from environment variables.
 * See .env.example. No secrets are required in Phase 1.
 */

const LOCAL_SITE_URL = "http://localhost:3000";

/**
 * NEXT_PUBLIC_SITE_URL wins; on Vercel the production domain is used as a
 * fallback so canonical URLs never point at localhost.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const vercelProduction = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  const raw = explicit || (vercelProduction ? `https://${vercelProduction}` : LOCAL_SITE_URL);
  return raw.replace(/\/+$/, "");
}

/**
 * Indexing is opt-in (SITE_INDEXABLE=true) and never allowed on Vercel
 * preview/development deployments, so sample data is not indexed by accident.
 */
function resolveIndexable(): boolean {
  const vercelEnv = process.env.VERCEL_ENV;
  if (vercelEnv && vercelEnv !== "production") return false;
  return process.env.SITE_INDEXABLE === "true";
}

export const siteConfig = {
  name: "Bangladesh Healthcare Search",
  shortName: "BD Healthcare Search",
  description:
    "Find medicines, hospitals, clinics, pharmacies and specialties across Bangladesh: registered medicine information, locations, contact details and directions.",
  locale: "en_BD",
  url: resolveSiteUrl(),
  indexable: resolveIndexable(),
} as const;
