import { firstParam, type SearchParamValue } from "./search-params";

export const MAX_COMPARE_ITEMS = 4;

/** Up to four distinct, well-formed slugs from "?m=a,b,c". */
export function readCompareSlugs(raw: SearchParamValue): string[] {
  const slugs = (firstParam(raw) ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter((s) => /^[A-Za-z0-9._~-]{1,120}$/.test(s));
  return [...new Set(slugs)].slice(0, MAX_COMPARE_ITEMS);
}
