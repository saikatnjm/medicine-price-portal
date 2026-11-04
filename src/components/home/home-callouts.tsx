import Link from "@/i18n/link";
import { getT } from "@/i18n/server";
import { ChevronIcon, InfoIcon, SirenIcon } from "@/components/ui/icons";
import { routes } from "@/lib/routes";

const CARD = "flex h-full flex-col gap-3 rounded-2xl p-5 sm:p-6";
const CTA =
  "mt-auto inline-flex min-h-11 w-fit items-center gap-1 rounded-full px-5 text-sm font-semibold text-white transition-colors";

/** Two call-out cards: editorial guides (warm accent) and emergency hospitals (flag marker, always with icon and text). */
export function HomeCallouts() {
  const t = getT();
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <section aria-labelledby="home-guides" className={`${CARD} bg-accent-50`}>
        <span aria-hidden="true" className="flex size-11 items-center justify-center rounded-xl bg-white text-accent-700">
          <InfoIcon className="size-6" />
        </span>
        <h2 id="home-guides" className="text-xl font-semibold text-ink">
          {t("home.guides.title")}
        </h2>
        <p className="text-sm text-slate-700">{t("home.guides.desc")}</p>
        <Link href={routes.guides()} className={`${CTA} bg-accent-600 hover:bg-accent-700`}>
          {t("home.guides.cta")}
          <ChevronIcon className="size-4" />
        </Link>
      </section>
      <section aria-labelledby="home-emergency" className={`${CARD} bg-surface ring-1 ring-flag/30`}>
        <span aria-hidden="true" className="flex size-11 items-center justify-center rounded-xl bg-white text-flag">
          <SirenIcon className="size-6" />
        </span>
        <h2 id="home-emergency" className="text-xl font-semibold text-ink">
          {t("home.emergency.title")}
        </h2>
        <p className="text-sm text-slate-700">{t("home.emergency.desc")}</p>
        <Link href={routes.emergency()} className={`${CTA} bg-pine hover:bg-brand-700`}>
          {t("home.emergency.cta")}
          <ChevronIcon className="size-4" />
        </Link>
      </section>
    </div>
  );
}
