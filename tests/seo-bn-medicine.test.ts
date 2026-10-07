import { describe, expect, it } from "vitest";
import { createLocalRepositories } from "@/data/local/repositories";
import { medicineDescription, medicineJsonLd, medicineTitle } from "@/lib/seo";
import { MedicineService } from "@/services/medicine-service";
import { fixtureDataset } from "./fixtures";

const service = new MedicineService(createLocalRepositories(fixtureDataset));

describe("Bangla medicine SEO", () => {
  it("localises titles, descriptions and URLs while keeping data names", async () => {
    const napa = await service.getMedicineDetail("napa-500mg");
    if (!napa) throw new Error("fixture missing");
    expect(medicineTitle(napa, "bn")).toBe("Napa 500 mg Tablet — ওষুধের তথ্য ও মূল্য");
    expect(medicineDescription(napa, "bn")).toContain("নমুনা মূল্য");
    expect(medicineDescription(napa, "bn")).not.toContain("Compare");
    const ld = medicineJsonLd(napa, "bn");
    expect(String(ld["url"])).toContain("/bn/medicine/napa-500mg");
    expect(ld["inLanguage"]).toBe("bn");
    expect(medicineJsonLd(napa)).not.toHaveProperty("inLanguage");
  });
});
