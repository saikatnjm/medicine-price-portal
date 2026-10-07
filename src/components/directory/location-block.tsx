import type { Coordinates, GooglePlaceRef } from "@/domain/healthcare";
import { MapIcon, NavigateIcon, PinIcon } from "@/components/ui/icons";
import { getT } from "@/i18n/server";
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
  heading,
}: LocationBlockProps) {
  const t = getT();
  const fullAddress = address ?? formatPlace(placeLabel, postalCode);
  const target = { name, address: fullAddress || undefined, coordinates: coordinates ?? undefined, google };
  const links = mapLinksFor(target);
  const embed = mapEmbedFor(target);

  return (
    <section aria-labelledby={headingId} className="space-y-3">
      <h2 id={headingId} className="text-xl font-semibold text-slate-900">
        {heading ?? t("directory.location")}
      </h2>
      <address className="flex gap-2 not-italic text-slate-800">
        <PinIcon className="mt-1 size-4 text-brand-700" />
        <span className="min-w-0">
          {fullAddress || t("directory.addressNotPublished")}
          {address && placeLabel && !address.includes(placeLabel.split(",").at(-1)?.trim() ?? "") && (
            <span className="block text-sm text-slate-600">{placeLabel}</span>
          )}
        </span>
      </address>
      {links ? (
        <div className="flex flex-wrap items-start gap-2">
          <a
            href={links.directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-brand-700 px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-800"
          >
            <NavigateIcon className="size-4" />
            {t("directory.getDirections")}
          </a>
          <a
            href={links.viewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-medium text-slate-800 ring-1 ring-slate-300 transition-colors hover:bg-slate-50"
          >
            <MapIcon className="size-4" />
            {t("directory.viewOnGoogle")}
          </a>
          {embed && <MapPreview src={embed.src} provider={embed.provider} fullMapUrl={embed.fullMapUrl} name={name} />}
        </div>
      ) : (
        <p className="text-sm text-slate-600">{t("directory.noMapLocation")}</p>
      )}
      {links && !links.isGooglePlace && (
        <p className="text-xs text-slate-500">
          {links.hasExactLocation ? t("directory.mapExactNote") : t("directory.mapSearchNote")}
        </p>
      )}
    </section>
  );
}
