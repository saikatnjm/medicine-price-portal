// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Faq } from "@/components/common/faq";
import { popularLocations } from "@/components/home/division-links";
import { FilterChips } from "@/components/facility/filter-chips";
import type { DivisionWithDistricts, LocationListItem } from "@/domain/read-models";

afterEach(cleanup);

const counts = (facilityCount: number, pharmacyCount = 0) => ({ facilityCount, hospitalCount: 0, pharmacyCount, doctorCount: 0 });
const district = (name: string, facilityCount: number, pharmacyCount = 0): LocationListItem =>
  ({ location: { id: name, slug: name.toLowerCase(), name, level: "district" }, ...counts(facilityCount, pharmacyCount) }) as unknown as LocationListItem;

describe("popularLocations", () => {
  it("ranks districts by listed records, skips empty ones and respects the limit", () => {
    const divisions = [
      { division: { id: "d1" }, ...counts(0), districts: [district("Dhaka", 50, 20), district("Sylhet", 5), district("Empty", 0)] },
      { division: { id: "d2" }, ...counts(0), districts: [district("Gazipur", 30, 10)] },
    ] as unknown as DivisionWithDistricts[];
    expect(popularLocations(divisions).map((d) => d.location.name)).toEqual(["Dhaka", "Gazipur", "Sylhet"]);
    expect(popularLocations(divisions, 2)).toHaveLength(2);
  });
});

describe("FilterChips", () => {
  it("toggles a type chip on and off, keeping other parameters", () => {
    const kinds = [
      { kind: "hospital", count: 3 },
      { kind: "clinic", count: 2 },
    ] as const;
    const { rerender } = render(<FilterChips path="/hospitals" keep={{ q: "heart" }} kinds={kinds} selectedKind={null} />);
    expect(screen.getByRole("link", { name: /^Hospital/ }).getAttribute("href")).toBe("/hospitals?q=heart&kind=hospital");
    rerender(<FilterChips path="/hospitals" keep={{ q: "heart" }} kinds={kinds} selectedKind="hospital" />);
    const active = screen.getByRole("link", { name: /^Hospital/ });
    expect(active.getAttribute("aria-current")).toBe("true");
    expect(active.getAttribute("href")).toBe("/hospitals?q=heart");
  });

  it("shows the emergency chip only when there are emergency records", () => {
    render(<FilterChips path="/hospitals" keep={{}} kinds={[]} selectedKind={null} emergency={{ show: true, checked: false }} />);
    expect(screen.getByRole("link", { name: "Emergency" }).getAttribute("href")).toBe("/hospitals?emergency=1");
    cleanup();
    const { container } = render(<FilterChips path="/hospitals" keep={{}} kinds={[]} selectedKind={null} emergency={{ show: false, checked: false }} />);
    expect(container.textContent).toBe("");
  });
});

describe("Faq", () => {
  it("renders native disclosure items and nothing for an empty list", () => {
    const { container } = render(<Faq items={[{ question: "Is it verified?", answer: "No." }]} />);
    expect(screen.getByRole("heading", { level: 2, name: "Frequently asked questions" })).toBeTruthy();
    expect(container.querySelectorAll("details")).toHaveLength(1);
    cleanup();
    expect(render(<Faq items={[]} />).container.textContent).toBe("");
  });
});
