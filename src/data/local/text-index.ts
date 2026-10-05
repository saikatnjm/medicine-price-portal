import { normalizeSearchText } from "../../lib/text";

/**
 * Small reusable prefix-match index for directory records (facilities,
 * pharmacies). Every query token must be a prefix of an indexed word; records
 * whose primary name starts with the query rank first. Replaceable by a search
 * engine later without changing callers.
 */
export interface TextIndexEntry<T> {
  item: T;
  order: number;
  primary: string;
  words: string[];
}

export function buildTextIndex<T>(
  items: readonly T[],
  primaryText: (item: T) => string,
  extraText: (item: T) => string,
): TextIndexEntry<T>[] {
  return items.map((item, order) => {
    const primary = normalizeSearchText(primaryText(item));
    const extra = normalizeSearchText(extraText(item));
    return {
      item,
      order,
      primary,
      words: [...new Set(`${primary} ${extra}`.split(" ").filter(Boolean))],
    };
  });
}

function rank(entry: TextIndexEntry<unknown>, query: string): number {
  if (entry.primary === query) return 0;
  if (entry.primary.startsWith(query)) return 1;
  if (entry.primary.split(" ").some((word) => word.startsWith(query))) return 2;
  return 3;
}

/** Returns matching items in rank order, then original order. Empty query returns all. */
export function searchTextIndex<T>(index: readonly TextIndexEntry<T>[], rawQuery: string | undefined): T[] {
  const query = normalizeSearchText(rawQuery ?? "");
  if (!query) return index.map((entry) => entry.item);
  const tokens = query.split(" ");
  const hits: { entry: TextIndexEntry<T>; score: number }[] = [];
  for (const entry of index) {
    if (tokens.every((token) => entry.words.some((word) => word.startsWith(token)))) {
      hits.push({ entry, score: rank(entry, query) });
    }
  }
  hits.sort((a, b) => a.score - b.score || a.entry.order - b.entry.order);
  return hits.map(({ entry }) => entry.item);
}

export function paginate<T>(items: readonly T[], page: number, pageSize: number) {
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total: items.length, page, pageSize };
}
