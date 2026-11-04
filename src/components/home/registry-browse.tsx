import Link from "@/i18n/link";
import { getT } from "@/i18n/server";
import { WHITE_CHIP_CLASS } from "@/components/ui/chip";
import { CheckBadgeIcon, ChevronIcon } from "@/components/ui/icons";
import { routes } from "@/lib/routes";

const numberFormatter = new Intl.NumberFormat("en-US");

export interface RegistryCounts {
  generics: number;
  companies: number;
  dosageForms: number;
}

interface RegistryBrowseProps {
  /** Brand initials that have at least one product (from services.browse.listInitials). */
  initials: readonly string[];
  counts: RegistryCounts;
}

const LETTER_CLASS =
  "inline-flex h-11 min-w-11 items-center justify-center rounded-xl px-2 bg-white text-base font-semibold text-pine uppercase shadow-sm transition-colors hover:bg-brand-100";

/** A–Z strip and registry hubs (generics, companies, dosage forms, registration check). Real counts only. */
export function RegistryBrowse({ initials, counts }: RegistryBrowseProps) {
  const t = getT();
  const hubs = [
    { href: routes.generics(), label: t("home.registry.generics"), count: counts.generics, key: "home.registry.count.generic" as const },
    { href: routes.companies(), label: t("home.registry.companies"), count: counts.companies, key: "home.registry.count.company" as const },
    { href: routes.dosageForms(), label: t("home.registry.dosageForms"), count: counts.dosageForms, key: "home.registry.count.form" as const },
  ];
  return (
    <section aria-labelledby="browse-registry" className="rounded-2xl bg-mist p-5 sm:p-6">
      <h2 id="browse-registry" className="text-xl font-semibold text-ink">
        {t("home.registry.title")}
      </h2>
      <p className="mt-1 max-w-2xl text-sm text-slate-700">{t("home.registry.desc")}</p>
      {initials.length > 0 && (
        <nav aria-label={t("home.registry.az")} className="mt-4">
          <ul className="flex flex-wrap gap-1.5">
            {initials.map((initial) => (
              <li key={initial}>
                <Link
                  href={routes.medicines(initial)}
                  aria-label={initial === "0-9" ? t("home.registry.digits") : t("home.registry.letter", { letter: initial.toUpperCase() })}
                  className={LETTER_CLASS}
                >
                  {initial}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
      <ul className="mt-5 flex flex-wrap gap-2">
        {hubs.map((hub) => (
          <li key={hub.href}>
            <Link href={hub.href} className={WHITE_CHIP_CLASS}>
              {hub.label}
              {hub.count > 0 && (
                <span className="font-normal text-brand-800">{t(hub.key, { n: numberFormatter.format(hub.count) })}</span>
              )}
            </Link>
          </li>
        ))}
        <li>
          <Link href={routes.verify()} className={WHITE_CHIP_CLASS}>
            <CheckBadgeIcon className="size-4" />
            {t("home.registry.verify")}
            <span className="font-normal text-brand-800">{t("home.registry.verifyHint")}</span>
          </Link>
        </li>
        <li>
          <Link href={routes.medicines()} className={WHITE_CHIP_CLASS}>
            {t("home.registry.az")}
            <ChevronIcon className="size-4" />
          </Link>
        </li>
      </ul>
    </section>
  );
}
