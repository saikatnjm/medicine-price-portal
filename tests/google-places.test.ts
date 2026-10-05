import { afterEach, describe, expect, it } from "vitest";
import {
  fetchGooglePlaceDetails,
  googleMapsPlaceUrl,
  liveDetailsEnabled,
  parseGooglePlaceDetails,
} from "@/lib/google-places";
import { distanceMetres, nameSimilarity, pickMatch } from "../scripts/data/lib/google-match.mjs";
import { mergeGooglePlaces } from "../scripts/data/build-healthcare.mjs";

const realFetch = globalThis.fetch;
const env = process.env as Record<string, string | undefined>;
const original = { key: env.GOOGLE_PLACES_API_KEY, live: env.GOOGLE_PLACES_LIVE_DETAILS };

function setEnv(key: string | undefined, live: string | undefined) {
  if (key === undefined) delete env.GOOGLE_PLACES_API_KEY;
  else env.GOOGLE_PLACES_API_KEY = key;
  if (live === undefined) delete env.GOOGLE_PLACES_LIVE_DETAILS;
  else env.GOOGLE_PLACES_LIVE_DETAILS = live;
}

function mockFetch(body: unknown, ok = true) {
  const calls: { url: string; init: RequestInit | undefined }[] = [];
  globalThis.fetch = (async (url: string | URL | Request, init?: RequestInit) => {
    calls.push({ url: String(url), init });
    return { ok, json: async () => body } as Response;
  }) as typeof fetch;
  return calls;
}

afterEach(() => {
  globalThis.fetch = realFetch;
  setEnv(original.key, original.live);
});

describe("googleMapsPlaceUrl", () => {
  it("builds the official search URL with the encoded name and place id", () => {
    expect(googleMapsPlaceUrl("ChIJ123", "Square Hospitals & Co")).toBe(
      "https://www.google.com/maps/search/?api=1&query=Square%20Hospitals%20%26%20Co&query_place_id=ChIJ123",
    );
  });
});

describe("live details", () => {
  const good = { rating: 4.5, userRatingCount: 1234, googleMapsUri: "https://maps.google.com/?cid=1" };

  it("returns null without calling Google when there is no key", async () => {
    setEnv(undefined, "true");
    const calls = mockFetch(good);
    expect(await fetchGooglePlaceDetails("ChIJ123")).toBeNull();
    expect(calls.length).toBe(0);
  });

  it("returns null when the live flag is off", async () => {
    setEnv("test-key", "false");
    const calls = mockFetch(good);
    expect(liveDetailsEnabled()).toBe(false);
    expect(await fetchGooglePlaceDetails("ChIJ123")).toBeNull();
    expect(calls.length).toBe(0);
  });

  it("returns null for malformed responses and HTTP errors", async () => {
    setEnv("test-key", "true");
    mockFetch({ rating: "4.5", userRatingCount: 10, googleMapsUri: "https://maps.google.com/" });
    expect(await fetchGooglePlaceDetails("ChIJ123")).toBeNull();
    mockFetch({ rating: 9, userRatingCount: 10, googleMapsUri: "https://maps.google.com/" });
    expect(await fetchGooglePlaceDetails("ChIJ123")).toBeNull();
    mockFetch({ rating: 4, userRatingCount: 10, googleMapsUri: "javascript:alert(1)" });
    expect(await fetchGooglePlaceDetails("ChIJ123")).toBeNull();
    mockFetch(good, false);
    expect(await fetchGooglePlaceDetails("ChIJ123")).toBeNull();
    expect(parseGooglePlaceDetails(null)).toBeNull();
  });

  it("returns null when fetch throws", async () => {
    setEnv("test-key", "true");
    globalThis.fetch = (async () => {
      throw new Error("network");
    }) as typeof fetch;
    expect(await fetchGooglePlaceDetails("ChIJ123")).toBeNull();
  });

  it("parses a valid response and sends the key, field mask and no-store", async () => {
    setEnv("test-key", "true");
    const calls = mockFetch(good);
    expect(await fetchGooglePlaceDetails("ChIJ123")).toEqual(good);
    expect(calls[0].url).toBe("https://places.googleapis.com/v1/places/ChIJ123");
    const headers = calls[0].init?.headers as Record<string, string>;
    expect(headers["X-Goog-Api-Key"]).toBe("test-key");
    expect(headers["X-Goog-FieldMask"]).toBe("rating,userRatingCount,googleMapsUri");
    expect(calls[0].init?.cache).toBe("no-store");
  });
});

describe("place matching", () => {
  const record = { name: "Popular Diagnostic Centre", coordinates: { lat: 23.7465, lon: 90.376 } };
  const place = (id: string, text: string, dLat = 0) => ({
    id,
    displayName: { text },
    location: { latitude: 23.7465 + dLat, longitude: 90.376 },
  });

  it("computes token similarity and distance", () => {
    expect(nameSimilarity("Popular Diagnostic Centre", "popular diagnostic centre")).toBe(1);
    expect(nameSimilarity("Popular Diagnostic Centre", "Square Hospital")).toBe(0);
    expect(nameSimilarity("", "x")).toBe(0);
    const d = distanceMetres({ lat: 23.7465, lon: 90.376 }, { lat: 23.7475, lon: 90.376 });
    expect(d).toBeGreaterThan(100);
    expect(d).toBeLessThan(120);
  });

  it("accepts a close, similarly named place", () => {
    expect(pickMatch(record, [place("B", "Popular Diagnostic Centre Ltd", 0.0005)])).toBe("B");
  });

  it("rejects places that are too far or have a different name", () => {
    expect(pickMatch(record, [place("C", "Popular Diagnostic Centre", 0.002)])).toBe(null);
    expect(pickMatch(record, [place("D", "Green Pharmacy", 0.0001)])).toBe(null);
    // Spelling variant plus extra words falls below the 0.6 similarity bar: skipped, not guessed.
    expect(pickMatch(record, [place("A", "Popular Diagnostic Center Dhanmondi", 0.0005)])).toBe(null);
    expect(pickMatch(record, [])).toBe(null);
  });

  it("prefers the most similar acceptable candidate", () => {
    const picked = pickMatch(record, [
      place("E", "Popular Diagnostic Centre Annex Building", 0.0001),
      place("F", "Popular Diagnostic Centre", 0.0008),
    ]);
    expect(picked).toBe("F");
  });
});

describe("mergeGooglePlaces", () => {
  const records = [
    { id: "a", provenance: { recordId: "node/1" } },
    { id: "b", provenance: { recordId: "node/2" } },
    { id: "c", provenance: { recordId: "node/3" } },
  ];

  it("adds only the place id and check date to matching records", () => {
    const { records: out, merged } = mergeGooglePlaces(records, {
      "node/1": { placeId: "ChIJ1", lastChecked: "2026-10-05T00:00:00.000Z" },
      "node/2": { placeId: null, lastChecked: "2026-10-05T00:00:00.000Z" },
    });
    expect(merged).toBe(1);
    expect(out[0]).toEqual({ ...records[0], google: { placeId: "ChIJ1", lastChecked: "2026-10-05T00:00:00.000Z" } });
    expect(out[1]).toEqual(records[1]);
  });

  it("changes nothing without place ids", () => {
    expect(mergeGooglePlaces(records, null).merged).toBe(0);
  });
});
