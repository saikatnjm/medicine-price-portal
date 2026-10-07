import { ReviewNotice, TrustBadge } from "@/components/directory/trust-badge";
import type { FacilityDetail } from "@/domain/read-models";
import { getT } from "@/i18n/server";
import { facilityKindPhrase } from "@/lib/directory-labels";

/** h1, Bangla name, kind/ownership, place, trust badge and any review notice. */
export function FacilityOverview({ detail }: { detail: FacilityDetail }) {
  const { facility, place } = detail;
  const t = getT();
  return (
    <header className="space-y-2">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">{facility.name}</h1>
      {facility.altName && (
        <p lang="bn" className="text-lg text-slate-700">
          {facility.altName}
        </p>
      )}
      <p className="text-lg text-slate-800">
        {facilityKindPhrase(t, facility.kind, facility.ownership)}
        {place.label && <span className="text-slate-600"> · {place.label}</span>}
      </p>
      <p>
        <TrustBadge provenance={facility.provenance} />
      </p>
      {facility.emergency === true && (
        <p className="text-sm font-medium text-slate-900">
          {t("directory.card.emergency")}{" "}
          <span className="font-normal text-slate-600">{t("facility.overview.emergencyNote")}</span>
        </p>
      )}
      <ReviewNotice record={facility} />
    </header>
  );
}
