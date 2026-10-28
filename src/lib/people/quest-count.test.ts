import { describe, expect, it } from "vitest";
import { questCountSentence } from "./quest-count";

describe("questCountSentence", () => {
  it("says the quests a person gives and is in, with the verbs of its subject", () => {
    expect(questCountSentence("She", 0, 2)).toBe("She is in 2 quests.");
    expect(questCountSentence("He", 1, 1)).toBe("He gives 1 quest.");
    expect(questCountSentence("She", 9, 12)).toBe("She gives 9 quests, and is in 3 more.");
    expect(questCountSentence("They", 2, 5)).toBe("They give 2 quests, and are in 3 more.");
    expect(questCountSentence("They", 0, 1)).toBe("They are in 1 quest.");
    expect(questCountSentence("Aela the Huntress", 0, 3)).toBe("Aela the Huntress is in 3 quests.");
  });
  it("is nothing for a person in no quest", () => {
    expect(questCountSentence("She", 0, 0)).toBe("");
  });
});
