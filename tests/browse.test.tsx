// @vitest-environment jsdom
/** Brand A–Z index (/medicines) and DGDA registration check (/verify), against the real DGDA seed. */
import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import MedicinesHubPage, { generateMetadata as hubMetadata } from "@/app/[lang]/medicines/page";
import InitialPage, { generateMetadata as initialMetadata } from "@/app/[lang]/medicines/[initial]/page";
import InitialPagedPage, { generateMetadata as pagedMetadata } from "@/app/[lang]/medicines/[initial]/[page]/page";
import VerifyPage, { generateMetadata as verifyMetadata } from "@/app/[lang]/verify/page";
import { services } from "@/data";
import { setLocale } from "@/i18n/server";
import { BRAND_PAGE_SIZE, medicinesPage, parsePageSegment } from "@/lib/routes-browse";
import { BRAND_INITIALS, normalizeDarNumber } from "@/services/browse-service";

vi.hoisted(() => {
  process.env.SITE_INDEXABLE = "true";
  delete process.env.VERCEL_ENV;
});
vi.mock("next/link", () => import("./components/next-link-mock"));
vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));
afterEach(() => {
  cleanup();
  setLocale("en");
});

const initialParams = (initial: string) => ({ params: Promise.resolve({ initial }) });
const pagedParams = (initial: string, page: string) => ({ params: Promise.resolve({ initial, page }) });
const verifyArgs = (query: Record<string, string> = {}) => ({ searchParams: Promise.resolve(query) });

describe("brand A–Z paths", () => {
  it("puts page 1 at the base URL and later pages in a path segment", () => {
    expect(medicinesPage("a")).toBe("/medicines/a");
    expect(medicinesPage("a", 1)).toBe("/medicines/a");
    expect(medicinesPage("a", 2)).toBe("/medicines/a/2");
    expect(medicinesPage("0-9", 3)).toBe("/medicines/0-9/3");
  });

  it("accepts only canonical page segments ≥ 2", () => {
    expect(parsePageSegment("2")).toBe(2);
    expect(parsePageSegment("14")).toBe(14);
    for (const bad of ["1", "0", "02", "-2", "2.0", "abc", "", "1e3", "9999999"]) {
      expect(parsePageSegment(bad)).toBeNull();
    }
  });
});

describe("browse service", () => {
  it("counts every published product once across the initials", async () => {
    const initials = await services.browse.listInitials();
    const summary = await services.browse.getSummary();
    expect(initials.map((i) => i.initial).every((i) => (BRAND_INITIALS as readonly string[]).includes(i))).toBe(true);
    expect(initials.reduce((sum, i) => sum + i.productCount, 0)).toBe(summary.medicineCount);
    expect(summary.genericCount).toBeGreaterThan(0);
    expect(summary.companyCount).toBeGreaterThan(0);
    expect(summary.source?.retrievedAt).toBeTruthy();
  });

  it("paginates within bounds and rejects pages out of range", async () => {
    const first = await services.browse.getInitialPage("a", 1);
    expect(first).not.toBeNull();
    const { total, totalPages } = first!;
    expect(totalPages).toBe(Math.ceil(total / BRAND_PAGE_SIZE));
    expect(first!.items).toHaveLength(BRAND_PAGE_SIZE);
    expect(first!.items.every((item) => /^a/i.test(item.brandName))).toBe(true);
    const last = await services.browse.getInitialPage("a", totalPages);
    expect(last!.items).toHaveLength(total - (totalPages - 1) * BRAND_PAGE_SIZE);
    expect(await services.browse.getInitialPage("a", totalPages + 1)).toBeNull();
    expect(await services.browse.getInitialPage("a", 0)).toBeNull();
    expect(await services.browse.getInitialPage("a", 1.5)).toBeNull();
  });

  it('groups brands starting with a digit or symbol under "0-9" and rejects unknown initials', async () => {
    const digits = await services.browse.getInitialPage("0-9", 1);
    expect(digits).not.toBeNull();
    expect(digits!.items.every((item) => !/^[a-z]/i.test(item.brandName))).toBe(true);
    expect(digits!.items.some((item) => item.brandName.startsWith("0.9%"))).toBe(true);
    for (const bad of ["A", "ab", "0", "09", "", "ä"]) {
      expect(await services.browse.getInitialPage(bad, 1)).toBeNull();
    }
  });

  it("normalises DAR numbers as typed", () => {
    for (const input of ["186-0030-006", " 186 0030 006 ", "1860030006", "186–0030–006", "186/0030/006", "১৮৬-০০৩০-০০৬"]) {
      expect(normalizeDarNumber(input)).toBe("186-0030-006");
    }
    for (const bad of ["", "123", "abc", "186-0030-00", "186-0030-0061", "0.5-0262-047", "186-0030-00x", null, undefined]) {
      expect(normalizeDarNumber(bad)).toBeNull();
    }
  });

  it("looks DAR numbers up exactly and reports empty, invalid and unknown input", async () => {
    const found = await services.browse.verifyByDar("186 0030 006");
    expect(found.status).toBe("found");
    expect(found.darNumber).toBe("186-0030-006");
    expect(found.matches.map((m) => m.medicine.slug)).toEqual(["napa-500mg"]);
    expect((await services.browse.verifyByDar("  ")).status).toBe("empty");
    expect((await services.browse.verifyByDar("napa")).status).toBe("invalid");
    const missing = await services.browse.verifyByDar("999-9999-999");
    expect(missing).toMatchObject({ status: "not_found", darNumber: "999-9999-999", matches: [] });
  });
});

describe("/medicines pages", () => {
  it("hub lists every initial with counts and links to the other catalogue hubs", async () => {
    const metadata = await hubMetadata({ params: Promise.resolve({}) });
    expect(metadata.title).toBe("All Medicine Names A–Z — Bangladesh Brand List");
    expect(metadata.alternates?.canonical).toBe("/medicines");
    expect(metadata.robots).toMatchObject({ index: true });

    render(await MedicinesHubPage({ params: Promise.resolve({}) }));
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Medicine list A–Z");
    expect(screen.getByRole("link", { name: /^A\s*\d/ }).getAttribute("href")).toBe("/medicines/a");
    expect(screen.getByRole("link", { name: /^0–9/ }).getAttribute("href")).toBe("/medicines/0-9");
    expect(screen.getByRole("link", { name: "Medicines by generic name" }).getAttribute("href")).toBe("/generics");
    expect(screen.getByRole("link", { name: "Pharmaceutical companies" }).getAttribute("href")).toBe("/companies");
    expect(screen.getByRole("link", { name: "Dosage forms" }).getAttribute("href")).toBe("/dosage-forms");
    expect(screen.getByText(/DGDA Registered Drug Products snapshot retrieved/)).toBeTruthy();
  });

  it("first page of a letter is self-canonical, lists brands and links to every page", async () => {
    const metadata = await initialMetadata(initialParams("a"));
    expect(metadata.title).toBe("Medicines Starting with A — Brand List");
    expect(metadata.alternates?.canonical).toBe("/medicines/a");
    expect(metadata.robots).toMatchObject({ index: true });

    render(await InitialPage(initialParams("a")));
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Medicines starting with A");
    const list = screen.getByRole("list", { name: "Medicines starting with A" });
    const links = within(list).getAllByRole("link");
    expect(links).toHaveLength(BRAND_PAGE_SIZE);
    expect(links.every((a) => a.getAttribute("href")?.startsWith("/medicine/"))).toBe(true);
    const pages = screen.getByRole("navigation", { name: "Pages of medicines starting with A" });
    expect(within(pages).getByRole("link", { name: "Next" }).getAttribute("href")).toBe("/medicines/a/2");
    expect(within(pages).getByRole("link", { name: "Page 2" }).getAttribute("href")).toBe("/medicines/a/2");
    expect(within(pages).queryByRole("link", { name: "Previous" })).toBeNull();
    const ld = document.querySelector('script[type="application/ld+json"]')?.textContent ?? "";
    expect(ld).toContain('"@type":"BreadcrumbList"');
  });

  it("later pages have their own title and canonical, with prev/next", async () => {
    const metadata = await pagedMetadata(pagedParams("a", "2"));
    expect(metadata.title).toBe("Medicines Starting with A — Brand List (Page 2)");
    expect(metadata.alternates?.canonical).toBe("/medicines/a/2");
    expect(metadata.robots).toMatchObject({ index: true });

    render(await InitialPagedPage(pagedParams("a", "2")));
    const pages = screen.getByRole("navigation", { name: "Pages of medicines starting with A" });
    expect(within(pages).getByRole("link", { name: "Previous" }).getAttribute("href")).toBe("/medicines/a");
    expect(within(pages).getByRole("link", { name: "Page 1" }).getAttribute("href")).toBe("/medicines/a");
  });

  it("the 0-9 group renders, and the Bangla version translates the UI", async () => {
    render(await InitialPage({ params: Promise.resolve({ initial: "0-9", lang: "bn" }) }));
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("0–9 দিয়ে শুরু ওষুধ");
    // Brand names stay as registered; the link prefix comes from the client locale provider (not mounted here).
    expect(screen.getByRole("link", { name: /0\.9% NaCl Saline/ }).getAttribute("href")).toMatch(/\/medicine\//);
    expect(screen.getByText(/নিবন্ধিত পণ্যের মধ্যে 1–/)).toBeTruthy();
  });

  it("unknown initials and invalid or out-of-range pages are 404s", async () => {
    await expect(InitialPage(initialParams("ab"))).rejects.toThrow("NEXT_NOT_FOUND");
    await expect(InitialPage(initialParams("A"))).rejects.toThrow("NEXT_NOT_FOUND");
    for (const page of ["1", "02", "abc", "999"]) {
      await expect(InitialPagedPage(pagedParams("a", page))).rejects.toThrow("NEXT_NOT_FOUND");
    }
    // 0-9 has a single page.
    await expect(InitialPagedPage(pagedParams("0-9", "2"))).rejects.toThrow("NEXT_NOT_FOUND");
  });
});

describe("/verify", () => {
  it("the clean page is indexable; any query makes it noindex with the clean canonical", async () => {
    const clean = await verifyMetadata(verifyArgs());
    expect(clean.title).toBe("DGDA Registered Medicine Check — DAR Number Lookup");
    expect(clean.alternates?.canonical).toBe("/verify");
    expect(clean.robots).toMatchObject({ index: true });
    const queries: Record<string, string>[] = [{ dar: "186-0030-006" }, { q: "napa" }, { utm_source: "x" }];
    for (const query of queries) {
      const meta = await verifyMetadata(verifyArgs(query));
      expect(meta.robots).toMatchObject({ index: false });
      expect(meta.alternates?.canonical).toBe("/verify");
    }
  });

  it("renders the forms, the DAR explainer and the FAQ without a query", async () => {
    render(await VerifyPage(verifyArgs()));
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Check if a medicine is DGDA registered");
    expect(screen.getByRole("textbox", { name: "DAR number" }).getAttribute("name")).toBe("dar");
    expect(screen.getByRole("searchbox", { name: "Brand name" }).getAttribute("name")).toBe("q");
    expect(screen.getByText(/for example 186-0030-006 \(Napa 500 mg Tablet\)/)).toBeTruthy();
    expect(screen.getByText("Does a match prove that the medicine I bought is genuine?")).toBeTruthy();
    expect(screen.queryByRole("heading", { name: /^Result/ })).toBeNull();
    const ld = document.querySelector('script[type="application/ld+json"]')?.textContent ?? "";
    expect(ld).toContain('"@type":"WebPage"');
    // DGDA's domain is shown as text, never as a link.
    expect(document.querySelector('a[href*="dgda"]')).toBeNull();
  });

  it("a known DAR number is found, with the snapshot date and the pack caveat", async () => {
    render(await VerifyPage(verifyArgs({ dar: "186 0030 006" })));
    expect(screen.getByRole("heading", { level: 2, name: "Result: DAR number 186-0030-006" })).toBeTruthy();
    expect(screen.getByText(/^Found in the DGDA registry snapshot we use \(retrieved /)).toBeTruthy();
    expect(screen.getByRole("link", { name: "Napa 500 mg" }).getAttribute("href")).toBe("/medicine/napa-500mg");
    expect(screen.getByText(/does not prove that a particular pack is genuine/)).toBeTruthy();
  });

  it("an unknown DAR number is not called fake and points to dgda.gov.bd as text", async () => {
    render(await VerifyPage(verifyArgs({ dar: "999-9999-999" })));
    expect(screen.getByText(/^999-9999-999 was not found in our snapshot/)).toBeTruthy();
    expect(screen.getByText(/^This does not prove a medicine is fake/)).toBeTruthy();
    expect(screen.getByText(/type dgda\.gov\.bd into your browser/)).toBeTruthy();
    expect(document.querySelector('a[href*="dgda"]')).toBeNull();
  });

  it("malformed DAR input explains the format", async () => {
    render(await VerifyPage(verifyArgs({ dar: "12-34" })));
    expect(screen.getByText(/“12-34” is not a DAR number we can check/)).toBeTruthy();
  });

  it("brand-name lookup lists registered products with their DAR numbers", async () => {
    render(await VerifyPage(verifyArgs({ q: "Napa" })));
    expect(screen.getByRole("heading", { level: 2, name: "Registered products matching “Napa”" })).toBeTruthy();
    const list = screen.getByRole("list", { name: "Matching registered products" });
    expect(within(list).getAllByRole("link").length).toBeGreaterThan(0);
    expect(within(list).getByText("186-0030-006")).toBeTruthy();
  });

  it("a brand that is not in the snapshot gets the honest not-found note", async () => {
    render(await VerifyPage(verifyArgs({ q: "Zzqxw" })));
    expect(screen.getByText(/^No product matching “Zzqxw” was found in our snapshot/)).toBeTruthy();
    expect(screen.getByText(/^This does not prove a medicine is fake/)).toBeTruthy();
  });
});
