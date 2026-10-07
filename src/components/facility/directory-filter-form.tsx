import type { ReactNode } from "react";
import Link from "@/i18n/link";
import type { FacilityKind } from "@/domain/healthcare";
import type { DivisionWithDistricts, FacilityKindCount, SpecialtyListItem } from "@/domain/read-models";
import { localizePath } from "@/i18n/config";
import { SearchIcon } from "@/components/ui/icons";
import { SlidersIcon } from "@/components/ui/icons-entity";
import { getLocale, getT } from "@/i18n/server";
import { facilityKindLabel } from "@/lib/directory-labels";
import { SEARCH_MAX_QUERY_LENGTH } from "@/lib/search-config";

const controlClass =
  "min-h-11 w-full rounded-xl border border-transparent bg-white px-3 text-base text-slate-900 ring-1 ring-slate-300 focus-visible:ring-brand-600";
const labelClass = "mb-1 block text-sm font-medium text-slate-700";

function Field({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      {children}
    </div>
  );
}

export interface DirectoryFilterFormProps {
  /** Form target: the current list path (a plain GET form, works without JavaScript). */
  action: string;
  idPrefix: string;
  query: string;
  queryLabel: string;
  queryPlaceholder: string;
  /** Location select; omit when the location is fixed by the path. */
  locations?: { tree: readonly DivisionWithDistricts[]; selected: string; selectedName?: string; countOf: "facilityCount" | "pharmacyCount" };
  kinds?: { counts: readonly FacilityKindCount[]; selected: FacilityKind | null };
  specialties?: { items: readonly SpecialtyListItem[]; selected: string };
  emergency?: { show: boolean; checked: boolean };
  /** Link that clears every filter (shown when any is applied). */
  clearHref?: string;
}

/** Filters for hospital and pharmacy lists. Only controls that have values to choose from are shown. */
export function DirectoryFilterForm(props: DirectoryFilterFormProps) {
  const { action, idPrefix, query, locations, kinds, specialties, emergency, clearHref } = props;
  const t = getT();
  const id = (name: string) => `${idPrefix}-${name}`;

  let locationSelect: ReactNode = null;
  if (locations) {
    const known = new Set<string>();
    const groups = locations.tree
      .map(({ division, districts, ...counts }) => {
        const ds = districts.filter((d) => d[locations.countOf] > 0);
        ds.forEach((d) => known.add(d.location.slug));
        known.add(division.slug);
        return { division, districts: ds, divisionCount: counts[locations.countOf] };
      })
      .filter((g) => g.districts.length > 0);
    const extra = locations.selected && !known.has(locations.selected);
    locationSelect = (
      <Field id={id("location")} label={t("facility.filter.location")}>
        <select id={id("location")} name="location" defaultValue={locations.selected} className={controlClass}>
          <option value="">{t("facility.filter.allBangladesh")}</option>
          {extra && <option value={locations.selected}>{locations.selectedName ?? locations.selected}</option>}
          {groups.map(({ division, districts, divisionCount }) => (
            <optgroup key={division.slug} label={t("directory.division", { name: division.name })}>
              <option value={division.slug}>
                {t("facility.filter.allOfDivision", { name: division.name, count: divisionCount.toLocaleString("en-US") })}
              </option>
              {districts.map((d) => (
                <option key={d.location.slug} value={d.location.slug}>
                  {d.location.name} ({d[locations.countOf].toLocaleString("en-US")})
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </Field>
    );
  }

  const kindSelect =
    kinds && kinds.counts.length > 0 ? (
      <Field id={id("kind")} label={t("facility.filter.type")}>
        <select id={id("kind")} name="kind" defaultValue={kinds.selected ?? ""} className={controlClass}>
          <option value="">{t("facility.filter.allTypes")}</option>
          {kinds.counts.map(({ kind, count }) => (
            <option key={kind} value={kind}>
              {facilityKindLabel(t, kind)} ({count.toLocaleString("en-US")})
            </option>
          ))}
        </select>
      </Field>
    ) : null;
  const specialtySelect =
    specialties && specialties.items.length > 0 ? (
      <Field id={id("specialty")} label={t("facility.filter.specialty")}>
        <select id={id("specialty")} name="specialty" defaultValue={specialties.selected} className={controlClass}>
          <option value="">{t("facility.filter.allSpecialties")}</option>
          {specialties.items.map(({ specialty, facilityCount }) => (
            <option key={specialty.slug} value={specialty.slug}>
              {specialty.name} ({facilityCount.toLocaleString("en-US")})
            </option>
          ))}
        </select>
      </Field>
    ) : null;
  const emergencyBox = emergency?.show ? (
    <label htmlFor={id("emergency")} className="flex min-h-11 items-center gap-2 text-sm text-slate-800">
      <input id={id("emergency")} type="checkbox" name="emergency" value="1" defaultChecked={emergency.checked} className="size-5" />
      {t("directory.card.emergency")}
    </label>
  ) : null;

  const hasMore = Boolean(locationSelect || kindSelect || specialtySelect || emergencyBox);
  // Keep the extra filters open when one of them is in use, so the applied state is visible.
  const moreActive = Boolean(locations?.selected || kinds?.selected || specialties?.selected || emergency?.checked);

  return (
    <form role="search" action={localizePath(action, getLocale())} method="get" className="space-y-3 rounded-2xl bg-slate-50 p-3 sm:p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1">
          <label htmlFor={id("q")} className={labelClass}>
            {props.queryLabel}
          </label>
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-slate-500" />
            <input
              id={id("q")}
              type="search"
              name="q"
              defaultValue={query}
              maxLength={SEARCH_MAX_QUERY_LENGTH}
              placeholder={props.queryPlaceholder}
              autoComplete="off"
              enterKeyHint="search"
              className={`${controlClass} pl-10 placeholder:text-slate-500`}
            />
          </div>
        </div>
        <button
          type="submit"
          className="min-h-11 rounded-full bg-brand-700 px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-800"
        >
          {t("facility.filter.apply")}
        </button>
      </div>
      {hasMore && (
        <details open={moreActive} className="group">
          <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-full bg-white px-4 text-sm font-medium text-slate-800 ring-1 ring-slate-200 [&::-webkit-details-marker]:hidden">
            <SlidersIcon className="size-4" />
            {t("facility.filter.more")}
          </summary>
          <div className="grid gap-4 pt-3 sm:grid-cols-2 lg:grid-cols-3">
            {locationSelect}
            {kindSelect}
            {specialtySelect}
            {emergencyBox}
          </div>
        </details>
      )}
      {clearHref && (
        <Link href={clearHref} className="inline-flex min-h-11 items-center text-sm font-medium text-brand-800 underline underline-offset-2">
          {t("facility.filter.clear")}
        </Link>
      )}
    </form>
  );
}
