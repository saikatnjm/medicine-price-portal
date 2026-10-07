import type { ComponentType } from "react";
import Link from "next/link";
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

function countText(count: number, singular: string, plural: string): string | null {
  return count > 0 ? `${numberFormatter.format(count)} ${count === 1 ? singular : plural}` : null;
}

/** Large entry-point cards with real counts; empty datasets are labelled honestly. */
export function CategoryLinks({ summary }: { summary: DirectorySummary }) {
  const categories: Category[] = [
    { label: "Medicines", href: routes.search(), Icon: PillIcon, detail: countText(summary.medicineCount, "product", "products"), fallback: "Not loaded yet" },
    // Doctor profiles have no legitimate source yet: say so instead of showing 0.
    { label: "Doctors", href: routes.doctors(), Icon: DoctorIcon, detail: null, fallback: "Coming soon" },
    { label: "Hospitals & Clinics", href: routes.hospitals(), Icon: HospitalIcon, detail: countText(summary.facilityCount, "listing", "listings"), fallback: "Not loaded yet" },
    { label: "Pharmacies", href: routes.pharmacies(), Icon: PharmacyIcon, detail: countText(summary.pharmacyCount, "listing", "listings"), fallback: "Not loaded yet" },
    { label: "Locations", href: routes.locations(), Icon: PinIcon, detail: countText(summary.districtCount, "district", "districts"), fallback: "Not loaded yet" },
    { label: "Specialties", href: routes.specialties(), Icon: StethoscopeIcon, detail: countText(summary.specialtyCount, "specialty", "specialties"), fallback: "Not loaded yet" },
  ];
  return (
    <section aria-labelledby="browse-categories">
      <h2 id="browse-categories" className="sr-only">
        Browse the directory
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
