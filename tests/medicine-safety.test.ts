import { describe, expect, it } from "vitest";
import { createLocalRepositories } from "@/data/local/repositories";
import { seedDataset } from "@/data/local/dataset";
import { hasSafetyContent, SAFETY_SOURCE_TYPES, type MedicineSafetyInfo } from "@/domain/medicine-safety";
import { MedicineService } from "@/services/medicine-service";
import { fixtureDataset } from "./fixtures";

/** Fictional test record (the real dataset only ever contains licensed, cited text). */
const record: MedicineSafetyInfo = {
  genericSlug: "paracetamol",
  genericName: "Paracetamol",
  description: null,
  uses: ["Test use"],
  mechanism: null,
  commonSideEffects: ["Test common effect"],
  seriousSideEffects: null,
  seekHelpIf: null,
  warnings: null,
  contraindications: null,
  interactions: null,
  pregnancyInfo: null,
  breastfeedingInfo: null,
  storage: null,
  source: "Test source",
  sourceUrl: "https://example.org/test",
  sourceType: "public_health",
  sourceUpdatedAt: null,
  lastCheckedAt: "2026-10-07",
  verificationStatus: "source_cited",
  licenceNote: "Test licence",
};

function serviceWith(safety: MedicineSafetyInfo[]) {
  return new MedicineService(createLocalRepositories({ ...fixtureDataset, safety }));
}

describe("medicine safety information", () => {
  it("is null when no reviewed record exists", async () => {
    expect((await serviceWith([]).getMedicineDetail("napa-500mg"))?.safety).toBeNull();
  });

  it("is attached by generic, with its source", async () => {
    const detail = await serviceWith([record]).getMedicineDetail("napa-500mg");
    expect(detail?.safety?.source).toBe("Test source");
    expect(detail?.safety?.commonSideEffects).toEqual(["Test common effect"]);
  });

  it("never serves records that need review, lack a licence note, or are empty", async () => {
    for (const bad of [
      { ...record, verificationStatus: "needs_review" as const },
      { ...record, licenceNote: "" },
      { ...record, uses: null, commonSideEffects: null },
    ]) {
      expect((await serviceWith([bad]).getMedicineDetail("napa-500mg"))?.safety).toBeNull();
    }
    expect(hasSafetyContent({ ...record, uses: [], commonSideEffects: [] })).toBe(false);
  });

  it("seed records are cited, licensed and use a known source type", () => {
    for (const info of seedDataset.safety ?? []) {
      expect(info.sourceUrl).toMatch(/^https:\/\//);
      expect(info.licenceNote.length).toBeGreaterThan(0);
      expect(SAFETY_SOURCE_TYPES).toContain(info.sourceType);
    }
  });
});
