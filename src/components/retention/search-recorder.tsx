"use client";

import { useEffect } from "react";
import { track } from "@/lib/events";
import { addSearch } from "@/lib/local-store";

/** Remembers the query in this browser (for "Recent searches") and reports result counts to analytics. */
export function SearchRecorder({ query, results }: { query: string; results: number }) {
  useEffect(() => {
    if (!query) return;
    if (results > 0) addSearch(query);
    track({ name: "search", query, results });
    if (results === 0) track({ name: "search_no_results", query });
  }, [query, results]);
  return null;
}
