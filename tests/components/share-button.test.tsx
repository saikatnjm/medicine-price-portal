// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ShareButton, whatsappShareUrl } from "@/components/common/share-button";
import { SiteFooter } from "@/components/layout/site-footer";

vi.mock("next/link", () => import("./next-link-mock"));

afterEach(() => {
  cleanup();
  Reflect.deleteProperty(navigator, "share");
  Reflect.deleteProperty(navigator, "clipboard");
});

describe("ShareButton", () => {
  it("copies the link when the Web Share API is missing and announces it", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
    render(<ShareButton title="Napa 500 mg" path="/medicine/napa-500" />);
    fireEvent.click(screen.getByRole("button", { name: /^Share/ }));
    await waitFor(() => expect(screen.getByRole("status").textContent).toBe("Link copied."));
    expect(writeText).toHaveBeenCalledWith(`${window.location.origin}/medicine/napa-500`);
  });

  it("uses the native share sheet when available", async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "share", { configurable: true, value: share });
    render(<ShareButton title="Napa 500 mg" path="/medicine/napa-500" />);
    fireEvent.click(screen.getByRole("button", { name: /^Share/ }));
    await waitFor(() => expect(share).toHaveBeenCalledWith({ title: "Napa 500 mg", url: `${window.location.origin}/medicine/napa-500` }));
  });

  it("offers a WhatsApp link with the encoded title and URL", () => {
    render(<ShareButton title="Napa 500 mg" path="/medicine/napa-500" />);
    const link = screen.getByRole("link", { name: "Share Napa 500 mg on WhatsApp" });
    expect(link.getAttribute("href")).toBe(whatsappShareUrl("Napa 500 mg", `${window.location.origin}/medicine/napa-500`));
    expect(link.getAttribute("href")).toMatch(/^https:\/\/wa\.me\/\?text=Napa%20500%20mg%20http/);
    expect(link.getAttribute("rel")).toBe("noopener noreferrer");
  });
});

describe("SiteFooter", () => {
  it("has a Browse column linking the registry hubs, guides and emergency hospitals", () => {
    render(<SiteFooter />);
    const browse = screen.getByRole("list", { name: "Browse" });
    const hrefs = Array.from(browse.querySelectorAll("a")).map((a) => a.getAttribute("href"));
    expect(hrefs).toEqual(["/medicines", "/generics", "/companies", "/dosage-forms", "/verify", "/guides", "/emergency"]);
    expect(screen.getByRole("link", { name: "Check registration" }).getAttribute("href")).toBe("/verify");
    expect(screen.getByRole("list", { name: "Directory" })).toBeTruthy();
  });
});
