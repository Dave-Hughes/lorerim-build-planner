import { describe, expect, it } from "vitest";
import { freeHandle, handleBase, isHandle } from "./handles";

describe("making handles", () => {
  it("lowercases and joins words with -", () => {
    expect(handleBase("Tapps")).toBe("tapps");
    expect(handleBase("Ushnar gro-Mazgar")).toBe("ushnar-gro-mazgar");
    expect(handleBase("  Jo'Vashar  the   Swift ")).toBe("jo-vashar-the-swift");
  });

  it("drops accents and keeps the letters", () => {
    expect(handleBase("Éowyn Ñúñez")).toBe("eowyn-nunez");
  });

  it("drops emoji and symbols", () => {
    expect(handleBase("🐉 Dragon Born 🔥")).toBe("dragon-born");
    expect(handleBase("x_X_dark_X_x")).toBe("x-x-dark-x-x");
  });

  it("falls back to player when nothing usable is left", () => {
    expect(handleBase("✨✨✨")).toBe("player");
    expect(handleBase("!!!")).toBe("player");
    expect(handleBase("")).toBe("player");
    expect(handleBase(null)).toBe("player");
    expect(handleBase("Al")).toBe("player");
  });

  it("cuts long names to 30 characters without a trailing -", () => {
    const h = handleBase("The Very Long Name Of A Nord Who Talks Too Much");
    expect(h.length).toBeLessThanOrEqual(30);
    expect(h).toBe("the-very-long-name-of-a-nord-w");
    expect(handleBase("abcdefghijklmnopqrstuvwxyzabc d")).toBe("abcdefghijklmnopqrstuvwxyzabc");
  });

  it("adds -2, -3 when taken, staying within 30 characters", () => {
    expect(freeHandle("tapps", new Set())).toBe("tapps");
    expect(freeHandle("tapps", new Set(["tapps"]))).toBe("tapps-2");
    expect(freeHandle("tapps", new Set(["tapps", "tapps-2"]))).toBe("tapps-3");
    expect(freeHandle("player", new Set(["player"]))).toBe("player-2");
    const long = "a".repeat(30);
    expect(freeHandle(long, new Set([long]))).toBe(`${"a".repeat(28)}-2`);
  });

  it("every made handle is a valid handle", () => {
    for (const n of ["Tapps", "🐉", "Éowyn", "a b c d e f g h i j k l m n o p q r s t", "--x--y--"]) expect(isHandle(handleBase(n)), n).toBe(true);
    expect(isHandle("nobody-here")).toBe(true);
    expect(isHandle("Bad Handle")).toBe(false);
  });
});
