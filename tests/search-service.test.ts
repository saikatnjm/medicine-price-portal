import { describe, expect, it } from "vitest";
import { createLocalRepositories } from "@/data/local/repositories";
import { SearchService } from "@/services/search-service";
import { fixtureDataset } from "./fixtures";

const search = new SearchService(createLocalRepositories(fixtureDataset));
const slugs = (r: { items: { medicine: { slug: string } }[] }) =>
  r.items.map((i) => i.medicine.slug);

describe("SearchService", () => {
  it("matches brand names case-insensitively and partially", async () => {
    const result = await search.searchMedicines("NAP");
    expect(result.status).toBe("ok");
    // Same brand: tablets before liquids; "Napa SR" sorts before "Napadol".
    expect(slugs(result)).toEqual([
      "napa-500mg",
      "napa-120mg-5ml-suspension",
      "napa-sr-500mg-sr-tablet",
      "napadol-500mg",
    ]);
  });

  it("ranks exact brand matches before other matches", async () => {
    expect(slugs(await search.searchMedicines("napadol"))).toEqual(["napadol-500mg"]);
    // Exact brand first; generic "paracetamol" must not match mid-word.
    expect(slugs(await search.searchMedicines("ace"))).toEqual(["ace-500mg"]);
  });

  it("matches generic names by prefix", async () => {
    expect((await search.searchMedicines("para")).total).toBe(5);
    expect(slugs(await search.searchMedicines("omepra"))).toEqual(["seclo-20mg"]);
  });

  it("matches slugs, registered names and multi-word queries with strength", async () => {
    expect(slugs(await search.searchMedicines("ace-500mg"))).toEqual(["ace-500mg"]);
    expect(slugs(await search.searchMedicines("Napa SR 500"))).toEqual(["napa-sr-500mg-sr-tablet"]);
    expect(slugs(await search.searchMedicines("napa 500"))).toEqual([
      "napa-500mg",
      "napa-sr-500mg-sr-tablet",
      "napadol-500mg",
    ]);
  });

  it("tolerates missing spaces between words", async () => {
    expect(slugs(await search.searchMedicines("napasr"))).toEqual(["napa-sr-500mg-sr-tablet"]);
    expect(slugs(await search.searchMedicines("napa500"))[0]).toBe("napa-500mg");
  });

  it("falls back to the first word when no medicine matches every word", async () => {
    const result = await search.searchMedicines("napa extra");
    expect(result.matchedQuery).toBe("napa");
    expect(result.query).toBe("napa extra");
    expect(slugs(result)[0]).toBe("napa-500mg");
  });

  it("reports paging and price ranges", async () => {
    const result = await search.searchMedicines("napa");
    expect(result.totalPages).toBe(1);
    expect(result.matchedQuery).toBe("napa");
    const napa = result.items.find((i) => i.medicine.slug === "napa-500mg");
    expect(napa?.priceStats).toEqual({ lowest: 11.5, highest: 12, count: 2, hasSampleData: true });
  });

  it("returns summaries with generic and manufacturer", async () => {
    const [first] = (await search.searchMedicines("seclo")).items;
    expect(first?.generic.name).toBe("Omeprazole");
    expect(first?.manufacturer.name).toBe("Maker Ltd.");
  });

  it("handles empty, too-short, unmatched and special-character queries", async () => {
    expect((await search.searchMedicines("   ")).status).toBe("empty_query");
    expect((await search.searchMedicines(undefined)).status).toBe("empty_query");
    expect((await search.searchMedicines("a")).status).toBe("query_too_short");
    const none = await search.searchMedicines("zzzz");
    expect(none.status).toBe("ok");
    expect(none.total).toBe(0);
    expect(none.items).toEqual([]);
    expect((await search.searchMedicines("<script>%$#")).total).toBe(0);
  });

  it("falls back to page 1 for invalid page numbers", async () => {
    expect((await search.searchMedicines("napa", -3)).page).toBe(1);
    expect((await search.searchMedicines("napa", Number.NaN)).page).toBe(1);
  });
});
