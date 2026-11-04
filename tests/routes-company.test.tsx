// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import CompaniesPage, { generateMetadata as companiesMetadata } from "@/app/[lang]/companies/page";
import CompanyPage, { generateMetadata as companyMetadata } from "@/app/[lang]/companies/[slug]/page";
import CompanyListPage, { generateMetadata as companyListMetadata } from "@/app/[lang]/companies/[slug]/[page]/page";
import DosageFormsPage from "@/app/[lang]/dosage-forms/page";
import DosageFormPage, { generateMetadata as dosageFormMetadata } from "@/app/[lang]/dosage-forms/[form]/page";
import DosageFormListPage from "@/app/[lang]/dosage-forms/[form]/[page]/page";
import MedicinePage from "@/app/[lang]/medicine/[slug]/page";

vi.mock("next/link", () => import("./components/next-link-mock"));
afterEach(cleanup);

const INCEPTA = "incepta-pharmaceuticals-ltd";
const company = (slug: string, lang?: string) => ({ params: Promise.resolve({ slug, lang }) });
const companyList = (slug: string, page: string) => ({ params: Promise.resolve({ slug, page }) });
const form = (f: string) => ({ params: Promise.resolve({ form: f }) });
const formList = (f: string, page: string) => ({ params: Promise.resolve({ form: f, page }) });

describe("company pages (real seed data)", () => {
  it("hub ranks companies by DGDA-registered product count and lists them A–Z", async () => {
    render(await CompaniesPage({}));
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Pharmaceutical companies in Bangladesh");
    expect(screen.getByRole("heading", { level: 2, name: "Companies by number of DGDA-registered products" })).toBeTruthy();
    const table = screen.getByRole("table", { name: "Companies by number of DGDA-registered products" });
    const firstRow = table.querySelector("tbody tr");
    expect(firstRow?.textContent).toContain("Incepta Pharmaceuticals Ltd.");
    expect(screen.getByRole("heading", { level: 2, name: "All companies A–Z" })).toBeTruthy();
    const meta = await companiesMetadata({});
    expect(meta.title).toMatch(/^Pharmaceutical Companies in Bangladesh — \d+ Manufacturers$/);
    expect(meta.alternates?.canonical).toBe("/companies");
  });

  it("company page shows the medicine list grouped by generic with form links and pagination", async () => {
    render(await CompanyPage(company(INCEPTA)));
    expect(screen.getByRole("heading", { level: 1 }).textContent).toMatch(
      /^Incepta Pharmaceuticals Ltd — Medicine List \([\d,]+ registered products\)$/,
    );
    expect(screen.getAllByRole("link", { name: /^Tablets/ })[0]?.getAttribute("href")).toBe("/dosage-forms/tablet");
    expect(screen.getByRole("heading", { level: 2, name: /^Top generics by Incepta/ })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Next" }).getAttribute("href")).toBe(`/companies/${INCEPTA}/2`);
    const rowgroups = document.querySelectorAll('th[scope="rowgroup"] a');
    expect(rowgroups.length).toBeGreaterThan(0);
    expect(rowgroups[0]?.getAttribute("href")).toMatch(/^\/generics\//);
    expect(screen.getByRole("heading", { level: 2, name: "Frequently asked questions" })).toBeTruthy();
    const ld = [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => s.textContent).join("");
    expect(ld).toContain('"@type":"Organization"');
    expect(ld).toContain('"@type":"BreadcrumbList"');

    const meta = await companyMetadata(company(INCEPTA));
    expect(meta.alternates?.canonical).toBe(`/companies/${INCEPTA}`);
  });

  it("later pages are self-canonical with prev/next and out-of-range pages 404", async () => {
    render(await CompanyListPage(companyList(INCEPTA, "2")));
    expect(screen.getByRole("heading", { level: 1 }).textContent).toMatch(/Medicine List, Page 2 of \d+$/);
    expect(screen.getByRole("link", { name: "Previous" }).getAttribute("href")).toBe(`/companies/${INCEPTA}`);
    const meta = await companyListMetadata(companyList(INCEPTA, "2"));
    expect(meta.alternates?.canonical).toBe(`/companies/${INCEPTA}/2`);
    for (const page of ["99", "01", "abc", "1"]) {
      await expect(CompanyListPage(companyList(INCEPTA, page))).rejects.toThrow();
    }
  });

  it("unknown company triggers not-found", async () => {
    await expect(CompanyPage(company("no-such-company"))).rejects.toThrow();
  });

  it("renders Bangla headings with data names unchanged", async () => {
    render(await CompanyPage(company(INCEPTA, "bn")));
    expect(screen.getByRole("heading", { level: 1 }).textContent).toMatch(/^Incepta Pharmaceuticals Ltd — ওষুধের তালিকা/);
  });

  it("medicine page links the manufacturer to its company page", async () => {
    render(await MedicinePage({ params: Promise.resolve({ slug: "napa-500mg" }) }));
    expect(screen.getByRole("link", { name: "Beximco Pharmaceuticals Ltd." }).getAttribute("href")).toBe(
      "/companies/beximco-pharmaceuticals-ltd",
    );
  });
});

describe("dosage-form pages (real seed data)", () => {
  it("hub lists forms with counts", async () => {
    render(await DosageFormsPage({}));
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Medicines by dosage form");
    expect(screen.getByRole("link", { name: /^Syrups/ }).getAttribute("href")).toBe("/dosage-forms/syrup");
  });

  it("form page shows counts, top generics, top companies and a brand list", async () => {
    render(await DosageFormPage(form("syrup")));
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Syrups registered in Bangladesh");
    expect(screen.getByRole("heading", { level: 2, name: "Top generics" })).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2, name: "Top companies" })).toBeTruthy();
    expect(screen.getByRole("table", { name: "All products" }).querySelectorAll("tbody tr").length).toBe(200);
    const meta = await dosageFormMetadata(form("syrup"));
    expect(meta.title).toMatch(/^Syrups in Bangladesh — [\d,]+ Registered Products$/);
    expect(meta.alternates?.canonical).toBe("/dosage-forms/syrup");
  });

  it("paginates large forms by path segment and 404s unknown forms or pages", async () => {
    render(await DosageFormListPage(formList("tablet", "2")));
    expect(screen.getByRole("heading", { level: 1 }).textContent).toMatch(/^Tablets registered in Bangladesh — page 2 of \d+$/);
    await expect(DosageFormPage(form("pills"))).rejects.toThrow();
    await expect(DosageFormListPage(formList("tablet", "9999"))).rejects.toThrow();
  });
});
