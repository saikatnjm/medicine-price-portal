import Link from "next/link";
import type { LocationListItem } from "@/domain/read-models";
import { routes } from "@/lib/routes";
import { locationCountsText } from "./location-tree";

export function SubLocations({ items }: { items: LocationListItem[] }) {
  return (
    <ul className="grid gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
      {items.map(({ location, ...counts }) => (
        <li key={location.id}>
          <Link href={routes.location(location.slug)} className="font-medium text-brand-800 underline">
            {location.name}
          </Link>
          <span className="block text-sm text-slate-600">{locationCountsText(counts)}</span>
        </li>
      ))}
    </ul>
  );
}
