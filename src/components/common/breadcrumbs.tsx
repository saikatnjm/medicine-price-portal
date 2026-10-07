import Link from "@/i18n/link";
import { getT } from "@/i18n/server";
import type { BreadcrumbItem } from "@/lib/seo";

export function Breadcrumbs({ items }: { items: readonly BreadcrumbItem[] }) {
  const t = getT();
  return (
    <nav aria-label={t("common.breadcrumb")} className="text-sm text-slate-600">
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
        {items.map((item, index) => (
          <li key={`${item.name}-${index}`} className="flex items-center gap-1.5">
            {index > 0 && <span aria-hidden="true">/</span>}
            {item.href ? (
              <Link href={item.href} className="underline-offset-2 hover:underline">
                {item.name}
              </Link>
            ) : (
              <span aria-current="page" className="text-slate-900">
                {item.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
