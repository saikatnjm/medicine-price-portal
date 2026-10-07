import { Suspense } from "react";
import { getT } from "@/i18n/server";
import Link from "@/i18n/link";
import { LanguageSwitcher } from "@/i18n/language-switcher";
import { Container } from "@/components/ui/container";
import { routes } from "@/lib/routes";
import { MobileNav } from "./mobile-nav";
import { NAV_ITEMS } from "./nav-items";

export function SiteHeader() {
  const t = getT();
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <Container className="flex min-h-14 items-center justify-between gap-4 py-1">
        <Link
          href={routes.home()}
          className="flex min-h-11 items-center gap-2 font-semibold text-pine"
        >
          <svg aria-hidden="true" viewBox="0 0 32 32" className="size-7 shrink-0">
            <rect width="32" height="32" rx="6" fill="currentColor" />
            <path d="M14 8h4v6h6v4h-6v6h-4v-6H8v-4h6z" fill="#fff" />
          </svg>
          <span className="leading-tight">{t("layout.siteName")}</span>
        </Link>
        <nav aria-label={t("layout.mainNav")} className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex min-h-11 items-center rounded-full px-3.5 text-sm font-medium text-slate-700 transition-colors hover:bg-mist hover:text-pine"
                >
                  {t(item.labelKey)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <Suspense fallback={null}>
            <LanguageSwitcher />
          </Suspense>
          <MobileNav items={NAV_ITEMS} />
        </div>
      </Container>
    </header>
  );
}
