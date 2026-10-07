import Link from "next/link";
import type { RelatedSearch } from "@/lib/related-searches";

/** "People also search for": real links to existing pages. Renders nothing without links. */
export function RelatedSearches({ items, heading = "People also search for", id = "related-searches" }: { items: readonly RelatedSearch[]; heading?: string; id?: string }) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby={id}>
      <h2 id={id} className="text-xl font-semibold text-slate-900">
        {heading}
      </h2>
      <ul className="mt-3 flex flex-wrap gap-2">
        {items.map(({ label, href }) => (
          <li key={href}>
            <Link
              href={href}
              className="inline-flex min-h-11 items-center rounded-full border border-slate-300 bg-white px-4 text-sm font-medium text-slate-800 shadow-sm hover:border-brand-600 hover:text-brand-800"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
