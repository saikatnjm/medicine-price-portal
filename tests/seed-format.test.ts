import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { seedDataset } from "@/data/local/dataset";
import type { Facility } from "@/domain/healthcare";
import type { Medicine, Pharmacy } from "@/domain/types";
import {
  compactDirectory,
  compactMedicines,
  expandDirectory,
  expandMedicines,
  expandSeed,
  formatCompactSeed,
} from "../src/data/local/seed-format.mjs";

/**
 * Records copied verbatim from the seed files before they were compacted (D40):
 * first/last/middle records, records without a DAR number, with registeredName,
 * excluded / needs-review listings, ways and relations.
 */
const sample = JSON.parse(readFileSync("tests/fixtures/seed-sample.json", "utf8")) as {
  medicines: Medicine[];
  facilities: Facility[];
  pharmacies: Pharmacy[];
};
const OSM = "https://www.openstreetmap.org/";

describe("compact seed format", () => {
  it("expands the shipped files into exactly the pre-compaction objects", () => {
    const byId = <T extends { id: string }>(list: T[]) => new Map(list.map((r) => [r.id, r]));
    const shipped = {
      medicines: byId(seedDataset.medicines),
      facilities: byId(seedDataset.facilities),
      pharmacies: byId(seedDataset.pharmacies),
    };
    for (const kind of ["medicines", "facilities", "pharmacies"] as const) {
      expect(sample[kind].length).toBeGreaterThan(5);
      for (const expected of sample[kind]) {
        const actual = shipped[kind].get(expected.id);
        expect(actual).toStrictEqual(expected);
        // Same key order too, so serialised output is unchanged.
        expect(JSON.stringify(actual)).toBe(JSON.stringify(expected));
      }
    }
  });

  it("round-trips medicines, including withheld and non-prefix DAR numbers", () => {
    const odd: Medicine = { ...sample.medicines[0]!, id: "dgda-x--y", provenance: { ...sample.medicines[0]!.provenance, recordId: "x--y", darNumber: "123-4567-001" } };
    const input = [...sample.medicines, odd];
    const text = formatCompactSeed(compactMedicines(input, { idPrefix: "dgda-" }));
    const expanded = expandMedicines(JSON.parse(text));
    expect(JSON.stringify(expanded)).toBe(JSON.stringify(input));
  });

  it("round-trips facilities and pharmacies, including Google place ids", () => {
    const withGoogle: Pharmacy = { ...sample.pharmacies[0]!, google: { placeId: "abc", lastChecked: "2026-10-05T00:00:00Z" } };
    for (const [items, idPrefix] of [
      [sample.facilities, "fac_"],
      [[...sample.pharmacies, withGoogle].slice(1), "pha_"],
    ] as const) {
      const text = formatCompactSeed(compactDirectory([...items], { idPrefix, recordUrlPrefix: OSM }));
      expect(JSON.stringify(expandDirectory(JSON.parse(text)))).toBe(JSON.stringify(items));
    }
  });

  it("handles empty lists and passes plain arrays through", () => {
    expect(expandSeed(JSON.parse(formatCompactSeed(compactMedicines([], { idPrefix: "dgda-" }))))).toEqual([]);
    expect(expandSeed(JSON.parse(formatCompactSeed(compactDirectory([], { idPrefix: "fac_", recordUrlPrefix: OSM }))))).toEqual([]);
    expect(expandSeed([{ id: "a" }])).toEqual([{ id: "a" }]);
    expect(() => expandSeed({ format: "unknown/v9", records: [] })).toThrow(/Unknown seed format/);
  });
});
