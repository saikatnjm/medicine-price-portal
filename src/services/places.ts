import type { Location, PostalLocation } from "../domain/healthcare";
import type { Place } from "../domain/read-models";
import type { ID } from "../domain/types";
import { formatPlace } from "../lib/format";
import { aliasTargetsForPrefix, canonicalPlaceName } from "../lib/aliases";
import { normalizeSearchText } from "../lib/text";
import type { Repositories } from "../repositories";

/** Default page size for directory lists (hospitals, pharmacies, doctors). */
export const DIRECTORY_PAGE_SIZE = 24;

/** Coerces a raw page number from the URL. */
export function toPage(rawPage: number | undefined): number {
  return rawPage !== undefined && Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;
}

export function totalPages(total: number, pageSize: number): number {
  return Math.ceil(total / pageSize);
}

const LEVEL_ORDER = { area: 0, district: 1, division: 2 } as const;

/**
 * Locations are small reference data (divisions, districts, areas), so they are
 * loaded once per request and resolved in memory.
 */
export class PlaceResolver {
  private readonly byId: ReadonlyMap<ID, Location>;
  private readonly children = new Map<ID, Location[]>();

  private constructor(readonly all: readonly Location[]) {
    this.byId = new Map(all.map((l) => [l.id, l]));
    for (const l of all) {
      if (!l.parentId) continue;
      const list = this.children.get(l.parentId) ?? [];
      list.push(l);
      this.children.set(l.parentId, list);
    }
  }

  static async create(repos: Pick<Repositories, "locations">): Promise<PlaceResolver> {
    return new PlaceResolver(await repos.locations.listAll());
  }

  get(id: ID | undefined): Location | null {
    return id ? (this.byId.get(id) ?? null) : null;
  }

  resolve(record: PostalLocation): Place {
    const area = this.get(record.areaId);
    const district = this.get(record.districtId ?? area?.parentId);
    const division = this.get(district?.parentId);
    return { area, district, division, label: formatPlace(record.locality, area?.name, district?.name) };
  }

  /** Outermost first: [division, district] for an area. */
  ancestorsOf(location: Location): Location[] {
    const chain: Location[] = [];
    let parent = this.get(location.parentId);
    while (parent) {
      chain.unshift(parent);
      parent = this.get(parent.parentId);
    }
    return chain;
  }

  childrenOf(id: ID): Location[] {
    return this.children.get(id) ?? [];
  }

  divisions(): Location[] {
    return this.all.filter((l) => l.level === "division");
  }

  /**
   * Location ids a filter on `location` should match: records store their area
   * and district, so a division expands to its districts.
   */
  matchIdsOf(location: Location): ID[] {
    return location.level === "division" ? this.childrenOf(location.id).map((d) => d.id) : [location.id];
  }

  /** Records' place ids that fall inside `location` (for counting). */
  contains(location: Location, record: PostalLocation): boolean {
    const ids = this.matchIdsOf(location);
    return [record.areaId, record.districtId].some((id) => id !== undefined && ids.includes(id));
  }

  /** Locations whose name (or a word of it) starts with the query; areas and districts before divisions. */
  search(query: string): Location[] {
    const typed = normalizeSearchText(query);
    if (!typed) return [];
    const q = canonicalPlaceName(typed);
    const aliased = aliasTargetsForPrefix(typed);
    return this.all
      .filter((l) => {
        const name = normalizeSearchText(`${l.name} ${l.nameBn ?? ""}`);
        return (
          name.startsWith(q) ||
          name.split(" ").some((w) => w.startsWith(q)) ||
          aliased.some((alias) => name.startsWith(alias))
        );
      })
      .sort(
        (a, b) =>
          Number(normalizeSearchText(b.name) === q) - Number(normalizeSearchText(a.name) === q) ||
          LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level],
      );
  }

  /** Exact name match (used to recognise "in Dhanmondi" in queries); districts win over same-name areas/divisions. */
  findByName(name: string): Location | null {
    const q = canonicalPlaceName(normalizeSearchText(name));
    if (!q) return null;
    const matches = this.all.filter((l) => normalizeSearchText(l.name) === q || l.slug === q.replace(/ /g, "-"));
    const rank = { district: 0, area: 1, division: 2 } as const;
    return matches.sort((a, b) => rank[a.level] - rank[b.level])[0] ?? null;
  }
}
