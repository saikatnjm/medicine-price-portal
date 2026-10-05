import { describe, expect, it } from "vitest";
import { mapEmbedFor, mapLinksFor } from "@/lib/maps";

const coordinates = { lat: 23.75, lon: 90.38 };
const google = { placeId: "ChIJ-test_place", lastChecked: "2026-10-01T00:00:00Z" };

describe("mapLinksFor", () => {
  it("links to exact coordinates when available", () => {
    const links = mapLinksFor({ name: "Alpha Pharmacy", coordinates });
    expect(links === null).toBe(false);
    const directions = new URL(links!.directionsUrl);
    expect(directions.hostname).toBe("www.google.com");
    expect(directions.pathname).toBe("/maps/dir/");
    expect(directions.searchParams.get("api")).toBe("1");
    expect(directions.searchParams.get("destination")).toBe("23.75,90.38");
    expect(directions.searchParams.has("destination_place_id")).toBe(false);
    const view = new URL(links!.viewUrl);
    expect(view.hostname).toBe("www.google.com");
    expect(view.searchParams.get("api")).toBe("1");
    expect(view.searchParams.get("query")).toBe("23.75,90.38");
    expect([links!.hasExactLocation, links!.isGooglePlace]).toEqual([true, false]);
  });

  it("falls back to an address search that includes name, address and country", () => {
    const links = mapLinksFor({ name: "Alpha Pharmacy", address: " Road 27, Dhanmondi " });
    expect([links!.hasExactLocation, links!.isGooglePlace]).toEqual([false, false]);
    const query = new URL(links!.viewUrl).searchParams.get("query");
    expect(query).toBe("Alpha Pharmacy, Road 27, Dhanmondi, Bangladesh");
    expect(new URL(links!.directionsUrl).searchParams.get("destination")).toBe(query);
  });

  it("adds place ids when a Google place is stored", () => {
    const links = mapLinksFor({ name: "Central Heart Hospital", coordinates, google });
    expect(links?.isGooglePlace).toBe(true);
    const view = new URL(links!.viewUrl);
    expect(view.searchParams.get("query_place_id")).toBe(google.placeId);
    expect(view.searchParams.get("query")).toBe("Central Heart Hospital");
    const directions = new URL(links!.directionsUrl);
    expect(directions.searchParams.get("destination_place_id")).toBe(google.placeId);
    expect(directions.searchParams.get("destination")).toBe("23.75,90.38");
  });

  it("returns null when there is neither coordinates nor address", () => {
    expect(mapLinksFor({ name: "Nowhere Clinic" })).toBeNull();
    expect(mapLinksFor({ name: "Nowhere Clinic", address: "   " })).toBeNull();
  });

  it("ignores invalid coordinates and uses the address instead", () => {
    const links = mapLinksFor({ name: "Alpha", address: "Road 1", coordinates: { lat: NaN, lon: 90 } });
    expect(links?.hasExactLocation).toBe(false);
    expect(new URL(links!.directionsUrl).searchParams.get("destination")).toBe("Alpha, Road 1, Bangladesh");
    expect(mapLinksFor({ name: "Alpha", coordinates: { lat: 200, lon: 90 } })).toBeNull();
  });

  it("URL-encodes names containing ampersands and Bangla text", () => {
    const links = mapLinksFor({ name: "Smith & Sons ফার্মেসি", address: "রোড ২৭" });
    expect(links!.directionsUrl).not.toContain(" ");
    expect(links!.directionsUrl).not.toMatch(/&Sons/);
    const destination = new URL(links!.directionsUrl).searchParams.get("destination");
    expect(destination).toBe("Smith & Sons ফার্মেসি, রোড ২৭, Bangladesh");
    // Only api= and destination= parameters exist: the ampersand did not split anything.
    expect([...new URL(links!.directionsUrl).searchParams.keys()]).toEqual(["api", "destination"]);
  });
});

describe("mapEmbedFor", () => {
  it("returns null without usable coordinates", () => {
    expect(mapEmbedFor({ name: "A", address: "Road 1" }, "key")).toBeNull();
    expect(mapEmbedFor({ name: "A", coordinates: { lat: NaN, lon: 1 } }, undefined)).toBeNull();
  });

  it("uses an OpenStreetMap embed with a marker when no key is configured", () => {
    const embed = mapEmbedFor({ name: "A", coordinates }, undefined);
    expect(embed?.provider).toBe("openstreetmap");
    const src = new URL(embed!.src);
    expect(src.hostname).toBe("www.openstreetmap.org");
    expect(src.searchParams.get("marker")).toBe("23.75,90.38");
    const [west, south, east, north] = src.searchParams.get("bbox")!.split(",").map(Number) as [number, number, number, number];
    expect(west).toBeLessThan(90.38);
    expect(east).toBeGreaterThan(90.38);
    expect(south).toBeLessThan(23.75);
    expect(north).toBeGreaterThan(23.75);
    expect(embed!.fullMapUrl).toContain("openstreetmap.org");
  });

  it("uses the Google embed when a key is supplied", () => {
    const embed = mapEmbedFor({ name: "A", coordinates }, "test-key");
    expect(embed?.provider).toBe("google");
    const src = new URL(embed!.src);
    expect(src.pathname).toBe("/maps/embed/v1/place");
    expect(src.searchParams.get("key")).toBe("test-key");
    expect(src.searchParams.get("q")).toBe("23.75,90.38");
    expect(embed!.fullMapUrl).toContain("google.com/maps");
  });

  it("prefers the stored place id with a key", () => {
    const embed = mapEmbedFor({ name: "A", coordinates, google }, " test-key ");
    const src = new URL(embed!.src);
    expect(src.searchParams.get("key")).toBe("test-key");
    expect(src.searchParams.get("q")).toBe(`place_id:${google.placeId}`);
  });

  it("treats a whitespace-only key as missing", () => {
    expect(mapEmbedFor({ name: "A", coordinates }, "   ")?.provider).toBe("openstreetmap");
    expect(mapEmbedFor({ name: "A", coordinates }, "")?.provider).toBe("openstreetmap");
  });
});
