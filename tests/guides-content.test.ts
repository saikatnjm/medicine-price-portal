import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { findGuide, GUIDES, relatedGuides, type GuideContent } from "@/content/guides";
import { LOCALES } from "@/i18n/config";
import { routes } from "@/lib/routes";

const seed = <T>(name: string): T =>
  JSON.parse(readFileSync(new URL(`../src/data/local/seed/${name}.json`, import.meta.url), "utf8")) as T;
const genericSlugs = new Set(seed<{ slug: string }[]>("generics").map((g) => g.slug));
const companySlugs = new Set(seed<{ slug: string }[]>("manufacturers").map((m) => m.slug));
const specialtySlugs = new Set(seed<{ slug: string }[]>("specialties").map((s) => s.slug));
const guideSlugs = new Set(GUIDES.map((g) => g.slug));

/** Hubs a guide may link to, plus detail prefixes whose slug is checked against the data. */
const HUBS = new Set([
  routes.search(),
  routes.verify(),
  routes.generics(),
  routes.companies(),
  routes.dosageForms(),
  routes.medicines(),
  routes.hospitals(),
  routes.pharmacies(),
  routes.locations(),
  routes.specialties(),
  routes.emergency(),
  routes.about(),
  routes.guides(),
  routes.compare(),
]);
const DETAIL: Array<[string, Set<string>]> = [
  ["/guides/", guideSlugs],
  ["/generics/", genericSlugs],
  ["/companies/", companySlugs],
  ["/specialties/", specialtySlugs],
];

function resolves(href: string): boolean {
  if (HUBS.has(href)) return true;
  return DETAIL.some(([prefix, slugs]) => href.startsWith(prefix) && slugs.has(decodeURIComponent(href.slice(prefix.length))));
}

/** Every visible text of one language version (sources excluded: their URLs contain article ids). */
function allText(c: GuideContent): string {
  const parts = [c.title, c.description, c.summary];
  for (const b of c.body) {
    if (b.type === "p" || b.type === "h2" || b.type === "note") parts.push(b.text);
    if (b.type === "ul" || b.type === "ol") parts.push(...b.items);
    if (b.type === "link") parts.push(b.label);
  }
  for (const { q, a } of c.faq ?? []) parts.push(q, a);
  return parts.join("\n");
}

/** The DGHS code-system example id is quoted verbatim in the registry guides. */
const DAR_EXAMPLE = "353-0026-039";
/** "৯৯৯" in the 999 guide title, "৫০০" as the search example of Bangla digits not matching "500". */
const ALLOWED_BANGLA_DIGITS = new Set(["৯৯৯", "৫০০"]);

function phoneLike(text: string): string[] {
  const t = text.split(DAR_EXAMPLE).join(" ");
  const patterns = [
    /\d{5,}/g, // long digit runs (hotlines such as 16263, mobile numbers)
    /\+?88\s?0\d/g, // country-code prefixed numbers
    /\b\d{2,5}[-\s]\d{3,4}[-\s]?\d{3,4}\b/g, // grouped phone numbers
    /\b(?!999\b)\d{3,5}\b(?=\s*(?:hotline|helpline|হটলাইন|হেল্পলাইন))/gi, // short codes next to "hotline"
    /[০-৯]+/g, // Bangla digits (body text uses Latin digits; quoted examples allowed below)
  ];
  return patterns.flatMap((p) => t.match(p) ?? []).filter((m) => !ALLOWED_BANGLA_DIGITS.has(m));
}

describe("guide content", () => {
  it("has 25 guides with unique slugs, all registered for lookup", () => {
    expect(GUIDES).toHaveLength(25);
    expect(guideSlugs.size).toBe(GUIDES.length);
    for (const g of GUIDES) expect(findGuide(g.slug)).toBe(g);
    expect(findGuide("no-such-guide")).toBeNull();
  });

  it.each(GUIDES.map((g) => [g.slug, g] as const))("%s is complete in both languages", (_slug, guide) => {
    expect(guide.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    expect(guide.updatedAt).toBe("2026-11-04");
    for (const lang of LOCALES) {
      const c = guide.content[lang];
      expect(c.title.length).toBeGreaterThan(5);
      expect(c.summary.length).toBeGreaterThan(20);
      expect(c.description.length).toBeGreaterThan(50);
      expect(c.description.length).toBeLessThanOrEqual(160);
      expect(c.body.some((b) => b.type === "h2")).toBe(true);
      expect(c.faq?.length ?? 0).toBeGreaterThanOrEqual(3);
      expect(c.faq?.length ?? 0).toBeLessThanOrEqual(5);
      const links = c.body.filter((b) => b.type === "link");
      expect(links.length).toBeGreaterThanOrEqual(2);
      expect(links.length).toBeLessThanOrEqual(4);
    }
    // Same structure in both languages.
    expect(guide.content.bn.body.map((b) => b.type)).toEqual(guide.content.en.body.map((b) => b.type));
  });

  it("links only to routes that exist", () => {
    const broken = GUIDES.flatMap((g) =>
      LOCALES.flatMap((lang) =>
        g.content[lang].body.flatMap((b) => (b.type === "link" && !resolves(b.href) ? [`${g.slug}/${lang}: ${b.href}`] : [])),
      ),
    );
    expect(broken).toEqual([]);
  });

  it("publishes no phone number other than 999", () => {
    const found = GUIDES.flatMap((g) =>
      LOCALES.flatMap((lang) => phoneLike(allText(g.content[lang])).map((m) => `${g.slug}/${lang}: ${m}`)),
    );
    expect(found).toEqual([]);
  });

  it("never links unsafe DGDA mirrors and cites only https sources", () => {
    for (const g of GUIDES) {
      for (const s of g.sources ?? []) {
        expect(s.url).toMatch(/^https:\/\//);
        expect(s.url).not.toMatch(/dgdagov\.info|\/\/\d+\.\d+\.\d+\.\d+/);
      }
      for (const lang of LOCALES) expect(allText(g.content[lang])).not.toMatch(/dgdagov\.info/);
    }
  });

  it("points readers of health-related guides to a registered doctor or pharmacist", () => {
    for (const g of GUIDES.filter((x) => x.category !== "using-the-site")) {
      expect(allText(g.content.en), g.slug).toMatch(/doctor or (a )?pharmacist|pharmacist or (a )?doctor/i);
      expect(allText(g.content.bn), g.slug).toMatch(/ডাক্তার বা ফার্মাসিস্ট|ফার্মাসিস্ট বা ডাক্তার/);
    }
  });

  it("relates guides within the same category", () => {
    const guide = GUIDES[0]!;
    const related = relatedGuides(guide);
    expect(related.length).toBeGreaterThan(0);
    for (const r of related) {
      expect(r.category).toBe(guide.category);
      expect(r.slug).not.toBe(guide.slug);
    }
  });
});
