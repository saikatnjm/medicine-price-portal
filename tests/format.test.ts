import { describe, expect, it } from "vitest";
import {
  formatAvailability,
  formatDate,
  formatDosageForm,
  formatPackSize,
  formatPrice,
  formatPriceRange,
  formatUnitPrice,
} from "@/lib/format";
import { normalizeSearchText } from "@/lib/text";
import { fixtureDataset } from "./fixtures";

describe("formatting", () => {
  it("formats BDT prices", () => {
    expect(formatPrice(12)).toBe("৳12.00");
    expect(formatPrice(1234.5)).toBe("৳1,234.50");
  });

  it("formats price ranges", () => {
    expect(formatPriceRange({ lowest: 11, highest: 12, count: 2, hasSampleData: true })).toBe(
      "৳11.00–৳12.00",
    );
    expect(formatPriceRange({ lowest: 12, highest: 12, count: 1, hasSampleData: true })).toBe(
      "৳12.00",
    );
  });

  it("formats unit prices only for countable forms", () => {
    const tablet = fixtureDataset.medicines[0]!;
    const suspension = fixtureDataset.medicines[2]!;
    expect(formatUnitPrice(12, tablet)).toBe("৳1.20 per tablet");
    expect(formatUnitPrice(35, suspension)).toBeNull();
  });

  it("formats dosage forms and pack sizes", () => {
    expect(formatDosageForm("suspension")).toBe("Oral suspension");
    expect(formatPackSize({ quantity: 10, unit: "tablets" })).toBe("10 tablets");
  });

  it("gives availability a text label", () => {
    expect(formatAvailability("out_of_stock")).toBe("Out of stock");
  });

  it("formats dates in Dhaka time", () => {
    expect(formatDate("2026-09-30T20:00:00Z")).toBe("1 Oct 2026");
  });

  it("normalises search text", () => {
    expect(normalizeSearchText("  Napa-Extra   500MG ")).toBe("napa extra 500mg");
  });
});
