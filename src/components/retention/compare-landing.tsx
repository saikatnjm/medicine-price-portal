"use client";

import { useT } from "@/i18n/client";
import Link from "@/i18n/link";
import { clearCompare } from "@/lib/local-store";
import { routes } from "@/lib/routes";
import { useCompareList } from "@/lib/use-local-store";

/** Shown on /compare when no medicines are in the URL: offers the list collected with "Compare" buttons. */
export function CompareLanding() {
  const list = useCompareList();
  const t = useT();
  return (
    <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-5 text-slate-800">
      <p className="font-medium">{t("retention.compare.choose")}</p>
      <p className="text-sm text-slate-700">{t("retention.compare.help")}</p>
      {list.length > 0 && (
        <p className="flex flex-wrap items-center gap-3 text-sm">
          <Link href={routes.compare(list)} className="inline-flex min-h-11 items-center rounded-xl bg-brand-700 px-5 font-semibold text-white hover:bg-brand-800">
            {t(list.length === 1 ? "retention.compare.selected.one" : "retention.compare.selected.other", { n: list.length })}
          </Link>
          <button type="button" onClick={clearCompare} className="inline-flex min-h-11 items-center text-brand-800 underline">
            {t("retention.compare.clear")}
          </button>
        </p>
      )}
      <p>
        <Link href={routes.search()} className="inline-flex min-h-11 items-center font-medium text-brand-800 underline">
          {t("retention.compare.search")}
        </Link>
      </p>
    </div>
  );
}
