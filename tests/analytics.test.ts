import { describe, expect, it } from "vitest";
import { resolveGaMeasurementId, sanitizePageLocation } from "@/lib/analytics";

describe("resolveGaMeasurementId", () => {
  it("accepts a GA4 id", () => {
    expect(resolveGaMeasurementId({ NEXT_PUBLIC_GA_MEASUREMENT_ID: " g-ab12cd34ef " })).toBe("G-AB12CD34EF");
    expect(
      resolveGaMeasurementId({ NEXT_PUBLIC_GA_MEASUREMENT_ID: "G-AB12CD34EF", VERCEL_ENV: "production" }),
    ).toBe("G-AB12CD34EF");
  });

  it("is off when unset, invalid or on a preview deployment", () => {
    expect(resolveGaMeasurementId({})).toBeNull();
    expect(resolveGaMeasurementId({ NEXT_PUBLIC_GA_MEASUREMENT_ID: "UA-12345-1" })).toBeNull();
    expect(resolveGaMeasurementId({ NEXT_PUBLIC_GA_MEASUREMENT_ID: "G-<script>" })).toBeNull();
    expect(
      resolveGaMeasurementId({ NEXT_PUBLIC_GA_MEASUREMENT_ID: "G-AB12CD34EF", VERCEL_ENV: "preview" }),
    ).toBeNull();
  });
});

describe("sanitizePageLocation", () => {
  it("removes the near-me position and the hash, keeping other parameters", () => {
    expect(sanitizePageLocation("https://example.org/hospitals?near=23.75,90.38&kind=clinic#x")).toBe(
      "https://example.org/hospitals?kind=clinic",
    );
    expect(sanitizePageLocation("https://example.org/search?q=napa")).toBe("https://example.org/search?q=napa");
  });

  it("returns an empty string for invalid input", () => {
    expect(sanitizePageLocation("not a url")).toBe("");
  });
});
