import { describe, expect, it } from "vitest";
import { assembled, playerWords, quoteQuest } from "./player-words";

describe("playerWords", () => {
  it("takes the editors' hedge out of the sentence and keeps it as a reason for Not sure yet", () => {
    expect(playerWords("Helgen as a living town: its inn, houses and shops can be shut away; the records don't show when")).toEqual({
      text: "Helgen as a living town: its inn, houses and shops can be shut away",
      unsure: ["The records don't show when"],
    });
    expect(playerWords("Level 25, for the cultists to find you (not checked yet)")).toEqual({ text: "Level 25, for the cultists to find you", unsure: ["Not checked yet"] });
    expect(playerWords("Derkeethus follows you, and the records don't show whether that waits for the rescue.").text).toBe("Derkeethus follows you.");
  });
  it("leaves a plain sentence alone", () => {
    expect(playerWords("Storn Crag-Strider dies (The Gardener of Men)")).toEqual({ text: "Storn Crag-Strider dies (The Gardener of Men)", unsure: [] });
  });
});

describe("quoteQuest", () => {
  it("says which quest when the sentence holds the name already", () => {
    expect(quoteQuest("Paarthurnax dies if you kill him (Paarthurnax)")).toBe("Paarthurnax dies if you kill him in the quest Paarthurnax");
    expect(quoteQuest("Storn Crag-Strider dies (The Gardener of Men)")).toBe("Storn Crag-Strider dies (The Gardener of Men)");
  });
});

describe("assembled", () => {
  it("says a bracketed copy as a clause", () => {
    expect(assembled("Talk to her; same job (Windhelm's own copy of it).")).toBe("Talk to her; it is the same job, Windhelm's own copy.");
    expect(assembled("Talk to Amren")).toBe("Talk to Amren");
  });
});
