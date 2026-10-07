/**
 * Google Analytics 4 helpers (dependency-free, safe for server and client).
 *
 * Analytics is off unless NEXT_PUBLIC_GA_MEASUREMENT_ID is set, and never runs
 * on Vercel preview/development deployments.
 */

const MEASUREMENT_ID = /^G-[A-Z0-9]{4,20}$/;

/** URL parameters that must never reach analytics (rounded visitor position from "near me"). */
const PRIVATE_PARAMS = ["near"] as const;

/** The GA4 measurement id to use, or null when analytics should not load. */
export function resolveGaMeasurementId(
  env: Record<string, string | undefined> = process.env,
): string | null {
  const id = env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim().toUpperCase();
  if (!id || !MEASUREMENT_ID.test(id)) return null;
  if (env.VERCEL_ENV && env.VERCEL_ENV !== "production") return null;
  return id;
}

/** Removes private parameters from a URL before it is sent as page_location. */
export function sanitizePageLocation(href: string): string {
  try {
    const url = new URL(href);
    for (const param of PRIVATE_PARAMS) url.searchParams.delete(param);
    url.hash = "";
    return url.toString();
  } catch {
    return "";
  }
}
