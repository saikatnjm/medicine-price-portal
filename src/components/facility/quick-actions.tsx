import type { Coordinates, GooglePlaceRef } from "@/domain/healthcare";
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
}

const primary =
  "inline-flex min-h-11 items-center rounded-md bg-brand-700 px-5 text-base font-semibold text-white hover:bg-brand-800";
const secondary =
  "inline-flex min-h-11 items-center rounded-md border border-slate-300 px-5 text-base font-medium text-slate-800 hover:bg-slate-50";

const NEW_TAB = <span className="sr-only"> (opens in a new tab)</span>;

/** Call / Website / Directions; each action appears only when the data supports it. */
export function QuickActions({ name, phone, website, address, coordinates, google, showMapLink = false }: QuickActionsProps) {
  const url = safeHttpUrl(website);
  const links = mapLinksFor({ name, address, coordinates: coordinates ?? undefined, google });
  if (!phone && !url && !links) return null;
  return (
    <div role="group" aria-label={`Quick actions for ${name}`} className="flex flex-wrap gap-3">
      {phone && (
        <a href={telHref(phone)} className={primary}>
          Call<span className="sr-only"> {name}</span>
        </a>
      )}
      {url && (
        <a href={url.toString()} target="_blank" rel="noopener noreferrer nofollow" className={secondary}>
          Website<span className="sr-only"> of {name}</span>
          {NEW_TAB}
        </a>
      )}
      {links && (
        <a href={links.directionsUrl} target="_blank" rel="noopener noreferrer" className={secondary}>
          Directions<span className="sr-only"> to {name}</span>
          {NEW_TAB}
        </a>
      )}
      {links && showMapLink && (
        <a href={links.viewUrl} target="_blank" rel="noopener noreferrer" className={secondary}>
          Google Maps<span className="sr-only"> for {name}</span>
          {NEW_TAB}
        </a>
      )}
    </div>
  );
}
