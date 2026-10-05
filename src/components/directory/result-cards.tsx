import type { ReactNode } from "react";
import Link from "next/link";
import { FACILITY_KIND_LABEL, OWNERSHIP_LABEL } from "@/domain/healthcare";
import type { DoctorListItem, FacilityListItem, PharmacyListItem } from "@/domain/read-models";
import { formatDistance } from "@/lib/geo";
import { routes } from "@/lib/routes";
import { DirectionsLink } from "./directions-link";

const cardClass = "flex flex-col gap-2 border-b border-slate-200 py-4 sm:flex-row sm:items-start sm:justify-between";
const viewClass =
  "inline-flex min-h-10 items-center rounded-md bg-brand-700 px-3 text-sm font-semibold text-white hover:bg-brand-800";

function Distance({ km }: { km?: number }) {
  return km === undefined ? null : <span className="text-sm text-slate-600">{formatDistance(km)}</span>;
}

export function FacilityCard({ item, headingLevel = "h3" }: { item: FacilityListItem; headingLevel?: "h2" | "h3" }) {
  const { facility, place, specialties, distanceKm } = item;
  const Heading = headingLevel;
  const kind = [facility.ownership ? OWNERSHIP_LABEL[facility.ownership] : null, FACILITY_KIND_LABEL[facility.kind].toLowerCase()]
    .filter(Boolean)
    .join(" ");
  return (
    <li className={cardClass}>
      <div className="min-w-0 space-y-0.5">
        <Heading className="text-base font-semibold text-slate-900">
          <Link href={routes.hospital(facility.slug)} className="hover:underline">
            {facility.name}
          </Link>
        </Heading>
        <p className="text-sm text-slate-700">{kind.charAt(0).toUpperCase() + kind.slice(1)}</p>
        {place.label && <p className="text-sm text-slate-600">{place.label}</p>}
        <p className="flex flex-wrap gap-x-3 text-sm text-slate-600">
          {facility.emergency && <span className="font-medium text-slate-800">Emergency services listed</span>}
          {specialties.length > 0 && <span>{specialties.slice(0, 3).map((s) => s.name).join(", ")}</span>}
          <Distance km={distanceKm} />
        </p>
      </div>
      <div className="flex shrink-0 gap-2">
        <Link href={routes.hospital(facility.slug)} className={viewClass}>
          View<span className="sr-only"> {facility.name}</span>
        </Link>
        <DirectionsLink name={facility.name} address={facility.address} coordinates={facility.coordinates} google={facility.google} />
      </div>
    </li>
  );
}

export function PharmacyCard({ item, headingLevel = "h3" }: { item: PharmacyListItem; headingLevel?: "h2" | "h3" }) {
  const { pharmacy, place, distanceKm } = item;
  const Heading = headingLevel;
  return (
    <li className={cardClass}>
      <div className="min-w-0 space-y-0.5">
        <Heading className="text-base font-semibold text-slate-900">
          <Link href={routes.pharmacy(pharmacy.slug)} className="hover:underline">
            {pharmacy.name}
          </Link>
        </Heading>
        {place.label && <p className="text-sm text-slate-600">{place.label}</p>}
        {pharmacy.address && <p className="text-sm text-slate-600">{pharmacy.address}</p>}
        <Distance km={distanceKm} />
      </div>
      <div className="flex shrink-0 gap-2">
        <Link href={routes.pharmacy(pharmacy.slug)} className={viewClass}>
          View<span className="sr-only"> {pharmacy.name}</span>
        </Link>
        <DirectionsLink name={pharmacy.name} address={pharmacy.address} coordinates={pharmacy.coordinates} google={pharmacy.google} />
      </div>
    </li>
  );
}

export function DoctorCard({ item, headingLevel = "h3" }: { item: DoctorListItem; headingLevel?: "h2" | "h3" }) {
  const { doctor, specialties, chamber, distanceKm } = item;
  const Heading = headingLevel;
  return (
    <li className={cardClass}>
      <div className="min-w-0 space-y-0.5">
        <Heading className="text-base font-semibold text-slate-900">
          <Link href={routes.doctor(doctor.slug)} className="hover:underline">
            {doctor.name}
          </Link>
        </Heading>
        {specialties.length > 0 && (
          <p className="text-sm text-slate-700">{specialties.map((s) => s.practitionerTitle).join(", ")}</p>
        )}
        {chamber && (
          <p className="text-sm text-slate-600">{[chamber.name, chamber.place.label].filter(Boolean).join(" · ")}</p>
        )}
        <Distance km={distanceKm} />
      </div>
      <div className="flex shrink-0 gap-2">
        <Link href={routes.doctor(doctor.slug)} className={viewClass}>
          Profile<span className="sr-only"> of {doctor.name}</span>
        </Link>
        {chamber && <DirectionsLink name={chamber.name} address={chamber.chamber.address} coordinates={chamber.coordinates} />}
      </div>
    </li>
  );
}

/** Semantic list wrapper for cards. */
export function ResultList({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <ul className="border-t border-slate-200" aria-label={label}>
      {children}
    </ul>
  );
}
