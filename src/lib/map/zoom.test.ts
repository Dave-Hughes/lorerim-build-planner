import { describe, expect, it } from "vitest";
import { BUTTON_STEP, NOTCH, wheelFactor } from "./zoom";

/** WO-185 Part 2: zoom follows the size of the gesture, not the number of events. */
describe("wheelFactor", () => {
  it("is about one step for one mouse notch, either way", () => {
    expect(wheelFactor({ deltaY: -100 })).toBeCloseTo(NOTCH, 2);
    expect(wheelFactor({ deltaY: 100 })).toBeCloseTo(1 / NOTCH, 2);
    // Firefox sends a notch as three lines.
    expect(wheelFactor({ deltaY: -3, deltaMode: 1 })).toBeCloseTo(NOTCH, 1);
  });
  it("is in proportion to a trackpad pinch, so a small pinch zooms a little and a long one a lot", () => {
    const small = wheelFactor({ deltaY: -2, ctrlKey: true });
    const long = Array.from({ length: 20 }, () => wheelFactor({ deltaY: -2, ctrlKey: true })).reduce((a, b) => a * b, 1);
    expect(small).toBeGreaterThan(1);
    expect(small).toBeLessThan(1.05);
    expect(long).toBeCloseTo(small ** 20, 5);
    expect(long).toBeGreaterThan(1.4);
  });
  it("is gentle for a trackpad's two-finger scroll, many small events adding up", () => {
    const one = wheelFactor({ deltaY: -4 });
    expect(one).toBeLessThan(1.02);
    expect(Array.from({ length: 25 }, () => one).reduce((a, b) => a * b, 1)).toBeCloseTo(NOTCH, 1);
  });
  it("never goes further than one step and a bit in one event", () => {
    expect(wheelFactor({ deltaY: -5000 })).toBeLessThanOrEqual(1.25);
    expect(wheelFactor({ deltaY: 5000 })).toBeGreaterThanOrEqual(0.8);
  });
  it("has the buttons move one level", () => {
    expect(BUTTON_STEP).toBeGreaterThan(NOTCH);
  });
});
