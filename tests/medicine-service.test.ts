import { describe, expect, it } from "vitest";
import { createLocalRepositories } from "@/data/local/repositories";
import { MedicineService } from "@/services/medicine-service";
import { computePriceStats } from "@/services/summaries";
import { fixtureDataset } from "./fixtures";

const service = new MedicineService(createLocalRepositories(fixtureDataset));

describe("MedicineService", () => {
  it("returns null for an unknown slug", async () => {
    expect(await service.getMedicineDetail("does-not-exist")).toBeNull();
  });

  it("returns medicine detail with generic and manufacturer", async () => {
    const detail = await service.getMedicineDetail("napa-500mg");
    expect(detail?.medicine.id).toBe("m1");
    expect(detail?.generic.name).toBe("Paracetamol");
    expect(detail?.manufacturer.name).toBe("Maker Ltd.");
  });

  it("sorts prices from lowest to highest with pharmacy details", async () => {
    const detail = await service.getMedicineDetail("napa-500mg");
    expect(detail?.prices.map((p) => [p.pharmacy.slug, p.price.amount])).toEqual([
      ["beta-pharmacy", 11.5],
      ["alpha-pharmacy", 12],
    ]);
    expect(detail?.priceStats).toEqual({
      lowest: 11.5,
      highest: 12,
      count: 2,
      hasSampleData: true,
    });
    expect(detail?.hasSampleData).toBe(true);
  });

  it("lists alternatives with the same generic, strength and dosage form only", async () => {
    const detail = await service.getMedicineDetail("napa-500mg");
    // Excludes itself and the suspension (different form/strength) and other generics.
    expect(detail?.alternatives.map((a) => a.medicine.slug)).toEqual([
      "ace-500mg",
      "napadol-500mg",
    ]);
  });

  it("includes sample price ranges for alternatives", async () => {
    const detail = await service.getMedicineDetail("napa-500mg");
    const ace = detail?.alternatives.find((a) => a.medicine.slug === "ace-500mg");
    expect(ace?.priceStats).toEqual({ lowest: 12, highest: 12, count: 1, hasSampleData: true });
    const napadol = detail?.alternatives.find((a) => a.medicine.slug === "napadol-500mg");
    expect(napadol?.priceStats).toBeNull();
  });

  it("lists other strengths and forms of the same generic separately", async () => {
    const detail = await service.getMedicineDetail("napa-500mg");
    expect(detail?.otherForms.map((a) => a.medicine.slug)).toEqual(["napa-120mg-5ml-suspension"]);
  });

  it("handles medicines without prices or alternatives", async () => {
    const detail = await service.getMedicineDetail("seclo-20mg");
    expect(detail?.prices).toEqual([]);
    expect(detail?.priceStats).toBeNull();
    expect(detail?.alternatives).toEqual([]);
    expect(detail?.otherForms).toEqual([]);
    expect(detail?.hasSampleData).toBe(false);
  });

  it("lists popular medicines in curated order, skipping unknown ids", async () => {
    const popular = await service.listPopularMedicines();
    expect(popular.map((p) => p.medicine.slug)).toEqual(["ace-500mg", "napa-500mg"]);
    expect(popular[1]?.priceStats?.lowest).toBe(11.5);
  });

  it("lists the medicine index for static params and the sitemap", async () => {
    const index = await service.listMedicineIndex();
    expect(index).toHaveLength(fixtureDataset.medicines.length);
    expect(index[0]).toEqual({ slug: "napa-500mg", updatedAt: "2026-10-01T00:00:00Z" });
  });

  it("skips records with broken references instead of failing", async () => {
    const broken = createLocalRepositories({
      ...fixtureDataset,
      prices: [
        ...fixtureDataset.prices,
        { ...fixtureDataset.prices[0]!, id: "orphan", pharmacyId: "no-such-pharmacy" },
      ],
    });
    const detail = await new MedicineService(broken).getMedicineDetail("napa-500mg");
    expect(detail?.prices).toHaveLength(2);
  });

  it("computes price stats", () => {
    expect(computePriceStats([])).toBeNull();
  });
});
