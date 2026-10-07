import type { ComponentType } from "react";
import type { MessageKey } from "@/i18n/messages";
import {
  DoctorIcon,
  HospitalIcon,
  PharmacyIcon,
  PillIcon,
  PinIcon,
  StethoscopeIcon,
} from "@/components/ui/icons";

export type CategoryType = "medicine" | "doctor" | "hospital" | "pharmacy" | "location" | "specialty";

export interface CategoryStyle {
  Icon: ComponentType<{ className?: string }>;
  /** Soft background and strong foreground as separate classes (e.g. a tinted tile with a white icon chip). */
  bg: string;
  fg: string;
  /** Soft tinted background + strong foreground for the icon tile (full class names for Tailwind). */
  tint: string;
  /** Plural, translated label ("Medicines"); the icon is never the only signal. */
  labelKey: MessageKey;
}

/** Single source of truth for how each entity type looks wherever it appears. */
export const CATEGORY: Record<CategoryType, CategoryStyle> = {
  medicine: { bg: "bg-cat-medicine-bg", fg: "text-cat-medicine-fg", Icon: PillIcon, tint: "bg-cat-medicine-bg text-cat-medicine-fg", labelKey: "layout.nav.medicines" },
  doctor: { bg: "bg-cat-doctor-bg", fg: "text-cat-doctor-fg", Icon: DoctorIcon, tint: "bg-cat-doctor-bg text-cat-doctor-fg", labelKey: "layout.nav.doctors" },
  hospital: { bg: "bg-cat-hospital-bg", fg: "text-cat-hospital-fg", Icon: HospitalIcon, tint: "bg-cat-hospital-bg text-cat-hospital-fg", labelKey: "layout.nav.hospitals" },
  pharmacy: { bg: "bg-cat-pharmacy-bg", fg: "text-cat-pharmacy-fg", Icon: PharmacyIcon, tint: "bg-cat-pharmacy-bg text-cat-pharmacy-fg", labelKey: "layout.nav.pharmacies" },
  location: { bg: "bg-cat-location-bg", fg: "text-cat-location-fg", Icon: PinIcon, tint: "bg-cat-location-bg text-cat-location-fg", labelKey: "layout.nav.locations" },
  specialty: { bg: "bg-cat-specialty-bg", fg: "text-cat-specialty-fg", Icon: StethoscopeIcon, tint: "bg-cat-specialty-bg text-cat-specialty-fg", labelKey: "layout.nav.specialties" },
};
