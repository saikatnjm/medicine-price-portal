import { describe, expect, it } from "vitest";
import { createLocalRepositories } from "@/data/local/repositories";
import { PharmacyService } from "@/services/pharmacy-service";
import { fixtureDataset } from "./fixtures";

const service = new PharmacyService(createLocalRepositories(fixtureDataset));

describe("PharmacyService", () => {
  it("returns null for an unknown pharmacy", async () => {
    expect(await service.getPharmacyDetail("missing")).toBeNull();
  });

  it("returns pharmacy prices sorted by brand name", async () => {
    const detail = await service.getPharmacyDetail("alpha-pharmacy");
    expect(detail?.prices.map((p) => p.medicine.slug)).toEqual(["ace-500mg", "napa-500mg"]);
    expect(detail?.hasSampleData).toBe(true);
  });

  it("lists all pharmacies sorted by name", async () => {
    const pharmacies = await service.listPharmacies();
    expect(pharmacies.map((p) => p.slug)).toEqual(["alpha-pharmacy", "beta-pharmacy"]);
  });

  it("returns an empty price list for a pharmacy without prices", async () => {
    const repos = createLocalRepositories({ ...fixtureDataset, prices: [] });
    const detail = await new PharmacyService(repos).getPharmacyDetail("beta-pharmacy");
    expect(detail?.prices).toEqual([]);
    expect(detail?.hasSampleData).toBe(false);
  });
});
