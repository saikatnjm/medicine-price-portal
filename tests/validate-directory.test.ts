import { describe, expect, it } from "vitest";
import { validateDataset, type DatasetFiles } from "../scripts/data/validate-data.mjs";

const updatedAt = "2026-10-01T00:00:00Z";
const osm = (recordId: string) => ({ sourceId: "osm", recordId, status: "unverified" });

/** Smallest dataset with directory files that passes validation. */
function minimal() {
  return {
    medicines: [] as Record<string, unknown>[],
    generics: [] as Record<string, unknown>[],
    manufacturers: [] as Record<string, unknown>[],
    sources: [] as Record<string, unknown>[],
    pharmacies: [] as Record<string, unknown>[],
    prices: [] as Record<string, unknown>[],
    popular: [] as string[],
    directorySources: [
      { id: "osm", name: "OpenStreetMap", publisher: "OpenStreetMap contributors", url: "https://www.openstreetmap.org/", retrievedAt: updatedAt },
      { id: "doctors", name: "Verified doctors", publisher: "Test", url: "https://example.org", retrievedAt: updatedAt },
    ] as Record<string, unknown>[],
    locations: [
      { id: "loc_div_1", slug: "dhaka-division", name: "Dhaka", level: "division" },
      { id: "loc_dis_1", slug: "dhaka", name: "Dhaka", level: "district", parentId: "loc_div_1" },
    ] as Record<string, unknown>[],
    specialties: [
      { id: "spec_cardiology", slug: "cardiology", name: "Cardiology", practitionerTitle: "Cardiologist", description: "d", aliases: [] },
    ] as Record<string, unknown>[],
    facilities: [
      {
        id: "fac_1",
        slug: "alpha-hospital-dhaka",
        name: "Alpha Hospital",
        kind: "hospital",
        districtId: "loc_dis_1",
        specialtyIds: ["spec_cardiology"],
        coordinates: { lat: 23.75, lon: 90.38 },
        website: "https://alpha.example",
        updatedAt,
        provenance: osm("node/1"),
      },
    ] as Record<string, unknown>[],
    doctors: [] as Record<string, unknown>[],
  };
}

const validate = (data: ReturnType<typeof minimal>) => validateDataset(data as unknown as DatasetFiles);
const rules = (data: ReturnType<typeof minimal>) =>
  validate(data).errors.map((e) => /^\[([^\]]+)\]/.exec(e)?.[1]);
const hasRule = (data: ReturnType<typeof minimal>, rule: string) => rules(data).includes(rule);

describe("directory validation", () => {
  it("accepts a valid minimal dataset", () => {
    expect(validate(minimal()).errors).toEqual([]);
  });

  it("accepts a valid verified doctor", () => {
    const data = minimal();
    data.doctors.push({
      id: "doc_1",
      slug: "dr-test-example",
      name: "Dr. Test Example",
      specialtyIds: ["spec_cardiology"],
      chambers: [],
      updatedAt,
      provenance: { sourceId: "doctors", recordId: "d1", status: "verified", verificationMethod: "official_profile", verifiedAt: "2026-10-01T00:00:00Z", recordUrl: "https://example.org/dr/d1" },
    });
    expect(validate(data).errors).toEqual([]);
  });

  it("reports a facility pointing at an unknown district", () => {
    const data = minimal();
    data.facilities[0]!.districtId = "loc_dis_missing";
    expect(rules(data)).toEqual(["broken_reference"]);
    expect(validate(data).errors[0]).toContain("loc_dis_missing");
  });

  it("reports an unknown facility kind", () => {
    const data = minimal();
    data.facilities[0]!.kind = "spaceport";
    expect(rules(data)).toEqual(["malformed_record"]);
  });

  it("reports an unknown ownership value", () => {
    const data = minimal();
    data.facilities[0]!.ownership = "alien";
    expect(hasRule(data, "malformed_record")).toBe(true);
  });

  it("reports an invalid slug", () => {
    const data = minimal();
    data.facilities[0]!.slug = "Alpha Hospital!";
    expect(rules(data)).toEqual(["invalid_slug"]);
  });

  it("reports a website that is not http(s)", () => {
    for (const website of ["javascript:alert(1)", "ftp://example.org", "alpha.example"]) {
      const data = minimal();
      data.facilities[0]!.website = website;
      expect(rules(data)).toEqual(["malformed_record"]);
    }
  });

  it("reports out-of-range coordinates", () => {
    const data = minimal();
    data.facilities[0]!.coordinates = { lat: 123, lon: 90 };
    expect(rules(data)).toEqual(["malformed_record"]);
  });

  it("rejects a doctor with unverified provenance", () => {
    const data = minimal();
    data.doctors.push({
      id: "doc_1",
      slug: "dr-scraped",
      name: "Dr. Scraped",
      specialtyIds: [],
      chambers: [],
      updatedAt,
      provenance: { sourceId: "doctors", recordId: "d1", status: "unverified" },
    });
    const errors = validate(data).errors;
    expect(errors.every((e) => e.startsWith("[invalid_provenance]"))).toBe(true);
    expect(errors[0]).toContain('doctor doc_1 status must be "verified"');
  });

  it("requires verification method, verifiedAt and recordUrl on every doctor", () => {
    const data = minimal();
    data.doctors.push({
      id: "doc_1",
      slug: "dr-thin",
      name: "Dr. Thin",
      specialtyIds: [],
      chambers: [],
      updatedAt,
      provenance: { sourceId: "doctors", recordId: "d1", status: "verified" },
    });
    const text = validate(data).errors.join("\n");
    expect(text).toContain("needs verificationMethod");
    expect(text).toContain("needs a valid verifiedAt");
    expect(text).toContain("needs a recordUrl");
  });

  it("reports provenance that points at an unknown source", () => {
    const data = minimal();
    data.facilities[0]!.provenance = { sourceId: "nowhere", recordId: "x", status: "unverified" };
    expect(rules(data)).toEqual(["invalid_provenance"]);
  });

  it("reports a duplicate facility profile (same kind, name, district and coordinates)", () => {
    const data = minimal();
    data.facilities.push({ ...data.facilities[0]!, id: "fac_2", slug: "alpha-hospital-dhaka-2", provenance: osm("node/2") });
    expect(rules(data)).toEqual(["duplicate_profile"]);
  });

  it("allows the same name in the same district at different coordinates", () => {
    const data = minimal();
    data.facilities.push({
      ...data.facilities[0]!,
      id: "fac_2",
      slug: "alpha-hospital-dhaka-2",
      coordinates: { lat: 23.9, lon: 90.5 },
      provenance: osm("node/2"),
    });
    expect(validate(data).errors).toEqual([]);
  });

  it("reports duplicate ids and slugs", () => {
    const data = minimal();
    data.facilities.push({ ...data.facilities[0]!, coordinates: { lat: 24, lon: 91 } });
    expect(hasRule(data, "duplicate_facility_id")).toBe(true);
    expect(hasRule(data, "duplicate_facility_slug")).toBe(true);
  });

  it("reports an unknown specialty reference on facilities and doctors", () => {
    const data = minimal();
    data.facilities[0]!.specialtyIds = ["spec_missing"];
    data.doctors.push({
      id: "doc_1",
      slug: "dr-test-example",
      name: "Dr. Test Example",
      specialtyIds: ["spec_also_missing"],
      chambers: [],
      updatedAt,
      provenance: { sourceId: "doctors", recordId: "d1", status: "verified", verificationMethod: "official_profile", verifiedAt: "2026-10-01T00:00:00Z", recordUrl: "https://example.org/dr/d1" },
    });
    const errors = validate(data).errors;
    expect(errors).toHaveLength(2);
    expect(errors.every((e) => e.startsWith("[broken_reference]"))).toBe(true);
    expect(errors[0]).toContain("spec_missing");
    expect(errors[1]).toContain("spec_also_missing");
  });

  it("reports a district whose parent is missing", () => {
    const data = minimal();
    data.locations[1]!.parentId = "loc_div_missing";
    expect(rules(data)).toEqual(["broken_reference"]);
  });

  it("validates pharmacies that carry provenance", () => {
    const data = minimal();
    data.pharmacies.push({
      id: "pha_1",
      slug: "Bad Slug",
      name: "Pharmacy",
      districtId: "loc_dis_missing",
      updatedAt,
      provenance: osm("node/9"),
    });
    expect(rules(data).sort()).toEqual(["broken_reference", "invalid_slug"]);
  });

  it("is still valid without any directory files", () => {
    const { errors } = validateDataset({ medicines: [], generics: [], manufacturers: [], sources: [], pharmacies: [], prices: [], popular: [] });
    expect(errors).toEqual([]);
  });

  it("rejects non-array directory files", () => {
    const { errors } = validateDataset({ ...minimal(), facilities: {} as never } as unknown as DatasetFiles);
    expect(errors[0]).toContain("[invalid_json]");
  });
});

describe("directory validation: areas and doctor chambers", () => {
  it("accepts area-level locations, which build-healthcare.mjs generates", () => {
    const data = minimal();
    data.locations.push({ id: "loc_area_1", slug: "dhanmondi", name: "Dhanmondi", level: "area", parentId: "loc_dis_1" });
    expect(validate(data).errors).toEqual([]);
  });

  it("reports an area whose parent district is missing", () => {
    const data = minimal();
    data.locations.push({ id: "loc_area_1", slug: "dhanmondi", name: "Dhanmondi", level: "area", parentId: "loc_dis_missing" });
    expect(rules(data)).toEqual(["broken_reference"]);
  });

  it("reports a facility whose areaId is unknown", () => {
    const data = minimal();
    data.facilities[0]!.areaId = "loc_area_missing";
    expect(rules(data)).toEqual(["broken_reference"]);
  });

  it("reports a doctor chamber that points at an unknown facility", () => {
    const data = minimal();
    data.doctors.push({
      id: "doc_1",
      slug: "dr-test-example",
      name: "Dr. Test Example",
      specialtyIds: ["spec_cardiology"],
      chambers: [{ facilityId: "fac_missing" }],
      updatedAt,
      provenance: { sourceId: "doctors", recordId: "d1", status: "verified", verificationMethod: "official_profile", verifiedAt: "2026-10-01T00:00:00Z", recordUrl: "https://example.org/dr/d1" },
    });
    expect(rules(data)).toEqual(["broken_reference"]);
  });
});
