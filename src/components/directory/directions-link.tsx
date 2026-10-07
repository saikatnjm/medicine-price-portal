import type { Coordinates, GooglePlaceRef } from "@/domain/healthcare";
import { TrackedLink } from "@/components/common/tracked-link";
import { NavigateIcon } from "@/components/ui/icons";
import { getT } from "@/i18n/server";
import type { EntityKind } from "@/lib/events";
import { mapLinksFor } from "@/lib/maps";

/** Compact "Directions" link for result cards; renders nothing without a location. */
export function DirectionsLink({
  name,
  address,
  coordinates,
  google,
  entity,
  slug,
}: {
  name: string;
  address?: string;
  coordinates?: Coordinates | null;
  google?: GooglePlaceRef;
  /** Record kind and slug for the maps_click event; no event without an entity. */
  entity?: EntityKind;
  slug?: string;
}) {
  const links = mapLinksFor({ name, address, coordinates: coordinates ?? undefined, google });
  if (!links) return null;
  const t = getT();
  return (
    <TrackedLink
      event={entity ? { name: "maps_click", entity, slug } : undefined}
      href={links.directionsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-800 hover:bg-slate-50"
    >
      <NavigateIcon className="size-4" />
      {t("directory.directions")}
      <span className="sr-only">{t("directory.directionsSr", { name })}</span>
    </TrackedLink>
  );
}
