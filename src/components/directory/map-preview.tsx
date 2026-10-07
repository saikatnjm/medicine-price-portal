"use client";

import { useState } from "react";
import { MapIcon } from "@/components/ui/icons";
import { useT } from "@/i18n/client";

interface MapPreviewProps {
  /** Iframe source computed on the server (lib/maps.ts). */
  src: string;
  provider: "google" | "openstreetmap";
  fullMapUrl: string;
  /** Place name, used for the iframe title. */
  name: string;
}

/**
 * Click-to-load map. Nothing is fetched from a map provider until the visitor
 * asks, which keeps pages light and avoids third-party requests by default.
 */
export function MapPreview({ src, provider, fullMapUrl, name }: MapPreviewProps) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const providerName = provider === "google" ? "Google Maps" : "OpenStreetMap";

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-medium text-slate-800 ring-1 ring-slate-300 transition-colors hover:bg-slate-50"
      >
        <MapIcon className="size-4" />
        {t("directory.map.show")}
      </button>
    );
  }
  return (
    <figure className="w-full basis-full space-y-1">
      <iframe
        src={src}
        title={t("directory.map.title", { name })}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-56 w-full rounded-2xl sm:h-72"
      />
      <figcaption className="text-xs text-slate-600">
        {t("directory.map.caption")}{" "}
        <a href={fullMapUrl} target="_blank" rel="noopener noreferrer" className="underline">
          {provider === "openstreetmap" ? "© OpenStreetMap contributors" : providerName}
        </a>
      </figcaption>
    </figure>
  );
}
