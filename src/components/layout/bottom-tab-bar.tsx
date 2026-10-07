"use client";

import type { ComponentType } from "react";
import { usePathname } from "next/navigation";
import { useT } from "@/i18n/client";
import { stripLocale } from "@/i18n/config";
import Link from "@/i18n/link";
import type { MessageKey } from "@/i18n/messages";
import { BookmarkIcon, DoctorIcon, HospitalIcon, PharmacyIcon, SearchIcon } from "@/components/ui/icons";
import { routes } from "@/lib/routes";

interface Tab {
  labelKey: MessageKey;
  href: string;
  /** Extra path prefixes that keep the tab highlighted (e.g. a medicine page belongs to Search). */
  also?: readonly string[];
  Icon: ComponentType<{ className?: string }>;
}

export const TABS: readonly Tab[] = [
  { labelKey: "layout.tab.search", href: routes.search(), also: ["/medicine"], Icon: SearchIcon },
  { labelKey: "layout.nav.doctors", href: routes.doctors(), also: ["/doctor"], Icon: DoctorIcon },
  { labelKey: "layout.nav.hospitals", href: routes.hospitals(), also: ["/hospital"], Icon: HospitalIcon },
  { labelKey: "layout.nav.pharmacies", href: routes.pharmacies(), also: ["/pharmacy"], Icon: PharmacyIcon },
  { labelKey: "layout.nav.saved", href: routes.saved(), Icon: BookmarkIcon },
];

function matches(path: string, prefix: string): boolean {
  return path === prefix || path.startsWith(`${prefix}/`);
}

export function isTabActive(pathname: string, tab: Pick<Tab, "href" | "also">): boolean {
  const path = stripLocale(pathname);
  return [tab.href, ...(tab.also ?? [])].some((prefix) => matches(path, prefix));
}

/** Thumb-reachable primary navigation for phones. Hidden from md upwards, where the header nav shows. */
export function BottomTabBar() {
  const t = useT();
  const pathname = usePathname() ?? "/";
  return (
    <nav
      aria-label={t("layout.tabBar")}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <ul className="mx-auto grid max-w-lg grid-cols-5">
        {TABS.map((tab) => {
          const active = isTabActive(pathname, tab);
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-14 flex-col items-center justify-center gap-0.5 px-1 py-1.5 text-xs leading-tight font-medium transition-colors ${
                  active ? "text-pine" : "text-slate-600 hover:text-pine"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`flex h-7 w-12 items-center justify-center rounded-full transition-colors ${active ? "bg-mist" : ""}`}
                >
                  <tab.Icon className="size-5" />
                </span>
                <span className={`text-center ${active ? "font-semibold" : ""}`}>{t(tab.labelKey)}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
