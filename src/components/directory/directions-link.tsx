import type { Coordinates, GooglePlaceRef } from "@/domain/healthcare";
import { NavigateIcon } from "@/components/ui/icons";
import { getT } from "@/i18n/server";
import { mapLinksFor } from "@/lib/maps";

/** Compact "Directions" link for result cards; renders nothing without a location. */
export function DirectionsLink({
  name,
  address,
  coordinates,
  google,
}: {
  name: string;
  address?: string;
  coordinates?: Coordinates | null;
  google?: GooglePlaceRef;
}) {
  const links = mapLinksFor({ name, address, coordinates: coordinates ?? undefined, google });
  if (!links) return null;
  const t = getT();
  return (
    <a
      href={links.directionsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-800 hover:bg-slate-50"
    >
      <NavigateIcon className="size-4" />
      {t("directory.directions")}
      <span className="sr-only">{t("directory.directionsSr", { name })}</span>
    </a>
  );
}
