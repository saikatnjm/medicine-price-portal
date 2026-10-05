import Link from "next/link";
import { MedicalDisclaimer } from "@/components/common/medical-disclaimer";
import { Container } from "@/components/ui/container";
import { routes } from "@/lib/routes";
import { siteConfig } from "@/lib/site-config";
import { NAV_ITEMS } from "./nav-items";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-50 py-8">
      <Container className="space-y-4">
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-700">
            <li>
              <Link href={routes.home()} className="inline-flex min-h-8 items-center underline-offset-2 hover:underline">
                Home
              </Link>
            </li>
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="inline-flex min-h-8 items-center underline-offset-2 hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href={routes.specialties()} className="inline-flex min-h-8 items-center underline-offset-2 hover:underline">
                Specialties
              </Link>
            </li>
            <li>
              <Link href={routes.about()} className="inline-flex min-h-8 items-center underline-offset-2 hover:underline">
                About the data
              </Link>
            </li>
          </ul>
        </nav>
        <div className="space-y-2 text-sm text-slate-700">
          <p>
            Medicine information comes from the DGDA list of registered drug products. Hospital,
            clinic and pharmacy listings are community-mapped data from{" "}
            <a
              href="https://www.openstreetmap.org/copyright"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              © OpenStreetMap contributors
            </a>{" "}
            and have not been verified. Call ahead before visiting. Upazila and thana boundaries:{" "}
            <a
              href="https://www.geoboundaries.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              geoBoundaries
            </a>{" "}
            (BBS, OCHA; CC BY 3.0 IGO).
          </p>
          <p>Prices and doctor profiles are not available yet.</p>
        </div>
        <MedicalDisclaimer />
        <p className="text-sm text-slate-600">
          © {new Date().getFullYear()} {siteConfig.name}
        </p>
      </Container>
    </footer>
  );
}
