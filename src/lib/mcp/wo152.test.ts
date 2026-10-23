import { describe, expect, it } from "vitest";
import { getQuest } from "./facts";

/**
 * WO-152 Part 0: where Jaree-Ra stands, from Dave's day in the game. The records place him in the Red Wave (the cell the editor put
 * him in); a player finds him in Solitude by the Winking Skeever, day and night. Part 2 carries this for every person.
 */

describe("Lights Out! says where Jaree-Ra stands", () => {
  const a = getQuest({ name: "Lights Out!" }) as { quest: { start: { ways: { way: string; where?: string; checked?: string }[]; who?: string; where?: string; then?: string } } };
  const said = JSON.stringify(a.quest.start);

  it("by the Winking Skeever, from a player who watched, in the way and in the place", () => {
    expect(a.quest.start.ways).toEqual([expect.objectContaining({ way: "Talk to Jaree-Ra in Solitude, by the Winking Skeever (he stays there day and night)", where: "Solitude, by the Winking Skeever", who: "Jaree-Ra", checked: "a player's report, not the game files (Dave, watched in game for a day, 23 Oct 2026)" })]);
    expect(a.quest.start.where).toBe("Solitude, by the Winking Skeever");
    expect(a.quest.start.then).toBe("Accept Jaree-Ra's offer in Solitude at the Winking Skeever");
  });
  it("never the Red Wave or the docks as where to find him", () => {
    expect(said).not.toMatch(/Red Wave|docks/i);
  });
});
