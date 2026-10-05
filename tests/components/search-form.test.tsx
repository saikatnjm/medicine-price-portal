// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SearchForm } from "@/components/search/search-form";
import type { SuggestionGroup } from "@/domain/read-models";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const LABEL = "Search medicines, hospitals, clinics, pharmacies and specialties";

const groups: SuggestionGroup[] = [
  {
    type: "medicine",
    label: "Medicines",
    items: [{ type: "medicine", label: "Napa 500 mg Tablet", detail: "Paracetamol", href: "/medicine/napa-500mg" }],
  },
  {
    type: "hospital",
    label: "Hospitals & clinics",
    items: [{ type: "hospital", label: "Gulshan Dental Clinic", href: "/hospital/gulshan-dental-clinic-dhaka" }],
  },
];

function stubSuggestApi(body: { groups: SuggestionGroup[] } = { groups }) {
  const fetchMock = vi.fn(async () => ({ ok: true, json: async () => body }));
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

describe("SearchForm", () => {
  it("is a plain GET form to /search with a labelled combobox (works without JavaScript)", () => {
    render(<SearchForm size="lg" defaultValue="napa" />);
    const form = screen.getByRole("search");
    expect(form.getAttribute("action")).toBe("/search");
    expect(form.getAttribute("method")).toBe("get");
    const input = screen.getByRole("combobox", { name: LABEL }) as HTMLInputElement;
    expect(input.name).toBe("q");
    expect(input.value).toBe("napa");
    expect(input.getAttribute("aria-autocomplete")).toBe("list");
    expect(input.getAttribute("aria-expanded")).toBe("false");
    expect(screen.getByRole("button", { name: "Search" })).toBeTruthy();
  });

  it("keeps the label for screen readers only in the compact size", () => {
    render(<SearchForm />);
    expect(screen.getByText(LABEL).className).toContain("sr-only");
  });

  it("does not call the API before the visitor types or for a one-character query", async () => {
    const fetchMock = stubSuggestApi();
    render(<SearchForm />);
    const input = screen.getByRole("combobox");
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "n" } });
    await new Promise((resolve) => setTimeout(resolve, 300));
    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.queryByRole("option")).toBeNull();
  });

  it("shows grouped suggestions as options and supports arrow keys and Escape", async () => {
    const fetchMock = stubSuggestApi();
    render(<SearchForm />);
    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "gul" } });

    const options = await screen.findAllByRole("option");
    expect(options.map((o) => o.textContent)).toEqual(["Napa 500 mg TabletParacetamol", "Gulshan Dental Clinic"]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect((fetchMock.mock.calls[0] as unknown[])[0]).toBe("/api/suggest?q=gul");
    expect(screen.getByText("Hospitals & clinics")).toBeTruthy();
    expect(screen.getByRole("group", { name: "Medicines" })).toBeTruthy();
    expect(input.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByText("2 suggestions available")).toBeTruthy();

    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(options[0]!.getAttribute("aria-selected")).toBe("true");
    expect(input.getAttribute("aria-activedescendant")).toBe(options[0]!.id);
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(options[1]!.getAttribute("aria-selected")).toBe("true");
    fireEvent.keyDown(input, { key: "ArrowDown" }); // wraps around
    expect(options[0]!.getAttribute("aria-selected")).toBe("true");

    fireEvent.keyDown(input, { key: "Escape" });
    await waitFor(() => expect(input.getAttribute("aria-expanded")).toBe("false"));
  });

  it("falls back to the plain form when the suggestion request fails", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => ({ ok: false, json: async () => ({}) })));
    render(<SearchForm />);
    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "napa" } });
    await new Promise((resolve) => setTimeout(resolve, 400));
    expect(screen.queryByRole("option")).toBeNull();
    expect(input.getAttribute("aria-expanded")).toBe("false");
  });
});
