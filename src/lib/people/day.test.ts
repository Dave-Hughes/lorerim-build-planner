import { describe, expect, it } from "vitest";
import { dayHours, hourOf, mainPlace, spanOf } from "./day";

describe("a person's day as 24 hours (WO-165)", () => {
  it("reads the read's times and lengths", () => {
    expect([hourOf("midnight"), hourOf("noon"), hourOf("8 am"), hourOf("6 pm"), hourOf("12 am"), hourOf("12 pm"), hourOf("any hour")]).toEqual([0, 12, 8, 18, 0, 12, null]);
    expect([spanOf("2 hours"), spanOf("1 hour"), spanOf("30 minutes"), spanOf("whenever")]).toEqual([2, 1, 0.5, null]);
  });
  it("lays Lucan Valerius's day out hour by hour, wrapping past midnight, the first row for an hour winning", () => {
    const hours = dayHours([
      { from: "midnight", for: "6 hours", where: "the Riverwood Trader, Riverwood" },
      { from: "6 am", for: "1 hour", where: "the Riverwood Trader, Riverwood" },
      { from: "7 am", for: "13 hours", where: "the Riverwood Trader, Riverwood" },
      { from: "8 pm", for: "4 hours", where: "the Sleeping Giant Inn, Riverwood" },
    ])!;
    expect(hours).toHaveLength(24);
    expect(hours[3]).toBe("Riverwood Trader");
    expect(hours[19]).toBe("Riverwood Trader");
    expect(hours[21]).toBe("Sleeping Giant Inn");
    expect(mainPlace(hours)).toEqual({ main: "Riverwood Trader", places: ["Riverwood Trader", "Sleeping Giant Inn"] });
  });
  it("a day with an any-hour row is one place all day, and rows with no hours give no strip", () => {
    expect(dayHours([{ from: "any hour", for: "24 hours", where: "Dragonsreach, Whiterun" }])!.every((h) => h === "Dragonsreach")).toBe(true);
    expect(dayHours([{ from: "weekdays", for: "", where: "somewhere" }])).toBeNull();
  });
});
