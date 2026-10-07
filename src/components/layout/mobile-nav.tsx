"use client";

import Link from "@/i18n/link";
import { useT } from "@/i18n/client";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { NavItem } from "./nav-items";

/** Disclosure menu for small screens. Hidden from md upwards, where the inline nav shows. */
export function MobileNav({ items }: { items: readonly NavItem[] }) {
  const t = useT();
  const pathname = usePathname();
  // The menu belongs to the page it was opened on, so it closes after navigating
  // without an effect: it is open only while the path is unchanged.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = useCallback(
    (value: boolean | ((current: boolean) => boolean)) =>
      setOpenOn((current) => {
        const next = typeof value === "function" ? value(current === pathname) : value;
        return next ? pathname : null;
      }),
    [pathname],
  );

  // Escape closes the menu.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex min-h-11 items-center rounded-full border border-slate-300 px-4 text-sm font-medium text-slate-800 transition-colors hover:bg-mist"
      >
        {open ? t("layout.closeMenu") : t("layout.menu")}
      </button>
      {open && (
        <nav
          id="mobile-menu"
          aria-label={t("layout.mainNav")}
          className="absolute inset-x-0 top-full z-40 border-b border-slate-200 bg-white shadow-sm"
        >
          <ul className="mx-auto max-w-5xl px-4 py-2 sm:px-6">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex min-h-11 items-center text-base font-medium text-slate-800 hover:text-brand-800"
                >
                  {t(item.labelKey)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
