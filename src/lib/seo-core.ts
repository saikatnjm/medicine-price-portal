/**
 * Centralised SEO decisions shared by pages, services and the audit: whether a page may be indexed and a
 * quality score used internally to find weak pages. Nothing here is shown to visitors.
 */
import { absoluteUrl, breadcrumbJsonLd, pageMetadata, openGraph } from "./seo";

/** Thin aliases so every route builds SEO output through one vocabulary. */
export const generateMetadata = pageMetadata;
export const generateCanonical = absoluteUrl;
export const generateOpenGraph = openGraph;
export const generateBreadcrumbs = breadcrumbJsonLd;

export type NoindexReason = "invalid" | "needs_review" | "filtered" | "below_threshold" | "no_unique_value";

export interface IndexabilityInput {
  /** False for records that failed validation or are excluded. */
  valid?: boolean;
  /** Record flagged for review during import. */
  needsReview?: boolean;
  /** The URL carries filters, search text or paging. */
  filtered?: boolean;
  /** Number of real entities the page lists (for list / landing pages). */
  count?: number;
  /** Minimum entities for the page to be useful (see SEO_THRESHOLDS). */
  minCount?: number;
  /** The page has information beyond a name, e.g. contact, address, services. */
  hasUniqueValue?: boolean;
}

/** One place that decides `index` vs `noindex` (the site-wide SITE_INDEXABLE switch is applied by pageRobots). */
export function getIndexability(input: IndexabilityInput): { index: boolean; reason: NoindexReason | null } {
  if (input.valid === false) return { index: false, reason: "invalid" };
  if (input.needsReview) return { index: false, reason: "needs_review" };
  if (input.filtered) return { index: false, reason: "filtered" };
  if (input.minCount !== undefined && (input.count ?? 0) < input.minCount) return { index: false, reason: "below_threshold" };
  if (input.hasUniqueValue === false) return { index: false, reason: "no_unique_value" };
  return { index: true, reason: null };
}

export const SEO_SIGNALS = [
  "hasTitle",
  "hasDescription",
  "hasH1",
  "hasCanonical",
  "hasStructuredData",
  "hasUsefulContent",
  "hasLocation",
  "hasSource",
  "hasRelatedLinks",
  "hasBreadcrumb",
  "hasUniqueInformation",
] as const;
export type SeoSignal = (typeof SEO_SIGNALS)[number];

/** Share of signals present (0..1) and which are missing. Internal only. */
export function seoQualityScore(signals: Partial<Record<SeoSignal, boolean>>): { score: number; missing: SeoSignal[] } {
  const missing = SEO_SIGNALS.filter((signal) => !signals[signal]);
  return { score: (SEO_SIGNALS.length - missing.length) / SEO_SIGNALS.length, missing };
}
