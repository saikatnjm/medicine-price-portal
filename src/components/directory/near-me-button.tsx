"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { localizePath, stripLocale } from "@/i18n/config";
import { useLocale, useT } from "@/i18n/client";
import { formatNearParam } from "@/lib/geo";

/**
 * Sorts the current list by distance using the browser's location. The
 * position is rounded to about 1 km before it is put in the URL and is never
 * stored. Hidden until the visitor asks; works without it (filter by location).
 */
export function NearMeButton() {
  const t = useT();
  const lang = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"idle" | "locating" | "denied" | "unavailable">("idle");
  const active = searchParams.has("near");

  function update(near: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    if (near) params.set("near", near);
    else params.delete("near");
    const qs = params.toString();
    const base = localizePath(stripLocale(pathname), lang);
    router.push(qs ? `${base}?${qs}` : base);
  }

  function locate() {
    if (!("geolocation" in navigator)) {
      setStatus("unavailable");
      return;
    }
    setStatus("locating");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setStatus("idle");
        update(formatNearParam({ lat: coords.latitude, lon: coords.longitude }));
      },
      (error) => setStatus(error.code === error.PERMISSION_DENIED ? "denied" : "unavailable"),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {active ? (
        <button
          type="button"
          onClick={() => update(null)}
          className="inline-flex min-h-11 items-center rounded-full border border-slate-300 bg-white px-5 text-sm font-medium text-slate-800 shadow-sm hover:bg-slate-50"
        >
          {t("directory.nearMe.clear")}
        </button>
      ) : (
        <button
          type="button"
          onClick={locate}
          disabled={status === "locating"}
          className="inline-flex min-h-11 items-center rounded-full border border-slate-300 bg-white px-5 text-sm font-medium text-slate-800 shadow-sm hover:bg-slate-50 disabled:opacity-60"
        >
          {status === "locating" ? t("directory.nearMe.locating") : t("directory.nearMe.sort")}
        </button>
      )}
      <p role="status" className="text-sm text-slate-600">
        {status === "denied" && t("directory.nearMe.denied")}
        {status === "unavailable" && t("directory.nearMe.unavailable")}
      </p>
    </div>
  );
}
