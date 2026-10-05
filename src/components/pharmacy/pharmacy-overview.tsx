import { ReviewNotice, TrustBadge } from "@/components/directory/trust-badge";
import type { PharmacyDetail } from "@/domain/read-models";

/** h1, Bangla name, kind, place, address, trust badge and description. */
export function PharmacyOverview({ detail }: { detail: PharmacyDetail }) {
  const { pharmacy, place } = detail;
  return (
    <header className="space-y-2">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">{pharmacy.name}</h1>
      {pharmacy.altName && (
        <p lang="bn" className="text-lg text-slate-700">
          {pharmacy.altName}
        </p>
      )}
      <p className="text-lg text-slate-800">
        Pharmacy
        {place.label && <span className="text-slate-600"> · {place.label}</span>}
      </p>
      {pharmacy.address && <p className="text-slate-700">{pharmacy.address}</p>}
      <p>
        <TrustBadge provenance={pharmacy.provenance} />
      </p>
      {pharmacy.description && <p className="max-w-3xl text-slate-700">{pharmacy.description}</p>}
      <ReviewNotice record={pharmacy} />
    </header>
  );
}
