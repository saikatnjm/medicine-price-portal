"use client";

import Link from "@/i18n/link";
import { useState } from "react";
import { useT } from "@/i18n/client";
import { formatNearParam } from "@/lib/geo";
import { routes } from "@/lib/routes";
import { buildHref } from "@/components/directory/pagination";
import { WHITE_CHIP_CLASS } from "@/components/ui/chip";
import { PinIcon } from "@/components/ui/icons";

type Status = "idle" | "locating" | "denied" | "unavailable";

/**
 * Homepage "Use my location". The browser is asked for a position only after the click. The rounded
 * position goes into the link addresses only (never stored or sent anywhere else).
 */
export function HomeNearMe({ showDoctors = false }: { showDoctors?: boolean }) {
  const t = useT();
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

  const chip = WHITE_CHIP_CLASS;

  return (
    <div className="space-y-3">
      {near ? (
        <div>
          <p className="text-sm font-medium text-slate-800">{t("home.near.heading")}</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            <li>
              <Link href={buildHref(routes.hospitals(), { near })} className={chip}>
                {t("home.near.hospitals")}
              </Link>
            </li>
            <li>
              <Link href={buildHref(routes.pharmacies(), { near })} className={chip}>
                {t("home.near.pharmacies")}
              </Link>
            </li>
            {showDoctors && (
              <li>
                <Link href={buildHref(routes.doctors(), { near })} className={chip}>
                  {t("home.near.doctors")}
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
          className="inline-flex min-h-12 items-center gap-2 rounded-full bg-pine px-6 text-base font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
        >
          <PinIcon className="size-5" />
          {status === "locating" ? t("home.near.locating") : t("home.near.locate")}
        </button>
      )}
      <p role="status" className="text-sm text-slate-600">
        {status === "denied" && t("home.near.denied")}
        {status === "unavailable" && t("home.near.unavailable")}
      </p>
    </div>
  );
}
