import type { SearchResult } from "../domain/read-models";
import type { Repositories } from "../repositories";
import { toMedicineListItems } from "./summaries";

import { cleanSearchQuery, SEARCH_MIN_QUERY_LENGTH, SEARCH_PAGE_SIZE } from "../lib/search-config";

export class SearchService {
  constructor(private readonly repos: Repositories) {}

  /** Accepts raw user input (e.g. from the URL); never throws on bad input. */
  async searchMedicines(
    rawQuery: string | null | undefined,
    rawPage: number = 1,
  ): Promise<SearchResult> {
    const query = cleanSearchQuery(rawQuery);
    const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;
    const empty = { items: [], total: 0, totalPages: 0, page, pageSize: SEARCH_PAGE_SIZE, query };

    if (query.length === 0) return { ...empty, status: "empty_query" };
    if (query.length < SEARCH_MIN_QUERY_LENGTH) return { ...empty, status: "query_too_short" };

    const result = await this.repos.medicines.search({ query, page, pageSize: SEARCH_PAGE_SIZE });
    const items = await toMedicineListItems(result.items, this.repos);
    return {
      ...result,
      items,
      query,
      status: "ok",
      totalPages: Math.ceil(result.total / result.pageSize),
    };
  }
}
