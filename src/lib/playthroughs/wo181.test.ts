import { describe, expect, it } from "vitest";
import { progressTracking } from "@/lib/features";
import { hasWho, themeLines } from "./theme";
import { checkTheme } from "./validate";

describe("who she is (WO-181 Part 1)", () => {
  it("keeps what is plain, trimmed, and her paragraphs apart by a blank line", () => {
    const r = checkTheme({ backstory: "  She was raised in Anvil.\r\nShe learned the lute.\n\n\n", from: " Anvil ", will: ["Work inn shifts", ""] });
    expect(r).toEqual({ theme: { backstory: "She was raised in Anvil.\n\nShe learned the lute.", from: "Anvil", will: ["Work inn shifts"] } });
  });
  it("refuses an em dash, a middle dot and an emoji, and says which", () => {
    expect(checkTheme({ from: "Anvil — a port" })).toEqual({ error: expect.stringContaining("em dash") });
    expect(checkTheme({ gods: "Stendarr · Dibella".replace("·", "·") })).toEqual({ error: expect.stringContaining("isn't used here") });
    expect(checkTheme({ goal: "Find Pia \u{1F5E1}" })).toEqual({ error: expect.stringContaining("no emoji") });
    expect(checkTheme({ backstory: "She left.\n\nShe wept — once." })).toEqual({ error: expect.stringContaining("em dash") });
  });
  it("refuses a colon in a will, won't or grey line", () => {
    for (const k of ["will", "never", "grey"] as const) expect(checkTheme({ [k]: ["Steal: only from the rich"] })).toEqual({ error: expect.stringContaining("colon") });
    expect(checkTheme({ goal: "Find Pia: and the man" })).toHaveProperty("theme");
  });
  it("refuses a line over its length, never cutting it", () => {
    expect(checkTheme({ goal: "x".repeat(81) })).toEqual({ error: expect.stringContaining("81 characters; the most is 80") });
    expect(checkTheme({ will: ["x".repeat(91)] })).toEqual({ error: expect.stringContaining("91 characters; the most is 90") });
    expect(checkTheme({ grey: ["a", "b", "c", "d", "e", "f", "g"] })).toEqual({ error: expect.stringContaining("7 lines; the most is 6") });
    expect(checkTheme({ backstory: "x".repeat(3001) })).toEqual({ error: expect.stringContaining("3001 characters; the most is 3000") });
  });
  it("writes She won't as the never list, in the player's words", () => {
    expect(checkTheme({ never: ["Steal from homes, farms or shops"] })).toEqual({ theme: {}, never: ["Steal from homes, farms or shops"] });
  });
  it("opens on who she is only when something is written about her", () => {
    expect(hasWho({ theme: null, never: null })).toBe(false);
    expect(hasWho({ theme: {}, never: [] })).toBe(false);
    expect(hasWho({ theme: { from: "Anvil" }, never: null })).toBe(true);
    expect(hasWho({ theme: null, never: [{ what: "Kill anyone who has yielded" }] })).toBe(true);
    expect(themeLines({ theme: { will: ["a"], grey: ["b"] }, never: [{ what: "c", words: "d" }] })).toEqual({ will: ["a"], wont: ["d"], grey: ["b"] });
  });
});

describe("progress tracking (WO-181 Part 3)", () => {
  it("is off unless it is turned on, whatever the environment", () => {
    expect(progressTracking({})).toBe(false);
    expect(progressTracking({ NODE_ENV: "development" })).toBe(false);
    expect(progressTracking({ VERCEL_ENV: "preview" })).toBe(false);
    expect(progressTracking({ PROGRESS_TRACKING: "off" })).toBe(false);
  });
  it("comes back with PROGRESS_TRACKING on", () => {
    for (const v of ["on", "1", "true", " ON "]) expect(progressTracking({ PROGRESS_TRACKING: v })).toBe(true);
  });
});
