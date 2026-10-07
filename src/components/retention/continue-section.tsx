"use client";

import { useT } from "@/i18n/client";
import Link from "@/i18n/link";
import { ClockIcon, HeartIcon } from "@/components/ui/icons";
import { clearSearches, clearViews, type EntityType } from "@/lib/local-store";
import { routes } from "@/lib/routes";
import { searchHref } from "@/lib/search-params";
import { useRecentSearches, useRecentViews, useSavedItems } from "@/lib/use-local-store";

const HREF: Record<EntityType, (slug: string) => string> = {
  medicine: routes.medicine,
  hospital: routes.hospital,
  pharmacy: routes.pharmacy,
  doctor: routes.doctor,
};

const chip =
  "inline-flex min-h-11 items-center rounded-full border border-slate-300 bg-white px-4 text-sm font-medium text-slate-800 shadow-sm hover:border-brand-600 hover:text-brand-800";

/** Homepage "Continue where you left off". Renders nothing until this browser has some history. */
export function ContinueSection() {
  const searches = useRecentSearches();
  const views = useRecentViews();
  const saved = useSavedItems();
  const t = useT();
  if (searches.length === 0 && views.length === 0 && saved.length === 0) return null;
  return (
    <section aria-labelledby="continue" className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="continue" className="flex items-center gap-2 text-xl font-semibold text-slate-900">
          <ClockIcon className="size-5" />
          {t("retention.continue.heading")}
        </h2>
        {(searches.length > 0 || views.length > 0) && (
          <button
            type="button"
            onClick={() => {
              clearSearches();
              clearViews();
            }}
            className="inline-flex min-h-11 items-center text-sm text-brand-800 underline underline-offset-2"
          >
            {t("retention.continue.clear")}
          </button>
        )}
      </div>
      {searches.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-slate-700">{t("retention.continue.searches")}</h3>
          <ul className="mt-2 flex flex-wrap gap-2">
            {searches.map((q) => (
              <li key={q}>
                <Link href={searchHref(q)} className={chip}>
                  {q}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      {views.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-slate-700">{t("retention.continue.views")}</h3>
          <ul className="mt-2 flex flex-wrap gap-2">
            {views.slice(0, 6).map((v) => (
              <li key={`${v.type}:${v.slug}`}>
                <Link href={HREF[v.type](v.slug)} className={chip}>
                  {v.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      {saved.length > 0 && (
        <p className="text-sm text-slate-700">
          <Link href={routes.saved()} className="inline-flex min-h-11 items-center gap-2 font-medium text-brand-800 underline">
            <HeartIcon className="size-4" />
            {t(saved.length === 1 ? "retention.continue.saved.one" : "retention.continue.saved.other", { n: saved.length })}
          </Link>
        </p>
      )}
      <p className="text-xs text-slate-600">{t("retention.continue.note")}</p>
    </section>
  );
}
