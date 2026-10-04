import { describe, expect, it } from "vitest";
import { seedDataset } from "@/data/local/dataset";
import { AVAILABILITY_STATUSES, DOSAGE_FORMS, PRICE_SOURCES } from "@/domain/types";

const { generics, manufacturers, medicines, pharmacies, prices, popularMedicineIds } = seedDataset;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function duplicates(values: readonly string[]): string[] {
  return values.filter((v, i) => values.indexOf(v) !== i);
}

describe("seed data integrity", () => {
  it("has unique ids and slugs per entity", () => {
    for (const list of [generics, manufacturers, medicines, pharmacies]) {
      expect(duplicates(list.map((x) => x.id))).toEqual([]);
      expect(duplicates(list.map((x) => x.slug))).toEqual([]);
      for (const item of list) expect(item.slug).toMatch(SLUG);
    }
    expect(duplicates(prices.map((p) => p.id))).toEqual([]);
  });

  it("medicines reference existing generics and manufacturers with valid enums", () => {
    const genericIds = new Set(generics.map((g) => g.id));
    const manufacturerIds = new Set(manufacturers.map((m) => m.id));
    for (const m of medicines) {
      expect(genericIds.has(m.genericId), `${m.id} genericId`).toBe(true);
      expect(manufacturerIds.has(m.manufacturerId), `${m.id} manufacturerId`).toBe(true);
      expect(DOSAGE_FORMS).toContain(m.dosageForm);
      expect(m.packSize.quantity).toBeGreaterThan(0);
      expect(Number.isNaN(Date.parse(m.updatedAt))).toBe(false);
    }
  });

  it("prices reference existing records, are positive and are marked as sample data", () => {
    const medicineIds = new Set(medicines.map((m) => m.id));
    const pharmacyIds = new Set(pharmacies.map((p) => p.id));
    for (const p of prices) {
      expect(medicineIds.has(p.medicineId), `${p.id} medicineId`).toBe(true);
      expect(pharmacyIds.has(p.pharmacyId), `${p.id} pharmacyId`).toBe(true);
      expect(p.amount).toBeGreaterThan(0);
      expect(p.currency).toBe("BDT");
      expect(AVAILABILITY_STATUSES).toContain(p.availability);
      expect(PRICE_SOURCES).toContain(p.source);
      // Phase 1 has no real price data.
      expect(p.source).toBe("sample");
    }
  });

  it("has a Phase-1 sized dataset", () => {
    expect(medicines.length).toBeGreaterThan(75);
    expect(pharmacies).toHaveLength(10);
    expect(prices.length).toBeGreaterThan(450);
  });

  it("pharmacies have location details and are marked fictional", () => {
    for (const p of pharmacies) {
      expect(p.address, p.id).toBeTruthy();
      expect(p.city, p.id).toBeTruthy();
      expect(p.description ?? "").toMatch(/fictional/i);
    }
  });

  it("popular medicines exist", () => {
    const ids = new Set(medicines.map((m) => m.id));
    expect(popularMedicineIds.length).toBeGreaterThan(0);
    for (const id of popularMedicineIds) expect(ids.has(id), id).toBe(true);
  });

  it("has at most one price per medicine and pharmacy", () => {
    expect(duplicates(prices.map((p) => `${p.medicineId}:${p.pharmacyId}`))).toEqual([]);
  });
});
