import { describe, expect, it } from "vitest";
import { firstParam, parsePageParam, searchHref } from "@/lib/search-params";

describe("search params", () => {
  it("reads the first value of repeated params", () => {
    expect(firstParam(["a", "b"])).toBe("a");
    expect(firstParam(undefined)).toBeUndefined();
  });

  it("parses page numbers defensively", () => {
    expect(parsePageParam("2")).toBe(2);
    expect(parsePageParam("0")).toBe(1);
    expect(parsePageParam("-1")).toBe(1);
    expect(parsePageParam("abc")).toBe(1);
    expect(parsePageParam(undefined)).toBe(1);
  });

  it("builds encoded search URLs", () => {
    expect(searchHref("napa extra")).toBe("/search?q=napa+extra");
    expect(searchHref("napa", 2)).toBe("/search?q=napa&page=2");
  });
});
