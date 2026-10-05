// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SearchResults } from "@/components/search/search-results";
import { createLocalRepositories } from "@/data/local/repositories";
import { SearchService } from "@/services/search-service";
import { fixtureDataset } from "../fixtures";

vi.mock("next/link", () => import("./next-link-mock"));
afterEach(cleanup);

const search = new SearchService(createLocalRepositories(fixtureDataset));

describe("SearchResults", () => {
  it("shows the count and links to medicine pages", async () => {
    render(<SearchResults result={await search.searchMedicines("napa")} suggestions={[]} />);
    expect(screen.getByRole("status").textContent).toBe("4 medicines found for “napa”");
    const link = screen.getByRole("link", { name: "Napa 500 mg" });
    expect(link.getAttribute("href")).toBe("/medicine/napa-500mg");
  });

  it("shows a no-results state", async () => {
    render(<SearchResults result={await search.searchMedicines("zzzz")} suggestions={[]} />);
    expect(screen.getByText("No medicines found for “zzzz”.")).toBeTruthy();
  });

  it("prompts for a query when empty and asks for more characters when too short", async () => {
    render(<SearchResults result={await search.searchMedicines("")} suggestions={[]} />);
    expect(screen.getByText(/Enter a brand name/)).toBeTruthy();
    cleanup();
    render(<SearchResults result={await search.searchMedicines("n")} suggestions={[]} />);
    expect(screen.getByText(/at least 2 characters/)).toBeTruthy();
  });
});
