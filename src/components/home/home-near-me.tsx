"use client";

import Link from "next/link";
import { useState } from "react";
import { formatNearParam } from "@/lib/geo";
import { routes } from "@/lib/routes";
import { buildHref } from "@/components/directory/pagination";
import { PinIcon } from "@/components/ui/icons";

type Status = "idle" | "locating" | "denied" | "unavailable";

/**
 * Homepage "Use my location". The browser is asked for a position only after the click. The rounded
 * position goes into the link addresses only (never stored or sent anywhere else).
 */
export function HomeNearMe({ showDoctors = false }: { showDoctors?: boolean }) {
  const [status, setStatus] = useState<Status>("idle");
  const [near, setNear] = useState<string | null>(null);

  function locate() {
    if (!("geolocation" in navigator)) {
      setStatus("unavailable");
      return;
    }
    setStatus("locating");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setStatus("idle");
        setNear(formatNearParam({ lat: coords.latitude, lon: coords.longitude }));
      },
      (error) => setStatus(error.code === error.PERMISSION_DENIED ? "denied" : "unavailable"),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  }

  const chip =
    "inline-flex min-h-11 items-center rounded-full border border-brand-600 bg-white px-4 text-sm font-semibold text-brand-800 hover:bg-brand-50";

  return (
    <div className="space-y-3">
      {near ? (
        <div>
          <p className="text-sm font-medium text-slate-800">Healthcare near you, sorted by distance</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            <li>
              <Link href={buildHref(routes.hospitals(), { near })} className={chip}>
                Hospitals &amp; clinics
              </Link>
            </li>
            <li>
              <Link href={buildHref(routes.pharmacies(), { near })} className={chip}>
                Pharmacies
              </Link>
            </li>
            {showDoctors && (
              <li>
                <Link href={buildHref(routes.doctors(), { near })} className={chip}>
                  Doctors
                </Link>
              </li>
            )}
          </ul>
        </div>
      ) : (
        <button
          type="button"
          onClick={locate}
          disabled={status === "locating"}
          className="inline-flex min-h-12 items-center gap-2 rounded-full bg-brand-700 px-6 text-base font-semibold text-white shadow-sm hover:bg-brand-800 disabled:opacity-60"
        >
          <PinIcon className="size-5" />
          {status === "locating" ? "Finding your location…" : "Use my location"}
        </button>
      )}
      <p role="status" className="text-sm text-slate-600">
        {status === "denied" && "Location permission was not given. Search by area instead."}
        {status === "unavailable" && "Your location is not available. Search by area instead."}
      </p>
    </div>
  );
}
