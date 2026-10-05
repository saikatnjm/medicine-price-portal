import type { Coordinates, GooglePlaceRef } from "@/domain/healthcare";
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
  return (
    <a
      href={links.directionsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-10 items-center rounded-md border border-slate-300 px-3 text-sm font-medium text-slate-800 hover:bg-slate-50"
    >
      Directions<span className="sr-only"> to {name} (opens Google Maps)</span>
    </a>
  );
}
