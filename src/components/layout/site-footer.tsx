import Link from "next/link";
import { MedicalDisclaimer } from "@/components/common/medical-disclaimer";
import { Container } from "@/components/ui/container";
import { routes } from "@/lib/routes";
import { siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-50 py-8">
      <Container className="space-y-4">
        <p className="text-sm text-slate-700">
          <strong className="font-semibold">Pilot with sample data.</strong> Prices, availability
          and pharmacies on this site are for demonstration only and are not live information.
        </p>
        <MedicalDisclaimer />
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-600">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}
          </p>
          <nav aria-label="Footer">
            <ul className="flex gap-4">
              <li>
                <Link href={routes.home()} className="hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link href={routes.search()} className="hover:underline">
                  Search medicines
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
