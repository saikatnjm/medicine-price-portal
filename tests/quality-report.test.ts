import { describe, expect, it } from "vitest";
import {
  buildQualityReport,
  coordinateProblem,
  findDuplicateChambers,
  findDuplicateSlugs,
  findProbableDuplicates,
  isStale,
  normalizeName,
} from "../scripts/data/lib/quality-report.mjs";

const prov = { sourceId: "osm", recordId: "node/1", status: "unverified", lastCheckedAt: "2026-10-01T00:00:00Z" };
const at = (lat: number, lon: number) => ({ lat, lon });

describe("quality report checks", () => {
  it("classifies coordinates", () => {
    expect(coordinateProblem(at(23.7, 90.4))).toBeNull();
    expect(coordinateProblem(undefined)).toBe("missing");
    expect(coordinateProblem({ lat: NaN, lon: 90 })).toBe("invalid");
    expect(coordinateProblem(at(10, 90))).toBe("outside_bangladesh");
  });

  it("finds duplicate slugs and probable duplicates within 100 m", () => {
    expect(findDuplicateSlugs([{ id: "a", slug: "x" }, { id: "b", slug: "x" }, { id: "c", slug: "y" }])).toEqual([
      { slug: "x", ids: ["a", "b"] },
    ]);
    expect(normalizeName("A. Ali  Pharmacy")).toBe(normalizeName("a ali pharmacy"));
    const records = [
      { id: "a", name: "Ali Pharmacy", coordinates: at(23.7, 90.4) },
      { id: "b", name: "ali pharmacy", coordinates: at(23.7003, 90.4) },
      { id: "c", name: "Ali Pharmacy", coordinates: at(23.71, 90.4) },
    ];
    expect(findProbableDuplicates(records)).toEqual([["a", "b"]]);
  });

  it("detects stale records and duplicate chambers", () => {
    const now = new Date("2026-10-07T00:00:00Z");
    expect(isStale("2025-01-01T00:00:00Z", now)).toBe(true);
    expect(isStale("2026-06-01T00:00:00Z", now)).toBe(false);
    expect(findDuplicateChambers([{ id: "d1", chambers: [{ facilityId: "f1" }, { facilityId: "f1" }, { facilityId: "f2" }] }])).toEqual([
      { doctorId: "d1", facility: "f1" },
    ]);
  });

  it("builds a capped report without touching its input", () => {
    const facilities = Array.from({ length: 5 }, (_, i) => ({
      id: `f${i}`,
      slug: "same",
      name: i === 0 ? "" : "Name",
      phone: "abc",
      reviewStatus: "needs_review",
      provenance: prov,
    }));
    const copy = JSON.stringify(facilities);
    const report = buildQualityReport({ facilities }, { now: new Date("2026-10-07T00:00:00Z"), cap: 2 });
    const f = report.datasets.facilities as Record<string, { count: number; examples: string[] }>;
    expect(f.missingName!.count).toBe(1);
    expect(f.malformedPhone!.count).toBe(5);
    expect(f.malformedPhone!.examples).toHaveLength(2);
    expect(f.missingCoordinates!.count).toBe(5);
    expect(f.needsReview!.count).toBe(5);
    expect(report.totals.error).toBeGreaterThan(0);
    expect(JSON.stringify(facilities)).toBe(copy);
  });
});
