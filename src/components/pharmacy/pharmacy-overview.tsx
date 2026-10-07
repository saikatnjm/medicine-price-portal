import { ReviewNotice, TrustBadge } from "@/components/directory/trust-badge";
import { EntityTile } from "@/components/ui/hero-card";
import { PinIcon } from "@/components/ui/icons";
import type { PharmacyDetail } from "@/domain/read-models";
import { getT } from "@/i18n/server";

/** Icon tile, h1, Bangla name, kind and place, address, one trust pill, description and any review notice. */
export function PharmacyOverview({ detail }: { detail: PharmacyDetail }) {
  const t = getT();
  const { pharmacy, place } = detail;
  return (
    <header className="flex gap-4">
      <EntityTile kind="pharmacy" size="lg" />
      <div className="min-w-0 space-y-2">
        <h1 className="text-[1.75rem] leading-9 font-semibold tracking-tight break-words text-slate-900 sm:text-4xl sm:leading-[3rem]">
          {pharmacy.name}
        </h1>
        {pharmacy.altName && (
          <p lang="bn" className="text-lg text-slate-700">
            {pharmacy.altName}
          </p>
        )}
        <p className="flex flex-wrap items-center gap-x-1.5 text-base text-slate-800">
          <span>{t("pharmacy.overview.kind")}</span>
          {place.label && (
            <span className="inline-flex items-center gap-1 text-slate-600">
              <span aria-hidden="true">·</span>
              <PinIcon className="size-4" />
              {place.label}
            </span>
          )}
        </p>
        {pharmacy.address && <p className="text-slate-700">{pharmacy.address}</p>}
        <p>
          <TrustBadge provenance={pharmacy.provenance} />
        </p>
        {pharmacy.description && <p className="max-w-3xl text-slate-700">{pharmacy.description}</p>}
        <ReviewNotice record={pharmacy} />
      </div>
    </header>
  );
}
