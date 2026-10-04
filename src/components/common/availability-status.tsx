import type { AvailabilityStatus as Status } from "@/domain/types";
import { formatAvailability } from "@/lib/format";

const STYLE: Record<Status, { symbol: string; className: string }> = {
  in_stock: { symbol: "✓", className: "text-emerald-800" },
  limited: { symbol: "!", className: "text-amber-800" },
  out_of_stock: { symbol: "✕", className: "text-red-800" },
  unknown: { symbol: "?", className: "text-slate-600" },
};

/** Availability as text plus a symbol, so status never relies on colour alone. */
export function AvailabilityStatus({ status }: { status: Status }) {
  const { symbol, className } = STYLE[status];
  return (
    <span className={`inline-flex items-center gap-1 text-sm ${className}`}>
      <span aria-hidden="true" className="font-semibold">
        {symbol}
      </span>
      {formatAvailability(status)}
    </span>
  );
}
