import type { PharmacyDetail } from "@/domain/read-models";

/** h1, Bangla name, place and description. */
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
      {place.label && <p className="text-lg text-slate-800">{place.label}</p>}
      {pharmacy.description && <p className="max-w-3xl text-slate-700">{pharmacy.description}</p>}
    </header>
  );
}
