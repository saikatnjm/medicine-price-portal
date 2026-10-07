import type { ReactNode } from "react";

export interface Fact {
  key: string;
  icon: ReactNode;
  label: string;
  value: string;
  /** Optional in-page anchor, e.g. "#departments". */
  href?: string;
}

/** Row of short "icon, label, value" chips. Renders nothing when there are no facts. */
export function FactChips({ facts, label }: { facts: readonly Fact[]; label: string }) {
  if (facts.length === 0) return null;
  const chip = "inline-flex min-h-11 items-center gap-2 rounded-full bg-slate-100 px-4 py-1.5 text-sm text-slate-800";
  return (
    <ul aria-label={label} className="flex flex-wrap gap-2">
      {facts.map(({ key, icon, label: name, value, href }) => {
        const body = (
          <>
            <span className="text-brand-700">{icon}</span>
            <span className="text-slate-600">{name}</span>
            <span className="font-semibold text-slate-900">{value}</span>
          </>
        );
        return (
          <li key={key}>
            {href ? (
              <a href={href} className={`${chip} hover:bg-slate-200`}>
                {body}
              </a>
            ) : (
              <span className={chip}>{body}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
