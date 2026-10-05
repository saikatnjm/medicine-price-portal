import type { Coordinates, GooglePlaceRef } from "@/domain/healthcare";
import { formatPlace } from "@/lib/format";
import { mapEmbedFor, mapLinksFor } from "@/lib/maps";
import { MapPreview } from "./map-preview";

interface LocationBlockProps {
  name: string;
  /** Street address as published. */
  address?: string;
  /** Resolved place label, e.g. "Panthapath, Dhanmondi, Dhaka". */
  placeLabel: string;
  postalCode?: string;
  coordinates?: Coordinates | null;
  google?: GooglePlaceRef;
  headingId?: string;
  heading?: string;
}

/**
 * Address first, then large Directions / Google Maps actions, then an optional
 * click-to-load map. Every state (no coordinates, no address, no key) stays usable.
 */
export function LocationBlock({
  name,
  address,
  placeLabel,
  postalCode,
  coordinates,
  google,
  headingId = "location",
  heading = "Location",
}: LocationBlockProps) {
  const fullAddress = address ?? formatPlace(placeLabel, postalCode);
  const target = { name, address: fullAddress || undefined, coordinates: coordinates ?? undefined, google };
  const links = mapLinksFor(target);
  const embed = mapEmbedFor(target);

  return (
    <section aria-labelledby={headingId} className="space-y-3">
      <h2 id={headingId} className="text-xl font-semibold text-slate-900">
        {heading}
      </h2>
      <address className="not-italic text-slate-800">
        {fullAddress || "Address not published."}
        {address && placeLabel && !address.includes(placeLabel.split(",").at(-1)?.trim() ?? "") && (
          <span className="block text-sm text-slate-600">{placeLabel}</span>
        )}
      </address>
      {links ? (
        <div className="flex flex-wrap items-start gap-2">
          <a
            href={links.directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center rounded-md bg-brand-700 px-4 text-sm font-semibold text-white hover:bg-brand-800"
          >
            Get directions
          </a>
          <a
            href={links.viewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center rounded-md border border-slate-300 px-4 text-sm font-medium text-slate-800 hover:bg-slate-50"
          >
            View on Google Maps
          </a>
          {embed && <MapPreview src={embed.src} provider={embed.provider} fullMapUrl={embed.fullMapUrl} name={name} />}
        </div>
      ) : (
        <p className="text-sm text-slate-600">No map location is published for this place.</p>
      )}
      {links && !links.isGooglePlace && (
        <p className="text-xs text-slate-500">
          {links.hasExactLocation
            ? "Opens Google Maps at the mapped location; it is not a verified Google listing."
            : "Opens a Google Maps search for this address; the result may not be exact."}
        </p>
      )}
    </section>
  );
}
