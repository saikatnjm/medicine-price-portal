import { describe, expect, it } from "vitest";
import { createLocalRepositories } from "@/data/local/repositories";
import type { LocalDataset } from "@/data/local/dataset";
import type { Facility } from "@/domain/healthcare";
import { createServices } from "@/services";
import { fixtureDataset } from "./fixtures";

const services = createServices(createLocalRepositories(fixtureDataset));

const facilitySlugs = (r: { results: { items: { facility: { slug: string } }[] } }) =>
  r.results.items.map((i) => i.facility.slug);

describe("FacilityService.listFacilities", () => {
  it("lists everything by default with paging metadata", async () => {
    const { filters, results } = await services.facilities.listFacilities();
    expect(results.total).toBe(3);
    expect(results.page).toBe(1);
    expect(results.totalPages).toBe(1);
    expect(filters.kind).toBeNull();
    expect(filters.near).toBeNull();
    expect(results.items.every((i) => i.distanceKm === undefined)).toBe(true);
  });

  it("filters by kind and ignores unknown kinds", async () => {
    expect((await services.facilities.listFacilities({ kind: "hospital" })).results.total).toBe(2);
    const dental = await services.facilities.listFacilities({ kind: "dental_clinic" });
    expect(facilitySlugs(dental)).toEqual(["gulshan-dental-clinic-dhaka"]);
    expect(dental.filters.kind).toBe("dental_clinic");
    const bogus = await services.facilities.listFacilities({ kind: "spaceship" });
    expect(bogus.results.total).toBe(3);
    expect(bogus.filters.kind).toBeNull();
  });

  it("expands a division to its districts and matches area and district slugs", async () => {
    expect((await services.facilities.listFacilities({ location: "dhaka-division" })).results.total).toBe(2);
    expect((await services.facilities.listFacilities({ location: "dhaka" })).results.total).toBe(2);
    expect(facilitySlugs(await services.facilities.listFacilities({ location: "dhanmondi" }))).toEqual([
      "central-heart-hospital-dhaka",
    ]);
    expect(facilitySlugs(await services.facilities.listFacilities({ location: "chattogram-division" }))).toEqual([
      "harbour-hospital-chattogram",
    ]);
    expect((await services.facilities.listFacilities({ location: "gulshan" })).filters.location?.slug).toBe("gulshan");
  });

  it("filters by specialty and emergency", async () => {
    const cardiology = await services.facilities.listFacilities({ specialty: "cardiology" });
    expect(facilitySlugs(cardiology)).toEqual(["central-heart-hospital-dhaka"]);
    expect(cardiology.filters.specialty?.slug).toBe("cardiology");
    expect(cardiology.results.items[0]?.specialties.map((s) => s.slug)).toEqual(["cardiology"]);
    const emergency = await services.facilities.listFacilities({ emergency: true });
    expect(facilitySlugs(emergency)).toEqual(["central-heart-hospital-dhaka"]);
    expect(emergency.filters.emergencyOnly).toBe(true);
  });

  it("matches the query against names and kind words", async () => {
    expect(facilitySlugs(await services.facilities.listFacilities({ query: "heart" }))).toEqual([
      "central-heart-hospital-dhaka",
    ]);
    expect(facilitySlugs(await services.facilities.listFacilities({ query: "dentist" }))).toEqual([
      "gulshan-dental-clinic-dhaka",
    ]);
    expect((await services.facilities.listFacilities({ query: "zzzz" })).results.total).toBe(0);
  });

  it("sorts by distance for a valid near value and reports distanceKm", async () => {
    const { filters, results } = await services.facilities.listFacilities({
      location: "dhaka-division",
      near: "23.79,90.41",
    });
    expect(filters.near).toEqual({ lat: 23.79, lon: 90.41 });
    expect(results.items.map((i) => i.facility.slug)).toEqual([
      "gulshan-dental-clinic-dhaka",
      "central-heart-hospital-dhaka",
    ]);
    const [first, second] = results.items;
    expect(typeof first?.distanceKm).toBe("number");
    expect(first!.distanceKm! < second!.distanceKm!).toBe(true);
    expect(first!.distanceKm! < 1).toBe(true);
  });

  it("ignores an invalid near value instead of failing", async () => {
    const { filters, results } = await services.facilities.listFacilities({ near: "garbage" });
    expect(filters.near).toBeNull();
    expect(results.total).toBe(3);
    expect(results.items.every((i) => i.distanceKm === undefined)).toBe(true);
  });

  it("coerces bad page numbers to page 1", async () => {
    expect((await services.facilities.listFacilities({ page: -4 })).results.page).toBe(1);
    expect((await services.facilities.listFacilities({ page: 1.5 })).results.page).toBe(1);
  });

  it("paginates and reports totalPages", async () => {
    const page2 = await services.facilities.listFacilities({ pageSize: 2, page: 2 });
    expect(page2.results.items).toHaveLength(1);
    expect(page2.results.totalPages).toBe(2);
    expect(page2.results.total).toBe(3);
  });
});

describe("FacilityService.getFacilityDetail", () => {
  it("returns null for unknown slugs", async () => {
    expect(await services.facilities.getFacilityDetail("nope")).toBeNull();
  });

  it("marks facilities with public details as indexable and thin ones as not", async () => {
    expect((await services.facilities.getFacilityDetail("central-heart-hospital-dhaka"))?.indexable).toBe(true);
    // Phone only is enough; harbour hospital has only a name and district.
    expect((await services.facilities.getFacilityDetail("gulshan-dental-clinic-dhaka"))?.indexable).toBe(true);
    expect((await services.facilities.getFacilityDetail("harbour-hospital-chattogram"))?.indexable).toBe(false);
  });

  it("resolves place, specialties and source", async () => {
    const detail = await services.facilities.getFacilityDetail("central-heart-hospital-dhaka");
    expect(detail?.place.label).toBe("Panthapath, Dhanmondi, Dhaka");
    expect(detail?.place.division?.slug).toBe("dhaka-division");
    expect(detail?.specialties.map((s) => s.slug)).toEqual(["cardiology"]);
    expect(detail?.source?.id).toBe("osm");
  });

  it("lists doctors with a chamber at the facility", async () => {
    const detail = await services.facilities.getFacilityDetail("central-heart-hospital-dhaka");
    expect(detail?.doctors.map((d) => d.doctor.slug)).toEqual(["dr-test-example"]);
    expect(detail?.doctors[0]?.chamber?.name).toBe("Central Heart Hospital");
    expect((await services.facilities.getFacilityDetail("gulshan-dental-clinic-dhaka"))?.doctors).toEqual([]);
  });

  it("excludes the facility itself from nearby lists and respects the radius", async () => {
    const detail = await services.facilities.getFacilityDetail("central-heart-hospital-dhaka");
    expect(detail?.nearby.hospitals).toEqual([]);
    expect(detail?.nearby.clinics).toEqual([]);
    expect(detail?.nearby.diagnosticCentres).toEqual([]);
    expect(detail?.nearby.pharmacies.map((p) => p.pharmacy.slug)).toEqual(["alpha-pharmacy"]);
    const distance = detail?.nearby.pharmacies[0]?.distanceKm;
    expect(distance !== undefined && distance < 1).toBe(true);
  });

  it("falls back to the same district for facilities without coordinates", async () => {
    // Harbour Hospital has no coordinates; nothing else is in Chattogram.
    const detail = await services.facilities.getFacilityDetail("harbour-hospital-chattogram");
    expect(detail?.nearby).toEqual({ hospitals: [], clinics: [], diagnosticCentres: [], pharmacies: [] });
  });

  it("groups nearby records by kind, closest first, at most five per group", async () => {
    const near = (n: number) => ({ lat: 23.75 + n * 0.001, lon: 90.38 });
    const extra = (id: string, kind: Facility["kind"], n: number): Facility => ({
      id,
      slug: id,
      name: id,
      kind,
      districtId: "loc_dis_dhaka",
      areaId: "loc_area_dhanmondi",
      specialtyIds: [],
      coordinates: near(n),
      updatedAt: "2026-10-01T00:00:00Z",
      provenance: { sourceId: "osm", recordId: `node/${id}`, status: "unverified" },
    });
    const dataset: LocalDataset = {
      ...fixtureDataset,
      facilities: [
        ...fixtureDataset.facilities,
        extra("hosp-b", "hospital", 3),
        extra("hosp-a", "hospital", 1),
        extra("clinic-a", "clinic", 2),
        extra("centre-a", "health_centre", 1),
        extra("diag-a", "diagnostic_centre", 2),
        ...[1, 2, 3, 4, 5, 6].map((n) => extra(`far-clinic-${n}`, "clinic", 10 + n)),
        // Outside the 5 km radius.
        { ...extra("far-away", "hospital", 0), coordinates: { lat: 24.5, lon: 91 } },
      ],
    };
    const detail = await createServices(createLocalRepositories(dataset)).facilities.getFacilityDetail(
      "central-heart-hospital-dhaka",
    );
    expect(detail?.nearby.hospitals.map((f) => f.facility.slug)).toEqual(["hosp-a", "hosp-b"]);
    expect(detail?.nearby.hospitals.map((f) => f.distanceKm ?? 0)).toEqual(
      [...(detail?.nearby.hospitals.map((f) => f.distanceKm ?? 0) ?? [])].sort((a, b) => a - b),
    );
    // Clinics and health centres share one group, ordered by distance.
    expect(detail?.nearby.clinics.map((f) => f.facility.slug).slice(0, 2).sort()).toEqual(["centre-a", "clinic-a"].sort());
    expect(detail?.nearby.clinics).toHaveLength(5);
    expect(detail?.nearby.diagnosticCentres.map((f) => f.facility.slug)).toEqual(["diag-a"]);
    expect(detail?.nearby.pharmacies.map((p) => p.pharmacy.slug)).toEqual(["alpha-pharmacy"]);
  });

  it("countByKind and listIndex only expose what they should", async () => {
    expect(await services.facilities.countByKind()).toEqual([
      { kind: "hospital", count: 2 },
      { kind: "dental_clinic", count: 1 },
    ]);
    expect((await services.facilities.listIndex()).map((e) => e.slug).sort()).toEqual([
      "central-heart-hospital-dhaka",
      "gulshan-dental-clinic-dhaka",
    ]);
  });
});

describe("PharmacyService", () => {
  it("returns null for unknown slugs", async () => {
    expect(await services.pharmacies.getPharmacyDetail("nope")).toBeNull();
  });

  it("returns detail with place, source, prices and nearby records", async () => {
    const detail = await services.pharmacies.getPharmacyDetail("alpha-pharmacy");
    expect(detail?.place.label).toBe("Road 27, Dhanmondi, Dhaka");
    expect(detail?.source?.id).toBe("osm");
    expect(detail?.indexable).toBe(true);
    expect(detail?.prices.map((p) => p.medicine.slug)).toEqual(["ace-500mg", "napa-500mg"]);
    expect(detail?.hasSampleData).toBe(true);
    expect(detail?.nearby.pharmacies.map((p) => p.pharmacy.slug)).toEqual([]);
    expect(detail?.nearby.facilities.map((f) => f.facility.slug)).toEqual(["central-heart-hospital-dhaka"]);
  });

  it("lists pharmacies with filters and distances", async () => {
    const all = await services.pharmacies.listPharmacies();
    expect(all.results.total).toBe(2);
    expect(all.results.items.map((i) => i.pharmacy.slug)).toEqual(["alpha-pharmacy", "beta-pharmacy"]);
    const gulshan = await services.pharmacies.listPharmacies({ location: "gulshan" });
    expect(gulshan.results.items.map((i) => i.pharmacy.slug)).toEqual(["beta-pharmacy"]);
    expect(gulshan.filters.location?.slug).toBe("gulshan");
    expect((await services.pharmacies.listPharmacies({ location: "chattogram" })).results.total).toBe(0);
    const near = await services.pharmacies.listPharmacies({ near: "23.79,90.41" });
    expect(near.results.items.map((i) => i.pharmacy.slug)).toEqual(["beta-pharmacy", "alpha-pharmacy"]);
    expect(near.results.items.every((i) => typeof i.distanceKm === "number")).toBe(true);
  });

  it("matches by name query", async () => {
    const result = await services.pharmacies.listPharmacies({ query: "beta" });
    expect(result.results.items.map((i) => i.pharmacy.slug)).toEqual(["beta-pharmacy"]);
  });

  it("listAll and listIndex return both fixture pharmacies", async () => {
    expect((await services.pharmacies.listAll()).length).toBe(2);
    expect((await services.pharmacies.listIndex()).map((e) => e.slug).sort()).toEqual(["alpha-pharmacy", "beta-pharmacy"]);
  });
});

describe("DoctorService", () => {
  it("lists and filters doctors", async () => {
    expect((await services.doctors.listDoctors()).results.total).toBe(1);
    expect((await services.doctors.listDoctors({ specialty: "cardiology" })).results.total).toBe(1);
    expect((await services.doctors.listDoctors({ specialty: "dentistry" })).results.total).toBe(0);
    expect((await services.doctors.listDoctors({ hospital: "central-heart-hospital-dhaka" })).results.total).toBe(1);
    expect((await services.doctors.listDoctors({ hospital: "gulshan-dental-clinic-dhaka" })).results.total).toBe(0);
    // Chamber places count: one chamber is in Dhanmondi, the other in Gulshan.
    expect((await services.doctors.listDoctors({ location: "gulshan" })).results.total).toBe(1);
    expect((await services.doctors.listDoctors({ location: "dhanmondi" })).results.total).toBe(1);
    expect((await services.doctors.listDoctors({ location: "chattogram" })).results.total).toBe(0);
  });

  it("resolves the applied filters", async () => {
    const { filters } = await services.doctors.listDoctors({ specialty: "cardiology", hospital: "central-heart-hospital-dhaka" });
    expect(filters.specialty?.slug).toBe("cardiology");
    expect(filters.facility?.slug).toBe("central-heart-hospital-dhaka");
  });

  it("returns null for an unknown doctor slug", async () => {
    expect(await services.doctors.getDoctorDetail("nobody")).toBeNull();
  });

  it("resolves chamber views to facility names and places", async () => {
    const detail = await services.doctors.getDoctorDetail("dr-test-example");
    expect(detail?.specialties.map((s) => s.slug)).toEqual(["cardiology"]);
    expect(detail?.source?.id).toBe("test-doctors");
    const [hospital, chamber] = detail!.chambers;
    expect(hospital?.name).toBe("Central Heart Hospital");
    expect(hospital?.facility?.slug).toBe("central-heart-hospital-dhaka");
    expect(hospital?.place.label).toBe("Panthapath, Dhanmondi, Dhaka");
    expect(hospital?.coordinates).toEqual({ lat: 23.75, lon: 90.38 });
    expect(hospital?.chamber.consultationDays).toBe("Sat–Thu");
    expect(chamber?.name).toBe("Test Chamber");
    expect(chamber?.facility).toBeNull();
    expect(chamber?.place.label).toBe("Gulshan, Dhaka");
    expect(chamber?.coordinates).toBeNull();
  });

  it("does not list the doctor as related to themselves", async () => {
    expect((await services.doctors.getDoctorDetail("dr-test-example"))?.related).toEqual([]);
  });

  it("lists the index", async () => {
    expect((await services.doctors.listIndex()).map((e) => e.slug)).toEqual(["dr-test-example"]);
  });
});

describe("LocationService", () => {
  it("returns null for unknown slugs", async () => {
    expect(await services.locations.getLocationDetail("atlantis")).toBeNull();
  });

  it("aggregates counts for a district and lists ancestors and children", async () => {
    const detail = await services.locations.getLocationDetail("dhaka");
    expect([detail?.facilityCount, detail?.hospitalCount, detail?.pharmacyCount, detail?.doctorCount]).toEqual([2, 1, 2, 1]);
    expect(detail?.ancestors.map((a) => a.slug)).toEqual(["dhaka-division"]);
    expect(detail?.children.map((c) => [c.location.slug, c.facilityCount, c.pharmacyCount])).toEqual([
      ["dhanmondi", 1, 1],
      ["gulshan", 1, 1],
    ]);
    expect(detail?.kindCounts).toEqual([
      { kind: "hospital", count: 1 },
      { kind: "dental_clinic", count: 1 },
    ]);
    expect(detail?.specialties.map((s) => s.specialty.slug).sort()).toEqual(["cardiology", "dentistry"]);
    expect(detail?.indexable).toBe(true);
    // Hospitals are listed before other facility kinds.
    expect(detail?.facilities.map((f) => f.facility.slug)).toEqual([
      "central-heart-hospital-dhaka",
      "gulshan-dental-clinic-dhaka",
    ]);
  });

  it("lists hospitals, clinics, diagnostic centres and pharmacies in separate groups", async () => {
    const detail = await services.locations.getLocationDetail("dhaka");
    expect(detail?.hospitals.map((f) => f.facility.slug)).toEqual(["central-heart-hospital-dhaka"]);
    // A dental clinic is neither a clinic nor a health centre; it only appears in the counts.
    expect(detail?.clinics).toEqual([]);
    expect(detail?.diagnosticCentres).toEqual([]);
    expect(detail?.pharmacies.map((p) => p.pharmacy.slug)).toEqual(["alpha-pharmacy", "beta-pharmacy"]);

    const withMore: LocalDataset = {
      ...fixtureDataset,
      facilities: [
        ...fixtureDataset.facilities,
        ...(["clinic", "health_centre", "diagnostic_centre"] as const).map((kind, i) => ({
          id: `x${i}`,
          slug: `x-${kind}`,
          name: `X ${kind}`,
          kind,
          districtId: "loc_dis_dhaka",
          specialtyIds: [],
          updatedAt: "2026-10-01T00:00:00Z",
          provenance: { sourceId: "osm", recordId: `node/x${i}`, status: "unverified" as const },
        })),
      ],
    };
    const more = await createServices(createLocalRepositories(withMore)).locations.getLocationDetail("dhaka");
    expect(more?.clinics.map((f) => f.facility.kind).sort()).toEqual(["clinic", "health_centre"]);
    expect(more?.diagnosticCentres.map((f) => f.facility.slug)).toEqual(["x-diagnostic_centre"]);
  });

  it("includes division and district ancestors for an area, outermost first", async () => {
    const detail = await services.locations.getLocationDetail("dhanmondi");
    expect(detail?.ancestors.map((a) => a.slug)).toEqual(["dhaka-division", "dhaka"]);
    expect(detail?.children).toEqual([]);
    expect(detail?.facilityCount).toBe(1);
  });

  it("counts a division through its districts", async () => {
    const detail = await services.locations.getLocationDetail("dhaka-division");
    expect(detail?.facilityCount).toBe(2);
    expect(detail?.children.map((c) => c.location.slug)).toEqual(["dhaka"]);
  });

  it("orders children with records first and then by name", async () => {
    const empty: LocalDataset = {
      ...fixtureDataset,
      locations: [
        ...fixtureDataset.locations,
        { id: "loc_area_aaa", slug: "aaa-empty", name: "Aaa Empty", level: "area", parentId: "loc_dis_dhaka" },
      ],
    };
    const detail = await createServices(createLocalRepositories(empty)).locations.getLocationDetail("dhaka");
    expect(detail?.children.map((c) => c.location.slug)).toEqual(["dhanmondi", "gulshan", "aaa-empty"]);
  });

  it("marks a location without records as not indexable", async () => {
    const detail = await services.locations.getLocationDetail("chattogram-division");
    expect(detail?.facilityCount).toBe(1);
    const noRecords: LocalDataset = {
      ...fixtureDataset,
      locations: [...fixtureDataset.locations, { id: "loc_dis_x", slug: "sylhet", name: "Sylhet", level: "district", parentId: "loc_div_ctg" }],
    };
    const sylhet = await createServices(createLocalRepositories(noRecords)).locations.getLocationDetail("sylhet");
    expect(sylhet?.indexable).toBe(false);
    expect(sylhet?.facilityCount).toBe(0);
  });

  it("lists the tree sorted by name with district counts", async () => {
    const tree = await services.locations.listLocationTree();
    expect(tree.map((d) => [d.division.slug, d.facilityCount, d.districts.map((x) => x.location.slug)])).toEqual([
      ["chattogram-division", 1, ["chattogram"]],
      ["dhaka-division", 2, ["dhaka"]],
    ]);
  });

  it("listIndexable returns only locations with records", async () => {
    const slugs = (await services.locations.listIndexable()).map((l) => l.location.slug).sort();
    expect(slugs).toEqual(["chattogram", "chattogram-division", "dhaka", "dhaka-division", "dhanmondi", "gulshan"]);
  });
});

describe("SpecialtyService", () => {
  it("lists specialties with counts", async () => {
    const list = await services.specialties.listSpecialties();
    expect(list.map((s) => [s.specialty.slug, s.facilityCount, s.doctorCount])).toEqual([
      ["cardiology", 1, 1],
      ["dentistry", 1, 0],
    ]);
  });

  it("returns null for unknown slugs", async () => {
    expect(await services.specialties.getSpecialtyDetail("astrology")).toBeNull();
  });

  it("returns facilities, doctors and top districts", async () => {
    const detail = await services.specialties.getSpecialtyDetail("cardiology");
    expect(detail?.facilityCount).toBe(1);
    expect(detail?.doctorCount).toBe(1);
    expect(detail?.facilities.map((f) => f.facility.slug)).toEqual(["central-heart-hospital-dhaka"]);
    expect(detail?.doctors.map((d) => d.doctor.slug)).toEqual(["dr-test-example"]);
    expect(detail?.topLocations.map((t) => t.location.slug)).toEqual(["dhaka"]);
  });
});

describe("DirectoryService", () => {
  it("summarises the directory", async () => {
    const summary = await services.directory.getSummary();
    expect({ ...summary, sources: summary.sources.map((s) => s.id).sort() }).toEqual({
      medicineCount: 6,
      facilityCount: 3,
      hospitalCount: 2,
      pharmacyCount: 2,
      doctorCount: 1,
      specialtyCount: 2,
      districtCount: 2,
      areaCount: 2,
      sources: ["osm", "src1", "test-doctors"],
    });
  });

  it("has no combination pages below the minimum record count", async () => {
    expect(await services.directory.listCombinations()).toEqual([]);
    expect(await services.directory.isIndexableCombination("hospitals", "dhaka")).toBe(false);
  });

  describe("with enough records", () => {
    const extra = (n: number): Facility => ({
      id: `fac_x${n}`,
      slug: `extra-heart-centre-${n}`,
      name: `Extra Heart Centre ${n}`,
      kind: "clinic",
      districtId: "loc_dis_dhaka",
      areaId: "loc_area_dhanmondi",
      specialtyIds: ["spec_cardiology"],
      coordinates: { lat: 23.75 + n / 1000, lon: 90.38 },
      updatedAt: "2026-10-01T00:00:00Z",
      provenance: { sourceId: "osm", recordId: `node/90${n}`, status: "unverified" },
    });
    const extended = createServices(
      createLocalRepositories({ ...fixtureDataset, facilities: [...fixtureDataset.facilities, extra(1), extra(2), extra(3)] }),
    );

    it("lists location and location × specialty combinations", async () => {
      const combos = await extended.directory.listCombinations();
      const has = (locationSlug: string, specialtySlug?: string) =>
        combos.some((c) => c.type === "hospitals" && c.locationSlug === locationSlug && c.specialtySlug === specialtySlug);
      expect(has("dhanmondi")).toBe(true);
      expect(has("dhanmondi", "cardiology")).toBe(true);
      expect(has("dhaka")).toBe(true);
      expect(has("dhaka", "cardiology")).toBe(true);
      expect(has("dhaka-division", "cardiology")).toBe(true);
      // Below the threshold: stays out.
      expect(has("gulshan")).toBe(false);
      expect(has("dhanmondi", "dentistry")).toBe(false);
      expect(has("chattogram")).toBe(false);
      expect(combos.find((c) => c.locationSlug === "dhanmondi" && !c.specialtySlug)?.count).toBe(4);
      expect(combos.some((c) => c.type !== "hospitals")).toBe(false);
    });

    it("answers isIndexableCombination consistently", async () => {
      expect(await extended.directory.isIndexableCombination("hospitals", "dhanmondi")).toBe(true);
      expect(await extended.directory.isIndexableCombination("hospitals", "dhanmondi", "cardiology")).toBe(true);
      expect(await extended.directory.isIndexableCombination("hospitals", "gulshan")).toBe(false);
      expect(await extended.directory.isIndexableCombination("doctors", "dhanmondi", "cardiology")).toBe(false);
    });
  });
});

describe("SearchService.searchAll", () => {
  it("finds only medicines for a medicine brand", async () => {
    const r = await services.search.searchAll("Napa");
    expect(r.status).toBe("ok");
    expect(r.medicines.total).toBe(4);
    expect([r.doctors.total, r.facilities.total, r.pharmacies.total, r.specialties.total, r.locations.total]).toEqual([0, 0, 0, 0, 0]);
    expect(r.total).toBe(4);
    expect(r.intent.text).toBe("napa");
  });

  it("finds doctors and the specialty for a practitioner title", async () => {
    const r = await services.search.searchAll("Cardiologist");
    expect(r.intent.entity).toBe("doctor");
    expect(r.intent.specialty?.slug).toBe("cardiology");
    expect(r.doctors.items.map((d) => d.doctor.slug)).toEqual(["dr-test-example"]);
    expect(r.specialties.items.map((s) => s.specialty.slug)).toEqual(["cardiology"]);
    expect(r.specialties.items[0]?.doctorCount).toBe(1);
    expect(r.medicines.total).toBe(0);
    expect(r.facilities.total).toBe(0);
    expect(r.pharmacies.total).toBe(0);
  });

  it("returns a location group plus facilities and pharmacies in the place", async () => {
    const r = await services.search.searchAll("Dhaka");
    expect(r.intent.location?.slug).toBe("dhaka");
    expect(r.locations.items.map((l) => l.location.slug)).toEqual(["dhaka"]);
    expect(r.locations.items[0]?.facilityCount).toBe(2);
    expect(r.facilities.items.map((f) => f.facility.slug).sort()).toEqual([
      "central-heart-hospital-dhaka",
      "gulshan-dental-clinic-dhaka",
    ]);
    expect(r.pharmacies.total).toBe(2);
    expect(r.doctors.total).toBe(1);
    expect(r.medicines.total).toBe(0);
  });

  it("restricts to hospitals for an entity word", async () => {
    const r = await services.search.searchAll("Hospital");
    expect(r.intent.entity).toBe("hospital");
    expect(r.facilities.total).toBe(3);
    expect(r.doctors.total).toBe(0);
    expect(r.pharmacies.total).toBe(0);
    expect(r.medicines.total).toBe(0);
  });

  it("combines specialty and location", async () => {
    const r = await services.search.searchAll("cardiologists in gulshan");
    expect(r.intent.specialty?.slug).toBe("cardiology");
    expect(r.intent.location?.slug).toBe("gulshan");
    // The doctor's second chamber is in Gulshan.
    expect(r.doctors.items.map((d) => d.doctor.slug)).toEqual(["dr-test-example"]);
    expect(r.locations.items.map((l) => l.location.slug)).toEqual(["gulshan"]);
    expect(r.facilities.total).toBe(0);
  });

  it("keeps a facility name with an alias word as a text search", async () => {
    const r = await services.search.searchAll("Central Heart");
    expect(r.intent.specialty).toBeNull();
    expect(r.facilities.items.map((f) => f.facility.slug)).toEqual(["central-heart-hospital-dhaka"]);
  });

  it("reports statuses for empty and too short queries", async () => {
    const empty = await services.search.searchAll("");
    expect(empty.status).toBe("empty_query");
    expect(empty.total).toBe(0);
    const spaces = await services.search.searchAll("   ");
    expect(spaces.status).toBe("empty_query");
    const short = await services.search.searchAll("a");
    expect(short.status).toBe("query_too_short");
    expect(short.total).toBe(0);
    expect((await services.search.searchAll(null)).status).toBe("empty_query");
  });

  it("returns an empty ok result for nonsense", async () => {
    const r = await services.search.searchAll("qqqzzz");
    expect(r.status).toBe("ok");
    expect(r.total).toBe(0);
  });
});

describe("SearchService.suggest", () => {
  it("groups suggestions by type with hrefs", async () => {
    const groups = await services.search.suggest("gul");
    const byType = Object.fromEntries(groups.map((g) => [g.type, g.items]));
    // The fixture doctor has a chamber in Gulshan, so doctors match too.
    expect(groups.map((g) => g.type)).toEqual(["doctor", "hospital", "pharmacy", "location"]);
    expect(byType.hospital?.[0]).toEqual({
      type: "hospital",
      label: "Gulshan Dental Clinic",
      detail: "Dental clinic · Gulshan, Dhaka",
      href: "/hospital/gulshan-dental-clinic-dhaka",
    });
    expect(byType.pharmacy?.[0]?.href).toBe("/pharmacy/beta-pharmacy");
    expect(byType.location?.[0]?.href).toBe("/locations/gulshan");
    expect(byType.location?.[0]?.detail).toBe("Area · Dhaka");
  });

  it("suggests places for an unfinished last word", async () => {
    const groups = await services.search.suggest("cardiologist in dhan");
    const locations = groups.find((g) => g.type === "location")?.items ?? [];
    expect(locations.map((l) => l.href)).toEqual(["/locations/dhanmondi"]);
  });

  it("links medicines and specialties", async () => {
    const napa = await services.search.suggest("napa");
    expect(napa.map((g) => g.type)).toEqual(["medicine"]);
    expect(napa[0]?.items[0]?.href).toBe("/medicine/napa-500mg");
    const cardio = await services.search.suggest("Cardiologist");
    expect(cardio.map((g) => g.type)).toEqual(["doctor", "specialty"]);
    expect(cardio[1]?.items[0]?.href).toBe("/specialties/cardiology");
  });

  it("returns no groups for empty, short or unmatched queries", async () => {
    expect(await services.search.suggest("")).toEqual([]);
    expect(await services.search.suggest("a")).toEqual([]);
    expect(await services.search.suggest("qqqzzz")).toEqual([]);
  });
});

describe("facility and pharmacy page titles", () => {
  it("uses name and the most specific place; shortens long pharmacy titles", async () => {
    const { facilityTitle, pharmacyTitle } = await import("@/lib/seo-facilities");
    const facility = await services.facilities.getFacilityDetail("central-heart-hospital-dhaka");
    expect(facilityTitle(facility!)).toBe("Central Heart Hospital, Dhanmondi");
    const thin = await services.facilities.getFacilityDetail("harbour-hospital-chattogram");
    expect(facilityTitle(thin!)).toBe("Harbour Hospital, Chattogram");
    const pharmacy = await services.pharmacies.getPharmacyDetail("alpha-pharmacy");
    expect(pharmacyTitle(pharmacy!)).toBe("Alpha Pharmacy, Dhanmondi — Pharmacy location & contact");
    const long = { ...pharmacy!, pharmacy: { ...pharmacy!.pharmacy, name: "A Very Long Pharmacy And Surgical Store Name" } };
    expect(pharmacyTitle(long).length <= 60).toBe(true);
    expect(pharmacyTitle(long)).toMatch(/^A Very Long Pharmacy And Surgical Store Name, Dhanmondi/);
  });
});
