// @vitest-environment jsdom
import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import GenericPage, { generateMetadata as genericMetadata, generateStaticParams } from "@/app/[lang]/generics/[slug]/page";
import GenericsPage, { generateMetadata as genericsMetadata } from "@/app/[lang]/generics/page";
import MedicinePage from "@/app/[lang]/medicine/[slug]/page";
import { setLocale } from "@/i18n/server";

// Indexing is opt-in; enable it before the site config is evaluated so the tests
// can tell indexable pages from thin (noindex) ones.
vi.hoisted(() => {
  process.env.SITE_INDEXABLE = "true";
  delete process.env.VERCEL_ENV;
});

vi.mock("next/link", () => import("./components/next-link-mock"));
afterEach(() => {
  cleanup();
  setLocale("en");
});

const params = (slug: string, lang?: string) => ({ params: Promise.resolve({ slug, ...(lang ? { lang } : {}) }) });

// Large real-data pages: role queries over hundreds of rows are slow under a parallel run.
describe("generic pages (real seed data)", { timeout: 30_000 }, () => {
  it("renders the paracetamol page with brands, companies, forms and source", async () => {
    render(await GenericPage(params("paracetamol")));
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Paracetamol: brands in Bangladesh");
    expect(screen.getByText(/^The DGDA registry lists \d+ registered products with the generic Paracetamol/)).toBeTruthy();

    // Element queries instead of role queries: the product table has hundreds of links.
    expect(document.querySelector('td a[href="/medicine/napa-500mg"]')?.textContent).toBe("Napa");
    expect(document.querySelector('a[href="/companies/beximco-pharmaceuticals-ltd"]')?.textContent).toBe(
      "Beximco Pharmaceuticals Ltd.",
    );
    expect([...document.querySelectorAll("h3")].filter((h) => h.textContent?.startsWith("500 mg · Tablet ")).length).toBe(1);
    expect(screen.getAllByText("186-0030-006").length).toBeGreaterThan(0);

    const section = (id: string, heading: string) => {
      const h2 = document.getElementById(id)!;
      expect(h2.textContent).toBe(heading);
      return h2.closest("section")!;
    };
    const forms = section("generic-forms", "Dosage forms available");
    expect(within(forms).getByRole("link", { name: /^Tablet/ }).getAttribute("href")).toBe("/dosage-forms/tablet");

    const related = section("generic-related", "Related generics");
    expect(within(related).getByRole("link", { name: /^Caffeine \+ Paracetamol/ }).getAttribute("href")).toBe(
      "/generics/caffeine-paracetamol",
    );
    expect(within(section("generic-source", "About this data")).getByRole("link", { name: "DGDA Registered Drug Products" })).toBeTruthy();
    expect(section("faq", "Frequently asked questions")).toBeTruthy();
    expect(screen.queryByText(/৳/)).toBeNull();

    const ld = [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => s.textContent).join("");
    expect(ld).toContain('"@type":"Drug"');
    expect(ld).toContain('"@type":"BreadcrumbList"');
    expect(ld).not.toContain("offers");
  });

  it("lists the single ingredients of a combination", async () => {
    render(await GenericPage(params("caffeine-paracetamol")));
    const related = screen.getByRole("heading", { level: 2, name: "Related generics" }).closest("section")!;
    expect(within(related).getByRole("link", { name: /^Paracetamol/ }).getAttribute("href")).toBe("/generics/paracetamol");
  });

  it("builds title, description and robots from the data", async () => {
    const metadata = await genericMetadata(params("paracetamol"));
    expect(metadata.title).toMatch(/^Paracetamol Brands in Bangladesh — \d+ Registered Products$/);
    expect(metadata.description).toMatch(/DGDA-registered products/);
    expect(metadata.alternates?.canonical).toBe("/generics/paracetamol");
    expect(metadata.robots).toMatchObject({ index: true });

    // A generic with a single registered product is rendered but not indexed.
    const thin = await genericMetadata(params("abametapir"));
    expect(thin.title).toMatch(/— 1 Registered Product$/);
    expect(thin.robots).toMatchObject({ index: false });
  });

  it("renders Bangla text with names unchanged", async () => {
    render(await GenericPage(params("paracetamol", "bn")));
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Paracetamol: বাংলাদেশে নিবন্ধিত ব্র্যান্ড");
    const metadata = await genericMetadata(params("paracetamol", "bn"));
    expect(metadata.alternates?.canonical).toBe("/bn/generics/paracetamol");
  });

  it("prerenders only the top generics", async () => {
    const slugs = (await generateStaticParams()).map((p) => p.slug);
    expect(slugs.length).toBe(12);
    expect(slugs).toContain("paracetamol");
  });

  it("unknown generic slug triggers not-found", async () => {
    await expect(GenericPage(params("no-such-generic"))).rejects.toThrow();
    expect((await genericMetadata(params("no-such-generic"))).title).toBe("Generic not found");
  });

  it("index lists most registered generics and an A–Z with letter anchors", async () => {
    render(await GenericsPage({ params: Promise.resolve({}) }));
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Generic medicines A–Z");
    const top = screen.getByRole("heading", { level: 2, name: "Most registered generics" }).closest("section")!;
    expect(within(top).getAllByRole("listitem").length).toBe(40);
    const jump = screen.getByRole("navigation", { name: "Jump to letter" });
    expect(within(jump).getByRole("link", { name: "P" }).getAttribute("href")).toBe("#letter-p");
    expect(document.getElementById("letter-p")).toBeTruthy();
    // A–Z entry (the "most registered" chip comes first and also shows the count).
    expect([...document.querySelectorAll('a[href="/generics/paracetamol"]')].at(-1)?.textContent).toBe("Paracetamol");

    const metadata = await genericsMetadata({ params: Promise.resolve({}) });
    expect(metadata.alternates?.canonical).toBe("/generics");
  });

  it("medicine page links its generic to the generic page", async () => {
    render(await MedicinePage(params("napa-500mg")));
    const links = screen.getAllByRole("link", { name: "Paracetamol" }).map((a) => a.getAttribute("href"));
    expect(links).toContain("/generics/paracetamol");
  });
});
