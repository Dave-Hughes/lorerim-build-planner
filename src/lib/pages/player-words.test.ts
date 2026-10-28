import { describe, expect, it } from "vitest";
import { assembled, playerField, playerReason, playerWords, quoteQuest, RECORD } from "./player-words";

describe("playerWords", () => {
  it("takes the editors' hedge out of the sentence and keeps it as a reason for Not sure yet", () => {
    expect(playerWords("Helgen as a living town: its inn, houses and shops can be shut away; the records don't show when")).toEqual({
      text: "Helgen as a living town: its inn, houses and shops can be shut away",
      unsure: ["About “Helgen as a living town”: we can't tell from the game files when."],
    });
    expect(playerWords("Level 25, for the cultists to find you (not checked yet)")).toEqual({ text: "Level 25, for the cultists to find you", unsure: ["About “Level 25, for the cultists to find you”: we haven't checked this against the game files yet."] });
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

describe("WO-177 Part 5", () => {
  it("keeps a space before a bracketed quest after a hedge is taken out", () => {
    expect(playerWords("its shops can be shut away; the records don't show when (Unbound)").text).toBe("its shops can be shut away (Unbound)");
  });
  it("says a guess as a reason, not a bracket", () => {
    const r = playerWords("Later she lives in Breezehome (presumably once you own Breezehome).");
    expect(r.text).toBe("Later she lives in Breezehome.");
    expect(r.unsure[0]).toMatch(/guess/);
  });
  it("says a repeated house once", () => {
    expect(assembled("at night in her own house, Bryling's House, in Solitude.")).toBe("at night in Bryling's House, in Solitude.");
    expect(assembled("In his room, Hall of Attainment")).toBe("In his room, Hall of Attainment");
  });
  it("never lets a record or a file name through", () => {
    expect(RECORD.test("'Cultists vs Player' (DLC2WE09)")).toBe(true);
    expect(RECORD.test("Vilkas Spar Skip.esp loosens")).toBe(true);
    expect(RECORD.test("a level 25 start at 3 pm")).toBe(false);
    expect(playerReason("GORE.esp is the last plugin to edit it")).toBe("We couldn't confirm this from the game files.");
    expect(playerReason("the door isn't in the files")).toBe("The door isn't in the files.");
    expect(playerField("Cultists vs Player (DLC2WE09)")).toBe("Cultists vs Player");
  });
});
