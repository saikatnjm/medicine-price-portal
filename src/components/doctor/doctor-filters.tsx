import Link from "@/i18n/link";
import type { Location, Specialty } from "@/domain/healthcare";
import type { DivisionWithDistricts } from "@/domain/read-models";
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
  "mt-1 block min-h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-base text-slate-900";
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
      className="space-y-4"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-4">
          <label htmlFor="doctor-q" className={labelClass}>
            {t("doctor.filters.name")}
          </label>
          <input
            id="doctor-q"
            name="q"
            type="search"
            defaultValue={query}
            autoComplete="off"
            className={controlClass}
          />
        </div>
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
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          className="inline-flex min-h-11 items-center rounded-md bg-brand-700 px-5 text-sm font-semibold text-white hover:bg-brand-800"
        >
          {t("doctor.filters.submit")}
        </button>
        <Link href={routes.doctors()} className="text-sm font-medium text-brand-800 underline">
          {t("doctor.filters.clear")}
        </Link>
      </div>
    </form>
  );
}
