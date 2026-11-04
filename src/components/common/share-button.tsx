"use client";

import { useState, useSyncExternalStore } from "react";
import { useLocale, useT } from "@/i18n/client";
import { localizePath } from "@/i18n/config";
import { ShareIcon } from "@/components/ui/icons";
import { track } from "@/lib/events";

interface ShareButtonProps {
  /** Title shared with the link (the entity name). */
  title: string;
  /** Public path of the page (no query string, unlocalised). */
  path: string;
  /** Receives status text instead of the built-in live region (e.g. a toolbar with its own status line). */
  onStatus?: (message: string) => void;
  className?: string;
}

const BUTTON =
  "inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-800 hover:bg-slate-50";

const noSubscribe = () => () => {};

/** WhatsApp share link (wa.me) with the title and URL as the message text. */
export function whatsappShareUrl(title: string, url: string): string {
  return `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`;
}

/**
 * Share via the Web Share API when the device has it, otherwise copy the link; plus a WhatsApp link,
 * the main share channel in Bangladesh. Analytics get the method only, never the URL or the visitor.
 */
export function ShareButton({ title, path, onStatus, className = BUTTON }: ShareButtonProps) {
  const t = useT();
  const lang = useLocale();
  const [status, setStatus] = useState("");
  // The origin is only known in the browser; the server renders a relative link.
  const origin = useSyncExternalStore(noSubscribe, () => window.location.origin, () => "");
  const url = `${origin}${localizePath(path, lang)}`;

  const report = (message: string) => (onStatus ? onStatus(message) : setStatus(message));

  async function share() {
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, url });
        track({ name: "share", method: "native" });
      } catch {
        // Closing the share sheet is not an error.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      report(t("ui.share.linkCopied"));
      track({ name: "share", method: "copy" });
    } catch {
      report(t("ui.share.copyFailed"));
    }
  }

  return (
    <>
      <button type="button" onClick={share} className={className}>
        <ShareIcon className="size-5" />
        {t("ui.share.button")}
        <span className="sr-only"> {title}</span>
      </button>
      <a
        href={whatsappShareUrl(title, url)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("ui.share.whatsappLabel", { name: title })}
        onClick={() => track({ name: "share", method: "whatsapp" })}
        className={className}
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 shrink-0" fill="currentColor">
          <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.6-.3Z" />
        </svg>
        {t("ui.share.whatsapp")}
      </a>
      {!onStatus && (
        <span role="status" aria-live="polite" className="text-sm text-slate-600">
          {status}
        </span>
      )}
    </>
  );
}
