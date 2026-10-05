import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GET } from "@/app/api/suggest/route";
import { services } from "@/data";
import type { SuggestionGroup } from "@/domain/read-models";

vi.mock("@/data", async () => {
  const { createServices } = await import("@/services");
  const { createLocalRepositories } = await import("@/data/local/repositories");
  const { fixtureDataset } = await import("./fixtures");
  return { services: createServices(createLocalRepositories(fixtureDataset)) };
});

afterEach(() => vi.restoreAllMocks());

const request = (search: string) => new NextRequest(`http://localhost:3000/api/suggest${search}`);
const CACHEABLE = "public, s-maxage=300, stale-while-revalidate=600";

describe("GET /api/suggest", () => {
  it("returns grouped suggestions with a cache header", async () => {
    const response = await GET(request("?q=gul"));
    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe(CACHEABLE);
    const { groups } = (await response.json()) as { groups: SuggestionGroup[] };
    expect(groups.map((g) => g.type)).toEqual(["doctor", "hospital", "pharmacy", "location"]);
    const hospital = groups.find((g) => g.type === "hospital")!;
    expect(hospital.items[0]).toMatchObject({
      label: "Gulshan Dental Clinic",
      href: "/hospital/gulshan-dental-clinic-dhaka",
    });
  });

  it("returns empty groups for a query that is too short or missing", async () => {
    for (const search of ["?q=a", "?q=%20%20", ""]) {
      const response = await GET(request(search));
      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({ groups: [] });
      expect(response.headers.get("Cache-Control")).toBe(CACHEABLE);
    }
  });

  it("returns empty groups for a query nothing matches", async () => {
    const response = await GET(request("?q=qqqzzz"));
    expect(await response.json()).toEqual({ groups: [] });
  });

  it("never exposes an internal error: responds 200 with no groups and no caching", async () => {
    vi.spyOn(services.search, "suggest").mockRejectedValue(new Error("boom: secret detail"));
    const response = await GET(request("?q=napa"));
    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    const text = await response.text();
    expect(JSON.parse(text)).toEqual({ groups: [] });
    expect(text).not.toContain("secret");
  });
});
