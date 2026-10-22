import { describe, expect, it } from "vitest";
import { NO_SAVE, logCounts, questLog, standing } from "./quest-log";
import { questsData } from "@/lib/quests/data";

/** WO-134: the quest log from a stored save, in the game's words. */
const quest = (edid: string) => questsData().lines.flatMap((l) => l.quests).find((q) => q.edid === edid)!;
const save = { label: "Save 70", level: 10, day: 15, place: "Ivarstead", questStages: { "0WRHorseQ": 10, MS11: 100, MQ101RescueHelper: 20 } };

describe("get_quest_log (WO-134)", () => {
  it("gives Running Wild under way, Blood on the Ice finished with its ending, and counts the helper", () => {
    const log = questLog(save, 30);
    if (!("active" in log)) throw new Error("no log");
    expect(log.from).toBe("Save 70, level 10, day 15, Ivarstead");
    expect(log.plan).toBe("The plan runs to level 30; the save is at level 10.");
    // Each line under its own category (WO-137 item 4).
    expect(log.active).toEqual([{ category: "Side stories", lines: [{ line: "Whiterun, expanded", quests: [{ quest: "Running Wild", stage: 10, state: "active", now: "Catch the white, or palonimo, horse roaming the fields of Whiterun" }] }] }]);
    expect(log.finished.count).toBe(1);
    expect(log.finished.categories[0].lines[0].quests[0]).toMatchObject({ quest: "Blood on the Ice", stage: 100, state: "finished" });
    expect(JSON.stringify(log.finished.categories[0].lines[0].quests[0])).toMatch(/"ending":"I discovered that Wuunferth the Unliving was the Butcher of Windhelm/);
    expect(log.background).toBe("and 1 background quest the planner doesn't list (helpers and the game's own bookkeeping)");
    expect(JSON.stringify(log)).not.toMatch(/MQ101RescueHelper|0WRHorseQ|MS11/);
  });

  it("a stage past the last objective, at an ending, is that ending; a fail is failed", () => {
    expect(standing(quest("0WRHorseQ"), 41)).toMatchObject({ state: "finished" });
    expect(standing(quest("0WRHorseQ"), 50)).toEqual({ state: "failed", ending: "The horse has died. That's the end of that." });
    expect(standing(quest("0WRHorseQ"), 20)).toEqual({ state: "active", now: "Bring the Horse back to the main gate of Whiterun" });
  });

  it("a stage with no objective or ending before it is started but unclear, never a guess", () => {
    expect(standing(quest("0WRHorseQ"), 5)).toMatchObject({ state: "unclear" });
    const log = questLog({ ...save, questStages: { "0WRHorseQ": 5 } });
    expect("startedButUnclear" in log && log.startedButUnclear?.[0].lines[0].quests[0].quest).toBe("Running Wild");
  });

  it("Save 70's faults (WO-137 item 4): no helper names, no stage 0, no quest twice", () => {
    const log = questLog({ ...save, questStages: { TG00MiscHandler: 10, CR01: 10, CR02: 10, MS13: 0, FreeformRiften15: 10, FreeformShorsStone02: 10 } });
    const text = JSON.stringify(log);
    expect(text).not.toMatch(/Handler|Golden Claw/);
    expect(text.match(/Animal Extermination/g)).toHaveLength(1);
    expect(text.match(/Special Delivery/g)).toHaveLength(1);
  });

  it("no save stored gives the plain answer", () => {
    expect(questLog(null)).toEqual({ log: null, says: NO_SAVE });
    expect(NO_SAVE).toBe("No save is stored yet; ask the player to run the save connector.");
  });

  it("get_playthrough's line: started and finished", () => {
    expect(logCounts(save)).toBe("2 quests started, 1 finished");
    expect(logCounts({ label: "x", level: 1 })).toBeNull();
  });

  it("a save past the plan says so", () => {
    const log = questLog(save, 8);
    expect("plan" in log && log.plan).toBe("The save is at level 10, past the plan's last level, 8.");
  });
});
