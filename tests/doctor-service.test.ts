import { describe, expect, it } from "vitest";
import { createLocalRepositories } from "@/data/local/repositories";
import { createServices } from "@/services";
import { doctorJsonLd, doctorTitle } from "@/lib/seo-directory";
import { fixtureDataset } from "./fixtures";

const services = createServices(createLocalRepositories(fixtureDataset));

describe("DoctorService", () => {
  it("returns a detail with specialties, chambers, source and verified provenance", async () => {
    const detail = await services.doctors.getDoctorDetail("dr-test-example");
    expect(detail?.doctor.provenance.verificationMethod).toBe("official_profile");
    expect(detail?.doctor.provenance.verifiedAt).toBeTruthy();
    expect(detail?.specialties.map((s) => s.slug)).toEqual(["cardiology"]);
    expect(detail?.chambers).toHaveLength(2);
    expect(detail?.chambers[0]!.facility?.slug).toBe("central-heart-hospital-dhaka");
    expect(detail?.chambers[1]!.name).toBe("Test Chamber");
    expect(detail?.source?.id).toBe("test-doctors");
  });

  it("returns null for an unknown slug", async () => {
    expect(await services.doctors.getDoctorDetail("dr-nobody")).toBeNull();
  });

  it("lists and filters by specialty, location and hospital", async () => {
    expect((await services.doctors.listDoctors()).results.total).toBe(1);
    expect((await services.doctors.listDoctors({ specialty: "cardiology" })).results.total).toBe(1);
    expect((await services.doctors.listDoctors({ specialty: "dentistry" })).results.total).toBe(0);
    expect((await services.doctors.listDoctors({ hospital: "central-heart-hospital-dhaka" })).results.total).toBe(1);
    expect((await services.doctors.listDoctors({ hospital: "harbour-hospital-chattogram" })).results.total).toBe(0);
    expect((await services.doctors.listDoctors({ location: "chattogram" })).results.total).toBe(0);
  });

  it("builds a title and a JSON-LD Physician with only real fields", async () => {
    const detail = (await services.doctors.getDoctorDetail("dr-test-example"))!;
    expect(doctorTitle(detail)).toMatch(/^Dr\. Test Example — Cardiologist in /);
    const ld = doctorJsonLd(detail);
    expect(ld["@type"]).toBe("Physician");
    expect(ld).not.toHaveProperty("aggregateRating");
    expect(ld).not.toHaveProperty("telephone");
    expect(ld).not.toHaveProperty("description");
  });
});

describe("SearchService: doctors at a facility", () => {
  it("shows the facility and its doctors for 'doctors at <facility>'", async () => {
    const r = await services.search.searchAll("Doctors at Central Heart Hospital");
    expect(r.intent.facility?.slug).toBe("central-heart-hospital-dhaka");
    expect(r.doctors.items.map((i) => i.doctor.slug)).toEqual(["dr-test-example"]);
    expect(r.facilities.items.map((i) => i.facility.slug)).toEqual(["central-heart-hospital-dhaka"]);
    expect(r.medicines.total).toBe(0);
  });

  it("returns no doctors for a facility where none consult", async () => {
    const r = await services.search.searchAll("doctors at Harbour Hospital");
    expect(r.intent.facility?.slug).toBe("harbour-hospital-chattogram");
    expect(r.doctors.total).toBe(0);
    expect(r.facilities.total).toBe(1);
  });

  it("finds cardiologists in a place", async () => {
    const r = await services.search.searchAll("Cardiologist in Gulshan");
    expect(r.intent.location?.slug).toBe("gulshan");
    expect(r.doctors.items.map((i) => i.doctor.slug)).toEqual(["dr-test-example"]);
  });
});
