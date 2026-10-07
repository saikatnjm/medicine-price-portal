import Link from "@/i18n/link";
import { getT } from "@/i18n/server";
import type { Translator } from "@/i18n/translate";
import type { DirectorySummary } from "@/domain/read-models";
import { CATEGORY, type CategoryType } from "@/components/ui/category";
import { routes } from "@/lib/routes";

const numberFormatter = new Intl.NumberFormat("en-US");

interface QuickAction {
  type: CategoryType;
  label: string;
  /** In-page anchor for the near-me flow; otherwise a route. */
  href: string;
  /** Real count text, or null when there is nothing to count yet. */
  detail: string | null;
  /** Shown instead of a count when `detail` is null. */
  fallback: string;
}

type CountUnit = "product" | "listing";

function countText(t: Translator, count: number, unit: CountUnit): string | null {
  if (count <= 0) return null;
  const key = `home.count.${unit}.${count === 1 ? "one" : "other"}` as const;
  return t(key, { n: numberFormatter.format(count) });
}

/** Quick-action tiles with real counts; empty datasets are labelled honestly. */
export function CategoryLinks({ summary }: { summary: DirectorySummary }) {
  const t = getT();
  const notLoaded = t("home.cat.notLoaded");
  const actions: QuickAction[] = [
    { type: "medicine", label: t("home.cat.medicines"), href: routes.search(), detail: countText(t, summary.medicineCount, "product"), fallback: notLoaded },
    // Doctor profiles have no legitimate source yet: say so instead of showing 0.
    { type: "doctor", label: t("home.cat.doctors"), href: routes.doctors(), detail: null, fallback: t("home.cat.comingSoon") },
    { type: "hospital", label: t("home.cat.hospitals"), href: routes.hospitals(), detail: countText(t, summary.facilityCount, "listing"), fallback: notLoaded },
    { type: "pharmacy", label: t("home.cat.pharmacies"), href: routes.pharmacies(), detail: countText(t, summary.pharmacyCount, "listing"), fallback: notLoaded },
    // The existing near-me flow sits just below; the tile scrolls to it.
    { type: "location", label: t("layout.cat.nearby"), href: "#near-you", detail: t("layout.cat.nearbyHint"), fallback: "" },
  ];
  const tile =
    "group flex h-full min-h-28 flex-col justify-between gap-3 rounded-2xl p-4 transition-colors hover:brightness-95";
  return (
    <section aria-labelledby="browse-categories">
      <h2 id="browse-categories" className="sr-only">
        {t("home.cat.browse")}
      </h2>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {actions.map(({ type, label, href, detail, fallback }, index) => {
          const { Icon, bg, fg } = CATEGORY[type];
          const content = (
            <>
              <span aria-hidden="true" className={`flex size-11 items-center justify-center rounded-xl bg-white/80 ${fg}`}>
                <Icon className="size-6" />
              </span>
              <span>
                <span className="block font-semibold text-ink">{label}</span>
                <span className="block text-sm text-slate-700">{detail ?? fallback}</span>
              </span>
            </>
          );
          return (
            <li key={`${type}-${href}`} className={index === actions.length - 1 ? "col-span-2 sm:col-span-1" : undefined}>
              {href.startsWith("#") ? (
                <a href={href} className={`${tile} ${bg}`}>
                  {content}
                </a>
              ) : (
                <Link href={href} className={`${tile} ${bg}`}>
                  {content}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
