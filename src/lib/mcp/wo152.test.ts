import { describe, expect, it } from "vitest";
import { getQuest } from "./facts";

/**
 * WO-152 Part 0: where Jaree-Ra stands, from Dave's day in the game. The records place him in the Red Wave (the cell the editor put
 * him in); a player finds him in Solitude by the Winking Skeever, day and night. Part 2 carries this for every person.
 */

describe("Lights Out! says where Jaree-Ra stands", () => {
  const a = getQuest({ name: "Lights Out!" }) as unknown as { quest: { starts: { how: string; who?: string; where?: string; checked?: string }[]; firstStep?: string } };
  const said = JSON.stringify(a.quest);

  it("by the Winking Skeever, from a player who watched, who and where first, and the read's other facts around it", () => {
    expect(a.quest.starts).toEqual([
      { who: "Jaree-Ra", where: "Solitude, by the Winking Skeever", how: "Talk to Jaree-Ra in Solitude, by the Winking Skeever (he stays there day and night)", checked: "a player's report, not the game files (Dave, watched in game for a day, 23 Oct 2026)" },
    ]);
    expect(a.quest.firstStep).toBe("Accept Jaree-Ra's offer in Solitude");
  });
  it("never the Red Wave or the docks as where to find him", () => {
    // Where to find him: never the Red Wave (the story's own words about the ship docking are another thing).
    expect(said).not.toMatch(/Red Wave/);
    expect(JSON.stringify(a.quest.starts)).not.toMatch(/docks/i);
  });
});
