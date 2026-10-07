import type { ReactNode } from "react";
import Link from "@/i18n/link";
import type { CategoryType } from "@/components/ui/category";
import { EntityTile } from "@/components/ui/hero-card";
import { ChevronIcon, SirenIcon } from "@/components/ui/icons";
import type { DoctorListItem, FacilityListItem, PharmacyListItem } from "@/domain/read-models";
import { getT } from "@/i18n/server";
import { facilityKindPhrase, formatDistanceT } from "@/lib/directory-labels";
import { routes } from "@/lib/routes";

/** Light list with dividers instead of a bordered card per record. */
export function CompactList({ children, label }: { children: ReactNode; label: string }) {
  return (
    <ul aria-label={label} className="divide-y divide-slate-100">
      {children}
    </ul>
  );
}

interface RowProps {
  kind: CategoryType;
  href: string;
  name: string;
  /** Secondary line parts; empty ones are dropped. */
  meta: Array<string | undefined>;
  emergency?: boolean;
  distanceKm?: number;
}

/** One record as a compact row. Only the name is a link; its click area is stretched over the whole row. */
function Row({ kind, href, name, meta, emergency, distanceKm }: RowProps) {
  const t = getT();
  const line = meta.filter(Boolean).join(" · ");
  return (
    <li className="relative flex min-h-14 items-center gap-3 py-2.5">
      <EntityTile kind={kind} />
      <div className="min-w-0 flex-1">
        <Link href={href} className="font-medium break-words text-slate-900 after:absolute after:inset-0 hover:underline">
          {name}
        </Link>
        {(line || emergency || distanceKm !== undefined) && (
          <p className="flex flex-wrap items-center gap-x-2 text-sm text-slate-600">
            {line && <span>{line}</span>}
            {emergency && (
              <span className="inline-flex items-center gap-1 font-medium text-flag">
                <SirenIcon className="size-4" />
                {t("directory.card.emergency")}
              </span>
            )}
            {distanceKm !== undefined && <span className="font-medium text-brand-800">{formatDistanceT(t, distanceKm)}</span>}
          </p>
        )}
      </div>
      <ChevronIcon className="size-4 text-slate-400" />
    </li>
  );
}

export function FacilityRow({ item }: { item: FacilityListItem }) {
  const t = getT();
  const { facility, place, distanceKm } = item;
  return (
    <Row
      kind="hospital"
      href={routes.hospital(facility.slug)}
      name={facility.name}
      meta={[facilityKindPhrase(t, facility.kind, facility.ownership), place.label || undefined]}
      emergency={facility.emergency === true}
      distanceKm={distanceKm}
    />
  );
}

export function PharmacyRow({ item }: { item: PharmacyListItem }) {
  const t = getT();
  const { pharmacy, place, distanceKm } = item;
  return (
    <Row
      kind="pharmacy"
      href={routes.pharmacy(pharmacy.slug)}
      name={pharmacy.name}
      meta={[t("directory.card.pharmacy"), place.label || undefined]}
      distanceKm={distanceKm}
    />
  );
}

export function DoctorRow({ item }: { item: DoctorListItem }) {
  const { doctor, specialties, chamber, distanceKm } = item;
  return (
    <Row
      kind="doctor"
      href={routes.doctor(doctor.slug)}
      name={doctor.name}
      meta={[specialties.map((s) => s.practitionerTitle).join(", ") || undefined, chamber?.name]}
      distanceKm={distanceKm}
    />
  );
}
