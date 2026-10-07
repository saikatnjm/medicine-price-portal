"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { localizePath, type Locale } from "@/i18n/config";
import { useLocale, useT } from "@/i18n/client";
import type { MapMarker } from "@/lib/map-markers";

const LEAFLET_VERSION = "1.9.4";
const LEAFLET_JS = `https://unpkg.com/leaflet@${LEAFLET_VERSION}/dist/leaflet.js`;
const LEAFLET_CSS = `https://unpkg.com/leaflet@${LEAFLET_VERSION}/dist/leaflet.css`;
const LEAFLET_JS_SRI = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
const LEAFLET_CSS_SRI = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
const SCRIPT_ID = "leaflet-js";
const STYLE_ID = "leaflet-css";
const TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const TILE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

type LatLng = [number, number];

/** The small part of the Leaflet global this component uses. */
interface LeafletMap {
  setView(center: LatLng, zoom: number): LeafletMap;
  fitBounds(bounds: [LatLng, LatLng], options?: { padding?: [number, number]; maxZoom?: number }): LeafletMap;
  remove(): void;
}
interface LeafletLayer {
  addTo(map: LeafletMap): LeafletLayer;
  bindPopup(content: HTMLElement): LeafletLayer;
}
interface LeafletGlobal {
  map(element: HTMLElement): LeafletMap;
  tileLayer(url: string, options: { maxZoom: number; attribution: string }): LeafletLayer;
  marker(position: LatLng, options?: { title?: string; alt?: string }): LeafletLayer;
}
declare global {
  interface Window {
    L?: LeafletGlobal;
  }
}

function whenLoaded(element: HTMLElement): Promise<void> {
  return new Promise((resolve, reject) => {
    if (element.dataset.loaded === "true") return resolve();
    element.addEventListener("load", () => {
      element.dataset.loaded = "true";
      resolve();
    });
    element.addEventListener("error", () => {
      // Remove the failed tag so a later click can try again.
      element.remove();
      reject(new Error("Leaflet failed to load"));
    });
  });
}

/** Injects the Leaflet script and stylesheet once; resolves with the global when both are ready. */
function loadLeaflet(): Promise<LeafletGlobal> {
  if (window.L) return Promise.resolve(window.L);

  let style = document.getElementById(STYLE_ID) as HTMLLinkElement | null;
  if (!style) {
    style = document.createElement("link");
    style.id = STYLE_ID;
    style.rel = "stylesheet";
    style.href = LEAFLET_CSS;
    style.integrity = LEAFLET_CSS_SRI;
    style.crossOrigin = "";
    document.head.appendChild(style);
  }
  let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = LEAFLET_JS;
    script.integrity = LEAFLET_JS_SRI;
    script.crossOrigin = "";
    script.async = true;
    document.head.appendChild(script);
  }
  return Promise.all([whenLoaded(style), whenLoaded(script)]).then(() => {
    if (!window.L) throw new Error("Leaflet global missing");
    return window.L;
  });
}

/** Popup content built with textContent only, so record data is never parsed as HTML. */
function popupFor(marker: MapMarker, viewLabel: string, lang: Locale): HTMLElement {
  const href = localizePath(marker.href, lang);
  const root = document.createElement("div");
  const link = document.createElement("a");
  link.href = href;
  link.textContent = marker.name;
  link.style.fontWeight = "600";
  root.appendChild(link);
  if (marker.label) {
    const label = document.createElement("p");
    label.textContent = marker.label;
    label.style.margin = "4px 0 0";
    root.appendChild(label);
  }
  const view = document.createElement("a");
  view.href = href;
  view.textContent = viewLabel;
  view.style.display = "inline-block";
  view.style.marginTop = "6px";
  root.appendChild(view);
  return root;
}

function drawMap(L: LeafletGlobal, element: HTMLElement, markers: readonly MapMarker[], viewLabel: string, lang: Locale): LeafletMap {
  const map = L.map(element);
  L.tileLayer(TILE_URL, { maxZoom: 19, attribution: TILE_ATTRIBUTION }).addTo(map);
  for (const m of markers) {
    L.marker([m.lat, m.lon], { title: m.name, alt: m.name }).addTo(map).bindPopup(popupFor(m, viewLabel, lang));
  }
  const [first] = markers;
  if (markers.length === 1 && first) {
    map.setView([first.lat, first.lon], 16);
  } else {
    const lats = markers.map((m) => m.lat);
    const lons = markers.map((m) => m.lon);
    map.fitBounds(
      [
        [Math.min(...lats), Math.min(...lons)],
        [Math.max(...lats), Math.max(...lons)],
      ],
      { padding: [30, 30], maxZoom: 16 },
    );
  }
  return map;
}

type Status = "loading" | "ready" | "error";

const DESKTOP_QUERY = "(min-width: 1024px)";

function subscribeDesktop(onChange: () => void): () => void {
  if (typeof window.matchMedia !== "function") return () => {};
  const query = window.matchMedia(DESKTOP_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}
function desktopSnapshot(): boolean {
  return typeof window.matchMedia === "function" && window.matchMedia(DESKTOP_QUERY).matches;
}

interface ResultsMapProps {
  /** Markers for the current page of results only. */
  markers: MapMarker[];
  /** The result list. Stays the primary content; the map is an optional extra. */
  children?: ReactNode;
}

/**
 * Optional map of the results on this page. Leaflet and OpenStreetMap tiles are requested only after
 * the visitor presses "Show map". Mobile: the map opens above the list. Desktop: list and map side by side.
 */
export function ResultsMap({ markers, children }: ResultsMapProps) {
  const t = useT();
  const lang = useLocale();
  const viewLabel = t("directory.card.viewDetails");
  // Desktop: list and map side by side from the start (Leaflet is still only fetched on the client, after
  // hydration). Mobile: the map stays closed until "Show map". A choice by the visitor always wins.
  const isDesktop = useSyncExternalStore(subscribeDesktop, desktopSnapshot, () => false);
  const [chosen, setChosen] = useState<boolean | null>(null);
  const open = chosen ?? isDesktop;
  const [status, setStatus] = useState<Status>("loading");
  const containerRef = useRef<HTMLDivElement>(null);
  const regionId = useId();

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    let map: LeafletMap | null = null;
    loadLeaflet().then(
      (L) => {
        const element = containerRef.current;
        if (cancelled || !element) return;
        map = drawMap(L, element, markers, viewLabel, lang);
        setStatus("ready");
      },
      () => {
        if (!cancelled) setStatus("error");
      },
    );
    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [open, markers, viewLabel, lang]);

  if (markers.length < 1) return <>{children}</>;

  const count = markers.length;
  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={regionId}
        onClick={() => {
          // Reset the status here (not in the effect) so opening starts from "loading".
          if (!open) setStatus("loading");
          setChosen(!open);
        }}
        className="mb-4 inline-flex min-h-11 items-center gap-2 rounded-full border border-slate-300 bg-white px-5 text-sm font-medium text-slate-800 shadow-sm hover:bg-slate-50"
      >
        {open ? t("directory.map.hide") : t("directory.map.show")}
      </button>
      <div className={open ? "lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-start lg:gap-6" : undefined}>
        <div id={regionId} className={open ? "mb-4 lg:order-last lg:mb-0 lg:sticky lg:top-4" : undefined}>
          {open && (
            <div role="region" aria-label={t("directory.map.regionLabel")} className="space-y-2">
              <p className="text-sm text-slate-700">
                {t(count === 1 ? "directory.map.count.one" : "directory.map.count.other", { n: count })}
              </p>
              {status === "error" ? (
                <p role="status" className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800">
                  {t("directory.map.error")}
                </p>
              ) : (
                <>
                  {status === "loading" && (
                    <p role="status" className="text-sm text-slate-700">
                      {t("directory.map.loading")}
                    </p>
                  )}
                  <div ref={containerRef} className="h-80 w-full rounded-xl border border-slate-300 lg:h-[32rem]" />
                </>
              )}
            </div>
          )}
        </div>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
