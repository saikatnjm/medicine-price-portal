import { ReviewNotice, TrustBadge } from "@/components/directory/trust-badge";
import { EntityTile } from "@/components/ui/hero-card";
import { PinIcon, SirenIcon } from "@/components/ui/icons";
import type { FacilityDetail } from "@/domain/read-models";
import { getT } from "@/i18n/server";
import { facilityKindPhrase } from "@/lib/directory-labels";

/** Icon tile, h1, Bangla name, kind and place, one trust pill, the emergency marker and any review notice. */
export function FacilityOverview({ detail }: { detail: FacilityDetail }) {
  const { facility, place } = detail;
  const t = getT();
  return (
    <header className="flex gap-4">
      <EntityTile kind="hospital" size="lg" />
      <div className="min-w-0 space-y-2">
        <h1 className="text-[1.75rem] leading-9 font-semibold tracking-tight break-words text-slate-900 sm:text-4xl sm:leading-[3rem]">
          {facility.name}
        </h1>
        {facility.altName && (
          <p lang="bn" className="text-lg text-slate-700">
            {facility.altName}
          </p>
        )}
        <p className="flex flex-wrap items-center gap-x-1.5 text-base text-slate-800">
          <span>{facilityKindPhrase(t, facility.kind, facility.ownership)}</span>
          {place.label && (
            <span className="inline-flex items-center gap-1 text-slate-600">
              <span aria-hidden="true">·</span>
              <PinIcon className="size-4" />
              {place.label}
            </span>
          )}
        </p>
        <p className="flex flex-wrap items-center gap-2">
          <TrustBadge provenance={facility.provenance} />
          {facility.emergency === true && (
            <span className="inline-flex min-h-8 items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-flag ring-1 ring-flag/40">
              <SirenIcon className="size-4" />
              {t("directory.card.emergency")}
            </span>
          )}
        </p>
        {facility.emergency === true && <p className="text-sm text-slate-600">{t("facility.overview.emergencyNote")}</p>}
        <ReviewNotice record={facility} />
      </div>
    </header>
  );
}
