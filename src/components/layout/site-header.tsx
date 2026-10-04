import Link from "next/link";
import { Container } from "@/components/ui/container";
import { routes } from "@/lib/routes";
import { siteConfig } from "@/lib/site-config";

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200">
      <Container className="flex h-14 items-center justify-between gap-4">
        <Link href={routes.home()} className="flex items-center gap-2 font-semibold text-brand-800">
          <svg aria-hidden="true" viewBox="0 0 32 32" className="h-6 w-6">
            <rect width="32" height="32" rx="6" fill="currentColor" />
            <path d="M14 8h4v6h6v4h-6v6h-4v-6H8v-4h6z" fill="#fff" />
          </svg>
          {siteConfig.name}
        </Link>
        <nav aria-label="Main">
          <Link
            href={routes.search()}
            className="text-sm font-medium text-slate-700 underline-offset-2 hover:text-brand-800 hover:underline"
          >
            Search medicines
          </Link>
        </nav>
      </Container>
    </header>
  );
}
