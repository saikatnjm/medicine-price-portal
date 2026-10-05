// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ResultsMap } from "@/components/directory/results-map";
import type { MapMarker } from "@/lib/map-markers";

const SCRIPT_URL = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";

const markers: MapMarker[] = [
  { id: "a", name: "Alpha Clinic", href: "/hospital/alpha", lat: 23.75, lon: 90.38, label: "Clinic · Dhanmondi, Dhaka" },
  { id: "b", name: "Beta Hospital", href: "/hospital/beta", lat: 23.76, lon: 90.39, label: "Hospital · Dhaka" },
];

function leafletScripts() {
  return document.querySelectorAll(`script[src="${SCRIPT_URL}"]`);
}

afterEach(() => {
  cleanup();
  document.head.innerHTML = "";
  Reflect.deleteProperty(window, "L");
});

describe("ResultsMap", () => {
  it("renders the toggle and the list, with the result count shown once opened", () => {
    render(
      <ResultsMap markers={markers}>
        <p>the list</p>
      </ResultsMap>,
    );
    const button = screen.getByRole("button", { name: "Show map" });
    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(screen.getByText("the list")).toBeTruthy();
    expect(leafletScripts()).toHaveLength(0);

    fireEvent.click(button);
    expect(screen.getByRole("button", { name: "Hide map" }).getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByRole("region", { name: "Map of results on this page" })).toBeTruthy();
    expect(screen.getByText("Map shows the 2 results on this page")).toBeTruthy();
  });

  it("renders only the list when there are no markers", () => {
    render(
      <ResultsMap markers={[]}>
        <p>the list</p>
      </ResultsMap>,
    );
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.getByText("the list")).toBeTruthy();
  });

  it("requests nothing until clicked, then injects the Leaflet script exactly once", () => {
    render(<ResultsMap markers={markers} />);
    expect(leafletScripts()).toHaveLength(0);
    fireEvent.click(screen.getByRole("button", { name: "Show map" }));
    expect(leafletScripts()).toHaveLength(1);
    const style = document.querySelector('link[href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"]');
    expect(style).not.toBeNull();
  });

  it("shows a text message when the script fails to load", async () => {
    render(<ResultsMap markers={markers} />);
    fireEvent.click(screen.getByRole("button", { name: "Show map" }));
    const script = document.querySelector(`script[src="${SCRIPT_URL}"]`)!;
    fireEvent.error(script);
    expect(await screen.findByText("Map could not be loaded. Use the Directions links instead.")).toBeTruthy();
  });
});
