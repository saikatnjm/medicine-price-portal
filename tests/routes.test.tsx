// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import HomePage from "@/app/page";
import MedicinePage, { generateMetadata as medicineMetadata } from "@/app/medicine/[slug]/page";
import PharmacyPage from "@/app/pharmacy/[slug]/page";
import SearchPage from "@/app/search/page";

vi.mock("next/link", () => import("./components/next-link-mock"));
afterEach(cleanup);

const params = (slug: string) => ({ params: Promise.resolve({ slug }) });
const searchParams = (q?: string) => ({
  searchParams: Promise.resolve(q === undefined ? {} : { q }),
});

describe("routes (real seed data)", () => {
  it("homepage renders the combobox search, examples and category links", async () => {
    render(await HomePage());
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Bangladesh Healthcare Search");
    expect(
      screen.getByText("Search medicines, doctors, hospitals, clinics and pharmacies across Bangladesh."),
    ).toBeTruthy();
    expect(screen.getByRole("combobox", { name: "What are you looking for?" })).toBeTruthy();
    expect(screen.getByRole("link", { name: /Napa 500 mg/ })).toBeTruthy();
    // Example searches and category entry points replace the old registry link.
    expect(screen.getByRole("link", { name: "Cardiologist" }).getAttribute("href")).toBe(
      "/search?q=Cardiologist",
    );
    expect(screen.getByRole("link", { name: "Pharmacies near Dhanmondi" }).getAttribute("href")).toBe(
      "/search?q=Pharmacies+near+Dhanmondi",
    );
    expect(screen.getAllByRole("link", { name: /^Hospitals & Clinics/ }).length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: /^Locations/ }).getAttribute("href")).toBe("/locations");
    // Doctors have no source yet: "Coming soon", never a count.
    expect(screen.getByRole("link", { name: /^Doctors.*Coming soon/ })).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2, name: "Where our data comes from" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "More about the data" }).getAttribute("href")).toBe("/about");
    // WebSite structured data with a search action.
    const ld = document.querySelector('script[type="application/ld+json"]')?.textContent ?? "";
    expect(ld).toContain('"@type":"WebSite"');
    expect(ld).toContain("search_term_string");
    expect(screen.queryByRole("link", { name: "DGDA Registered Drug Products" })).toBeNull();
  });

  it("search page finds Napa", async () => {
    render(await SearchPage(searchParams("Napa")));
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Results for “Napa”");
    // Grouped view lists the top matches only; any Napa brand link proves the medicines group renders.
    expect(screen.getByRole("heading", { level: 2, name: /^Medicines/ })).toBeTruthy();
    expect(screen.getAllByRole("link", { name: /^Napa/ }).length).toBeGreaterThan(0);
  });

  it("search page without a query shows the prompt", async () => {
    render(await SearchPage(searchParams()));
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Search");
  });

  it("medicine page renders registry details, a no-price state and alternatives", async () => {
    render(await MedicinePage(params("napa-500mg")));
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Napa 500 mg");
    expect(screen.getByText("Price information coming soon.")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Same-generic brands" })).toBeTruthy();
    expect(screen.getByText("186-0030-006")).toBeTruthy();
    expect(screen.queryByText(/Unknown/)).toBeNull();
  });

  it("medicine metadata has a unique title and canonical URL", async () => {
    const metadata = await medicineMetadata(params("napa-500mg"));
    // No price data in the registry seed, so the title has no "& Price" suffix.
    expect(metadata.title).toBe("Napa 500 mg Tablet — Medicine Information");
    expect(metadata.alternates?.canonical).toBe("/medicine/napa-500mg");
  });

  it("unknown medicine and pharmacy slugs trigger not-found", async () => {
    await expect(MedicinePage(params("does-not-exist"))).rejects.toThrow();
    await expect(PharmacyPage(params("no-such-pharmacy-slug"))).rejects.toThrow();
  });
});
