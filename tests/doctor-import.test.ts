import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { buildDoctors, COLUMNS, isValidPhone, mergeSources, parseCsv } from "../scripts/data/import-doctors.mjs";
import { validateDataset } from "../scripts/data/validate-data.mjs";
import { fixtureDataset } from "./fixtures";

const NOW = "2026-10-05T00:00:00.000Z";
const HEADER = COLUMNS.join(",");
const source = { id: "doctors-test", name: "Test hospital site", url: "https://hospital.test/doctors", licence: "Written permission, 2026-09-01" };
const common = {
  specialties: fixtureDataset.specialties as { id: string; slug: string }[],
  facilities: fixtureDataset.facilities as { id: string; slug: string }[],
  locations: fixtureDataset.locations as { id: string; slug: string; level: string }[],
  now: NOW,
};

/** Builds one CSV row from named columns. */
function row(values: Record<string, string>): string {
  return COLUMNS.map((c) => {
    const v = values[c] ?? "";
    return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
  }).join(",");
}
const valid = {
  doctor_key: "k1",
  name: "Dr. Fiction Name",
  specialties: "cardiology",
  source_id: "doctors-test",
  source_url: "https://hospital.test/doctors/fiction-name",
  verification_method: "official_profile",
  verified_at: "2026-09-15",
  facility_slug: "central-heart-hospital-dhaka",
};
const run = (rows: Record<string, string>[], opts: { allowExamples?: boolean; sources?: unknown } = {}) =>
  buildDoctors({ ...common, ...opts, sources: opts.sources ?? [source], csvText: [HEADER, ...rows.map(row)].join("\n") });
const has = (r: { errors: string[] }, text: string) => r.errors.some((e) => e.includes(text));

describe("doctor import", () => {
  it("imports a header-only CSV as an empty list", () => {
    const r = buildDoctors({ ...common, sources: [], csvText: `${HEADER}\n` });
    expect(r.errors).toEqual([]);
    expect(r.doctors).toEqual([]);
    expect(r.sources).toEqual([]);
  });

  it("builds doctors with chambers, ids, slugs and verified provenance", () => {
    const r = run([
      { ...valid, qualifications: "MBBS (fictional)", consultation_days: "Sat-Thu", appointment_phone: "+880 1700-000000" },
      { doctor_key: "k1", facility_name: "Second Chamber", district_slug: "dhaka", area_slug: "gulshan", latitude: "23.79", longitude: "90.41" },
    ]);
    expect(r.errors).toEqual([]);
    expect(r.doctors).toHaveLength(1);
    const d = r.doctors[0]!;
    expect(d.slug).toBe("dr-fiction-name-dhaka");
    expect(d.id).toMatch(/^doc_[0-9a-f]{16}$/);
    expect(d.specialtyIds).toEqual(["spec_cardiology"]);
    expect(d.chambers).toHaveLength(2);
    expect(d.chambers[0].facilityId).toBe("fac_1");
    expect(d.chambers[0].appointmentPhone).toBe("+880 1700-000000");
    expect(d.chambers[1]).toEqual({
      facilityName: "Second Chamber",
      districtId: "loc_dis_dhaka",
      areaId: "loc_area_gulshan",
      coordinates: { lat: 23.79, lon: 90.41 },
    });
    expect(d.provenance).toEqual({
      sourceId: "doctors-test",
      recordId: "k1",
      recordUrl: valid.source_url,
      status: "verified",
      verificationMethod: "official_profile",
      verifiedAt: "2026-09-15T00:00:00.000Z",
    });
    expect(r.sources.map((s) => s.id)).toEqual(["doctors-test"]);
  });

  it("is stable across runs and suffixes slug collisions", () => {
    const rows = [valid, { ...valid, doctor_key: "k2", source_url: "https://hospital.test/doctors/other" }];
    const a = run(rows);
    expect(a.doctors.map((d) => d.slug)).toEqual(["dr-fiction-name-dhaka", "dr-fiction-name-dhaka-2"]);
    expect(run(rows).doctors.map((d) => d.id)).toEqual(a.doctors.map((d) => d.id));
  });

  it("produces data that passes dataset validation", () => {
    const r = run([valid]);
    const { errors } = validateDataset({
      ...(fixtureDataset as never),
      popular: [],
      doctors: r.doctors,
      directorySources: r.sources,
    });
    expect(errors).toEqual([]);
  });

  it("rejects a missing source_url", () => {
    expect(has(run([{ ...valid, source_url: "" }]), "source_url is required")).toBe(true);
  });

  it("rejects an unknown specialty slug", () => {
    expect(has(run([{ ...valid, specialties: "astrology" }]), 'unknown specialty slug "astrology"')).toBe(true);
  });

  it("rejects an unknown facility_slug", () => {
    expect(has(run([{ ...valid, facility_slug: "no-such-hospital" }]), "unknown facility_slug")).toBe(true);
  });

  it("rejects a chamber without a facility_slug or a district", () => {
    expect(has(run([{ ...valid, facility_slug: "", facility_name: "Clinic" }]), "district_slug is required")).toBe(true);
  });

  it("rejects an invalid phone number", () => {
    expect(has(run([{ ...valid, phone: "call me" }]), "not a valid phone number")).toBe(true);
    expect(has(run([{ ...valid, appointment_phone: "12" }]), "not a valid phone number")).toBe(true);
    expect(isValidPhone("02-55512345")).toBe(true);
    expect(isValidPhone("+8801712345678")).toBe(true);
  });

  it("rejects placeholder hosts unless examples are allowed", () => {
    const example = { ...valid, source_url: "https://example.org/doctors/x" };
    expect(has(run([example]), "placeholder")).toBe(true);
    expect(run([example], { allowExamples: true, sources: [{ ...source, url: "https://example.org/d" }] }).errors).toEqual([]);
    expect(has(run([valid], { sources: [{ ...source, url: "https://example.com/d" }] }), "example hosts")).toBe(true);
  });

  it("requires a valid verification method, a past date, a known source and no unknown columns", () => {
    expect(has(run([{ ...valid, verification_method: "scraped" }]), "verification_method must be")).toBe(true);
    expect(has(run([{ ...valid, verified_at: "2999-01-01" }]), "in the future")).toBe(true);
    expect(has(run([{ ...valid, verified_at: "yesterday" }]), "verified_at must be a date")).toBe(true);
    expect(has(run([{ ...valid, source_id: "doctors-other" }]), "not in sources.json")).toBe(true);
    const extra = buildDoctors({ ...common, sources: [source], csvText: `${HEADER},rating\n` });
    expect(has(extra, 'unknown column "rating"')).toBe(true);
  });

  it("rejects conflicting doctor-level values across a doctor's rows and bad coordinates", () => {
    const conflict = run([valid, { doctor_key: "k1", name: "Someone Else", facility_slug: "central-heart-hospital-dhaka" }]);
    expect(has(conflict, '"name" differs')).toBe(true);
    expect(has(run([{ ...valid, latitude: "90.4", longitude: "23.7" }]), "inside Bangladesh")).toBe(true);
  });

  it("writes nothing when any row is invalid", () => {
    const r = run([valid, { ...valid, doctor_key: "k2", specialties: "astrology" }]);
    expect(r.doctors).toEqual([]);
  });

  it("parses quoted CSV fields, escaped quotes and CRLF", () => {
    const rows = parseCsv('a,b\r\n"x, y","say ""hi"""\r\n');
    expect(rows.map((r) => r.cells)).toEqual([["a", "b"], ["x, y", 'say "hi"']]);
  });

  it("merges sources without dropping existing entries", () => {
    const merged = mergeSources([{ id: "osm" }, { id: "doctors-test", name: "old" }], [{ id: "doctors-test", name: "new" }]);
    expect(merged).toEqual([{ id: "osm" }, { id: "doctors-test", name: "new" }]);
  });
});

describe("shipped doctor data", () => {
  it("has an empty doctor CSV and an empty seed", () => {
    expect(readFileSync("data/doctors/doctors.csv", "utf8").trim()).toBe(HEADER);
    expect(JSON.parse(readFileSync("src/data/local/seed/doctors.json", "utf8"))).toEqual([]);
  });

  it("keeps the example file valid only with --allow-examples", () => {
    const csvText = readFileSync("data/doctors/doctors.example.csv", "utf8");
    const sources = JSON.parse(readFileSync("data/doctors/sources.example.json", "utf8"));
    const real = (f: string) => JSON.parse(readFileSync(`src/data/local/seed/${f}.json`, "utf8"));
    const input = { csvText, sources, specialties: real("specialties"), facilities: real("facilities"), locations: real("locations"), now: NOW };
    expect(buildDoctors(input).errors.length).toBeGreaterThan(0);
    const ok = buildDoctors({ ...input, allowExamples: true });
    expect(ok.errors).toEqual([]);
    expect(ok.doctors).toHaveLength(2);
    expect(ok.doctors[0]!.chambers).toHaveLength(2);
  });
});
