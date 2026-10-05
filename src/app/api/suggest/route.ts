import { NextResponse, type NextRequest } from "next/server";
import { services } from "@/data";
import { cleanSearchQuery, SEARCH_MIN_QUERY_LENGTH } from "@/lib/search-config";

const CACHE_CONTROL = "public, s-maxage=300, stale-while-revalidate=600";

/**
 * GET /api/suggest?q=… — small grouped suggestions for the search box.
 * Always responds 200 with JSON `{ groups }` (empty for short or missing queries).
 * Values are plain strings; React escapes them when rendered.
 */
export async function GET(request: NextRequest) {
  const query = cleanSearchQuery(request.nextUrl.searchParams.get("q"));
  const headers = { "Cache-Control": CACHE_CONTROL };
  if (query.length < SEARCH_MIN_QUERY_LENGTH) {
    return NextResponse.json({ groups: [] }, { headers });
  }
  try {
    const groups = await services.search.suggest(query);
    return NextResponse.json({ groups }, { headers });
  } catch {
    // Suggestions are optional; never expose internal errors.
    return NextResponse.json({ groups: [] }, { headers: { "Cache-Control": "no-store" } });
  }
}
