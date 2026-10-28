import { describe, expect, it } from "vitest";
import { shortModName } from "./mods";

describe("shortModName", () => {
  it("drops the subtitle after a dash and keeps a name that has none", () => {
    expect(shortModName("The Gray Cowl of Nocturnal - 10th anniversary")).toBe("The Gray Cowl of Nocturnal");
    expect(shortModName("Follower Dialogue Expansion - Faralda")).toBe("Follower Dialogue Expansion");
    expect(shortModName("Missives")).toBe("Missives");
    // The mod that adds the quest, nothing appended (WO-177 Part 5).
    expect(shortModName("Rob's Bug Fixes - Capital Whiterun Expansion")).toBe("Capital Whiterun Expansion");
    expect(shortModName("Skyrim Extended Cut - Saints and Seducers")).toBe("Saints and Seducers");
    expect(shortModName("Betalille's Hammerfell Quests Bundle - The Gray Cowl of Nocturnal")).toBe("The Gray Cowl of Nocturnal");
    expect(shortModName("Missives - Gray Cowl Patch")).toBe("Missives");
    expect(shortModName("Trad - AE - CC - Collection - Requiem Patch")).toBe("Trad - AE - CC - Collection");
    expect(shortModName("Fists of Fury - Skyrim")).toBe("Fists of Fury");
    expect(shortModName("Remiel-Custom Voiced Follower")).toBe("Remiel-Custom Voiced Follower");
  });
});
