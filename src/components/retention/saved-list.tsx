"use client";

import { useT } from "@/i18n/client";
import Link from "@/i18n/link";
import type { MessageKey } from "@/i18n/messages";
import { ENTITY_TYPES, toggleSaved, type EntityType } from "@/lib/local-store";
import { routes } from "@/lib/routes";
import { useSavedItems } from "@/lib/use-local-store";

const HREF: Record<EntityType, (slug: string) => string> = {
  medicine: routes.medicine,
  hospital: routes.hospital,
  pharmacy: routes.pharmacy,
  doctor: routes.doctor,
};
const HEADING: Record<EntityType, MessageKey> = {
  medicine: "retention.saved.medicine",
  hospital: "retention.saved.hospital",
  pharmacy: "retention.saved.pharmacy",
  doctor: "retention.saved.doctor",
};

/** Saved items, grouped by type. Lives in this browser only. */
export function SavedList() {
  const saved = useSavedItems();
  const t = useT();
  if (saved.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-slate-800">
        <p className="font-medium">{t("retention.saved.emptyTitle")}</p>
        <p className="mt-1 text-sm text-slate-700">{t("retention.saved.emptyText")}</p>
        <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm">
          <li>
            <Link href={routes.search()} className="inline-flex min-h-11 items-center font-medium text-brand-800 underline">
              {t("retention.compare.search")}
            </Link>
          </li>
          <li>
            <Link href={routes.hospitals()} className="inline-flex min-h-11 items-center font-medium text-brand-800 underline">
              {t("retention.saved.browseHospitals")}
            </Link>
          </li>
          <li>
            <Link href={routes.pharmacies()} className="inline-flex min-h-11 items-center font-medium text-brand-800 underline">
              {t("retention.saved.browsePharmacies")}
            </Link>
          </li>
        </ul>
      </div>
    );
  }
  const medicineSlugs = saved.filter((s) => s.type === "medicine").map((s) => s.slug);
  return (
    <div className="space-y-8">
      {ENTITY_TYPES.map((type) => {
        const items = saved.filter((s) => s.type === type);
        if (items.length === 0) return null;
        return (
          <section key={type} aria-labelledby={`saved-${type}`}>
            <h2 id={`saved-${type}`} className="text-xl font-semibold text-slate-900">
              {t(HEADING[type])}
            </h2>
            <ul className="mt-3 space-y-2">
              {items.map((item) => (
                <li
                  key={item.slug}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
                >
                  <div className="min-w-0">
                    <Link href={HREF[type](item.slug)} className="font-medium text-brand-800 hover:underline">
                      {item.name}
                    </Link>
                    {item.subtitle && <p className="text-sm text-slate-600">{item.subtitle}</p>}
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleSaved({ type, slug: item.slug, name: item.name, subtitle: item.subtitle })}
                    className="inline-flex min-h-11 shrink-0 items-center rounded-lg border border-slate-300 px-3 text-sm font-medium text-slate-800 hover:bg-slate-50"
                  >
                    {t("retention.saved.remove")}<span className="sr-only"> {item.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
      {medicineSlugs.length >= 2 && (
        <p>
          <Link
            href={routes.compare(medicineSlugs.slice(0, 4))}
            className="inline-flex min-h-11 items-center rounded-xl bg-brand-700 px-5 font-semibold text-white hover:bg-brand-800"
          >
            {t("retention.saved.compare")}
          </Link>
        </p>
      )}
    </div>
  );
}
