import Link from "next/link";
import { FACILITY_KIND_LABEL, type FacilityKind } from "@/domain/healthcare";
import type { FacilityKindCount } from "@/domain/read-models";
import { buildHref } from "@/components/directory/pagination";
import { SirenIcon } from "@/components/ui/icons";

interface FilterChipsProps {
  /** Clean list path (no query string). */
  path: string;
  /** Parameters to keep on every chip link (query, location, specialty, near ...). */
  keep: Record<string, string | undefined>;
  kinds: readonly FacilityKindCount[];
  selectedKind: FacilityKind | null;
  emergency?: { show: boolean; checked: boolean };
}

const base = "inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full border px-4 text-sm font-medium";
const off = `${base} border-slate-300 bg-white text-slate-800 hover:border-brand-600`;
const on = `${base} border-brand-700 bg-brand-700 text-white`;

/** Quick toggles (type, emergency) as links: no JavaScript needed, and each state has its own URL. */
export function FilterChips({ path, keep, kinds, selectedKind, emergency }: FilterChipsProps) {
  if (kinds.length === 0 && !emergency?.show) return null;
  const emergencyParam = emergency?.checked ? "1" : undefined;
  return (
    <nav aria-label="Quick filters">
      <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
        {kinds.map(({ kind, count }) => {
          const active = selectedKind === kind;
          return (
            <li key={kind} className="shrink-0">
              <Link
                href={buildHref(path, { ...keep, kind: active ? undefined : kind, emergency: emergencyParam })}
                aria-current={active ? "true" : undefined}
                className={active ? on : off}
              >
                {FACILITY_KIND_LABEL[kind]}
                <span className={active ? "text-white/80" : "text-slate-500"}>{count.toLocaleString("en-US")}</span>
              </Link>
            </li>
          );
        })}
        {emergency?.show && (
          <li className="shrink-0">
            <Link
              href={buildHref(path, { ...keep, kind: selectedKind ?? undefined, emergency: emergency.checked ? undefined : "1" })}
              aria-current={emergency.checked ? "true" : undefined}
              className={emergency.checked ? on : off}
            >
              <SirenIcon className="size-4" />
              Emergency
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
