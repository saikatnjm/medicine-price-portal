import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { createLocalRepositories } from "@/data/local/repositories";
import { parseSearchIntent, singular, isStructured } from "@/services/search-intent";
import { PlaceResolver } from "@/services/places";
import type { Specialty } from "@/domain/healthcare";
import type { SearchIntent } from "@/domain/read-models";
import { fixtureDataset } from "./fixtures";

const repos = createLocalRepositories(fixtureDataset);
const places: PlaceResolver = await PlaceResolver.create(repos);
const specialties: Specialty[] = await repos.specialties.listAll();

const parse = (q: string) => parseSearchIntent(q, places, specialties);
const summary = (i: SearchIntent) => ({
  text: i.text,
  entity: i.entity,
  specialty: i.specialty?.slug ?? null,
  location: i.location?.slug ?? null,
});

describe("singular", () => {
  it("handles plurals conservatively", () => {
    expect(singular("cardiologists")).toBe("cardiologist");
    expect(singular("pharmacies")).toBe("pharmacy");
    expect(singular("hospitals")).toBe("hospital");
  });

  it("leaves short words, -ss words and non-plurals alone", () => {
    expect(singular("gas")).toBe("gas");
    expect(singular("class")).toBe("class");
    expect(singular("ies")).toBe("ies");
    expect(singular("heart")).toBe("heart");
  });
});

describe("parseSearchIntent", () => {
  it("recognises a practitioner title as doctor + specialty", () => {
    expect(summary(parse("Cardiologist"))).toEqual({ text: "", entity: "doctor", specialty: "cardiology", location: null });
    expect(summary(parse("Cardiologists"))).toEqual({ text: "", entity: "doctor", specialty: "cardiology", location: null });
  });

  it("extracts a location after 'in'", () => {
    expect(summary(parse("cardiologists in gulshan"))).toEqual({
      text: "",
      entity: "doctor",
      specialty: "cardiology",
      location: "gulshan",
    });
  });

  it("prefers the district over the same-named division", () => {
    expect(summary(parse("Hospitals in Dhaka"))).toEqual({ text: "", entity: "hospital", specialty: null, location: "dhaka" });
  });

  it("extracts a trailing location", () => {
    expect(summary(parse("pharmacy gulshan"))).toEqual({ text: "", entity: "pharmacy", specialty: null, location: "gulshan" });
  });

  it("treats a bare place name as a location", () => {
    expect(summary(parse("Dhanmondi"))).toEqual({ text: "", entity: null, specialty: null, location: "dhanmondi" });
  });

  it("does not treat an alias as a specialty when other text remains", () => {
    expect(summary(parse("Central Heart"))).toEqual({ text: "central heart", entity: null, specialty: null, location: null });
  });

  it("accepts an alias when only entity words remain", () => {
    expect(summary(parse("heart hospital"))).toEqual({ text: "", entity: "hospital", specialty: "cardiology", location: null });
  });

  it("keeps plain text as text", () => {
    const intent = parse("Napa");
    expect(summary(intent)).toEqual({ text: "napa", entity: null, specialty: null, location: null });
    expect(isStructured(intent)).toBe(false);
  });

  it("drops stop words and lets entity words coexist with text", () => {
    expect(summary(parse("best hospital"))).toEqual({ text: "", entity: "hospital", specialty: null, location: null });
    expect(summary(parse("Dr. Test"))).toEqual({ text: "test", entity: "doctor", specialty: null, location: null });
  });

  it("does not resolve an unknown place after 'in'", () => {
    expect(summary(parse("hospital in atlantis"))).toEqual({ text: "atlantis", entity: "hospital", specialty: null, location: null });
  });

  it("reports structure only when something was recognised", () => {
    expect(isStructured(parse("cardiologists in gulshan"))).toBe(true);
    expect(isStructured(parse("Dhanmondi"))).toBe(true);
  });
});

const facilities = await repos.facilities.listAll();

describe("parseSearchIntent: specialty in place, doctor at facility", () => {
  const byName = (name: string) => facilities.find((f) => f.name.toLowerCase() === name) ?? null;
  const withFacilities = (q: string) => parseSearchIntent(q, places, specialties, byName);

  it("parses 'Cardiologist in Dhaka' and 'Cardiologist in Dhanmondi'", () => {
    expect(summary(parse("Cardiologist in Dhaka"))).toEqual({ text: "", entity: "doctor", specialty: "cardiology", location: "dhaka" });
    expect(summary(parse("Cardiologist in Dhanmondi"))).toEqual({ text: "", entity: "doctor", specialty: "cardiology", location: "dhanmondi" });
  });

  it("parses 'Dermatologist in Dhanmondi' against the real specialty taxonomy", () => {
    const real = JSON.parse(readFileSync("src/data/local/seed/specialties.json", "utf8")) as Specialty[];
    const intent = parseSearchIntent("Dermatologist in Dhanmondi", places, real);
    expect(summary(intent)).toEqual({ text: "", entity: "doctor", specialty: "dermatology", location: "dhanmondi" });
  });

  it("resolves 'doctors at <facility name>' to the facility", () => {
    const intent = withFacilities("Doctors at Central Heart Hospital");
    expect(intent.facility?.slug).toBe("central-heart-hospital-dhaka");
    expect(summary(intent)).toEqual({ text: "", entity: "doctor", specialty: null, location: null });
    expect(isStructured(intent)).toBe(true);
  });

  it("combines a specialty with a facility", () => {
    const intent = withFacilities("cardiologist at central heart hospital");
    expect(intent.facility?.slug).toBe("central-heart-hospital-dhaka");
    expect(intent.specialty?.slug).toBe("cardiology");
  });

  it("prefers a location over a facility, and ignores unknown facilities", () => {
    expect(withFacilities("doctors at gulshan").facility).toBeUndefined();
    expect(withFacilities("doctors at gulshan").location?.slug).toBe("gulshan");
    expect(withFacilities("doctors at nowhere hospital").facility).toBeUndefined();
    expect(parse("doctors at central heart hospital").facility).toBeUndefined();
  });
});
