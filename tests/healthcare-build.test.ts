import { describe, expect, it } from "vitest";
import { validateDataset, type DatasetFiles } from "../scripts/data/validate-data.mjs";

/**
 * build-healthcare.mjs and lib/osm.mjs ship without .d.mts declarations, so they
 * are loaded through a computed specifier (typed as any) and given local types.
 */
type Point = { lat: number; lon: number };
type Way = Array<[number, number]>;
interface Rec extends Record<string, unknown> {
  id: string;
  slug: string;
  name: string;
  districtId?: string;
  areaId?: string;
  altName?: string;
  coordinates?: Point;
  level?: string;
  parentId?: string;
}
interface BuildResult {
  facilities: Rec[];
  pharmacies: Rec[];
  locations: Rec[];
  specialties: Rec[];
  sources: Rec[];
  rejected: Array<{ recordId: string; reason: string }>;
  duplicates: Array<{ recordId: string; keptId: string }>;
  report: Record<string, number | Record<string, number>>;
}
interface RawFeature {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  districtId?: number | null;
  tags: Record<string, string>;
}
interface BuildModule {
  buildDirectory(raw: unknown, areasRaw?: unknown): BuildResult;
}
interface OsmModule {
  pointInWays(point: Point, ways: Way[]): boolean;
  areaNameOf(name: string): string;
  boundsOf(ways: Way[]): { minLat: number; minLon: number; maxLat: number; maxLon: number };
}

const scriptsDir = new URL("../scripts/data/", import.meta.url).href;
const { buildDirectory } = (await import(`${scriptsDir}build-healthcare.mjs`)) as BuildModule;
const { pointInWays, areaNameOf, boundsOf } = (await import(`${scriptsDir}lib/osm.mjs`)) as OsmModule;

const meta = { retrievedAt: "2026-10-04T00:00:00Z", osmTimestamp: null, source: { api: "https://example.org/api" } };
const divisions = [{ id: 1, name: "Dhaka Division", nameBn: "ঢাকা বিভাগ" }];
const districts = [
  { id: 2, name: "Dhaka District", nameBn: "ঢাকা জেলা", divisionId: 1 },
  { id: 4, name: "Gazipur District", divisionId: 1 },
];
const raw = (features: RawFeature[]) => ({ meta, divisions, districts, features });
const node = (id: number, lat: number, lon: number, tags: Record<string, string>, districtId: number | null = 2): RawFeature => ({
  type: "node",
  id,
  lat,
  lon,
  districtId,
  tags,
});
const square = (lat0: number, lon0: number, lat1: number, lon1: number): Way => [
  [lat0, lon0],
  [lat0, lon1],
  [lat1, lon1],
  [lat1, lon0],
  [lat0, lon0],
];
const areas = {
  areas: [
    { id: 3, name: "Dhanmondi Thana", nameBn: "ধানমন্ডি থানা", districtId: 2, ways: [square(0, 0, 1, 1)] },
    { id: 5, name: "Savar Upazila", districtId: 4, ways: [square(2, 2, 3, 3)] },
  ],
};

describe("pointInWays", () => {
  const sq = square(0, 0, 1, 1);

  it("detects points inside and outside a simple ring", () => {
    expect(pointInWays({ lat: 0.5, lon: 0.5 }, [sq])).toBe(true);
    expect(pointInWays({ lat: 1.5, lon: 0.5 }, [sq])).toBe(false);
    expect(pointInWays({ lat: 0.5, lon: -0.1 }, [sq])).toBe(false);
  });

  it("works when the ring is split across two ways", () => {
    const west: Way = [[0, 0], [1, 0], [1, 1]];
    const east: Way = [[1, 1], [0, 1], [0, 0]];
    expect(pointInWays({ lat: 0.5, lon: 0.5 }, [west, east])).toBe(true);
    expect(pointInWays({ lat: 0.5, lon: 1.5 }, [west, east])).toBe(false);
    // Way order does not matter.
    expect(pointInWays({ lat: 0.5, lon: 0.5 }, [east, west])).toBe(true);
  });

  it("excludes holes drawn as inner ways", () => {
    const hole = square(0.4, 0.4, 0.6, 0.6);
    expect(pointInWays({ lat: 0.5, lon: 0.5 }, [sq, hole])).toBe(false);
    expect(pointInWays({ lat: 0.2, lon: 0.2 }, [sq, hole])).toBe(true);
  });

  it("is false for no ways", () => {
    expect(pointInWays({ lat: 0, lon: 0 }, [])).toBe(false);
  });
});

describe("areaNameOf / boundsOf", () => {
  it("strips English and Bangla suffixes", () => {
    expect(areaNameOf("Dhanmondi Thana")).toBe("Dhanmondi");
    expect(areaNameOf("Savar Upazila")).toBe("Savar");
    expect(areaNameOf("Dhaka Metropolitan Thana")).toBe("Dhaka");
    expect(areaNameOf("ধানমন্ডি থানা")).toBe("ধানমন্ডি");
    expect(areaNameOf("সাভার উপজেলা")).toBe("সাভার");
    expect(areaNameOf("Thana Road")).toBe("Thana Road");
    expect(areaNameOf("  ")).toBe("");
  });

  it("computes bounds", () => {
    expect(boundsOf([square(0, 1, 2, 3)])).toEqual({ minLat: 0, minLon: 1, maxLat: 2, maxLon: 3 });
  });
});

describe("buildDirectory: locations", () => {
  const result = buildDirectory(raw([]), areas);

  it("builds divisions, districts and areas with suffix-free names and parents", () => {
    expect(result.locations.map((l) => [l.id, l.slug, l.name, l.level, l.parentId])).toEqual([
      ["loc_area_3", "dhanmondi", "Dhanmondi", "area", "loc_dis_2"],
      ["loc_area_5", "savar", "Savar", "area", "loc_dis_4"],
      ["loc_dis_2", "dhaka", "Dhaka", "district", "loc_div_1"],
      ["loc_dis_4", "gazipur", "Gazipur", "district", "loc_div_1"],
      ["loc_div_1", "dhaka-division", "Dhaka", "division", undefined],
    ]);
    expect(result.locations.find((l) => l.id === "loc_area_3")?.nameBn).toBe("ধানমন্ডি");
    expect(result.locations.find((l) => l.id === "loc_dis_2")?.nameBn).toBe("ঢাকা");
  });

  it("builds area slugs as {name}-{district} when names collide", () => {
    const dup = buildDirectory(raw([]), {
      areas: [
        { id: 10, name: "Kotwali Thana", districtId: 2, ways: [square(0, 0, 1, 1)] },
        { id: 11, name: "Kotwali Thana", districtId: 4, ways: [square(2, 2, 3, 3)] },
      ],
    });
    expect(dup.locations.filter((l) => l.level === "area").map((l) => l.slug)).toEqual(["kotwali-dhaka", "kotwali-gazipur"]);
  });

  it("disambiguates an area named like its district or division", () => {
    const same = buildDirectory(raw([]), {
      areas: [{ id: 12, name: "Dhaka Thana", districtId: 2, ways: [square(0, 0, 1, 1)] }],
    });
    const slugs = same.locations.map((l) => l.slug);
    expect(slugs.filter((s) => s === "dhaka")).toHaveLength(1);
    expect(slugs).toContain("dhaka-dhaka");
  });

  it("drops areas without ways or an unknown district", () => {
    const filtered = buildDirectory(raw([]), {
      areas: [
        { id: 20, name: "Empty Thana", districtId: 2, ways: [] },
        { id: 21, name: "Orphan Thana", districtId: 99, ways: [square(0, 0, 1, 1)] },
        { id: 22, name: "No District Thana", ways: [square(0, 0, 1, 1)] },
      ],
    });
    expect(filtered.locations.filter((l) => l.level === "area")).toEqual([]);
  });
});

describe("buildDirectory: records", () => {
  const features: RawFeature[] = [
    node(10, 0.5, 0.5, { amenity: "hospital", name: "Alpha Hospital", "addr:postcode": "1205", phone: "+880 2 1234567" }),
    // Near duplicate (about 55 m away), fewer tags.
    node(11, 0.5, 0.5005, { amenity: "hospital", name: "Alpha Hospital" }),
    // Same name 100 km away: a different place.
    node(12, 2.5, 2.5, { amenity: "hospital", name: "Alpha Hospital" }, 4),
    node(13, 5, 5, { amenity: "pharmacy", name: "Beta Pharmacy" }),
    // Outside every area; district comes from the query grouping.
    node(14, 0.2, 7, { amenity: "pharmacy", name: "Gamma Pharma" }),
    // Rejected.
    node(15, 0.1, 0.1, { amenity: "pharmacy", name: "Pharmacy" }),
    node(16, 0.1, 0.1, { amenity: "hospital", name: "হাসপাতাল" }),
    node(17, 0.1, 0.1, { amenity: "clinic", name: "Happy Pets Veterinary Clinic" }),
    node(18, 0.1, 0.1, { amenity: "clinic" }),
    node(19, 0.1, 0.1, { amenity: "bench", name: "Bench" }),
    node(20, 0.1, 0.1, { amenity: "clinic", name: "Old Clinic", disused: "yes" }),
    // Bangla-only name.
    node(21, 0.3, 0.3, { amenity: "clinic", name: "সেবা ক্লিনিক" }),
    // Slug collision: same slug "city-clinic-dhaka" for two clinics far apart.
    node(30, 0.6, 0.6, { amenity: "clinic", name: "City Clinic" }),
    node(31, 0.7, 0.2, { amenity: "dentist", name: "City Clinic" }),
    node(32, 0.8, 0.8, { amenity: "clinic", name: "City Clinic" }),
  ];
  const result = buildDirectory(raw(features), areas);
  const facility = (recordId: string) => result.facilities.find((f) => (f.provenance as { recordId: string }).recordId === recordId);
  const pharmacy = (recordId: string) => result.pharmacies.find((f) => (f.provenance as { recordId: string }).recordId === recordId);

  it("assigns the containing area and its district by point-in-polygon", () => {
    expect(facility("node/10")?.areaId).toBe("loc_area_3");
    expect(facility("node/10")?.districtId).toBe("loc_dis_2");
  });

  it("keeps the feature's own district and assigns an area by point-in-polygon", () => {
    expect(facility("node/12")?.districtId).toBe("loc_dis_4");
    expect(facility("node/12")?.areaId).toBe("loc_area_5");
  });

  it("moves an area to the district most of its features belong to", () => {
    // Area 3 was fetched under district 2; if its only features are in district 4, it belongs to 4.
    const moved = buildDirectory(raw([node(40, 0.5, 0.5, { amenity: "hospital", name: "Border Hospital" }, 4)]), areas);
    expect(moved.facilities[0]?.districtId).toBe("loc_dis_4");
    expect(moved.facilities[0]?.areaId).toBe("loc_area_3");
    expect(moved.locations.find((l) => l.id === "loc_area_3")?.parentId).toBe("loc_dis_4");
  });

  it("keeps the query district and no area outside every area polygon", () => {
    expect(pharmacy("node/14")?.districtId).toBe("loc_dis_2");
    expect(pharmacy("node/14")?.areaId).toBeUndefined();
    expect(pharmacy("node/13")?.districtId).toBe("loc_dis_2");
    expect(pharmacy("node/13")?.areaId).toBeUndefined();
  });

  it("removes near duplicates, keeping the richer record, but not far-apart namesakes", () => {
    expect(result.duplicates).toEqual([{ recordId: "node/11", keptId: "node/10" }]);
    expect(facility("node/10")).toBeTruthy();
    expect(facility("node/11")).toBeUndefined();
    expect(facility("node/12")).toBeTruthy();
    expect(result.report.duplicatesRemoved).toBe(1);
  });

  it("rejects category-only, veterinary, unnamed, unsupported and disused records with reasons", () => {
    const reasons = Object.fromEntries(result.rejected.map((r) => [r.recordId, r.reason]));
    expect(reasons).toEqual({
      "node/15": "generic_name_only",
      "node/16": "generic_name_only",
      "node/17": "veterinary",
      "node/18": "missing_name",
      "node/19": "unsupported_type",
      "node/20": "disused",
    });
  });

  it("accepts Bangla-only names, using the Bangla text as name and a kind-based slug", () => {
    const record = facility("node/21");
    expect(record?.name).toBe("সেবা ক্লিনিক");
    expect(record?.slug).toBe("clinic-dhaka");
  });

  it("resolves slug collisions with the OSM id", () => {
    const slugs = result.facilities.filter((f) => f.name === "City Clinic").map((f) => f.slug).sort();
    expect(slugs).toEqual(["city-clinic-dhaka", "city-clinic-dhaka-n-31", "city-clinic-dhaka-n-32"]);
    expect(new Set(result.facilities.map((f) => f.slug)).size).toBe(result.facilities.length);
    expect(result.report.slugCollisionsResolved).toBe(2);
  });

  it("separates pharmacies from facilities and marks every record as unverified OSM data", () => {
    expect(result.pharmacies.map((p) => p.name).sort()).toEqual(["Beta Pharmacy", "Gamma Pharma"]);
    for (const record of [...result.facilities, ...result.pharmacies]) {
      const provenance = record.provenance as { sourceId: string; status: string; recordUrl: string };
      expect(provenance.sourceId).toBe("osm");
      expect(provenance.status).toBe("unverified");
      expect(provenance.recordUrl.startsWith("https://www.openstreetmap.org/")).toBe(true);
    }
    expect(result.sources.map((s) => s.id)).toEqual(["osm"]);
  });

  it("includes optional fields only when published", () => {
    const alpha = facility("node/10")!;
    expect(alpha.phone).toBe("+880 2 1234567");
    expect(alpha.postalCode).toBe("1205");
    expect(alpha.specialtyIds).toEqual([]);
    expect("website" in alpha).toBe(false);
    expect("emergency" in alpha).toBe(false);
    expect("ownership" in alpha).toBe(false);
  });

  it("produces a dataset that passes validation", () => {
    const { errors } = validateDataset({
      medicines: [],
      generics: [],
      manufacturers: [],
      sources: [],
      pharmacies: result.pharmacies,
      prices: [],
      popular: [],
      facilities: result.facilities,
      locations: result.locations,
      specialties: result.specialties,
      doctors: [],
      directorySources: result.sources,
    } as unknown as DatasetFiles);
    expect(errors).toEqual([]);
  });

  it("is deterministic", () => {
    const again = buildDirectory(raw([...features].reverse()), areas);
    expect(JSON.stringify(again.facilities)).toBe(JSON.stringify(result.facilities));
    expect(JSON.stringify(again.pharmacies)).toBe(JSON.stringify(result.pharmacies));
  });
});

describe("buildDirectory without an areas file", () => {
  const features = [
    node(10, 0.5, 0.5, { amenity: "hospital", name: "Alpha Hospital", "addr:suburb": "Dhanmondi" }),
    node(11, 0.5, 0.5, { amenity: "pharmacy", name: "Beta Pharmacy" }, null),
  ];

  for (const [label, areasRaw] of [["null", null], ["undefined", undefined], ["empty list", { areas: [] }]] as const) {
    it(`builds no area locations and no areaId (${label})`, () => {
      const result = buildDirectory(raw(features), areasRaw);
      expect(result.locations.some((l) => l.level === "area")).toBe(false);
      expect(result.facilities[0]?.areaId).toBeUndefined();
      expect(result.facilities[0]?.districtId).toBe("loc_dis_2");
      // The published suburb is kept as a locality.
      expect(result.facilities[0]?.locality).toBe("Dhanmondi");
      expect(result.pharmacies[0]?.districtId).toBeUndefined();
      expect(result.report.areas).toBe(0);
      expect(result.report.withArea).toBe(0);
      expect(result.report.withoutDistrict).toBe(1);
    });
  }
});
