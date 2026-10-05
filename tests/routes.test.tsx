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
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
      "What are you looking for?",
    );
    expect(
      screen.getByRole("combobox", {
        name: "Search medicines, hospitals, clinics, pharmacies and specialties",
      }),
    ).toBeTruthy();
    expect(screen.getByRole("link", { name: /Napa 500 mg/ })).toBeTruthy();
    // Example searches and category entry points replace the old registry link.
    expect(screen.getByRole("link", { name: "Cardiologist" }).getAttribute("href")).toBe(
      "/search?q=Cardiologist",
    );
    expect(screen.getAllByRole("link", { name: /^Hospitals & clinics/ }).length).toBeGreaterThan(0);
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
    // No price data in the registry seed, so the suffix says "Alternatives", not "Price".
    expect(metadata.title).toBe(
      "Napa 500 mg Tablet (Paracetamol) — Medicine Information & Alternatives",
    );
    expect(metadata.alternates?.canonical).toBe("/medicine/napa-500mg");
  });

  it("unknown medicine and pharmacy slugs trigger not-found", async () => {
    await expect(MedicinePage(params("does-not-exist"))).rejects.toThrow();
    await expect(PharmacyPage(params("no-such-pharmacy-slug"))).rejects.toThrow();
  });
});
