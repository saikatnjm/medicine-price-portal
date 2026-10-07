import Link from "@/i18n/link";
import { getT } from "@/i18n/server";
import type { RelatedSearch } from "@/lib/related-searches";

/** "Check another" loop: a few clear next actions at the end of a page. */
export function NextSteps({ links, label }: { links: readonly RelatedSearch[]; label?: string }) {
  if (links.length === 0) return null;
  const t = getT();
  const heading = label ?? t("common.nextSteps.label");
  return (
    <nav aria-label={heading} className="pt-4">
      <p className="mb-3 text-sm font-semibold text-slate-700">{heading}</p>
      <ul className="flex flex-wrap gap-2">
        {links.map(({ label: text, href }) => (
          <li key={href}>
            <Link
              href={href}
              className="inline-flex min-h-11 items-center rounded-full bg-pine px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
            >
              {text}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
