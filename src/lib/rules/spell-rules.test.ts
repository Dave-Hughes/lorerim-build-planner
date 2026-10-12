import { describe, expect, it } from "vitest";
import sample from "./__fixtures__/sample-build.json";
import { computeBuild } from "./engine";
import { requireGameData } from "./data";
import { keptMainSpells, spellsAt, spellsLearned, tierPicksAt } from "./spells";
import { addSpell, removeSpell, toggleMainSpell } from "@/components/editor/plan-ops";
import type { BuildPlan } from "./types";

const d = requireGameData("5.0.4.8");
const base = sample as unknown as BuildPlan;
const id = (name: string) => d.spells.find((s) => s.name === name)!.id;
const pool = d.spellPicks.pools["Destruction:Novice Destruction"];

/** The sample build with Novice Destruction taken at level 1 and these spells there. */
function withNovice(spells: { id: string; where?: string }[], more: { level: number; id: string }[] = []): BuildPlan {
  const levels = base.levels.map((lv, i) => (i === 0 ? { ...lv, perks: [...lv.perks, "Destruction:Novice Destruction"], spells } : lv));
  for (const m of more) levels[m.level - 1] = { ...levels[m.level - 1], spells: [...(levels[m.level - 1].spells ?? []), { id: m.id }] };
  return { ...base, levels };
}

describe("spells in a build", () => {
  it("Novice Destruction gives 2 free picks from its pool", () => {
    expect(tierPicksAt(d, withNovice([]), 1)).toEqual([{ perk: "Destruction:Novice Destruction", tier: "Novice", count: 2, pool }]);
  });

  it("two picks from the pool at that level are free, and a third is learned another way", () => {
    const [a, b, c] = ["Flames", "Sparks", "Frostbite"].map(id);
    const rows = spellsAt(d, withNovice([{ id: a }, { id: b }, { id: c }]), 1);
    expect(rows.map((r) => r.freeFrom)).toEqual(["Destruction:Novice Destruction", "Destruction:Novice Destruction", undefined]);
  });

  it("a spell outside the pool is never a free pick", () => {
    expect(spellsAt(d, withNovice([{ id: id("Eldritch Blast") }]), 1)[0].freeFrom).toBeUndefined();
  });

  it("learning Fireball twice raises spell-repeat", () => {
    const fireball = id("Fireball");
    const plan = withNovice([{ id: fireball }], [{ level: 3, id: fireball }]);
    const states = computeBuild(plan);
    expect(states[0].issues.map((i) => i.code)).not.toContain("spell-repeat");
    expect(states[2].issues).toContainEqual({ code: "spell-repeat", message: "Fireball was already learned at level 1." });
    expect(spellsLearned(d, plan).filter((s) => s.id === fireball)).toHaveLength(1);
  });

  it("an id this version doesn't have raises spell-unknown", () => {
    expect(computeBuild(withNovice([{ id: "Nope.esp:000001" }]))[0].issues.map((i) => i.code)).toContain("spell-unknown");
  });

  it("mainSpells keeps only spells the build learns", () => {
    const flames = id("Flames");
    const plan = { ...withNovice([{ id: flames }]), mainSpells: [flames, id("Fireball")] };
    expect(keptMainSpells(plan)).toEqual([flames]);
    // Starring adds; removing the spell takes its star away.
    let p = toggleMainSpell(withNovice([{ id: flames }]), flames);
    expect(p.mainSpells).toEqual([flames]);
    p = removeSpell(p, 1, 0);
    expect(p.mainSpells).toBeUndefined();
    // A spell the build doesn't learn can't be starred.
    expect(toggleMainSpell(withNovice([]), flames).mainSpells).toBeUndefined();
    expect(addSpell(withNovice([]), 1, { id: flames, where: "  " }).levels[0].spells).toEqual([{ id: flames }]);
  });
});
