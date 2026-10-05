import { routes } from "@/lib/routes";

export interface NavItem {
  label: string;
  href: string;
}

/** Primary navigation, shared by the desktop nav, the mobile menu and the footer. */
export const NAV_ITEMS: readonly NavItem[] = [
  { label: "Medicines", href: routes.search() },
  { label: "Doctors", href: routes.doctors() },
  { label: "Hospitals", href: routes.hospitals() },
  { label: "Pharmacies", href: routes.pharmacies() },
  { label: "Locations", href: routes.locations() },
];
