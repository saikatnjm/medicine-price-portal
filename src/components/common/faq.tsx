import type { ReactNode } from "react";

export interface FaqItem {
  question: string;
  answer: ReactNode;
}

/**
 * Small factual FAQ (native <details>, works without JavaScript). Only pass questions the page can
 * answer from its own data. Intentionally no FAQPage structured data.
 */
export function Faq({ items, id = "faq" }: { items: readonly FaqItem[]; id?: string }) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby={id} className="space-y-3">
      <h2 id={id} className="text-xl font-semibold text-slate-900">
        Frequently asked questions
      </h2>
      <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
        {items.map(({ question, answer }) => (
          <details key={question} className="group px-4 py-1">
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 py-2 font-medium text-slate-900 marker:hidden">
              <span>{question}</span>
              <span aria-hidden="true" className="text-slate-500 transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <div className="pb-3 text-sm text-slate-700">{answer}</div>
          </details>
        ))}
      </div>
    </section>
  );
}
