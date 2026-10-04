import { describe, expect, it } from "vitest";
import { createLocalRepositories } from "@/data/local/repositories";
import { fixtureDataset } from "./fixtures";

const repos = createLocalRepositories(fixtureDataset);

describe("local repositories", () => {
  it("looks up medicines by slug and ids", async () => {
    expect((await repos.medicines.findBySlug("ace-500mg"))?.id).toBe("m2");
    expect(await repos.medicines.findBySlug("nope")).toBeNull();
    const byIds = await repos.medicines.findByIds(["m4", "m1", "m1", "missing"]);
    expect(byIds.map((m) => m.id)).toEqual(["m4", "m1"]);
  });

  it("finds medicines by generic in deterministic order", async () => {
    const list = await repos.medicines.findByGeneric("g1");
    expect(list.map((m) => m.slug)).toEqual([
      "ace-500mg",
      "napa-500mg",
      "napa-120mg-5ml-suspension",
      "napadol-500mg",
    ]);
  });

  it("paginates search results", async () => {
    const page1 = await repos.medicines.search({ query: "napa", page: 1, pageSize: 2 });
    const page2 = await repos.medicines.search({ query: "napa", page: 2, pageSize: 2 });
    expect(page1.total).toBe(3);
    expect(page1.items).toHaveLength(2);
    expect(page2.items.map((m) => m.slug)).toEqual(["napadol-500mg"]);
  });

  it("looks up pharmacies", async () => {
    expect((await repos.pharmacies.findBySlug("beta-pharmacy"))?.id).toBe("p2");
    expect(await repos.pharmacies.findBySlug("missing")).toBeNull();
  });

  it("looks up prices by medicine, medicines and pharmacy", async () => {
    expect((await repos.prices.listByMedicine("m1")).map((p) => p.id)).toEqual(["pr1", "pr2"]);
    expect((await repos.prices.listByMedicines(["m1", "m2"])).map((p) => p.id)).toEqual([
      "pr1",
      "pr2",
      "pr3",
    ]);
    expect((await repos.prices.listByPharmacy("p1")).map((p) => p.id)).toEqual(["pr1", "pr3"]);
    expect(await repos.prices.listByMedicine("m4")).toEqual([]);
  });

  it("returns copies so callers cannot mutate the dataset", async () => {
    const prices = await repos.prices.listByMedicine("m1");
    prices.pop();
    expect(await repos.prices.listByMedicine("m1")).toHaveLength(2);
  });
});
