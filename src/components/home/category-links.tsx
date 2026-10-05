import Link from "next/link";
import type { DirectorySummary } from "@/domain/read-models";
import { routes } from "@/lib/routes";

const numberFormatter = new Intl.NumberFormat("en-US");

interface Category {
  label: string;
  href: string;
  /** Count, or null when there is nothing to count yet. */
  count: number | null;
  /** Shown instead of a count when `count` is null. */
  fallback: string;
}

/** Compact entry points with real counts; empty datasets are labelled honestly. */
export function CategoryLinks({ summary }: { summary: DirectorySummary }) {
  const categories: Category[] = [
    { label: "Medicines", href: routes.search(), count: summary.medicineCount, fallback: "Not loaded yet" },
    { label: "Hospitals & clinics", href: routes.hospitals(), count: summary.facilityCount, fallback: "Not loaded yet" },
    { label: "Pharmacies", href: routes.pharmacies(), count: summary.pharmacyCount, fallback: "Not loaded yet" },
    { label: "Specialties", href: routes.specialties(), count: summary.specialtyCount, fallback: "Not loaded yet" },
    // Doctor profiles have no legitimate source yet: say so instead of showing 0.
    { label: "Doctors", href: routes.doctors(), count: null, fallback: "Coming soon" },
  ];
  return (
    <section aria-labelledby="browse-categories">
      <h2 id="browse-categories" className="text-xl font-semibold text-slate-900">
        Browse the directory
      </h2>
      <ul className="mt-4 grid grid-cols-1 gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map(({ label, href, count, fallback }) => (
          <li key={label} className="border-b border-slate-200">
            <Link href={href} className="group flex min-h-14 items-center justify-between gap-3 py-3">
              <span className="font-medium text-brand-800 group-hover:underline">{label}</span>
              <span className="text-sm text-slate-600">
                {count !== null && count > 0 ? numberFormatter.format(count) : fallback}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
