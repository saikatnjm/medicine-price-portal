import type { ReactNode } from "react";
import Link from "next/link";
import type { FacilityKind } from "@/domain/healthcare";
import { FACILITY_KIND_LABEL } from "@/domain/healthcare";
import type { DivisionWithDistricts, FacilityKindCount, SpecialtyListItem } from "@/domain/read-models";
import { SEARCH_MAX_QUERY_LENGTH } from "@/lib/search-config";

const controlClass =
  "min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-base text-slate-900 focus-visible:border-brand-600";
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
      <Field id={id("location")} label="Location">
        <select id={id("location")} name="location" defaultValue={locations.selected} className={controlClass}>
          <option value="">All of Bangladesh</option>
          {extra && <option value={locations.selected}>{locations.selectedName ?? locations.selected}</option>}
          {groups.map(({ division, districts, divisionCount }) => (
            <optgroup key={division.slug} label={`${division.name} Division`}>
              <option value={division.slug}>
                All of {division.name} Division ({divisionCount.toLocaleString("en-US")})
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

  return (
    <form role="search" action={action} method="get" className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Field id={id("q")} label={props.queryLabel}>
          <input
            id={id("q")}
            type="search"
            name="q"
            defaultValue={query}
            maxLength={SEARCH_MAX_QUERY_LENGTH}
            placeholder={props.queryPlaceholder}
            autoComplete="off"
            enterKeyHint="search"
            className={`${controlClass} placeholder:text-slate-500`}
          />
        </Field>
        {locationSelect}
        {kinds && kinds.counts.length > 0 && (
          <Field id={id("kind")} label="Type">
            <select id={id("kind")} name="kind" defaultValue={kinds.selected ?? ""} className={controlClass}>
              <option value="">All types</option>
              {kinds.counts.map(({ kind, count }) => (
                <option key={kind} value={kind}>
                  {FACILITY_KIND_LABEL[kind]} ({count.toLocaleString("en-US")})
                </option>
              ))}
            </select>
          </Field>
        )}
        {specialties && specialties.items.length > 0 && (
          <Field id={id("specialty")} label="Specialty">
            <select id={id("specialty")} name="specialty" defaultValue={specialties.selected} className={controlClass}>
              <option value="">All specialties</option>
              {specialties.items.map(({ specialty, facilityCount }) => (
                <option key={specialty.slug} value={specialty.slug}>
                  {specialty.name} ({facilityCount.toLocaleString("en-US")})
                </option>
              ))}
            </select>
          </Field>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        {emergency?.show && (
          <label htmlFor={id("emergency")} className="flex min-h-11 items-center gap-2 text-sm text-slate-800">
            <input id={id("emergency")} type="checkbox" name="emergency" value="1" defaultChecked={emergency.checked} className="size-5" />
            Emergency services listed
          </label>
        )}
        <button
          type="submit"
          className="min-h-11 rounded-lg bg-brand-700 px-5 text-sm font-semibold text-white hover:bg-brand-800"
        >
          Apply filters
        </button>
        {clearHref && (
          <Link href={clearHref} className="inline-flex min-h-11 items-center text-sm text-brand-800 underline underline-offset-2">
            Clear filters
          </Link>
        )}
      </div>
    </form>
  );
}
