import Link from "next/link";
import type { RelatedSearch } from "@/lib/related-searches";

/** "Check another" loop: a few clear next actions at the end of a page. */
export function NextSteps({ links, label = "What next?" }: { links: readonly RelatedSearch[]; label?: string }) {
  if (links.length === 0) return null;
  return (
    <nav aria-label={label} className="border-t border-slate-200 pt-6">
      <p className="mb-3 text-sm font-semibold text-slate-700">{label}</p>
      <ul className="flex flex-wrap gap-2">
        {links.map(({ label: text, href }) => (
          <li key={href}>
            <Link
              href={href}
              className="inline-flex min-h-11 items-center rounded-xl bg-brand-700 px-5 text-sm font-semibold text-white hover:bg-brand-800"
            >
              {text}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
