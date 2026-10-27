import { describe, expect, it } from "vitest";
import { distance, fuzzyScore, words } from "./fuzzy";

describe("fuzzy search", () => {
  it("finds a word spelt wrong by a letter or two", () => {
    expect(fuzzyScore(words("Palonimo"), "Catch the white, or palomino, horse")).not.toBeNull();
    expect(fuzzyScore(words("brynjof"), "Brynjolf")).not.toBeNull();
    expect(fuzzyScore(words("riftin"), "Riften")).not.toBeNull();
  });
  it("needs every word, and a short word to be right", () => {
    expect(fuzzyScore(words("lights outt"), "Lights Out!")).not.toBeNull();
    expect(fuzzyScore(words("lights dinner"), "Lights Out!")).toBeNull();
    expect(fuzzyScore(words("cat"), "Cut")).toBeNull();
  });
  it("scores an exact word better than a start, and a start better than a near miss", () => {
    expect(fuzzyScore(words("solitude"), "Solitude")).toBe(0);
    expect(fuzzyScore(words("sol"), "Solitude")).toBe(1);
    expect(fuzzyScore(words("solitud"), "Solitude")).toBe(1);
    expect(fuzzyScore(words("solitdue"), "Solitude")).toBe(2);
  });
  it("counts a swap of two letters as one mistake", () => {
    expect(distance("riften", "rifetn", 2)).toBe(1);
  });
});
