"use client";

import { useLocale, useT } from "@/i18n/client";
import { localizePath } from "@/i18n/config";
import Link from "@/i18n/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { ShareButton } from "@/components/common/share-button";
import { CompareIcon, HeartIcon, LinkIcon } from "@/components/ui/icons";
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
 * Save / Share / WhatsApp / Copy link (and Compare for medicines), plus the "recently viewed" record for
 * this page. Everything is stored in this browser only. Share (components/common/share-button.tsx) uses the
 * Web Share API when the device has it and otherwise copies the link. Hidden when printing.
 */
export function EntityToolbar({ type, slug, name, subtitle, path, compare = false }: EntityToolbarProps) {
  const savedRaw = useSyncExternalStore(subscribeStore, () => readRaw(STORE_KEYS.saved), () => "");
  const saved = isSaved(savedRaw, type, slug);
  const compareList = useCompareList();
  const inCompare = compareList.includes(slug);
  const [message, setMessage] = useState("");
  const t = useT();
  const lang = useLocale();

  // Record this page as recently viewed (a browser-local write; no state is set here).
  useEffect(() => {
    addView({ type, slug, name, subtitle });
    track({ name: "view_entity", entity: type, slug });
  }, [type, slug, name, subtitle]);

  const url = () => `${window.location.origin}${localizePath(path, lang)}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(url());
      setMessage(t("retention.toolbar.linkCopied"));
      track({ name: "share", method: "copy" });
    } catch {
      setMessage(t("retention.toolbar.copyFailed"));
    }
  }

  return (
    <div className="space-y-2" data-print="hide">
      <div role="group" aria-label={t("retention.toolbar.group", { name })} className="flex flex-wrap gap-2">
        <button
          type="button"
          aria-pressed={saved}
          onClick={() => {
            const now = toggleSaved({ type, slug, name, subtitle });
            track({ name: "save_toggle", entity: type, saved: now });
            setMessage(now ? t("retention.toolbar.savedMsg") : t("retention.toolbar.removedMsg"));
          }}
          className={button}
        >
          <HeartIcon filled={saved} className="size-5" />
          {saved ? t("retention.toolbar.saved") : t("retention.toolbar.save")}
          <span className="sr-only"> {name}</span>
        </button>
        <ShareButton title={name} path={path} onStatus={setMessage} className={button} />
        <button type="button" onClick={copy} className={button}>
          <LinkIcon className="size-5" />
          {t("retention.toolbar.copy")}
        </button>
        {compare && (
          <button
            type="button"
            aria-pressed={inCompare}
            onClick={() => setMessage(toggleCompare(slug).includes(slug) ? t("retention.compare.added") : t("retention.compare.removed"))}
            className={button}
          >
            <CompareIcon className="size-5" />
            {inCompare ? t("retention.compare.inList") : t("retention.compare.button")}
          </button>
        )}
      </div>
      {compare && compareList.length > 0 && (
        <p className="text-sm text-slate-700">
          <Link href={routes.compare(compareList)} className="font-medium text-brand-800 underline">
            {t(compareList.length === 1 ? "retention.compare.count.one" : "retention.compare.count.other", { n: compareList.length })}
          </Link>
        </p>
      )}
      <p role="status" className="min-h-5 text-sm text-slate-600">
        {message}
      </p>
    </div>
  );
}
