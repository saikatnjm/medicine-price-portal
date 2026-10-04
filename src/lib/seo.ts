import type { Metadata } from "next";
import type { MedicineDetail, PharmacyDetail } from "../domain/read-models";
import { formatDosageForm, formatMedicineName, pluralize, pricesLabel } from "./format";
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

export function medicineTitle(detail: MedicineDetail): string {
  const { medicine, generic, hasSampleData } = detail;
  return `${formatMedicineName(medicine)} ${formatDosageForm(medicine.dosageForm)} (${generic.name}) – ${hasSampleData ? "Sample Prices" : "Prices"} & Alternatives`;
}

export function medicineDescription(detail: MedicineDetail): string {
  const { medicine, generic, manufacturer, priceStats } = detail;
  const maker = manufacturer.name.replace(/\.$/, "");
  const intro = `${formatMedicineName(medicine)} ${formatDosageForm(medicine.dosageForm).toLowerCase()} by ${maker}. Generic: ${generic.name}.`;
  const prices = priceStats
    ? ` Compare ${pricesLabel(priceStats.hasSampleData).toLowerCase()} from ${pluralize(priceStats.count, "pharmacy", "pharmacies")} in Bangladesh and see same-generic alternatives.`
    : " See generic information and same-generic alternatives.";
  return intro + prices;
}

export function pharmacyTitle(detail: PharmacyDetail): string {
  const { pharmacy, hasSampleData } = detail;
  const suffix = hasSampleData ? " – Sample Pharmacy Listing" : "";
  return `${pharmacy.name}, ${pharmacy.area}, ${pharmacy.city}${suffix}`;
}

export function pharmacyDescription(detail: PharmacyDetail): string {
  const { pharmacy, prices, hasSampleData } = detail;
  const base = `${pricesLabel(hasSampleData)} for ${pluralize(prices.length, "medicine", "medicines")} at ${pharmacy.name} in ${pharmacy.area}, ${pharmacy.city}.`;
  return hasSampleData ? `${base} Demonstration data, not live pharmacy information.` : base;
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
 * schema.org Drug. Deliberately contains no offers/prices: Phase-1 prices are
 * sample data and must not appear as real prices in search results.
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
    dosageForm: formatDosageForm(medicine.dosageForm),
    manufacturer: { "@type": "Organization", name: manufacturer.name },
    prescriptionStatus: medicine.prescriptionRequired
      ? "https://schema.org/PrescriptionOnly"
      : "https://schema.org/OTC",
  };
}

/** Serialises JSON-LD for a <script> tag, escaping "<" to prevent breaking out of it. */
export function serializeJsonLd(data: JsonLd | JsonLd[]): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
