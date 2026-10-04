// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { SampleDataNotice } from "@/components/common/sample-data-notice";

afterEach(cleanup);

describe("SampleDataNotice", () => {
  it("tells users the data is not live", () => {
    render(<SampleDataNotice />);
    const note = screen.getByRole("note");
    expect(note.textContent).toMatch(/sample data/i);
    expect(note.textContent).toMatch(/not live/i);
  });
});
