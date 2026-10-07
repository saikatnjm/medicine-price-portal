import type { ReactNode } from "react";
import Link from "@/i18n/link";
import type { ProvenanceStatus } from "@/domain/types";
import type { DoctorListItem, FacilityListItem, PharmacyListItem } from "@/domain/read-models";
import { getT } from "@/i18n/server";
import { facilityKindPhrase, formatDistanceT, trustLabel } from "@/lib/directory-labels";
import { routes } from "@/lib/routes";
import { CategoryTile } from "@/components/ui/category-tile";
import type { CategoryType } from "@/components/ui/category";
import { AlertIcon, CheckBadgeIcon, InfoIcon, PinIcon, SirenIcon } from "@/components/ui/icons";
import { DirectionsLink } from "./directions-link";

const cardClass = "flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition-colors hover:border-brand-600/40 sm:flex-row sm:items-center sm:justify-between";
const actionsClass = "flex shrink-0 gap-2 [&>*]:flex-1 [&>*]:justify-center sm:[&>*]:flex-none";
const viewClass =
  "inline-flex min-h-11 items-center justify-center rounded-full bg-pine px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-700";

function Distance({ km }: { km?: number }) {
  if (km === undefined) return null;
  return (
    <span className="rounded-full bg-mist px-2 py-0.5 text-xs font-medium text-pine">{formatDistanceT(getT(), km)}</span>
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

/** Small pill with icon + text for how reliable a record is. "Community-mapped" shows as "Unverified". */
function TrustPill({ status }: { status: ProvenanceStatus }) {
  const t = getT();
  const Icon = status === "verified" || status === "registered" ? CheckBadgeIcon : status === "needs_review" ? AlertIcon : InfoIcon;
  const label = status === "unverified" ? t("layout.trust.unverified") : trustLabel(t, status);
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
      <Icon className="size-3.5" />
      <span className="sr-only">{t("directory.trust.dataStatus")}</span>
      {label}
    </span>
  );
}

function Meta({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-700">{children}</div>;
}

export function FacilityCard({ item, headingLevel = "h3" }: { item: FacilityListItem; headingLevel?: "h2" | "h3" }) {
  const { facility, place, specialties, distanceKm } = item;
  const Heading = headingLevel;
  const t = getT();
  const type: CategoryType = facility.kind === "doctors_practice" ? "doctor" : "hospital";
  return (
    <li className={cardClass}>
      <div className="flex min-w-0 gap-3">
        <CategoryTile type={type} />
        <div className="min-w-0 space-y-1">
          <Heading className="text-base font-semibold text-ink">
            <Link href={routes.hospital(facility.slug)} className="hover:underline">
              {facility.name}
            </Link>
          </Heading>
          <Meta>
            <span>{facilityKindPhrase(t, facility.kind, facility.ownership)}</span>
            <Distance km={distanceKm} />
            <TrustPill status={facility.provenance.status} />
          </Meta>
          {facility.emergency && (
            <p className="inline-flex items-center gap-1 text-sm font-medium text-flag">
              <SirenIcon className="size-4" />
              {t("directory.card.emergency")}
            </p>
          )}
          <Place label={place.label} />
          {specialties.length > 0 && (
            <p className="text-sm text-slate-600">{specialties.slice(0, 3).map((s) => s.name).join(" · ")}</p>
          )}
        </div>
      </div>
      <div className={actionsClass}>
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
        <CategoryTile type="pharmacy" />
        <div className="min-w-0 space-y-1">
          <Heading className="text-base font-semibold text-ink">
            <Link href={routes.pharmacy(pharmacy.slug)} className="hover:underline">
              {pharmacy.name}
            </Link>
          </Heading>
          <Meta>
            <span>{t("directory.card.pharmacy")}</span>
            <Distance km={distanceKm} />
            <TrustPill status={pharmacy.provenance.status} />
          </Meta>
          <Place label={place.label} />
          {pharmacy.address && pharmacy.address !== place.label && <p className="text-sm text-slate-600">{pharmacy.address}</p>}
        </div>
      </div>
      <div className={actionsClass}>
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
        <CategoryTile type="doctor" />
        <div className="min-w-0 space-y-1">
          <Heading className="text-base font-semibold text-ink">
            <Link href={routes.doctor(doctor.slug)} className="hover:underline">
              {doctor.name}
            </Link>
          </Heading>
          <Meta>
            {specialties.length > 0 && <span>{specialties.map((s) => s.practitionerTitle).join(", ")}</span>}
            <Distance km={distanceKm} />
            <TrustPill status={doctor.provenance.status} />
          </Meta>
          {chamber && <p className="text-sm text-slate-700">{chamber.name}</p>}
          <Place label={chamber?.place.label} />
        </div>
      </div>
      <div className={actionsClass}>
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
