import { cleanSearchQuery } from "@/lib/search-config";
import { firstParam, parsePageParam, type SearchParamValue } from "@/lib/search-params";

/** URL parameters of the hospital and pharmacy lists, normalised ("" when absent). */
export interface ListParams {
  q: string;
  kind: string;
  location: string;
  specialty: string;
  emergency: boolean;
  near: string;
  page: number;
}

export function readListParams(raw: Record<string, SearchParamValue>): ListParams {
  const text = (v: SearchParamValue) => (firstParam(v) ?? "").trim().slice(0, 80);
  return {
    q: cleanSearchQuery(firstParam(raw.q)),
    kind: text(raw.kind),
    location: text(raw.location),
    specialty: text(raw.specialty),
    emergency: firstParam(raw.emergency) === "1",
    near: text(raw.near),
    page: parsePageParam(raw.page),
  };
}
