import Link from "@/i18n/link";
import { getT } from "@/i18n/server";
import { MedicalDisclaimer } from "@/components/common/medical-disclaimer";
import { Container } from "@/components/ui/container";
import { routes } from "@/lib/routes";
import { BROWSE_ITEMS, NAV_ITEMS } from "./nav-items";

const LINK = "inline-flex min-h-8 items-center underline-offset-2 hover:text-pine hover:underline";

function FooterColumn({ id, title, items }: { id: string; title: string; items: { label: string; href: string }[] }) {
  return (
    <div>
      <h2 id={id} className="text-sm font-semibold text-ink">
        {title}
      </h2>
      <ul aria-labelledby={id} className="mt-2 grid grid-cols-2 gap-x-5 text-sm text-slate-700 sm:grid-cols-1">
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className={LINK}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  const t = getT();
  return (
    <footer className="mt-16 bg-mist pt-8 pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-8">
      <Container className="space-y-4">
        <nav aria-label={t("layout.footerNav")} className="grid gap-6 sm:grid-cols-2 lg:max-w-2xl">
          <FooterColumn
            id="footer-directory"
            title={t("layout.footer.directory")}
            items={[
              { label: t("layout.nav.home"), href: routes.home() },
              ...NAV_ITEMS.map((item) => ({ label: t(item.labelKey), href: item.href })),
              { label: t("layout.nav.specialties"), href: routes.specialties() },
              { label: t("layout.nav.saved"), href: routes.saved() },
              { label: t("layout.nav.about"), href: routes.about() },
            ]}
          />
          <FooterColumn
            id="footer-browse"
            title={t("layout.footer.browse")}
            items={BROWSE_ITEMS.map((item) => ({ label: t(item.labelKey), href: item.href }))}
          />
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
