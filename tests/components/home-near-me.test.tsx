// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { HomeNearMe } from "@/components/home/home-near-me";

function stubGeolocation(impl: (ok: PositionCallback, fail: PositionErrorCallback) => void) {
  Object.defineProperty(navigator, "geolocation", { configurable: true, value: { getCurrentPosition: impl } });
}

afterEach(() => {
  cleanup();
  Reflect.deleteProperty(navigator, "geolocation");
});

describe("HomeNearMe", () => {
  it("asks for location only after the click and offers rounded near-me links", () => {
    let asked = 0;
    stubGeolocation((ok) => {
      asked += 1;
      ok({ coords: { latitude: 23.75123, longitude: 90.38456 } } as GeolocationPosition);
    });
    render(<HomeNearMe />);
    expect(asked).toBe(0);
    fireEvent.click(screen.getByRole("button", { name: "Use my location" }));
    expect(asked).toBe(1);
    expect(screen.getByRole("link", { name: "Hospitals & clinics" }).getAttribute("href")).toBe("/hospitals?near=23.75%2C90.38");
    expect(screen.getByRole("link", { name: "Pharmacies" }).getAttribute("href")).toBe("/pharmacies?near=23.75%2C90.38");
    expect(screen.queryByRole("link", { name: "Doctors" })).toBeNull();
  });

  it("offers doctors only when asked to, and suggests searching by area when permission is denied", () => {
    stubGeolocation((_ok, fail) => fail({ code: 1, PERMISSION_DENIED: 1 } as unknown as GeolocationPositionError));
    render(<HomeNearMe showDoctors />);
    fireEvent.click(screen.getByRole("button", { name: "Use my location" }));
    expect(screen.getByRole("status").textContent).toMatch(/Search by area instead/);
  });
});
