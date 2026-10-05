// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NearMeButton } from "@/components/directory/near-me-button";

const nav = vi.hoisted(() => ({ push: vi.fn(), search: "" }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: nav.push }),
  usePathname: () => "/hospitals",
  useSearchParams: () => new URLSearchParams(nav.search),
}));

function stubGeolocation(impl: (ok: PositionCallback, fail: PositionErrorCallback) => void) {
  Object.defineProperty(navigator, "geolocation", {
    configurable: true,
    value: { getCurrentPosition: impl },
  });
}

beforeEach(() => {
  nav.push.mockClear();
  nav.search = "";
});
afterEach(() => {
  cleanup();
  Reflect.deleteProperty(navigator, "geolocation");
});

describe("NearMeButton", () => {
  it("adds a rounded near parameter to the URL and resets paging", () => {
    nav.search = "q=heart&page=3";
    stubGeolocation((ok) => ok({ coords: { latitude: 23.75123, longitude: 90.38456 } } as GeolocationPosition));
    render(<NearMeButton />);
    fireEvent.click(screen.getByRole("button", { name: "Sort by distance from me" }));
    expect(nav.push).toHaveBeenCalledTimes(1);
    const url = new URL(nav.push.mock.calls[0]![0] as string, "http://localhost");
    expect(url.pathname).toBe("/hospitals");
    expect(url.searchParams.get("q")).toBe("heart");
    expect(url.searchParams.has("page")).toBe(false);
    // About 1 km precision: the exact position never reaches the URL.
    expect(url.searchParams.get("near")).toBe("23.75,90.38");
  });

  it("explains what to do when location permission is denied", () => {
    stubGeolocation((_ok, fail) =>
      fail({ code: 1, PERMISSION_DENIED: 1 } as unknown as GeolocationPositionError),
    );
    render(<NearMeButton />);
    fireEvent.click(screen.getByRole("button", { name: "Sort by distance from me" }));
    expect(screen.getByRole("status").textContent).toMatch(/permission was not given/);
    expect(nav.push).not.toHaveBeenCalled();
  });

  it("explains when the browser has no geolocation", () => {
    render(<NearMeButton />);
    fireEvent.click(screen.getByRole("button", { name: "Sort by distance from me" }));
    expect(screen.getByRole("status").textContent).toMatch(/not available/);
  });

  it("offers to clear an active near-me sort", () => {
    nav.search = "near=23.75%2C90.38&q=heart";
    render(<NearMeButton />);
    fireEvent.click(screen.getByRole("button", { name: "Clear “near me”" }));
    expect(nav.push).toHaveBeenCalledWith("/hospitals?q=heart");
  });
});
