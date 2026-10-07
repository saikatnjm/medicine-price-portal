import type { MessageKey } from "@/i18n/messages";
import { routes } from "@/lib/routes";

export interface NavItem {
  labelKey: MessageKey;
  href: string;
}

/** Primary navigation, shared by the desktop nav, the mobile menu and the footer. */
export const NAV_ITEMS: readonly NavItem[] = [
  { labelKey: "layout.nav.medicines", href: routes.search() },
  { labelKey: "layout.nav.doctors", href: routes.doctors() },
  { labelKey: "layout.nav.hospitals", href: routes.hospitals() },
  { labelKey: "layout.nav.pharmacies", href: routes.pharmacies() },
  { labelKey: "layout.nav.locations", href: routes.locations() },
];
