import type { ReactNode } from "react";

/** Header card for entity pages: name, type, place and the primary actions in one block. */
export function HeroCard({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-5 rounded-2xl border border-slate-200 bg-gradient-to-b from-brand-50 to-white p-5 shadow-sm sm:p-6">
      {children}
    </div>
  );
}
