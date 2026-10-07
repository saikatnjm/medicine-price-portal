import Link from "@/i18n/link";
import type { LocationListItem } from "@/domain/read-models";
import { CategoryTile } from "@/components/ui/category-tile";
import { getT } from "@/i18n/server";
import { routes } from "@/lib/routes";
import { locationCountsText } from "./location-tree";

export function SubLocations({ items }: { items: LocationListItem[] }) {
  const t = getT();
  return (
    <ul className="grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map(({ location, ...counts }) => (
        <li key={location.id} className="flex min-w-0 gap-3">
          <CategoryTile type="location" size="sm" />
          <div className="min-w-0">
            <Link href={routes.location(location.slug)} className="font-medium text-brand-800 hover:underline">
              {location.name}
            </Link>
            <span className="block text-sm text-slate-600">{locationCountsText(counts, t)}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
