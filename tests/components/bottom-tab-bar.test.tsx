// @vitest-environment jsdom
import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BottomTabBar, isTabActive, TABS } from "@/components/layout/bottom-tab-bar";

const pathname = vi.hoisted(() => ({ current: "/" }));
vi.mock("next/navigation", () => ({ usePathname: () => pathname.current }));
vi.mock("next/link", () => import("./next-link-mock"));
afterEach(cleanup);

describe("BottomTabBar", () => {
  it("lists the five primary destinations", () => {
    pathname.current = "/";
    render(<BottomTabBar />);
    const nav = screen.getByRole("navigation", { name: "Quick navigation" });
    const links = within(nav).getAllByRole("link");
    expect(links.map((a) => a.textContent)).toEqual(["Search", "Doctors", "Hospitals", "Pharmacies", "Saved"]);
    expect(links.map((a) => a.getAttribute("href"))).toEqual(["/search", "/doctors", "/hospitals", "/pharmacies", "/saved"]);
    expect(links.some((a) => a.getAttribute("aria-current") === "page")).toBe(false);
  });

  it("marks the current section, including detail pages and the /bn prefix", () => {
    pathname.current = "/bn/hospital/central-heart-hospital-dhaka";
    render(<BottomTabBar />);
    expect(screen.getByRole("link", { name: "Hospitals" }).getAttribute("aria-current")).toBe("page");
    expect(screen.getByRole("link", { name: "Pharmacies" }).getAttribute("aria-current")).toBeNull();
  });

  it("does not confuse /hospitals with /hospital paths", () => {
    const hospitals = TABS.find((tab) => tab.href === "/hospitals")!;
    expect(isTabActive("/hospitals/dhaka", hospitals)).toBe(true);
    expect(isTabActive("/hospital/x", hospitals)).toBe(true);
    expect(isTabActive("/hospitalx", hospitals)).toBe(false);
  });
});
