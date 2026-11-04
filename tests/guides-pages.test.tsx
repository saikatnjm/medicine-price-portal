// @vitest-environment jsdom
/** Route-level tests for /guides, /guides/[slug] and /emergency against the fixture dataset. */
import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import EmergencyPage, { generateMetadata as emergencyMetadata } from "@/app/[lang]/emergency/page";
import GuidePage, { generateMetadata as guideMetadata, generateStaticParams } from "@/app/[lang]/guides/[slug]/page";
import GuidesPage from "@/app/[lang]/guides/page";
import { GUIDES } from "@/content/guides";
import { setLocale } from "@/i18n/server";
import { notFound } from "next/navigation";

vi.hoisted(() => {
  process.env.SITE_INDEXABLE = "true";
  delete process.env.VERCEL_ENV;
});

vi.mock("@/data", async () => {
  const { createServices } = await import("@/services");
  const { createLocalRepositories } = await import("@/data/local/repositories");
  const { fixtureDataset } = await import("./fixtures");
  return { services: createServices(createLocalRepositories(fixtureDataset)) };
});

vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

vi.mock("next/link", () => import("./components/next-link-mock"));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  setLocale("en");
});

const guideParams = (slug: string, lang?: string) => ({ params: Promise.resolve({ slug, lang }) });

function jsonLdOf(container: HTMLElement): string {
  return Array.from(container.querySelectorAll('script[type="application/ld+json"]'))
    .map((script) => script.textContent ?? "")
    .join("\n");
}

describe("/guides", () => {
  it("lists every guide grouped by category", async () => {
    render(await GuidesPage({}));
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Guides");
    for (const heading of ["DGDA registration", "Reading medicine names and labels", "Finding healthcare", "Using this site"]) {
      expect(screen.getByRole("heading", { level: 2, name: heading })).toBeTruthy();
    }
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(GUIDES.length);
    expect(screen.getByRole("link", { name: GUIDES[0]!.content.en.title }).getAttribute("href")).toBe(`/guides/${GUIDES[0]!.slug}`);
  });
});

describe("/guides/[slug]", () => {
  it("pre-renders every guide", () => {
    expect(generateStaticParams()).toEqual(GUIDES.map((g) => ({ slug: g.slug })));
  });

  it("renders a guide with FAQ, sources, related guides and Article JSON-LD", async () => {
    const { container } = render(await GuidePage(guideParams("what-is-dgda")));
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
      "What is DGDA (Directorate General of Drug Administration)?",
    );
    expect(screen.getByText("Last reviewed 4 Nov 2026")).toBeTruthy();
    expect(container.querySelectorAll("details").length).toBeGreaterThanOrEqual(3);
    expect(screen.getByRole("link", { name: /fhir\.dghs|DGHS: DGDA drug registry/ }).getAttribute("href")).toBe(
      "https://fhir.dghs.gov.bd/core/CodeSystem-dgda-drug-registry.html",
    );
    expect(screen.getByRole("heading", { level: 2, name: "Related guides" })).toBeTruthy();
    expect(screen.getByRole("link", { name: /Check a brand name or DAR number/ }).getAttribute("href")).toBe("/verify");
    expect(screen.getByText(/is not medical advice/)).toBeTruthy();
    const ld = jsonLdOf(container);
    expect(ld).toContain('"@type":"Article"');
    expect(ld).toContain('"dateModified":"2026-11-04"');
    expect(ld).toContain('"@type":"BreadcrumbList"');
    expect(ld).not.toContain("FAQPage");
    expect(ld).not.toContain('"author"');
  });

  it("renders the Bangla version with localised links", async () => {
    setLocale("bn");
    render(await GuidePage(guideParams("what-is-dgda", "bn")));
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("ঔষধ প্রশাসন অধিদপ্তর (DGDA) কী?");
    expect(screen.getByRole("heading", { level: 2, name: "সম্পর্কিত গাইড" })).toBeTruthy();
  });

  it("fills the specialty chips of the departments guide from the data", async () => {
    render(await GuidePage(guideParams("medical-departments-explained")));
    const list = screen.getByRole("list", { name: "Department pages on this site" });
    const hrefs = within(list).getAllByRole("link").map((a) => a.getAttribute("href"));
    expect(hrefs.length).toBeGreaterThan(0);
    for (const href of hrefs) expect(href).toMatch(/^\/specialties\/[a-z0-9-]+$/);
  });

  it("builds metadata per language", async () => {
    const meta = await guideMetadata(guideParams("national-emergency-999"));
    expect(String(meta.title)).toContain("999");
    expect(meta.alternates?.canonical).toMatch(/\/guides\/national-emergency-999$/);
  });

  it("calls notFound() for an unknown slug", async () => {
    await expect(GuidePage(guideParams("no-such-guide"))).rejects.toThrow("NEXT_NOT_FOUND");
    expect(notFound).toHaveBeenCalled();
  });
});

describe("/emergency", () => {
  it("shows the 999 call-out, the unverified notice and emergency-listed facilities by division", async () => {
    const { container } = render(await EmergencyPage({}));
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Emergency hospitals in Bangladesh");
    expect(screen.getByRole("link", { name: /Call 999/ }).getAttribute("href")).toBe("tel:999");
    expect(screen.getByText(/call before you go/i)).toBeTruthy();
    const hospital = screen.getByRole("link", { name: "Central Heart Hospital" });
    expect(hospital.getAttribute("href")).toMatch(/^\/hospital\//);
    // Only facilities whose data states emergency services are listed.
    expect(screen.queryByRole("link", { name: "Gulshan Dental Clinic" })).toBeNull();
    const divisionLinks = screen.getAllByRole("link", { name: /^Emergency-listed facilities in / });
    expect(divisionLinks.length).toBeGreaterThan(0);
    for (const link of divisionLinks) expect(link.getAttribute("href")).toMatch(/^\/hospitals\/[a-z0-9-]+\?emergency=1$/);
    expect(jsonLdOf(container)).toContain('"@type":"BreadcrumbList"');
  });

  it("is indexable with its own canonical", async () => {
    const meta = await emergencyMetadata({});
    expect(meta.alternates?.canonical).toMatch(/\/emergency$/);
    expect(JSON.stringify(meta.robots ?? {})).not.toContain('"index":false');
  });
});
