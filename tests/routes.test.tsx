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
  it("homepage renders the search form and popular medicines", async () => {
    render(await HomePage());
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
      "What medicine are you looking for?",
    );
    expect(screen.getByRole("searchbox", { name: "Search by brand or generic name" })).toBeTruthy();
    expect(screen.getByRole("link", { name: /Napa 500 mg/ })).toBeTruthy();
  });

  it("search page finds Napa", async () => {
    render(await SearchPage(searchParams("Napa")));
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Results for “Napa”");
    expect(screen.getByRole("link", { name: "Napa 500 mg" })).toBeTruthy();
  });

  it("search page without a query shows the prompt", async () => {
    render(await SearchPage(searchParams()));
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Search medicines");
  });

  it("medicine page renders price comparison and alternatives", async () => {
    render(await MedicinePage(params("napa-500mg")));
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Napa 500 mg");
    expect(screen.getByRole("heading", { name: "Price comparison" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Same-generic brands" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Ace 500 mg" })).toBeTruthy();
  });

  it("medicine metadata has a unique title and canonical URL", async () => {
    const metadata = await medicineMetadata(params("napa-500mg"));
    expect(metadata.title).toBe("Napa 500 mg Tablet (Paracetamol) – Sample Prices & Alternatives");
    expect(metadata.alternates?.canonical).toBe("/medicine/napa-500mg");
  });

  it("pharmacy page renders sample prices", async () => {
    render(await PharmacyPage(params("nirob-medicine-corner")));
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Nirob Medicine Corner");
    expect(screen.getByRole("heading", { name: "Sample prices at this pharmacy" })).toBeTruthy();
  });

  it("unknown medicine and pharmacy slugs trigger not-found", async () => {
    await expect(MedicinePage(params("does-not-exist"))).rejects.toThrow();
    await expect(PharmacyPage(params("does-not-exist"))).rejects.toThrow();
  });
});
