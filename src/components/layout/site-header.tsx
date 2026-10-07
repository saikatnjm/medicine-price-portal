import Link from "next/link";
import { Container } from "@/components/ui/container";
import { routes } from "@/lib/routes";
import { siteConfig } from "@/lib/site-config";
import { MobileNav } from "./mobile-nav";
import { NAV_ITEMS } from "./nav-items";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <Container className="flex min-h-14 items-center justify-between gap-4 py-1">
        <Link
          href={routes.home()}
          className="flex min-h-11 items-center gap-2 font-semibold text-brand-800"
        >
          <svg aria-hidden="true" viewBox="0 0 32 32" className="h-6 w-6 shrink-0">
            <rect width="32" height="32" rx="6" fill="currentColor" />
            <path d="M14 8h4v6h6v4h-6v6h-4v-6H8v-4h6z" fill="#fff" />
          </svg>
          <span className="leading-tight">{siteConfig.name}</span>
        </Link>
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex min-h-11 items-center px-3 text-sm font-medium text-slate-700 underline-offset-4 hover:text-brand-800 hover:underline"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <MobileNav items={NAV_ITEMS} />
      </Container>
    </header>
  );
}
