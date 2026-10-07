import type { ReactNode } from "react";
import Link from "@/i18n/link";
import type { FacilityKind } from "@/domain/healthcare";
import type { DoctorListItem, FacilityListItem, PharmacyListItem } from "@/domain/read-models";
import { getT } from "@/i18n/server";
import { facilityKindPhrase, formatDistanceT } from "@/lib/directory-labels";
import { routes } from "@/lib/routes";
import { DoctorIcon, HospitalIcon, PharmacyIcon, PinIcon, SirenIcon } from "@/components/ui/icons";
import { DirectionsLink } from "./directions-link";

const cardClass =
  "flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:justify-between";
const viewClass =
  "inline-flex min-h-11 items-center rounded-lg bg-brand-700 px-4 text-sm font-semibold text-white hover:bg-brand-800";

const FACILITY_ICON: Partial<Record<FacilityKind, typeof HospitalIcon>> = {
  doctors_practice: DoctorIcon,
};

function Distance({ km }: { km?: number }) {
  if (km === undefined) return null;
  return (
    <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-800">{formatDistanceT(getT(), km)}</span>
  );
}

function Place({ label }: { label?: string }) {
  if (!label) return null;
  return (
    <p className="flex items-center gap-1.5 text-sm text-slate-600">
      <PinIcon className="size-4" />
      <span className="min-w-0">{label}</span>
    </p>
  );
}

function CardIcon({ children }: { children: ReactNode }) {
  return (
    <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700">
      {children}
    </span>
  );
}

export function FacilityCard({ item, headingLevel = "h3" }: { item: FacilityListItem; headingLevel?: "h2" | "h3" }) {
  const { facility, place, specialties, distanceKm } = item;
  const Heading = headingLevel;
  const t = getT();
  const Icon = FACILITY_ICON[facility.kind] ?? HospitalIcon;
  return (
    <li className={cardClass}>
      <div className="flex min-w-0 gap-3">
        <CardIcon>
          <Icon className="size-5" />
        </CardIcon>
        <div className="min-w-0 space-y-1">
          <Heading className="text-base font-semibold text-slate-900">
            <Link href={routes.hospital(facility.slug)} className="hover:underline">
              {facility.name}
            </Link>
          </Heading>
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-700">
            <span>{facilityKindPhrase(t, facility.kind, facility.ownership)}</span>
            {facility.emergency && (
              <span className="inline-flex items-center gap-1 font-medium text-slate-900">
                <SirenIcon className="size-4" />
                {t("directory.card.emergency")}
              </span>
            )}
            <Distance km={distanceKm} />
          </p>
          <Place label={place.label} />
          {specialties.length > 0 && (
            <p className="text-sm text-slate-600">{specialties.slice(0, 3).map((s) => s.name).join(" · ")}</p>
          )}
        </div>
      </div>
      <div className="flex shrink-0 gap-2">
        <Link href={routes.hospital(facility.slug)} className={viewClass}>
          {t("directory.card.viewDetails")}
          <span className="sr-only">{t("directory.card.viewDetailsSr", { name: facility.name })}</span>
        </Link>
        <DirectionsLink name={facility.name} address={facility.address} coordinates={facility.coordinates} google={facility.google} />
      </div>
    </li>
  );
}

export function PharmacyCard({ item, headingLevel = "h3" }: { item: PharmacyListItem; headingLevel?: "h2" | "h3" }) {
  const { pharmacy, place, distanceKm } = item;
  const Heading = headingLevel;
  const t = getT();
  return (
    <li className={cardClass}>
      <div className="flex min-w-0 gap-3">
        <CardIcon>
          <PharmacyIcon className="size-5" />
        </CardIcon>
        <div className="min-w-0 space-y-1">
          <Heading className="text-base font-semibold text-slate-900">
            <Link href={routes.pharmacy(pharmacy.slug)} className="hover:underline">
              {pharmacy.name}
            </Link>
          </Heading>
          <p className="flex flex-wrap items-center gap-x-2 text-sm text-slate-700">
            <span>{t("directory.card.pharmacy")}</span>
            <Distance km={distanceKm} />
          </p>
          <Place label={place.label} />
          {pharmacy.address && <p className="text-sm text-slate-600">{pharmacy.address}</p>}
        </div>
      </div>
      <div className="flex shrink-0 gap-2">
        <Link href={routes.pharmacy(pharmacy.slug)} className={viewClass}>
          {t("directory.card.viewDetails")}
          <span className="sr-only">{t("directory.card.viewDetailsSr", { name: pharmacy.name })}</span>
        </Link>
        <DirectionsLink name={pharmacy.name} address={pharmacy.address} coordinates={pharmacy.coordinates} google={pharmacy.google} />
      </div>
    </li>
  );
}

export function DoctorCard({ item, headingLevel = "h3" }: { item: DoctorListItem; headingLevel?: "h2" | "h3" }) {
  const { doctor, specialties, chamber, distanceKm } = item;
  const Heading = headingLevel;
  const t = getT();
  return (
    <li className={cardClass}>
      <div className="flex min-w-0 gap-3">
        <CardIcon>
          <DoctorIcon className="size-5" />
        </CardIcon>
        <div className="min-w-0 space-y-1">
          <Heading className="text-base font-semibold text-slate-900">
            <Link href={routes.doctor(doctor.slug)} className="hover:underline">
              {doctor.name}
            </Link>
          </Heading>
          {specialties.length > 0 && (
            <p className="flex flex-wrap items-center gap-x-2 text-sm text-slate-700">
              <span>{specialties.map((s) => s.practitionerTitle).join(", ")}</span>
              <Distance km={distanceKm} />
            </p>
          )}
          {chamber && <p className="text-sm text-slate-700">{chamber.name}</p>}
          <Place label={chamber?.place.label} />
        </div>
      </div>
      <div className="flex shrink-0 gap-2">
        <Link href={routes.doctor(doctor.slug)} className={viewClass}>
          {t("directory.card.viewProfile")}
          <span className="sr-only">{t("directory.card.viewDetailsSr", { name: doctor.name })}</span>
        </Link>
        {chamber && <DirectionsLink name={chamber.name} address={chamber.chamber.address} coordinates={chamber.coordinates} />}
      </div>
    </li>
  );
}

/** Semantic list wrapper for cards. */
export function ResultList({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <ul className="space-y-3" aria-label={label}>
      {children}
    </ul>
  );
}
