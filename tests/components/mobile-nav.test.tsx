// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MobileNav } from "@/components/layout/mobile-nav";
import { NAV_ITEMS } from "@/components/layout/nav-items";

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));
vi.mock("next/link", () => import("./next-link-mock"));
afterEach(cleanup);

describe("MobileNav", () => {
  it("is a disclosure that reveals every main section", () => {
    render(<MobileNav items={NAV_ITEMS} />);
    const button = screen.getByRole("button", { name: "Menu" });
    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(screen.queryByRole("navigation", { name: "Main" })).toBeNull();

    fireEvent.click(button);
    expect(screen.getByRole("button", { name: "Close menu" }).getAttribute("aria-expanded")).toBe("true");
    const nav = screen.getByRole("navigation", { name: "Main" });
    const links = within(nav).getAllByRole("link");
    expect(links.map((a) => a.textContent)).toEqual(["Medicines", "Doctors", "Hospitals", "Pharmacies", "Locations"]);
    expect(links.map((a) => a.getAttribute("href"))).toEqual([
      "/search",
      "/doctors",
      "/hospitals",
      "/pharmacies",
      "/locations",
    ]);
  });

  it("closes with Escape", () => {
    render(<MobileNav items={NAV_ITEMS} />);
    fireEvent.click(screen.getByRole("button", { name: "Menu" }));
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("navigation", { name: "Main" })).toBeNull();
    expect(screen.getByRole("button", { name: "Menu" })).toBeTruthy();
  });
});
