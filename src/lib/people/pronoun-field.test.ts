import { describe, expect, it } from "vitest";
import { pronounField } from "./data";

/** WO-180 Part 7b: Not sure yet says he or she on a page that says he or she. */
describe("pronounField", () => {
  it("turns they into the person's pronoun, with the verb to match", () => {
    expect(pronounField("where they are through the day and night", "female")).toBe("where she is through the day and night");
    expect(pronounField("Where they are through the day and night", "male")).toBe("Where he is through the day and night");
    expect(pronounField("what changes where they are", "male")).toBe("what changes where he is");
    expect(pronounField("how to recruit or marry them", "female")).toBe("how to recruit or marry her");
    expect(pronounField("What they sell", "female")).toBe("What she sells");
    expect(pronounField("How they join you", "male")).toBe("How he joins you");
    expect(pronounField("Whether they can die", "male")).toBe("Whether he can die");
    expect(pronounField("Whether and how you can marry them", "male")).toBe("Whether and how you can marry him");
    expect(pronounField("Where you first meet them", "female")).toBe("Where you first meet her");
    expect(pronounField("Which quests they are in", "female")).toBe("Which quests she is in");
  });
  it("keeps they when the sex isn't known", () => {
    expect(pronounField("Where they are through the day and night", undefined)).toBe("Where they are through the day and night");
    expect(pronounField("Where they are through the day and night", "unknown")).toBe("Where they are through the day and night");
  });
});
