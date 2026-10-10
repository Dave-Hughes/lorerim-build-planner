import { beforeAll, describe, expect, it } from "vitest";
import sample from "./__fixtures__/sample-build.json";
import expected from "./__fixtures__/sample-build.expected.json";
import { TEST_VERSION_ID, TEST_VERSION_MISSING_TRAIT, registerTestVersion } from "./__fixtures__/test-version";
import { convertPlan, droppedSentence, missingIn } from "./convert";
import { gameData, requireGameData } from "./data";
import { computeBuild } from "./engine";
import { currentVersion, isKnownVersion, isOlderThanCurrent, knownVersions, shippedVersions } from "./versions";
import { parseBuildPlan } from "@/lib/builds/validate";
import type { BuildPlan } from "./types";

const plan = sample as unknown as BuildPlan;

beforeAll(() => registerTestVersion());

describe("versions", () => {
  it("has exactly one current version, and it is shipped", () => {
    expect(knownVersions().filter((v) => v.current)).toHaveLength(1);
    expect(shippedVersions().map((v) => v.id)).toContain(currentVersion().id);
  });

  it("the test version is known, older than current, and never shipped", () => {
    expect(isKnownVersion(TEST_VERSION_ID)).toBe(true);
    expect(isOlderThanCurrent(TEST_VERSION_ID)).toBe(true);
    expect(shippedVersions().map((v) => v.id)).not.toContain(TEST_VERSION_ID);
  });

  it("loads each version's data once, and only that version's", () => {
    expect(gameData("5.0.4.8")).toBe(gameData("5.0.4.8"));
    expect(gameData("9.9.9")).toBeUndefined();
    expect(requireGameData(TEST_VERSION_ID).traitByName.has(TEST_VERSION_MISSING_TRAIT)).toBe(false);
    expect(requireGameData("5.0.4.8").traitByName.has(TEST_VERSION_MISSING_TRAIT)).toBe(true);
  });
});

describe("computeBuild against the build's own version", () => {
  it("gives the same results for the sample build as before versions existed", () => {
    const states = computeBuild(plan, requireGameData(plan.gameVersion));
    for (const e of expected) {
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
    }
  });

  it("reports a trait the build's version doesn't have", () => {
    const old = { ...plan, gameVersion: TEST_VERSION_ID };
    const issues = computeBuild(old)[0].issues.map((i) => i.message);
    expect(issues).toContain(`Unknown trait "${TEST_VERSION_MISSING_TRAIT}".`);
  });
});

describe("validate", () => {
  it("accepts the sample build for its version", () => {
    expect(() => parseBuildPlan(plan)).not.toThrow();
  });
  it("rejects a version the planner doesn't know", () => {
    expect(() => parseBuildPlan({ ...plan, gameVersion: "9.9.9" })).toThrow(/Unknown LoreRim version/);
  });
  it("reports an item missing from the plan's own version", () => {
    expect(() => parseBuildPlan({ ...plan, gameVersion: TEST_VERSION_ID })).toThrow(/Unknown trait/);
  });
});

describe("switching version", () => {
  it("lists what the other version doesn't have", () => {
    const dropped = missingIn(requireGameData(TEST_VERSION_ID), plan);
    expect(dropped).toEqual([{ kind: "trait", name: TEST_VERSION_MISSING_TRAIT }]);
    expect(droppedSentence(TEST_VERSION_ID, dropped)).toBe(`Not in ${TEST_VERSION_ID}: Bulwark (trait).`);
  });

  it("removes only what is missing, and moves the plan to the other version", () => {
    const { plan: moved, dropped } = convertPlan(requireGameData(TEST_VERSION_ID), plan);
    expect(dropped).toHaveLength(1);
    expect(moved.gameVersion).toBe(TEST_VERSION_ID);
    expect(moved.traits).toEqual(plan.traits.filter((t) => t !== TEST_VERSION_MISSING_TRAIT));
    expect(moved.levels).toEqual(plan.levels);
    expect(() => parseBuildPlan(moved)).not.toThrow();
  });

  it("Copy for the current version: an old build carries over cleanly", () => {
    const old = { ...plan, gameVersion: TEST_VERSION_ID, traits: ["Witcher"] };
    const { plan: copy, dropped } = convertPlan(requireGameData(currentVersion().id), old);
    expect(dropped).toEqual([]);
    expect(copy.gameVersion).toBe(currentVersion().id);
    expect(copy.traits).toEqual(["Witcher"]);
  });
});
