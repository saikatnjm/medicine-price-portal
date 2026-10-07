import type { Coordinates, GooglePlaceRef } from "@/domain/healthcare";
import { TrackedLink } from "@/components/common/tracked-link";
import { GlobeIcon, MapIcon, NavigateIcon, PhoneIcon } from "@/components/ui/icons";
import { getT } from "@/i18n/server";
import type { AppEvent, EntityKind } from "@/lib/events";
import { mapLinksFor } from "@/lib/maps";
import { safeHttpUrl, telHref } from "./contact-details";

interface QuickActionsProps {
  name: string;
  phone?: string;
  website?: string;
  address?: string;
  coordinates?: Coordinates | null;
  google?: GooglePlaceRef;
  /** Also show a "Google Maps" (view place) action next to Directions. */
  showMapLink?: boolean;
  /** Record kind and slug for click events; no events without an entity. */
  entity?: EntityKind;
  slug?: string;
}

const primary =
  "inline-flex min-h-12 items-center gap-2 rounded-xl bg-brand-700 px-5 text-base font-semibold text-white shadow-sm hover:bg-brand-800";
const secondary =
  "inline-flex min-h-12 items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 text-base font-medium text-slate-800 hover:bg-slate-50";

/** Call / Website / Directions; each action appears only when the data supports it. */
export function QuickActions({ name, phone, website, address, coordinates, google, showMapLink = false, entity, slug }: QuickActionsProps) {
  const t = getT();
  const ev = (name: "phone_click" | "website_click" | "maps_click"): AppEvent | undefined =>
    entity ? { name, entity, slug } : undefined;
  const newTab = <span className="sr-only">{t("directory.newTab")}</span>;
  const url = safeHttpUrl(website);
  const links = mapLinksFor({ name, address, coordinates: coordinates ?? undefined, google });
  if (!phone && !url && !links) return null;
  return (
    <div role="group" aria-label={t("facility.actions.label", { name })} className="flex flex-wrap gap-3">
      {phone && (
        <TrackedLink event={ev("phone_click")} href={telHref(phone)} className={primary}>
          <PhoneIcon />
          {t("facility.actions.call")}
          <span className="sr-only">{t("facility.actions.callSr", { name })}</span>
        </TrackedLink>
      )}
      {url && (
        <TrackedLink
          event={ev("website_click")}
          href={url.toString()}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className={secondary}
        >
          <GlobeIcon />
          {t("facility.actions.website")}
          <span className="sr-only">{t("facility.actions.websiteSr", { name })}</span>
          {newTab}
        </TrackedLink>
      )}
      {links && (
        <TrackedLink event={ev("maps_click")} href={links.directionsUrl} target="_blank" rel="noopener noreferrer" className={secondary}>
          <NavigateIcon />
          {t("directory.directions")}
          <span className="sr-only">{t("facility.actions.directionsSr", { name })}</span>
          {newTab}
        </TrackedLink>
      )}
      {links && showMapLink && (
        <TrackedLink event={ev("maps_click")} href={links.viewUrl} target="_blank" rel="noopener noreferrer" className={secondary}>
          <MapIcon />
          {t("facility.actions.googleMaps")}
          <span className="sr-only">{t("facility.actions.googleMapsSr", { name })}</span>
          {newTab}
        </TrackedLink>
      )}
    </div>
  );
}
