// @vitest-environment jsdom
import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import ComparePage from "@/app/[lang]/compare/page";
import { MedicineAlternatives } from "@/components/medicine/medicine-alternatives";
import { buildMedicineFaqs } from "@/components/medicine/medicine-faq";
import { MedicineOverview } from "@/components/medicine/medicine-overview";
import { MedicineSafety } from "@/components/medicine/medicine-safety";
import { createLocalRepositories } from "@/data/local/repositories";
import type { MedicineSafetyInfo } from "@/domain/medicine-safety";
import { createT } from "@/i18n/translate";
import { medicineDescription, medicineJsonLd, medicineTitle } from "@/lib/seo";
import { MedicineService } from "@/services/medicine-service";
import { fixtureDataset } from "./fixtures";

vi.mock("next/link", () => import("./components/next-link-mock"));
afterEach(cleanup);

/** Fictional test record: no real drug text, example.org URLs only. */
const record: MedicineSafetyInfo = {
  genericSlug: "paracetamol",
  genericName: "Paracetamol",
  description: "Test description",
  uses: ["Test use A", "Test use B"],
  mechanism: "Test mechanism",
  commonSideEffects: ["Test common effect"],
  seriousSideEffects: ["Test serious effect"],
  seekHelpIf: ["Test urgent sign"],
  warnings: ["Test warning"],
  contraindications: null,
  interactions: ["1", "2", "3", "4", "5", "6", "7"].map((n) => `Test interaction ${n}`),
  pregnancyInfo: null,
  breastfeedingInfo: null,
  storage: "Test storage",
  source: "Test source",
  sourceUrl: "https://example.org/test",
  sourceType: "public_health",
  sourceUpdatedAt: null,
  lastCheckedAt: "2026-10-07",
  verificationStatus: "source_cited",
  licenceNote: "Test licence",
};

async function detailWith(slug: string, safety: MedicineSafetyInfo[]) {
  const service = new MedicineService(createLocalRepositories({ ...fixtureDataset, safety }));
  const detail = await service.getMedicineDetail(slug);
  if (!detail) throw new Error("fixture missing");
  return detail;
}

const DISCLAIMER = "This information is for general education and does not replace advice from a qualified healthcare professional.";

describe("MedicineSafety", () => {
  it("without a record: calm unavailable panel, external DailyMed link, disclaimer, no invented text", async () => {
    render(<MedicineSafety detail={await detailWith("napa-500mg", [])} />);
    expect(screen.getByRole("heading", { level: 2, name: "Medicine information & safety" })).toBeTruthy();
    expect(screen.getByText("Detailed side-effect and safety information isn't available for this medicine yet")).toBeTruthy();
    const link = screen.getByRole("link", { name: /Search US drug labels \(DailyMed\)/ });
    expect(link.getAttribute("href")).toBe("https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=Paracetamol");
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toContain("noopener");
    expect(screen.getByText(DISCLAIMER)).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "Common side effects" })).toBeNull();
  });

  it("with a record: renders only present fields, grouped side effects, source and licence", async () => {
    render(<MedicineSafety detail={await detailWith("napa-500mg", [record])} />);
    for (const name of ["Common side effects", "Serious reactions", "Seek urgent medical help if…", "What it is used for", "How it works", "Warnings", "Interactions", "Storage", "What is it?"]) {
      expect(screen.getByRole("heading", { name })).toBeTruthy();
    }
    // Null fields are omitted entirely.
    for (const name of ["Contraindications", "Pregnancy", "Breastfeeding"]) {
      expect(screen.queryByRole("heading", { name })).toBeNull();
    }
    expect(screen.getByText("Test urgent sign")).toBeTruthy();
    // Long list: 5 visible, remaining 2 behind "Read more".
    const more = screen.getByText("Read more (2 more)");
    expect(more.closest("details")).toBeTruthy();
    expect(within(more.closest("details")!).getByText("Test interaction 7")).toBeTruthy();
    expect(screen.getByText("Source: Test source · last checked 7 Oct 2026")).toBeTruthy();
    const src = screen.getByRole("link", { name: /View the source/ });
    expect(src.getAttribute("href")).toBe("https://example.org/test");
    expect(src.getAttribute("rel")).toContain("noopener");
    expect(screen.getByText("Licence: Test licence")).toBeTruthy();
    expect(screen.getByText(DISCLAIMER)).toBeTruthy();
    expect(screen.queryByText(/isn't available for this medicine yet/)).toBeNull();
  });
});

describe("MedicineOverview", () => {
  it("labels brand and generic and shows the price anchor only when prices exist", async () => {
    const withPrices = await detailWith("napa-500mg", []);
    render(<MedicineOverview detail={withPrices} />);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Napa 500 mg");
    expect(screen.getByText("Brand")).toBeTruthy();
    expect(screen.getByText("Generic (active ingredient)")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Paracetamol" })).toBeTruthy();
    expect(screen.getByText("Manufacturer")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Go to prices" }).getAttribute("href")).toBe("#price-comparison");
    cleanup();
    render(<MedicineOverview detail={await detailWith("seclo-20mg", [])} />);
    expect(screen.queryByRole("link", { name: "Go to prices" })).toBeNull();
  });
});

describe("MedicineAlternatives wording", () => {
  it("uses neutral same-generic wording and no recommendation language", async () => {
    render(<MedicineAlternatives detail={await detailWith("napa-500mg", [])} />);
    expect(screen.getByRole("heading", { name: "Other products containing the same generic" })).toBeTruthy();
    expect(screen.getByText(/may differ in inactive ingredients, manufacturer and registration/)).toBeTruthy();
    expect(document.body.textContent ?? "").not.toMatch(/\b(better|best|cheaper)\b/i);
  });
});

describe("medicine SEO and FAQ with safety data", () => {
  it("keeps the current title without safety and switches only when a record exists", async () => {
    const without = await detailWith("napa-500mg", []);
    const withSafety = await detailWith("napa-500mg", [record]);
    expect(medicineTitle(without)).toBe("Napa 500 mg Tablet — Medicine Information & Price");
    expect(medicineTitle(withSafety)).toBe("Napa 500 mg Tablet — Uses, Side Effects & Medicine Information");
    expect(medicineTitle({ ...withSafety, safety: { ...record, uses: null } })).toBe("Napa 500 mg Tablet — Medicine Information & Safety");
    expect(medicineDescription(without)).not.toContain("Includes general medicine information");
    expect(medicineDescription(withSafety)).toContain("Includes general medicine information from Test source.");
  });

  it("adds Drug warning fields only from safety data and never ratings", async () => {
    const plain = medicineJsonLd(await detailWith("napa-500mg", []));
    for (const key of ["warning", "mechanismOfAction", "pregnancyWarning", "breastfeedingWarning", "aggregateRating"]) {
      expect(plain).not.toHaveProperty(key);
    }
    const rich = medicineJsonLd(await detailWith("napa-500mg", [record]));
    expect(rich["warning"]).toBe("Test warning");
    expect(rich["mechanismOfAction"]).toBe("Test mechanism");
    expect(rich).not.toHaveProperty("pregnancyWarning");
    expect(rich).not.toHaveProperty("aggregateRating");
  });

  it("builds safety FAQs only from fields that exist", async () => {
    const t = createT("en");
    const base = buildMedicineFaqs(await detailWith("napa-500mg", []), t).map((i) => i.question);
    expect(base).toEqual(["What is the generic name of Napa 500 mg?", "Who makes Napa 500 mg?"]);
    const some = buildMedicineFaqs(await detailWith("napa-500mg", [{ ...record, uses: null }]), t).map((i) => i.question);
    expect(some).toEqual([...base, "What are the common side effects of Napa 500 mg?"]);
    const all = buildMedicineFaqs(await detailWith("napa-500mg", [record]), t).map((i) => i.question);
    expect(all).toContain("What is Napa 500 mg used for?");
  });
});

describe("compare page wording", () => {
  it("shows factual rows only, with 'Not listed' for missing values", async () => {
    render(await ComparePage({ searchParams: Promise.resolve({ m: "napa-500mg" }) }));
    expect(screen.getByRole("heading", { level: 1, name: "Compare product information" })).toBeTruthy();
    for (const label of ["Brand", "Generic", "Strength", "Dosage form", "Manufacturer", "Pack size", "Price", "Availability"]) {
      expect(screen.getByRole("rowheader", { name: label })).toBeTruthy();
    }
    expect(screen.getAllByText("Not listed").length).toBeGreaterThan(0);
    expect(document.body.textContent ?? "").not.toMatch(/\b(best|better|cheaper|cheapest)\b/i);
  });
});
