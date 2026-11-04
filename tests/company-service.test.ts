import { describe, expect, it } from "vitest";
import { createLocalRepositories } from "@/data/local/repositories";
import type { LocalDataset } from "@/data/local/dataset";
import { companyPage, dosageFormPage, parsePageSegment } from "@/lib/routes-catalog";
import { CompanyService, paginate } from "@/services/company-service";
import { fixtureDataset } from "./fixtures";

// One extra company with a single product (below the indexing threshold).
const dataset: LocalDataset = {
  ...fixtureDataset,
  manufacturers: [...fixtureDataset.manufacturers, { id: "mf2", slug: "solo", name: "Solo Pharma Ltd." }],
  medicines: [
    ...fixtureDataset.medicines,
    {
      id: "m7",
      slug: "solo-1g-powder",
      brandName: "Solo",
      genericId: "g1",
      manufacturerId: "mf2",
      strength: "1 g",
      dosageForm: "powder",
      dosageFormLabel: "Powder",
      updatedAt: "2026-10-01T00:00:00Z",
      provenance: { sourceId: "src1", recordId: "m7", status: "registered" },
    },
  ],
};

const service = new CompanyService(createLocalRepositories(dataset), 2);

describe("CompanyService company pages", () => {
  it("groups products by generic (sorted by generic name) and paginates", async () => {
    const detail = await service.getCompanyDetail("maker");
    expect(detail?.productCount).toBe(6);
    expect(detail?.genericCount).toBe(2);
    expect(detail?.pagination).toEqual({ page: 1, totalPages: 3, pageSize: 2, offset: 0 });
    expect(detail?.groups.map((g) => [g.generic.name, g.products.map((m) => m.brandName)])).toEqual([
      ["Omeprazole", ["Seclo"]],
      ["Paracetamol", ["Ace"]],
    ]);
    expect(detail?.forms).toEqual([
      { item: "tablet", count: 4 },
      { item: "capsule", count: 1 },
      { item: "suspension", count: 1 },
    ]);
    expect(detail?.topGenerics.map((g) => [g.item.name, g.count])).toEqual([
      ["Paracetamol", 5],
      ["Omeprazole", 1],
    ]);
    const last = await service.getCompanyDetail("maker", 3);
    expect(last?.groups.flatMap((g) => g.products).length).toBe(2);
    expect(last?.groups.every((g) => g.generic.name === "Paracetamol")).toBe(true);
  });

  it("returns null for unknown companies and out-of-range pages", async () => {
    expect(await service.getCompanyDetail("no-such-company")).toBeNull();
    expect(await service.getCompanyDetail("maker", 0)).toBeNull();
    expect(await service.getCompanyDetail("maker", 4)).toBeNull();
    expect(await service.getCompanyDetail("maker", 1.5)).toBeNull();
  });

  it("marks companies below the product threshold as not indexable", async () => {
    expect((await service.getCompanyDetail("maker"))?.indexable).toBe(true);
    expect((await service.getCompanyDetail("solo"))?.indexable).toBe(false);
    expect((await service.listIndexable()).map((e) => e.manufacturer.slug)).toEqual(["maker"]);
  });

  it("ranks companies by product count", async () => {
    expect((await service.listRanked()).map((e) => [e.manufacturer.slug, e.productCount])).toEqual([
      ["maker", 6],
      ["solo", 1],
    ]);
  });
});

describe("CompanyService dosage-form pages", () => {
  it("summarises a form and lists brands by page", async () => {
    const detail = await service.getDosageFormDetail("tablet");
    expect(detail?.productCount).toBe(4);
    expect(detail?.companyCount).toBe(1);
    expect(detail?.labels).toEqual([
      { item: "Tablet", count: 3 },
      { item: "SR Tablet", count: 1 },
    ]);
    expect(detail?.topCompanies.map((c) => c.item.slug)).toEqual(["maker"]);
    expect(detail?.products.map((p) => p.medicine.brandName)).toEqual(["Ace", "Napa"]);
    expect(detail?.products[0]?.generic.name).toBe("Paracetamol");
    expect((await service.getDosageFormDetail("tablet", 2))?.products.length).toBe(2);
    expect(await service.getDosageFormDetail("tablet", 3)).toBeNull();
  });

  it("returns null for unknown or empty forms", async () => {
    expect(await service.getDosageFormDetail("pills")).toBeNull();
    expect(await service.getDosageFormDetail("patch")).toBeNull();
  });

  it("lists paginated pages (2..N) of indexable companies and forms for the sitemap", async () => {
    expect(await service.listIndexablePages()).toEqual([
      { type: "company", slug: "maker", page: 2 },
      { type: "company", slug: "maker", page: 3 },
      { type: "dosageForm", slug: "tablet", page: 2 },
    ]);
  });
});

describe("catalogue pagination helpers", () => {
  it("bounds pages", () => {
    expect(paginate(0, 1, 200)).toEqual({ page: 1, totalPages: 1, pageSize: 200, offset: 0 });
    expect(paginate(401, 3, 200)?.offset).toBe(400);
    expect(paginate(400, 3, 200)).toBeNull();
  });

  it("builds and parses path-segment page URLs", () => {
    expect(companyPage("square", 1)).toBe("/companies/square");
    expect(companyPage("square", 2)).toBe("/companies/square/2");
    expect(dosageFormPage("tablet", 5)).toBe("/dosage-forms/tablet/5");
    expect(parsePageSegment("2")).toBe(2);
    expect(parsePageSegment("15")).toBe(15);
    for (const bad of ["1", "0", "01", "-2", "2.0", "abc", ""]) expect(parsePageSegment(bad)).toBeNull();
  });
});
