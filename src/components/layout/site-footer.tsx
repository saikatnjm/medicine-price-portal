import Link from "@/i18n/link";
import { getT } from "@/i18n/server";
import { MedicalDisclaimer } from "@/components/common/medical-disclaimer";
import { Container } from "@/components/ui/container";
import { routes } from "@/lib/routes";
import { NAV_ITEMS } from "./nav-items";

export function SiteFooter() {
  const t = getT();
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-50 py-8">
      <Container className="space-y-4">
        <nav aria-label={t("layout.footerNav")}>
          <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-700">
            <li>
              <Link href={routes.home()} className="inline-flex min-h-8 items-center underline-offset-2 hover:underline">
                {t("layout.nav.home")}
              </Link>
            </li>
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="inline-flex min-h-8 items-center underline-offset-2 hover:underline">
                  {t(item.labelKey)}
                </Link>
              </li>
            ))}
            <li>
              <Link href={routes.specialties()} className="inline-flex min-h-8 items-center underline-offset-2 hover:underline">
                {t("layout.nav.specialties")}
              </Link>
            </li>
            <li>
              <Link href={routes.saved()} className="inline-flex min-h-8 items-center underline-offset-2 hover:underline">
                {t("layout.nav.saved")}
              </Link>
            </li>
            <li>
              <Link href={routes.about()} className="inline-flex min-h-8 items-center underline-offset-2 hover:underline">
                {t("layout.nav.about")}
              </Link>
            </li>
          </ul>
        </nav>
        <div className="space-y-2 text-sm text-slate-700">
          <p>
            {t("layout.footer.sources1")}{" "}
            <a
              href="https://www.openstreetmap.org/copyright"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              {t("layout.footer.osm")}
            </a>{" "}
            {t("layout.footer.sources2")}{" "}
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
          <p>{t("layout.footer.noPrices")}</p>
        </div>
        <MedicalDisclaimer />
        <p className="text-sm text-slate-600">
          © {new Date().getFullYear()} {t("layout.siteName")}
        </p>
      </Container>
    </footer>
  );
}
