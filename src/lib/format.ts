import { isUnitDosageForm } from "../domain/medicine";
import type { PriceStats } from "../domain/read-models";
import type { AvailabilityStatus, CurrencyCode, Medicine, PackSize } from "../domain/types";

const CURRENCY_SYMBOL: Record<CurrencyCode, string> = { BDT: "৳" };

const amountFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Formats a price, e.g. 1234.5 → "৳1,234.50". Deterministic across environments. */
export function formatPrice(amount: number, currency: CurrencyCode = "BDT"): string {
  return `${CURRENCY_SYMBOL[currency]}${amountFormatter.format(amount)}`;
}

/** "৳11.00" or "৳11.00–৳12.00". */
export function formatPriceRange(stats: PriceStats, currency: CurrencyCode = "BDT"): string {
  return stats.lowest === stats.highest
    ? formatPrice(stats.lowest, currency)
    : `${formatPrice(stats.lowest, currency)}–${formatPrice(stats.highest, currency)}`;
}

/** "1 pharmacy", "6 pharmacies", "1,560 facilities". */
export function pluralize(count: number, singular: string, plural: string): string {
  return `${count.toLocaleString("en-US")} ${count === 1 ? singular : plural}`;
}

/** "Sample prices" while data is sample data, otherwise "Prices". */
export function pricesLabel(hasSampleData: boolean): string {
  return hasSampleData ? "Sample prices" : "Prices";
}

const AVAILABILITY_LABEL: Record<AvailabilityStatus, string> = {
  in_stock: "In stock",
  limited: "Limited stock",
  out_of_stock: "Out of stock",
  unknown: "Availability unknown",
};

/** Text label for availability; never rely on colour alone. */
export function formatAvailability(status: AvailabilityStatus): string {
  return AVAILABILITY_LABEL[status];
}

/** "Napa 500 mg"; just the brand when no strength is published. */
export function formatMedicineName(medicine: Pick<Medicine, "brandName" | "strength">): string {
  return medicine.strength ? `${medicine.brandName} ${medicine.strength}` : medicine.brandName;
}

/** "10 tablets", "60 ml". */
export function formatPackSize(packSize: PackSize): string {
  return `${packSize.quantity} ${packSize.unit}`;
}

/** "৳1.20 per tablet" for tablets/capsules; null for forms where a unit price is not meaningful. */
export function formatUnitPrice(amount: number, medicine: Medicine): string | null {
  if (!isUnitDosageForm(medicine) || !medicine.packSize || medicine.packSize.quantity <= 0) {
    return null;
  }
  return `${formatPrice(amount / medicine.packSize.quantity)} per ${medicine.dosageForm}`;
}

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Dhaka",
});

/** Formats an ISO date, e.g. "1 Oct 2026". */
export function formatDate(iso: string): string {
  return dateFormatter.format(new Date(iso));
}

/** "Dhanmondi, Dhaka"; skips missing parts and repeats ("Dhaka, Dhaka" → "Dhaka"). Empty string when unknown. */
export function formatPlace(...parts: ReadonlyArray<string | null | undefined>): string {
  const seen = new Set<string>();
  return parts
    .map((p) => p?.trim())
    .filter((p): p is string => {
      if (!p || seen.has(p.toLowerCase())) return false;
      seen.add(p.toLowerCase());
      return true;
    })
    .join(", ");
}
