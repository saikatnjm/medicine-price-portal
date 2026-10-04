// @vitest-environment jsdom
import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PriceComparison } from "@/components/medicine/price-comparison";
import { createLocalRepositories } from "@/data/local/repositories";
import { MedicineService } from "@/services/medicine-service";
import { fixtureDataset } from "../fixtures";

vi.mock("next/link", () => import("./next-link-mock"));
afterEach(cleanup);

const service = new MedicineService(createLocalRepositories(fixtureDataset));

describe("PriceComparison", () => {
  it("lists prices lowest first with text availability and a lowest-price label", async () => {
    const detail = await service.getMedicineDetail("napa-500mg");
    if (!detail) throw new Error("fixture missing");
    render(<PriceComparison detail={detail} />);

    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(within(items[0]!).getByRole("link").textContent).toBe("Beta Pharmacy");
    expect(within(items[0]!).getByText("Lowest listed")).toBeTruthy();
    expect(within(items[0]!).getByText("Limited stock")).toBeTruthy();
    expect(within(items[1]!).queryByText("Lowest listed")).toBeNull();
    expect(screen.getByText(/Sample prices ৳11\.50–৳12\.00/)).toBeTruthy();
  });

  it("shows an empty state when there are no prices", async () => {
    const detail = await service.getMedicineDetail("seclo-20mg");
    if (!detail) throw new Error("fixture missing");
    render(<PriceComparison detail={detail} />);
    expect(screen.getByText(/No prices are listed/)).toBeTruthy();
  });
});
