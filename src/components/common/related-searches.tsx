import Link from "@/i18n/link";
import { getT } from "@/i18n/server";
import { CHIP_CLASS } from "@/components/ui/chip";
import type { RelatedSearch } from "@/lib/related-searches";

/** "People also search for": real links to existing pages. Renders nothing without links. */
export function RelatedSearches({ items, heading, id = "related-searches" }: { items: readonly RelatedSearch[]; heading?: string; id?: string }) {
  if (items.length === 0) return null;
  const t = getT();
  return (
    <section aria-labelledby={id}>
      <h2 id={id} className="text-xl font-semibold text-ink">
        {heading ?? t("common.related.heading")}
      </h2>
      <ul className="mt-3 flex flex-wrap gap-2">
        {items.map(({ label, href }) => (
          <li key={href}>
            <Link
              href={href}
              className={CHIP_CLASS}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
