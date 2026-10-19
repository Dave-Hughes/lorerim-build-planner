import { describe, expect, it } from "vitest";
import data from "@/data/lorerim-5.0.4.8/stories.json";
import quests from "@/data/lorerim-5.0.4.8/quests.json";
import { doneCount, lastFromMain, mainFromStory, splitReward, storyOrder, type Story } from "./story";

const story = (data as { stories: Story[] }).stories.find((s) => s.id === "become-the-dragonborn")!;
const order = storyOrder(story).map((q) => q.edid);
const mainOrder = (quests as { lines: { id: string; quests: { edid: string }[] }[] }).lines
  .find((l) => l.id === "main-quest")!
  .quests.map((q) => q.edid)
  .filter((e) => /^MQ\d/.test(e));

describe("a story's progress (WO-106)", () => {
  it("has 19 quests in 7 chapters, with names and XP joined in", () => {
    expect(order).toHaveLength(19);
    expect(story.chapters).toHaveLength(7);
    expect(storyOrder(story)[5]).toMatchObject({ edid: "MQ105Ustengrav", name: "The Horn of Jurgen Windcaller", atEnd: true, from: "MQ105" });
  });

  it("reads the main quest's story from Where you are: The Way of the Voice is 5 of 19, next the Horn", () => {
    const last = lastFromMain(order, "MQ105", mainOrder);
    expect(doneCount(order, last)).toBe(5);
    expect(order[doneCount(order, last)]).toBe("MQ105Ustengrav");
    expect(doneCount(order, lastFromMain(order, null, mainOrder))).toBe(0);
  });

  it("counts Paarthurnax done once Dragonslayer is", () => {
    expect(doneCount(order, lastFromMain(order, "MQ305", mainOrder))).toBe(19);
    expect(mainFromStory(order, "MQPaarthurnax", mainOrder)).toBe("MQ305");
  });

  it("writes Mark done back as the main quest done up to", () => {
    expect(mainFromStory(order, "MQ105Ustengrav", mainOrder)).toBe("MQ105Ustengrav");
    expect(mainFromStory(order, null, mainOrder)).toBeNull();
  });

  it("splits the reward into its head and note", () => {
    expect(splitReward("None: the last quest gives no item.")).toEqual({ head: "None", note: "the last quest gives no item" });
  });
});
