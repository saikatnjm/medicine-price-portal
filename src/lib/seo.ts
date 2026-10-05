import type { Metadata } from "next";
import type { MedicineDetail } from "../domain/read-models";
import { formatMedicineName, pluralize, pricesLabel } from "./format";
import { routes } from "./routes";
import { siteConfig } from "./site-config";

export function absoluteUrl(path: string): string {
  return new URL(path, `${siteConfig.url}/`).toString();
}

/**
 * Robots directives for a page. Pages are only indexable when the site is
 * indexable (SITE_INDEXABLE=true on production) and the page itself should be.
 */
export function pageRobots(indexablePage: boolean): Metadata["robots"] {
  return {
    index: siteConfig.indexable && indexablePage,
    follow: siteConfig.indexable,
  };
}

/** Page-level OpenGraph (Next.js replaces, not merges, the layout's openGraph object). */
export function openGraph(path: string, title: string, description: string): Metadata["openGraph"] {
  return {
    type: "website",
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    url: path,
    title,
    description,
  };
}

export interface PageMetadataInput {
  /** Page title without the site name (the layout template appends it). */
  title: string;
  description: string;
  /** Canonical path, e.g. "/hospitals/dhaka". */
  path: string;
  /** False for thin, empty or filtered pages: noindex (still followed). */
  indexable?: boolean;
}

/** Standard metadata for a page: title, description, canonical, OpenGraph and robots. */
export function pageMetadata({ title, description, path, indexable = true }: PageMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: openGraph(path, title, description),
    robots: pageRobots(indexable),
  };
}

const TITLE_MAX_LENGTH = 70;

/** Longest prefix of a generic list ("A + B + C", "A, B") that fits, cut at an item boundary. */
function fitGenerics(generic: string, maxLength: number): string | null {
  if (generic.length <= maxLength) return generic;
  const parts = generic.split(/\s*(?:\+|,|;)\s*/).filter(Boolean);
  let fitted = "";
  for (const part of parts) {
    const next = fitted ? `${fitted} + ${part}` : part;
    if (next.length + 7 > maxLength) break; // room for " + more"
    fitted = next;
  }
  return fitted && fitted !== generic ? `${fitted} + more` : null;
}

export function medicineTitle(detail: MedicineDetail): string {
  const { medicine, generic, priceStats } = detail;
  const name = `${formatMedicineName(medicine)} ${medicine.dosageFormLabel}`.trim();
  const suffix = ` — Medicine Information & ${priceStats ? "Price" : "Alternatives"}`;
  // Include the generic name only while the whole title stays short enough.
  const room = TITLE_MAX_LENGTH - name.length - suffix.length - 3; // " (" + ")"
  const fitted = room > 0 ? fitGenerics(generic.name, room) : null;
  return `${name}${fitted ? ` (${fitted})` : ""}${suffix}`;
}

export function medicineDescription(detail: MedicineDetail): string {
  const { medicine, generic, manufacturer, priceStats } = detail;
  const maker = manufacturer.name.replace(/\.$/, "");
  const intro = `${formatMedicineName(medicine)} ${medicine.dosageFormLabel.toLowerCase()} by ${maker}, registered with DGDA Bangladesh. Generic: ${generic.name}.`;
  const prices = priceStats
    ? ` Compare ${pricesLabel(priceStats.hasSampleData).toLowerCase()} from ${pluralize(priceStats.count, "pharmacy", "pharmacies")} and see same-generic brands.`
    : ` See ${detail.alternativesTotal > 0 ? `${pluralize(detail.alternativesTotal, "other brand", "other brands")} of the same generic, strength and form` : "other strengths and forms of the same generic"}.`;
  return intro + prices;
}

// ------------------------------------------------------------ structured data

type JsonLd = Record<string, unknown>;

export interface BreadcrumbItem {
  name: string;
  /** Omit for the current page. */
  href?: string;
}

export function breadcrumbJsonLd(items: readonly BreadcrumbItem[], currentPath: string): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.href ?? currentPath),
    })),
  };
}

/**
 * schema.org Drug. Deliberately contains no offers/prices. Prescription status
 * is included only when a source publishes it.
 */
export function medicineJsonLd(detail: MedicineDetail): JsonLd {
  const { medicine, generic, manufacturer } = detail;
  return {
    "@context": "https://schema.org",
    "@type": "Drug",
    name: formatMedicineName(medicine),
    url: absoluteUrl(routes.medicine(medicine.slug)),
    description: medicine.description,
    nonProprietaryName: generic.name,
    activeIngredient: generic.name,
    dosageForm: medicine.dosageFormLabel,
    manufacturer: { "@type": "Organization", name: manufacturer.name },
    ...(medicine.prescriptionRequired === undefined
      ? {}
      : {
          prescriptionStatus: medicine.prescriptionRequired
            ? "https://schema.org/PrescriptionOnly"
            : "https://schema.org/OTC",
        }),
  };
}

/** Serialises JSON-LD for a <script> tag, escaping "<" to prevent breaking out of it. */
export function serializeJsonLd(data: JsonLd | JsonLd[]): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
