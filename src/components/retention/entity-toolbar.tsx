"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { CompareIcon, HeartIcon, LinkIcon, ShareIcon } from "@/components/ui/icons";
import { track } from "@/lib/events";
import {
  addView,
  isSaved,
  readRaw,
  STORE_KEYS,
  subscribeStore,
  toggleCompare,
  toggleSaved,
  type EntityType,
} from "@/lib/local-store";
import { routes } from "@/lib/routes";
import { useCompareList } from "@/lib/use-local-store";

interface EntityToolbarProps {
  type: EntityType;
  slug: string;
  name: string;
  /** Short context saved with the item, e.g. the generic name or the place. */
  subtitle?: string;
  /** Public path of the page (no query string). */
  path: string;
  /** Show "Add to compare" (medicines). */
  compare?: boolean;
}

const button =
  "inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-800 hover:bg-slate-50";

/**
 * Save / Share / Copy link (and Compare for medicines), plus the "recently viewed" record for this page.
 * Everything is stored in this browser only. Share uses the Web Share API when the device has it and
 * otherwise copies the link.
 */
export function EntityToolbar({ type, slug, name, subtitle, path, compare = false }: EntityToolbarProps) {
  const savedRaw = useSyncExternalStore(subscribeStore, () => readRaw(STORE_KEYS.saved), () => "");
  const saved = isSaved(savedRaw, type, slug);
  const compareList = useCompareList();
  const inCompare = compareList.includes(slug);
  const [message, setMessage] = useState("");

  // Record this page as recently viewed (a browser-local write; no state is set here).
  useEffect(() => {
    addView({ type, slug, name, subtitle });
    track({ name: "view_entity", entity: type, slug });
  }, [type, slug, name, subtitle]);

  const url = () => `${window.location.origin}${path}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(url());
      setMessage("Link copied.");
      track({ name: "share", method: "copy" });
    } catch {
      setMessage("Could not copy the link. Copy it from the address bar.");
    }
  }

  async function share() {
    if (typeof navigator.share !== "function") return copy();
    try {
      await navigator.share({ title: name, url: url() });
      track({ name: "share", method: "native" });
    } catch {
      // Closing the share sheet is not an error.
    }
  }

  return (
    <div className="space-y-2">
      <div role="group" aria-label={`Save and share ${name}`} className="flex flex-wrap gap-2">
        <button
          type="button"
          aria-pressed={saved}
          onClick={() => {
            const now = toggleSaved({ type, slug, name, subtitle });
            track({ name: "save_toggle", entity: type, saved: now });
            setMessage(now ? "Saved on this device." : "Removed from saved.");
          }}
          className={button}
        >
          <HeartIcon filled={saved} className="size-5" />
          {saved ? "Saved" : "Save"}
          <span className="sr-only"> {name}</span>
        </button>
        <button type="button" onClick={share} className={button}>
          <ShareIcon className="size-5" />
          Share<span className="sr-only"> {name}</span>
        </button>
        <button type="button" onClick={copy} className={button}>
          <LinkIcon className="size-5" />
          Copy link
        </button>
        {compare && (
          <button
            type="button"
            aria-pressed={inCompare}
            onClick={() => setMessage(toggleCompare(slug).includes(slug) ? "Added to compare." : "Removed from compare.")}
            className={button}
          >
            <CompareIcon className="size-5" />
            {inCompare ? "In compare list" : "Compare"}
          </button>
        )}
      </div>
      {compare && compareList.length > 0 && (
        <p className="text-sm text-slate-700">
          <Link href={routes.compare(compareList)} className="font-medium text-brand-800 underline">
            Compare {compareList.length} {compareList.length === 1 ? "medicine" : "medicines"}
          </Link>
        </p>
      )}
      <p role="status" className="min-h-5 text-sm text-slate-600">
        {message}
      </p>
    </div>
  );
}
