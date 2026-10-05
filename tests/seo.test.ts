import { describe, expect, it } from "vitest";
import { createLocalRepositories } from "@/data/local/repositories";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  medicineDescription,
  medicineJsonLd,
  medicineTitle,
  pageMetadata,
  pageRobots,
  twitterCard,
  webPageJsonLd,
  websiteJsonLd,
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
    expect(medicineTitle(napa)).toBe("Napa 500 mg Tablet — Medicine Information & Price");
    expect(medicineTitle(seclo)).toBe("Seclo 20 mg Capsule — Medicine Information");
    expect(medicineTitle(napa).length).toBeLessThan(61);
    expect(medicineDescription(seclo)).toContain("registered with DGDA Bangladesh");
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

  it("omits prescription status when the source does not publish it", async () => {
    const ace = await service.getMedicineDetail("ace-500mg");
    if (!ace) throw new Error("fixture missing");
    expect(medicineJsonLd(ace)).not.toHaveProperty("prescriptionStatus");
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

  it("describes the site as a WebSite with a search action built from siteConfig.url", () => {
    const data = websiteJsonLd() as Record<string, any>;
    expect(data["@type"]).toBe("WebSite");
    expect(data["name"]).toBe(siteConfig.name);
    expect(data["url"]).toBe(absoluteUrl("/"));
    expect(data["potentialAction"]).toEqual({
      "@type": "SearchAction",
      target: `${siteConfig.url}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    });
  });

  it("builds a WebPage with an absolute URL and no ratings", () => {
    const data = webPageJsonLd({ name: "About", description: "d", path: "/about" });
    expect(data["@type"]).toBe("WebPage");
    expect(data["url"]).toBe(absoluteUrl("/about"));
    expect(JSON.stringify(data)).not.toMatch(/aggregateRating|review/i);
  });

  it("adds a summary twitter card to page metadata", () => {
    expect(twitterCard("T", "D")).toEqual({ card: "summary", title: "T", description: "D" });
    const metadata = pageMetadata({ title: "T", description: "D", path: "/about" });
    expect(metadata.twitter).toEqual({ card: "summary", title: "T", description: "D" });
  });

  it("derives absolute URLs from the configured site URL", () => {
    expect(absoluteUrl("/medicine/napa-500mg")).toBe(`${siteConfig.url}/medicine/napa-500mg`);
  });
});
