import type { GooglePlaceRef } from "@/domain/healthcare";
import { fetchGooglePlaceDetails, googleMapsPlaceUrl } from "@/lib/google-places";

const linkClass = "inline-flex min-h-8 items-center text-brand-800 underline underline-offset-2";
const countFormatter = new Intl.NumberFormat("en-US");

/**
 * Optional Google Maps information for a listing. Renders nothing without a
 * stored place ID. Ratings are fetched live (never stored) and shown only when
 * the operator enabled it; otherwise a plain "View on Google Maps" link.
 */
export async function GooglePlaceInfo({ google, name }: { google?: GooglePlaceRef; name: string }) {
  if (!google?.placeId) return null;
  const details = await fetchGooglePlaceDetails(google.placeId);

  if (!details) {
    return (
      <p className="text-sm">
        <a href={googleMapsPlaceUrl(google.placeId, name)} target="_blank" rel="noopener noreferrer" className={linkClass}>
          View on Google Maps
        </a>
      </p>
    );
  }

  return (
    <div className="space-y-1 text-sm text-slate-700">
      <p>
        Google rating{" "}
        <span className="font-medium text-slate-900">
          {details.rating.toFixed(1)} ★<span className="sr-only"> out of 5</span>
        </span>{" "}
        · {countFormatter.format(details.userRatingCount)} {details.userRatingCount === 1 ? "review" : "reviews"}
      </p>
      <p>
        <a href={details.googleMapsUri} target="_blank" rel="noopener noreferrer" className={linkClass}>
          View on Google Maps
        </a>
      </p>
      <p className="text-xs text-slate-600">Information from Google Maps</p>
    </div>
  );
}
