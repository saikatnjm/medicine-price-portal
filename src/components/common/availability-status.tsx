import type { AvailabilityStatus as Status } from "@/domain/types";
import { getT } from "@/i18n/server";
import type { MessageKey } from "@/i18n/messages";

const STYLE: Record<Status, { symbol: string; className: string }> = {
  in_stock: { symbol: "✓", className: "text-emerald-800" },
  limited: { symbol: "!", className: "text-amber-800" },
  out_of_stock: { symbol: "✕", className: "text-red-800" },
  unknown: { symbol: "?", className: "text-slate-600" },
};

const LABEL: Record<Status, MessageKey> = {
  in_stock: "common.availability.in_stock",
  limited: "common.availability.limited",
  out_of_stock: "common.availability.out_of_stock",
  unknown: "common.availability.unknown",
};

/** Availability as text plus a symbol, so status never relies on colour alone. */
export function AvailabilityStatus({ status }: { status: Status }) {
  const { symbol, className } = STYLE[status];
  const t = getT();
  return (
    <span className={`inline-flex items-center gap-1 text-sm ${className}`}>
      <span aria-hidden="true" className="font-semibold">
        {symbol}
      </span>
      {t(LABEL[status])}
    </span>
  );
}
