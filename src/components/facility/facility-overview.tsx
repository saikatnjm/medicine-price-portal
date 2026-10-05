import { FACILITY_KIND_LABEL, OWNERSHIP_LABEL } from "@/domain/healthcare";
import type { FacilityDetail } from "@/domain/read-models";

/** h1, Bangla name, kind/ownership and place. */
export function FacilityOverview({ detail }: { detail: FacilityDetail }) {
  const { facility, place } = detail;
  const kind = [facility.ownership ? OWNERSHIP_LABEL[facility.ownership] : null, FACILITY_KIND_LABEL[facility.kind].toLowerCase()]
    .filter(Boolean)
    .join(" ");
  return (
    <header className="space-y-2">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">{facility.name}</h1>
      {facility.altName && (
        <p lang="bn" className="text-lg text-slate-700">
          {facility.altName}
        </p>
      )}
      <p className="text-lg text-slate-800">
        {kind.charAt(0).toUpperCase() + kind.slice(1)}
        {place.label && <span className="text-slate-600"> · {place.label}</span>}
      </p>
      {facility.emergency === true && (
        <p className="text-sm font-medium text-slate-900">
          Emergency services listed{" "}
          <span className="font-normal text-slate-600">(as stated by the data source; confirm by phone)</span>
        </p>
      )}
    </header>
  );
}
