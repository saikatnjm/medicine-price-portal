import { describe, expect, it } from "vitest";
import {
  distanceKm,
  formatDistance,
  formatNearParam,
  isInBangladesh,
  isValidCoordinates,
  parseNearParam,
  roundCoordinates,
} from "@/lib/geo";

const dhaka = { lat: 23.8103, lon: 90.4125 };
const chattogram = { lat: 22.3569, lon: 91.7832 };

describe("isValidCoordinates", () => {
  it("accepts finite in-range coordinates, including the boundaries", () => {
    expect(isValidCoordinates(dhaka)).toBe(true);
    expect(isValidCoordinates({ lat: 90, lon: -180 })).toBe(true);
    expect(isValidCoordinates({ lat: 0, lon: 0 })).toBe(true);
  });

  it("rejects NaN, infinities and out-of-range values", () => {
    expect(isValidCoordinates({ lat: NaN, lon: 90 })).toBe(false);
    expect(isValidCoordinates({ lat: 23, lon: Infinity })).toBe(false);
    expect(isValidCoordinates({ lat: 90.1, lon: 90 })).toBe(false);
    expect(isValidCoordinates({ lat: 23, lon: -180.5 })).toBe(false);
  });

  it("rejects non-objects and wrongly typed fields", () => {
    for (const value of [null, undefined, "23,90", 5, true, [], {}, { lat: "23", lon: "90" }, { lat: 23 }]) {
      expect(isValidCoordinates(value)).toBe(false);
    }
  });
});

describe("isInBangladesh", () => {
  it("accepts Dhaka and Chattogram and rejects far-away places", () => {
    expect(isInBangladesh(dhaka)).toBe(true);
    expect(isInBangladesh(chattogram)).toBe(true);
    expect(isInBangladesh({ lat: 28.6, lon: 77.2 })).toBe(false); // Delhi
    expect(isInBangladesh({ lat: 0, lon: 0 })).toBe(false);
  });
});

describe("distanceKm", () => {
  it("is zero for identical points and symmetric", () => {
    expect(distanceKm(dhaka, dhaka)).toBe(0);
    expect(Math.abs(distanceKm(dhaka, chattogram) - distanceKm(chattogram, dhaka)) < 1e-9).toBe(true);
  });

  it("measures Dhaka to Chattogram as roughly 216 km", () => {
    expect(Math.abs(distanceKm(dhaka, chattogram) - 216)).toBeLessThan(5);
  });

  it("measures one degree of latitude as about 111 km", () => {
    expect(Math.abs(distanceKm({ lat: 23, lon: 90 }, { lat: 24, lon: 90 }) - 111.2) < 0.5).toBe(true);
  });
});

describe("formatDistance", () => {
  it("rounds short distances to 50 m steps, never below 50 m", () => {
    expect(formatDistance(0.35)).toBe("350 m away");
    expect(formatDistance(0.001)).toBe("50 m away");
    expect(formatDistance(0.97)).toBe("950 m away");
  });

  it("uses one decimal below 10 km and whole kilometres from 10 km", () => {
    expect(formatDistance(1.2)).toBe("1.2 km away");
    expect(formatDistance(9.94)).toBe("9.9 km away");
    expect(formatDistance(14.2)).toBe("14 km away");
  });
});

describe("roundCoordinates / formatNearParam", () => {
  it("keeps two decimals (about 1 km) so precise positions never reach URLs", () => {
    expect(roundCoordinates({ lat: 23.754321, lon: 90.389876 })).toEqual({ lat: 23.75, lon: 90.39 });
    expect(formatNearParam({ lat: 23.754321, lon: 90.389876 })).toBe("23.75,90.39");
  });

  it("round-trips through parseNearParam", () => {
    expect(parseNearParam(formatNearParam(dhaka))).toEqual({ lat: 23.81, lon: 90.41 });
  });
});

describe("parseNearParam", () => {
  it("parses valid values and rounds to 2 decimals", () => {
    expect(parseNearParam("23.7543,90.3898")).toEqual({ lat: 23.75, lon: 90.39 });
    expect(parseNearParam(" 23.75 , 90.38 ")).toEqual({ lat: 23.75, lon: 90.38 });
    expect(parseNearParam("24,90")).toEqual({ lat: 24, lon: 90 });
  });

  it("rejects missing and garbage input", () => {
    for (const raw of [null, undefined, "", "abc", "23.75", "23.75,", ",90", "23.75;90.38", "23.75,90.38,1", "NaN,NaN", "1e1,90"]) {
      expect(parseNearParam(raw)).toBeNull();
    }
  });

  it("rejects valid coordinates outside Bangladesh", () => {
    expect(parseNearParam("28.61,77.21")).toBeNull();
    expect(parseNearParam("0,0")).toBeNull();
    expect(parseNearParam("-23.75,90.38")).toBeNull();
  });

  it("tolerates surrounding whitespace, including a trailing newline", () => {
    expect(parseNearParam("23.75,90.38\n")).toEqual({ lat: 23.75, lon: 90.38 });
  });

  it("rejects injection-like strings", () => {
    for (const raw of [
      "23.75,90.38<script>alert(1)</script>",
      "23.75,90.38'; DROP TABLE facilities;--",
      "23.75,90.38&page=2",
      "../../etc/passwd",
      "javascript:alert(1)",
    ]) {
      expect(parseNearParam(raw)).toBeNull();
    }
  });
});
