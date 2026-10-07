import Link from "@/i18n/link";
import type { Location, Specialty } from "@/domain/healthcare";
import type { DivisionWithDistricts } from "@/domain/read-models";
import { SearchIcon } from "@/components/ui/icons";
import { SlidersIcon } from "@/components/ui/icons-entity";
import { localizePath } from "@/i18n/config";
import { getLocale, getT } from "@/i18n/server";
import { routes } from "@/lib/routes";

interface DoctorFiltersProps {
  query: string;
  location: string;
  specialty: string;
  hospital: string;
  divisions: DivisionWithDistricts[];
  specialties: Specialty[];
  /** Only provided when at least one doctor exists. */
  hospitals: Array<{ slug: string; name: string }> | null;
}

const controlClass =
  "mt-1 block min-h-11 w-full rounded-xl border border-transparent bg-white px-3 text-base text-slate-900 ring-1 ring-slate-300 focus-visible:ring-brand-600";
const labelClass = "block text-sm font-medium text-slate-800";

function LocationOption({ location, label }: { location: Location; label?: string }) {
  return <option value={location.slug}>{label ?? location.name}</option>;
}

/** Plain GET form (works without JavaScript); always searches the main doctors list. */
export function DoctorFilters({ query, location, specialty, hospital, divisions, specialties, hospitals }: DoctorFiltersProps) {
  const t = getT();
  return (
    <form
      action={localizePath(routes.doctors(), getLocale())}
      method="get"
      role="search"
      aria-label={t("doctor.filters.aria")}
      className="space-y-3 rounded-2xl bg-slate-50 p-3 sm:p-4"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1">
          <label htmlFor="doctor-q" className={labelClass}>
            {t("doctor.filters.name")}
          </label>
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-slate-500" />
            <input
              id="doctor-q"
              name="q"
              type="search"
              defaultValue={query}
              autoComplete="off"
              className={`${controlClass} pl-10`}
            />
          </div>
        </div>
        <button
          type="submit"
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-brand-700 px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-800"
        >
          {t("doctor.filters.submit")}
        </button>
      </div>
      <details open={Boolean(location || specialty || hospital)} className="group">
        <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-full bg-white px-4 text-sm font-medium text-slate-800 ring-1 ring-slate-200 [&::-webkit-details-marker]:hidden">
          <SlidersIcon className="size-4" />
          {t("doctor.filters.more")}
        </summary>
        <div className="grid gap-4 pt-3 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label htmlFor="doctor-location" className={labelClass}>
              {t("doctor.filters.location")}
            </label>
            <select id="doctor-location" name="location" defaultValue={location} className={controlClass}>
              <option value="">{t("doctor.filters.allBangladesh")}</option>
              {divisions.map(({ division, districts }) => (
                <optgroup key={division.id} label={t("location.place.division", { name: division.name })}>
                  <LocationOption location={division} label={t("doctor.filters.allDivision", { name: division.name })} />
                  {districts.map(({ location: district }) => (
                    <LocationOption key={district.id} location={district} />
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="doctor-specialty" className={labelClass}>
              {t("doctor.filters.specialty")}
            </label>
            <select id="doctor-specialty" name="specialty" defaultValue={specialty} className={controlClass}>
              <option value="">{t("doctor.filters.allSpecialties")}</option>
              {specialties.map((s) => (
                <option key={s.id} value={s.slug}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          {hospitals && hospitals.length > 0 && (
            <div>
              <label htmlFor="doctor-hospital" className={labelClass}>
                {t("doctor.filters.hospital")}
              </label>
              <select id="doctor-hospital" name="hospital" defaultValue={hospital} className={controlClass}>
                <option value="">{t("doctor.filters.anyHospital")}</option>
                {hospitals.map((h) => (
                  <option key={h.slug} value={h.slug}>
                    {h.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </details>
      <Link href={routes.doctors()} className="inline-flex min-h-11 items-center text-sm font-medium text-brand-800 underline underline-offset-2">
        {t("doctor.filters.clear")}
      </Link>
    </form>
  );
}
