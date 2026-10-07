import type { ComponentType } from "react";
import Link from "@/i18n/link";
import { getT } from "@/i18n/server";
import type { Translator } from "@/i18n/translate";
import type { DirectorySummary } from "@/domain/read-models";
import { routes } from "@/lib/routes";
import {
  DoctorIcon,
  HospitalIcon,
  PharmacyIcon,
  PillIcon,
  PinIcon,
  StethoscopeIcon,
} from "@/components/ui/icons";

const numberFormatter = new Intl.NumberFormat("en-US");

interface Category {
  label: string;
  href: string;
  Icon: ComponentType<{ className?: string }>;
  /** Real count text, or null when there is nothing to count yet. */
  detail: string | null;
  /** Shown instead of a count when `detail` is null. */
  fallback: string;
}

type CountUnit = "product" | "listing" | "district" | "specialty";

function countText(t: Translator, count: number, unit: CountUnit): string | null {
  if (count <= 0) return null;
  const key = `home.count.${unit}.${count === 1 ? "one" : "other"}` as const;
  return t(key, { n: numberFormatter.format(count) });
}

/** Large entry-point cards with real counts; empty datasets are labelled honestly. */
export function CategoryLinks({ summary }: { summary: DirectorySummary }) {
  const t = getT();
  const notLoaded = t("home.cat.notLoaded");
  const categories: Category[] = [
    { label: t("home.cat.medicines"), href: routes.search(), Icon: PillIcon, detail: countText(t, summary.medicineCount, "product"), fallback: notLoaded },
    // Doctor profiles have no legitimate source yet: say so instead of showing 0.
    { label: t("home.cat.doctors"), href: routes.doctors(), Icon: DoctorIcon, detail: null, fallback: t("home.cat.comingSoon") },
    { label: t("home.cat.hospitals"), href: routes.hospitals(), Icon: HospitalIcon, detail: countText(t, summary.facilityCount, "listing"), fallback: notLoaded },
    { label: t("home.cat.pharmacies"), href: routes.pharmacies(), Icon: PharmacyIcon, detail: countText(t, summary.pharmacyCount, "listing"), fallback: notLoaded },
    { label: t("home.cat.locations"), href: routes.locations(), Icon: PinIcon, detail: countText(t, summary.districtCount, "district"), fallback: notLoaded },
    { label: t("home.cat.specialties"), href: routes.specialties(), Icon: StethoscopeIcon, detail: countText(t, summary.specialtyCount, "specialty"), fallback: notLoaded },
  ];
  return (
    <section aria-labelledby="browse-categories">
      <h2 id="browse-categories" className="sr-only">
        {t("home.cat.browse")}
      </h2>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {categories.map(({ label, href, Icon, detail, fallback }) => (
          <li key={label}>
            <Link
              href={href}
              className="group flex h-full min-h-28 flex-col justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-brand-600 hover:shadow-md"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <Icon className="size-6" />
              </span>
              <span>
                <span className="block font-semibold text-slate-900 group-hover:text-brand-800">{label}</span>
                <span className="block text-sm text-slate-600">{detail ?? fallback}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
