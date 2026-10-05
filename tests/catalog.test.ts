import { describe, expect, it } from "vitest";
import { seedDataset } from "@/data/local/dataset";
import { createLocalRepositories } from "@/data/local/repositories";
import { DOSAGE_FORMS } from "@/domain/types";
import { SearchService } from "@/services/search-service";
import { validateDataset } from "../scripts/data/validate-data.mjs";

/** Tests against the real, generated DGDA catalogue in src/data/local/seed. */
const {
  medicines,
  generics,
  manufacturers,
  sources,
  pharmacies,
  prices,
  popularMedicineIds,
  facilities,
  locations,
  specialties,
  doctors,
} = seedDataset;
const search = new SearchService(createLocalRepositories(seedDataset));
const genericName = new Map(generics.map((g) => [g.id, g.name.toLowerCase()]));

describe("real medicine catalogue", () => {
  it("loads at least 1,000 valid medicine products and a valid directory", () => {
    expect(medicines.length).toBeGreaterThanOrEqual(1000);
    const { errors } = validateDataset({
      medicines,
      generics,
      manufacturers,
      sources,
      pharmacies,
      prices,
      popular: popularMedicineIds,
      facilities,
      locations,
      specialties,
      doctors,
    });
    expect(errors).toEqual([]);
  });

  it("has required fields, controlled dosage forms and traceable provenance", () => {
    const sourceIds = new Set(sources.map((s) => s.id));
    for (const m of medicines) {
      expect(
        m.brandName && m.genericId && m.manufacturerId && m.dosageFormLabel,
        m.id,
      ).toBeTruthy();
      expect(DOSAGE_FORMS).toContain(m.dosageForm);
      expect(sourceIds.has(m.provenance.sourceId), m.id).toBe(true);
      expect(m.provenance.recordId, m.id).toBeTruthy();
      expect(m.provenance.status).toBe("registered");
    }
  });

  it("does not invent prices, doctors, pharmacies or unpublished fields", () => {
    expect(prices).toEqual([]);
    expect(doctors).toEqual([]);
    // Pharmacies and facilities come only from OpenStreetMap and stay unverified.
    for (const record of [...pharmacies, ...facilities]) {
      expect(record.provenance.sourceId).toBe("osm");
      expect(record.provenance.status).toBe("unverified");
    }
    expect(medicines.some((m) => m.packSize || m.prescriptionRequired !== undefined)).toBe(false);
    expect(medicines.some((m) => m.description || m.category)).toBe(false);
  });

  it("has the homepage examples", () => {
    expect(popularMedicineIds).toHaveLength(8);
    const napa = medicines.find((m) => m.slug === "napa-500mg");
    expect(napa?.brandName).toBe("Napa");
    expect(genericName.get(napa?.genericId ?? "")).toBe("paracetamol");
  });
});

describe("search against the real catalogue", () => {
  const firstBrand = async (q: string) =>
    (await search.searchMedicines(q)).items[0]?.medicine.brandName;

  it("finds brands case-insensitively", async () => {
    expect(await firstBrand("Napa")).toBe("Napa");
    expect(await firstBrand("napa")).toBe("Napa");
    expect(await firstBrand("NAPA")).toBe("Napa");
    expect(await firstBrand("Ace")).toBe("Ace");
  });

  it.each([
    "Paracetamol",
    "Omeprazole",
    "Esomeprazole",
    "Azithromycin",
    "Amoxicillin",
    "Amlodipine",
    "Losartan",
    "Metformin",
  ])("finds medicines containing %s", async (query) => {
    const result = await search.searchMedicines(query);
    expect(result.total).toBeGreaterThan(20);
    for (const item of result.items) {
      const haystack = `${item.medicine.brandName} ${item.generic.name}`.toLowerCase();
      expect(haystack, item.medicine.slug).toContain(query.toLowerCase().slice(0, 6));
    }
  });

  it("supports partial and multi-word queries", async () => {
    expect((await search.searchMedicines("para")).total).toBeGreaterThan(100);
    const extra = await search.searchMedicines("Napa Extra");
    expect(extra.total).toBeGreaterThan(0);
    expect(extra.items[0]?.medicine.brandName.toLowerCase()).toContain("napa");
  });

  it("is fast enough for on-request server search", async () => {
    await search.searchMedicines("warm up index");
    const queries = ["napa", "paracetamol", "para", "omeprazole 20", "amlo", "xyznotfound"];
    const start = performance.now();
    for (const q of queries) await search.searchMedicines(q);
    const perQuery = (performance.now() - start) / queries.length;
    expect(perQuery).toBeLessThan(250);
  });
});
