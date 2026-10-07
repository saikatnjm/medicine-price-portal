// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";
import { canonicalPlaceName, aliasTargetsForPrefix } from "@/lib/aliases";
import { readCompareSlugs } from "@/lib/compare";
import {
  addSearch,
  addView,
  clearSearches,
  isSaved,
  parseEntities,
  parseSearches,
  readRaw,
  STORE_KEYS,
  toggleSaved,
} from "@/lib/local-store";
import { getIndexability, seoQualityScore } from "@/lib/seo-core";

describe("aliases", () => {
  it("maps alternative spellings to canonical names", () => {
    expect(canonicalPlaceName("dacca")).toBe("dhaka");
    expect(canonicalPlaceName("chittagong")).toBe("chattogram");
    expect(canonicalPlaceName("jessore")).toBe("jashore");
    expect(canonicalPlaceName("sylhet")).toBe("sylhet");
  });
  it("suggests canonical names for alias prefixes", () => {
    expect(aliasTargetsForPrefix("chitt")).toContain("chattogram");
    expect(aliasTargetsForPrefix("ch")).toEqual([]);
  });
});

describe("getIndexability", () => {
  it("indexes valid pages", () => expect(getIndexability({ count: 5, minCount: 3 }).index).toBe(true));
  it("noindexes thin, filtered, invalid and review pages", () => {
    expect(getIndexability({ count: 1, minCount: 3 }).reason).toBe("below_threshold");
    expect(getIndexability({ filtered: true }).reason).toBe("filtered");
    expect(getIndexability({ valid: false }).reason).toBe("invalid");
    expect(getIndexability({ needsReview: true }).reason).toBe("needs_review");
    expect(getIndexability({ hasUniqueValue: false }).reason).toBe("no_unique_value");
  });
});

describe("seoQualityScore", () => {
  it("scores empty signals as zero and lists missing", () => {
    const r = seoQualityScore({});
    expect(r.score).toBe(0);
    expect(r.missing.length).toBeGreaterThan(0);
  });
});

describe("readCompareSlugs", () => {
  it("keeps valid distinct slugs, max 4", () => {
    expect(readCompareSlugs("a,b,a,c,d,e")).toEqual(["a", "b", "c", "d"]);
  });
  it("drops malformed slugs and handles missing input", () => {
    expect(readCompareSlugs("a b,<x>,ok")).toEqual(["ok"]);
    expect(readCompareSlugs(undefined)).toEqual([]);
  });
});

describe("local-store", () => {
  beforeEach(() => window.localStorage.clear());

  it("records searches newest-first without duplicates and clears", () => {
    addSearch("napa");
    addSearch("Cardiologist in Dhaka");
    addSearch("NAPA");
    expect(parseSearches(readRaw(STORE_KEYS.searches))).toEqual(["NAPA", "Cardiologist in Dhaka"]);
    clearSearches();
    expect(parseSearches(readRaw(STORE_KEYS.searches))).toEqual([]);
  });
  it("ignores too-short queries", () => {
    addSearch("a");
    expect(parseSearches(readRaw(STORE_KEYS.searches))).toEqual([]);
  });
  it("toggles saved items", () => {
    const e = { type: "hospital", slug: "central-heart", name: "Central Heart" } as const;
    expect(toggleSaved(e)).toBe(true);
    expect(isSaved(readRaw(STORE_KEYS.saved), "hospital", "central-heart")).toBe(true);
    expect(toggleSaved(e)).toBe(false);
  });
  it("tolerates corrupted storage", () => {
    window.localStorage.setItem(STORE_KEYS.views, "{not json");
    expect(parseEntities(readRaw(STORE_KEYS.views), 10)).toEqual([]);
    addView({ type: "medicine", slug: "napa-500", name: "Napa" });
    expect(parseEntities(readRaw(STORE_KEYS.views), 10)).toHaveLength(1);
  });
});
