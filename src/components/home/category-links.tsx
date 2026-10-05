import Link from "next/link";
import type { DirectorySummary } from "@/domain/read-models";
import { routes } from "@/lib/routes";

const numberFormatter = new Intl.NumberFormat("en-US");

interface Category {
  label: string;
  href: string;
  /** Real count text, or null when there is nothing to count yet. */
  detail: string | null;
  /** Shown instead of a count when `detail` is null. */
  fallback: string;
}

function countText(count: number, singular: string, plural: string): string | null {
  return count > 0 ? `${numberFormatter.format(count)} ${count === 1 ? singular : plural}` : null;
}

/** Compact entry points with real counts; empty datasets are labelled honestly. */
export function CategoryLinks({ summary }: { summary: DirectorySummary }) {
  const categories: Category[] = [
    { label: "Medicines", href: routes.search(), detail: countText(summary.medicineCount, "product", "products"), fallback: "Not loaded yet" },
    // Doctor profiles have no legitimate source yet: say so instead of showing 0.
    { label: "Doctors", href: routes.doctors(), detail: null, fallback: "Coming soon" },
    { label: "Hospitals & Clinics", href: routes.hospitals(), detail: countText(summary.facilityCount, "listing", "listings"), fallback: "Not loaded yet" },
    { label: "Pharmacies", href: routes.pharmacies(), detail: countText(summary.pharmacyCount, "listing", "listings"), fallback: "Not loaded yet" },
    { label: "Locations", href: routes.locations(), detail: countText(summary.districtCount, "district", "districts"), fallback: "Not loaded yet" },
    { label: "Specialties", href: routes.specialties(), detail: countText(summary.specialtyCount, "specialty", "specialties"), fallback: "Not loaded yet" },
  ];
  return (
    <section aria-labelledby="browse-categories">
      <h2 id="browse-categories" className="text-xl font-semibold text-slate-900">
        Browse the directory
      </h2>
      <ul className="mt-4 grid grid-cols-1 gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map(({ label, href, detail, fallback }) => (
          <li key={label} className="border-b border-slate-200">
            <Link href={href} className="group flex min-h-14 items-center justify-between gap-3 py-3">
              <span className="font-medium text-brand-800 group-hover:underline">{label}</span>
              <span className="text-sm text-slate-600">{detail ?? fallback}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
