import type { Pharmacy } from "@/domain/types";

export function PharmacyOverview({ pharmacy }: { pharmacy: Pharmacy }) {
  return (
    <header className="space-y-2">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
        {pharmacy.name}
      </h1>
      <p className="text-lg text-slate-800">
        {pharmacy.area}, {pharmacy.city}
      </p>
      <dl className="space-y-1 text-slate-700">
        {pharmacy.address && (
          <div className="flex gap-2">
            <dt className="font-medium">Address:</dt>
            <dd>{pharmacy.address}</dd>
          </div>
        )}
        {pharmacy.phone && (
          <div className="flex gap-2">
            <dt className="font-medium">Phone:</dt>
            <dd>
              <a href={`tel:${pharmacy.phone}`} className="text-brand-800 underline">
                {pharmacy.phone}
              </a>
            </dd>
          </div>
        )}
        {pharmacy.website && (
          <div className="flex gap-2">
            <dt className="font-medium">Website:</dt>
            <dd>
              <a
                href={pharmacy.website}
                rel="nofollow noopener"
                className="text-brand-800 underline"
              >
                {pharmacy.website}
              </a>
            </dd>
          </div>
        )}
      </dl>
      {pharmacy.description && <p className="text-slate-700">{pharmacy.description}</p>}
    </header>
  );
}
