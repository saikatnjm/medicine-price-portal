import { isUnitDosageForm } from "../domain/medicine";
import type { PriceStats } from "../domain/read-models";
import type {
  AvailabilityStatus,
  CurrencyCode,
  DosageForm,
  Medicine,
  PackSize,
} from "../domain/types";

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

/** "1 pharmacy", "6 pharmacies". */
export function pluralize(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`;
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

const DOSAGE_FORM_LABEL: Record<DosageForm, string> = {
  tablet: "Tablet",
  capsule: "Capsule",
  syrup: "Syrup",
  suspension: "Oral suspension",
  injection: "Injection",
  cream: "Cream",
  ointment: "Ointment",
  drops: "Drops",
  inhaler: "Inhaler",
};

export function formatDosageForm(form: DosageForm): string {
  return DOSAGE_FORM_LABEL[form];
}

/** "Napa 500 mg". */
export function formatMedicineName(medicine: Pick<Medicine, "brandName" | "strength">): string {
  return `${medicine.brandName} ${medicine.strength}`;
}

/** "10 tablets", "60 ml". */
export function formatPackSize(packSize: PackSize): string {
  return `${packSize.quantity} ${packSize.unit}`;
}

/** "৳1.20 per tablet" for tablets/capsules; null for forms where a unit price is not meaningful. */
export function formatUnitPrice(amount: number, medicine: Medicine): string | null {
  if (!isUnitDosageForm(medicine) || medicine.packSize.quantity <= 0) return null;
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
