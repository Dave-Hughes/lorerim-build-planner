import { describe, expect, it } from "vitest";
import sample from "./__fixtures__/sample-build.json";
import raw from "../../../gamedata/5.0.4.8/starts_raw.json";
import { readPlan, withGameStart } from "./convert";
import { requireGameData } from "./data";
import type { BuildPlan } from "./types";

const base = sample as unknown as BuildPlan;
const names = requireGameData(base.gameVersion).starts.map((s) => s.name);
const read = (start: string) => {
  const p = withGameStart({ ...base, start, startOption: undefined }, names);
  return { start: p.start, option: p.startOption, was: p.startWas };
};

describe("old start names", () => {
  it("map to the game's names", () => {
    expect(read("Regular at an inn")).toEqual({ start: "Regular (Inn)", option: undefined, was: undefined });
    expect(read("Arriving from overseas").start).toBe("From Overseas");
    expect(read("Wanted criminal").start).toBe("Wanted Criminal");
    expect(read("Left for dead").start).toBe("Left for Dead");
    expect(read("Temple pilgrim").start).toBe("Pilgrim (Temple)");
    expect(read("Shrine pilgrim").start).toBe("Pilgrim (Shrine)");
    expect(read("Thalmor prisoner").start).toBe("Thalmor Prisoner");
    expect(read("At Angi's camp").start).toBe("At Angis Camp");
    expect(read("Dwemer ruin").start).toBe("Dwemer Ruin");
    expect(read("Bounty hunter").start).toBe("Bounty Hunter");
    expect(read("Roadside ambush").start).toBe("Roadside Ambush");
    expect(read("Prisoner in a bandit fort").start).toBe("Prisoner in a Bandit Fort");
    expect(read("Fell in a spike pit").start).toBe("Fell in a Spike Pit");
    expect(read("Out in the wilderness").start).toBe("Out in the Wilderness");
  });

  it("turn guild members into Guilds with the guild as the choice", () => {
    expect(read("Guild member: Companions")).toEqual({ start: "Guilds", option: "Companions", was: undefined });
    expect(read("Guild member: College of Winterhold")).toEqual({ start: "Guilds", option: "College of Winterhold", was: undefined });
  });

  it("turn the Dragonborn into Dragonborn with no choice", () => {
    expect(read("The Dragonborn (Helgen Keep)")).toEqual({ start: "Dragonborn", option: undefined, was: undefined });
  });

  it("keep game names as they are, and set aside what isn't a start", () => {
    expect(read("Mercenary")).toEqual({ start: "Mercenary", option: undefined, was: undefined });
    expect(read("")).toEqual({ start: "", option: undefined, was: undefined });
    expect(read("Merchant or mercenary")).toEqual({ start: "", option: undefined, was: "Merchant or mercenary" });
  });

  it("are read on load, with the gear", () => {
    const p = readPlan({ ...base, start: "Guild member: Thieves Guild" });
    expect([p.start, p.startOption]).toEqual(["Guilds", "Thieves Guild"]);
    expect(p.gear[0].slot).toBe("Main hand");
  });
});

describe("starts.json", () => {
  it("is the game's 25 starts, with the option lists exactly as extracted", () => {
    const d = requireGameData(base.gameVersion);
    expect(d.starts).toHaveLength(25);
    expect(d.starts.map((s) => [s.name, s.options])).toEqual(raw.starts.map((s) => [s.name, s.options.map((o) => o.name)]));
    // Eight have no choice; Dragonborn's (Helgen Keep, start or end) has no Random.
    expect(d.starts.filter((s) => s.options.length === 0)).toHaveLength(8);
  });
});
