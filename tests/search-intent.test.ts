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
