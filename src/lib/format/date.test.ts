import { describe, expect, it } from "vitest";
import { formatDate, formatDayMonth } from "./date";

describe("dates", () => {
  it("are the day in the viewer's time zone", () => {
    expect(formatDate("2026-10-12T02:00:00Z", "America/Denver")).toBe("11 Oct 2026");
    expect(formatDate("2026-10-12T02:00:00Z", "UTC")).toBe("12 Oct 2026");
    expect(formatDayMonth("2026-10-12T02:00:00Z", "America/Denver")).toBe("11 Oct");
  });
});
