import { describe, expect, it } from "vitest";
import type { LocalDataset } from "@/data/local/dataset";
import { createLocalRepositories } from "@/data/local/repositories";
import type { Medicine } from "@/domain/types";
import { SEO_THRESHOLDS } from "@/lib/seo-config";
import { compareStrengths, GenericService, genericIngredients } from "@/services/generic-service";
import { fixtureDataset } from "./fixtures";

const service = new GenericService(createLocalRepositories(fixtureDataset));

function med(id: string, genericId: string, brandName: string): Medicine {
  return {
    id,
    slug: id,
    brandName,
    genericId,
    manufacturerId: "mf1",
    strength: "500 mg",
    dosageForm: "tablet",
    dosageFormLabel: "Tablet",
    updatedAt: "2026-10-01T00:00:00Z",
    provenance: { sourceId: "src1", recordId: id, status: "registered" },
  };
}

/** Fixture plus combination and look-alike generics (name matching must be exact per ingredient). */
const withCombinations: LocalDataset = {
  ...fixtureDataset,
  generics: [
    ...fixtureDataset.generics,
    { id: "g3", slug: "caffeine-paracetamol", name: "Caffeine + Paracetamol" },
    { id: "g4", slug: "caffeine", name: "Caffeine" },
    { id: "g5", slug: "esomeprazole", name: "Esomeprazole" },
    { id: "g6", slug: "levocetrizine-dihydrochloride", name: "Levocetrizine Dihydrochloride" },
    { id: "g7", slug: "levocetirizine-hydrochloride", name: "Levocetirizine Hydrochloride" },
    { id: "g8", slug: "levocetirizine-montelukast", name: "Levocetirizine Hydrochloride + Montelukast" },
    { id: "g9", slug: "unused", name: "Unused" },
  ],
  medicines: [
    ...fixtureDataset.medicines,
    med("c1", "g3", "Napa Extra"),
    med("c2", "g4", "Cafo"),
    med("c3", "g5", "Maxpro"),
    med("c4", "g6", "Levo A"),
    med("c5", "g7", "Levo B"),
    med("c6", "g8", "Monas L"),
  ],
};
const combos = new GenericService(createLocalRepositories(withCombinations));

describe("GenericService", () => {
  it("returns null for unknown slugs and generics without products", async () => {
    expect(await service.getGenericDetail("does-not-exist")).toBeNull();
    expect(await combos.getGenericDetail("unused")).toBeNull();
  });

  it("groups products by dosage form, form label and strength", async () => {
    const detail = await service.getGenericDetail("paracetamol");
    expect(detail?.productCount).toBe(5);
    expect(detail?.companyCount).toBe(1);
    // Napa, Ace, Napadol, Napa SR (Napa counted once).
    expect(detail?.brandCount).toBe(4);
    expect(detail?.groups.map((g) => [g.dosageFormLabel, g.strength, g.products.map((p) => p.medicine.brandName)])).toEqual([
      ["SR Tablet", "500 mg", ["Napa SR"]],
      ["Tablet", "500 mg", ["Ace", "Napa", "Napadol"]],
      ["Suspension", "120 mg/5 mL", ["Napa"]],
    ]);
    expect(detail?.groups[1]?.products[0]?.manufacturer.name).toBe("Maker Ltd.");
    expect(detail?.forms).toEqual([
      { form: "tablet", count: 4 },
      { form: "suspension", count: 1 },
    ]);
    expect(detail?.strengths).toEqual(["120 mg/5 mL", "500 mg"]);
    expect(detail?.topCompanies.map((c) => [c.manufacturer.slug, c.count])).toEqual([["maker", 5]]);
    expect(detail?.sources.map((s) => s.id)).toEqual(["src1"]);
  });

  it("marks pages below the catalogue threshold as not indexable", async () => {
    expect(SEO_THRESHOLDS.minCatalogProducts).toBe(2);
    expect((await service.getGenericDetail("paracetamol"))?.indexable).toBe(true);
    expect((await service.getGenericDetail("omeprazole"))?.indexable).toBe(false);
    expect((await service.listIndexable()).map((e) => e.generic.slug)).toEqual(["paracetamol"]);
  });

  it("lists top generics by product count", async () => {
    expect((await service.listTopGenerics(1)).map((e) => [e.generic.slug, e.productCount])).toEqual([["paracetamol", 5]]);
  });

  it("relates combinations and ingredients by exact ingredient name", async () => {
    const paracetamol = await combos.getGenericDetail("paracetamol");
    expect(paracetamol?.combinations.map((e) => e.generic.slug)).toEqual(["caffeine-paracetamol"]);
    expect(paracetamol?.ingredients).toEqual([]);

    const combination = await combos.getGenericDetail("caffeine-paracetamol");
    expect(combination?.ingredients.map((e) => e.generic.slug)).toEqual(["caffeine", "paracetamol"]);
    expect(combination?.combinations).toEqual([]);

    // "Omeprazole" is not an ingredient of "Esomeprazole".
    expect((await combos.getGenericDetail("omeprazole"))?.combinations).toEqual([]);
  });

  it("handles name variants of the same ingredient without crashing", async () => {
    const misspelled = await combos.getGenericDetail("levocetrizine-dihydrochloride");
    expect(misspelled?.combinations).toEqual([]);
    const salt = await combos.getGenericDetail("levocetirizine-hydrochloride");
    expect(salt?.combinations.map((e) => e.generic.slug)).toEqual(["levocetirizine-montelukast"]);
    // Montelukast has no own generic in this dataset: only the matching ingredient is listed.
    const combination = await combos.getGenericDetail("levocetirizine-montelukast");
    expect(combination?.ingredients.map((e) => e.generic.slug)).toEqual(["levocetirizine-hydrochloride"]);
  });
});

describe("generic helpers", () => {
  it("splits combination names into ingredients", () => {
    expect(genericIngredients("Caffeine + Paracetamol")).toEqual(["caffeine", "paracetamol"]);
    expect(genericIngredients("Paracetamol")).toEqual(["paracetamol"]);
  });

  it("orders strengths naturally", () => {
    expect(["500 mg", "20 mg", "", "1.5 g", "5 mg"].sort(compareStrengths)).toEqual(["1.5 g", "5 mg", "20 mg", "500 mg", ""]);
  });
});
