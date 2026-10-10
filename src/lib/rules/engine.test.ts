import { describe, expect, it } from "vitest";
import sample from "./__fixtures__/sample-build.json";
import expected from "./__fixtures__/sample-build.expected.json";
import { computeBuild } from "./engine";
import { requireGameData } from "./data";
import type { BuildPlan, LevelPlan } from "./types";

const base = sample as unknown as BuildPlan;
const d = requireGameData("5.0.4.8");
const blank = (over: Partial<LevelPlan> = {}): LevelPlan => ({
  skillPoints: {},
  perks: [],
  destiny: [],
  extras: [],
  note: "",
  ...over,
});
const build = (over: Partial<BuildPlan> = {}): BuildPlan => ({ ...base, ...over });
const codes = (b: BuildPlan, level: number) => computeBuild(b)[level - 1].issues.map((i) => i.code);

describe("constants", () => {
  it("skill point cost by band", () => {
    expect([10, 24, 25, 49, 50, 74, 75, 99].map((v) => d.skillPointCost(v))).toEqual([1, 1, 2, 2, 3, 3, 6, 6]);
  });
  it("max skill is 50 + level, up to 100", () => {
    expect([1, 6, 50, 60].map((v) => d.maxSkillAt(v))).toEqual([51, 56, 100, 100]);
  });
  it("Destiny points: 1 at start, then every 5 levels to 30", () => {
    expect([1, 4, 5, 10, 30, 60].map((v) => d.destinyPointsAt(v))).toEqual([1, 1, 2, 3, 7, 7]);
  });
});

describe("game data", () => {
  it("every perk prerequisite exists", () => {
    for (const p of d.perks) for (const r of p.requires) expect(d.perkById.has(r), `${p.id} -> ${r}`).toBe(true);
  });
  it("every perk tree is a skill or Destiny", () => {
    for (const p of d.perks) expect(d.skills.includes(p.tree) || p.tree === "Destiny", p.id).toBe(true);
  });
  it("perks that take either prerequisite match the game's records", () => {
    const either = d.perks.filter((p) => p.anyOf && p.tree !== "Destiny").map((p) => p.name).sort();
    expect(either).toEqual([
      "Advanced Blacksmithing",
      "Daedric Smithing",
      "Death's Emperor",
      "Dodge",
      "Draconic Blacksmithing",
      "Ebony Smithing",
      "Elven Smithing",
      "Glass Smithing",
      "Lion's Arrow",
      "Orcish Smithing",
      "Sound Body",
      "You Shall Not Pass",
    ]);
  });
  it("every perk has the game's words", () => {
    for (const p of d.perks) {
      if (p.ranks > 1) expect(p.rankTexts?.length, p.id).toBe(p.ranks);
      else expect(p.text, p.id).toBeTruthy();
    }
  });
  it("exclusions go both ways", () => {
    for (const p of d.perks) for (const x of p.excludes ?? []) expect(d.perkById.get(x)?.excludes, `${p.id} <-> ${x}`).toContain(p.id);
  });
  it("the smithing book perks name their book", () => {
    expect(d.perkById.get("Smithing:Orcish Smithing")?.book).toBe("The Almanac of Orcish Blacksmithing");
    expect(d.perkById.get("Smithing:Legendary Blacksmithing")?.book).toBe("Saint Jiub's Opus");
    expect(d.perks.filter((p) => p.book).length).toBe(13);
  });
  it("ingredient perks list what to carry", () => {
    expect(d.perkById.get("Alchemy:Regeneration")?.carryItems).toBe("Troll Fat; Slaughterfish Egg; Spriggan Sap");
    expect(d.perkById.get("Finesse:Death's Emperor")?.carryItems).toBeUndefined();
  });
});

describe("sample build matches the prototype", () => {
  const states = computeBuild(base);
  it.each(expected)("level $level", (e) => {
    const s = states[e.level - 1];
    expect({
      level: s.level,
      health: s.health,
      magicka: s.magicka,
      stamina: s.stamina,
      carryWeight: s.carryWeight,
      skillPointsBanked: s.skillPointsBanked,
      perkPoints: s.perkPoints,
      perkPointsSpent: s.perkPointsSpent,
      destinyPoints: s.destinyPoints,
      destinyPointsSpent: s.destinyPointsSpent,
      issues: s.issues.length,
      skills: s.skills,
    }).toEqual(e);
  });
});

describe("level-up rules", () => {
  it("needs an attribute pick after level 1", () => {
    const b = build({ levels: [base.levels[0], blank()] });
    expect(codes(b, 2)).toContain("attribute-missing");
  });

  it("limits each skill to +5 per level-up", () => {
    const b = build({ levels: [base.levels[0], blank({ attribute: "health", skillPoints: { Sneak: 6 } })] });
    expect(codes(b, 2)).toContain("skill-over-five");
  });

  it("flags spending more than 30 points and banks the rest", () => {
    // Heavy Armor starts at 10 + 10 (Nord) + 10 (major) = 30, so +5 costs 2 each.
    const over = build({
      levels: [
        base.levels[0],
        blank({ attribute: "health", skillPoints: { "Heavy Armor": 5, Block: 5, "One-Handed": 5, Smithing: 5 } }),
      ],
    });
    expect(codes(over, 2)).toContain("skill-points-over");

    const under = build({ levels: [base.levels[0], blank({ attribute: "health", skillPoints: { Sneak: 5 } })] });
    expect(computeBuild(under)[1].skillPointsBanked).toBe(25);
  });

  it("stops skills at the max skill for the level", () => {
    // Heavy Armor 30 at level 1; max skill at level 2 is 52.
    const levels = [base.levels[0]];
    for (let i = 0; i < 5; i++) levels.push(blank({ attribute: "health", skillPoints: { "Heavy Armor": 5 } }));
    const states = computeBuild(build({ levels }));
    expect(states[4].skills["Heavy Armor"]).toBe(50);
    expect(states[4].issues.map((i) => i.code)).not.toContain("skill-over-max");
    expect(states[5].skills["Heavy Armor"]).toBe(55);
    expect(states[5].issues.map((i) => i.code)).not.toContain("skill-over-max"); // max 56 at level 6
  });

  it("allows 5 trainer sessions per level, carried forward", () => {
    const trainer = { kind: "trainer" as const, skill: "Sneak" };
    const ok = build({ levels: [blank({ ...base.levels[0], extras: Array(5).fill(trainer) })] });
    expect(codes(ok, 1)).not.toContain("trainer-limit");
    const tooMany = build({ levels: [blank({ ...base.levels[0], extras: Array(6).fill(trainer) })] });
    expect(codes(tooMany, 1)).toContain("trainer-limit");
  });
});

describe("perks", () => {
  it("checks the skill requirement", () => {
    const b = build({ levels: [blank({ ...base.levels[0], perks: ["Heavy Armor:Conditioning", "Heavy Armor:Combat Training", "Heavy Armor:Fortitude"] })] });
    const perkSkill = computeBuild(b)[0].issues.filter((i) => i.code === "perk-skill").map((i) => i.message);
    expect(perkSkill).toEqual(["Fortitude needs Heavy Armor 50; it is 30."]);
  });

  it("prerequisites taken the same level count in any order", () => {
    const b = build({ levels: [blank({ ...base.levels[0], perks: ["Block:Experienced Blocking", "Block:Improved Blocking"] })] });
    expect(codes(b, 1)).not.toContain("perk-prerequisite");
  });

  it("Dodge needs Agility or Conditioning, not both", () => {
    const states = computeBuild(
      build({
        majors: ["Evasion", "Heavy Armor", "Block"],
        levels: [blank({ ...base.levels[0], perks: ["Heavy Armor:Conditioning", "Evasion:Dodge"] })],
      }),
    );
    expect(states[0].issues.map((i) => i.code)).not.toContain("perk-prerequisite");
  });

  it("a second rank needs its own skill level", () => {
    // One-Handed is 30 at level 1 for the sample build (Nord, major).
    const two = build({ levels: [blank({ ...base.levels[0], perks: ["One-Handed:Weapon Mastery", "One-Handed:Weapon Mastery"] })] });
    expect(codes(two, 1)).not.toContain("perk-skill");
    const three = build({ levels: [blank({ ...base.levels[0], perks: ["One-Handed:Weapon Mastery", "One-Handed:Weapon Mastery", "One-Handed:Weapon Mastery"] })] });
    expect(codes(three, 1)).toContain("perk-ranks");
    const flurry = build({ levels: [blank({ ...base.levels[0], perks: ["One-Handed:Weapon Mastery", "One-Handed:Flurry", "One-Handed:Flurry"] })] });
    const msgs = computeBuild(flurry)[0].issues.filter((i) => i.code === "perk-skill").map((i) => i.message);
    expect(msgs).toEqual(["Flurry rank 2 needs One-Handed 50; it is 30."]);
  });

  it("Weapons Master can't be held with Weapon Mastery", () => {
    const b = build({ levels: [blank({ ...base.levels[0], perks: [...base.levels[0].perks, "Block:Weapons Master"] })] });
    const msgs = computeBuild(b)[0].issues.filter((i) => i.code === "perk-excluded").map((i) => i.message);
    expect(msgs).toEqual(["Weapons Master can't be held with One-Handed: Weapon Mastery."]);
  });

  it("book perks cost no perk point", () => {
    const states = computeBuild(base);
    // Level 4 takes Alchemical Lore (1 point) and Craftsmanship (book).
    expect(states[3].perkPointsSpent - states[2].perkPointsSpent).toBe(1);
  });

  it("flags more perk points spent than earned", () => {
    const b = build({
      levels: [
        blank({
          ...base.levels[0],
          perks: [...base.levels[0].perks, "Alchemy:Alchemical Lore"],
        }),
      ],
    });
    expect(codes(b, 1)).toContain("perk-points-over");
  });

  it("Naaktiid starts with 3 more perk points and 100 more carry weight", () => {
    const k = computeBuild(base)[0];
    const n = computeBuild(build({ mode: "Naaktiid" }))[0];
    expect(n.perkPoints - k.perkPoints).toBe(3);
    expect(n.carryWeight - k.carryWeight).toBe(100);
  });
});

describe("traits", () => {
  it("Skilled skips the perk point every 5th level", () => {
    const levels = [base.levels[0]];
    for (let i = 0; i < 5; i++) levels.push(blank({ attribute: "health" }));
    const s = computeBuild(build({ traits: ["Skilled"], levels }));
    expect(s[3].perkPoints).toBe(6);
    expect(s[4].perkPoints).toBe(6);
    expect(s[5].perkPoints).toBe(7);
  });

  it("Master of One gets no perk points from levels and the whole tree free", () => {
    const levels = [blank(), blank({ attribute: "health" })];
    const s = computeBuild(build({ traits: ["Master of One"], masterOfOneSkill: "Block", levels }));
    expect(s[1].perkPoints).toBe(3);
    expect(s[1].skills.Block).toBe(100);
    const b2 = build({ traits: ["Master of One"], masterOfOneSkill: "Block", levels: [blank({ perks: ["Block:Improved Blocking"] })] });
    expect(codes(b2, 1)).toContain("perk-granted");
  });

  it("Master of Destiny removes the birthsign and adds 5 perk points and +5 skills", () => {
    const plain = computeBuild(base)[0];
    const mod = computeBuild(build({ traits: ["Master of Destiny"] }))[0];
    expect(mod.perkPoints - plain.perkPoints).toBe(5);
    expect(mod.skills.Sneak - plain.skills.Sneak).toBe(5);
  });

  it("Master of One needs a skill chosen", () => {
    expect(codes(build({ traits: ["Master of One"] }), 1)).toContain("creation");
  });
});

describe("Destiny", () => {
  it("flags spending a Destiny point before it is earned", () => {
    const b = build({ levels: [blank({ ...base.levels[0], destiny: ["Destiny:Destiny", "Destiny:Focus"] })] });
    expect(codes(b, 1)).toContain("destiny-points-over");
  });

  it("checks Destiny prerequisites", () => {
    const b = build({ levels: [blank({ ...base.levels[0], destiny: ["Destiny:Focus"] })] });
    expect(codes(b, 1)).toContain("destiny-prerequisite");
  });
});
