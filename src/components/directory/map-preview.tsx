"use client";

import { useState } from "react";

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
  const [open, setOpen] = useState(false);
  const providerName = provider === "google" ? "Google Maps" : "OpenStreetMap";

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex min-h-11 items-center rounded-md border border-slate-300 px-4 text-sm font-medium text-slate-800 hover:bg-slate-50"
      >
        Show map
      </button>
    );
  }
  return (
    <figure className="w-full basis-full space-y-1">
      <iframe
        src={src}
        title={`Map showing the location of ${name}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-56 w-full rounded-md border border-slate-200 sm:h-72"
      />
      <figcaption className="text-xs text-slate-600">
        Map:{" "}
        <a href={fullMapUrl} target="_blank" rel="noopener noreferrer" className="underline">
          {provider === "openstreetmap" ? "© OpenStreetMap contributors" : providerName}
        </a>
      </figcaption>
    </figure>
  );
}
