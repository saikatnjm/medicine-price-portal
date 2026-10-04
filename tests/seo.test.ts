import { describe, expect, it } from "vitest";
import { createLocalRepositories } from "@/data/local/repositories";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  medicineDescription,
  medicineJsonLd,
  medicineTitle,
  pageRobots,
  serializeJsonLd,
} from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { MedicineService } from "@/services/medicine-service";
import { fixtureDataset } from "./fixtures";

const service = new MedicineService(createLocalRepositories(fixtureDataset));

describe("SEO helpers", () => {
  it("builds unique, readable medicine titles and descriptions", async () => {
    const napa = await service.getMedicineDetail("napa-500mg");
    const seclo = await service.getMedicineDetail("seclo-20mg");
    if (!napa || !seclo) throw new Error("fixture missing");
    expect(medicineTitle(napa)).toBe(
      "Napa 500 mg Tablet (Paracetamol) – Sample Prices & Alternatives",
    );
    expect(medicineTitle(seclo)).not.toBe(medicineTitle(napa));
    expect(medicineDescription(napa)).toContain("sample prices from 2 pharmacies");
    expect(medicineDescription(seclo)).not.toContain("sample prices");
    expect(medicineDescription(napa)).not.toContain("..");
  });

  it("never puts prices or offers in structured data", async () => {
    const napa = await service.getMedicineDetail("napa-500mg");
    if (!napa) throw new Error("fixture missing");
    const json = JSON.stringify(medicineJsonLd(napa));
    expect(json).not.toMatch(/offers|price/i);
    expect(medicineJsonLd(napa)["prescriptionStatus"]).toBe("https://schema.org/OTC");
  });

  it("builds breadcrumbs with absolute URLs", () => {
    const data = breadcrumbJsonLd(
      [{ name: "Home", href: "/" }, { name: "Napa 500 mg" }],
      "/medicine/napa-500mg",
    );
    expect(JSON.stringify(data)).toContain(absoluteUrl("/medicine/napa-500mg"));
  });

  it("escapes < in JSON-LD", () => {
    expect(serializeJsonLd({ name: "</script>" })).not.toContain("</script>");
  });

  it("never indexes non-indexable pages and follows the site-wide switch", () => {
    expect(pageRobots(false)).toEqual({ index: false, follow: siteConfig.indexable });
    expect(pageRobots(true)).toEqual({ index: siteConfig.indexable, follow: siteConfig.indexable });
  });
});
