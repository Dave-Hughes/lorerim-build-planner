import { deflateSync } from "node:zlib";
import { describe, expect, it } from "vitest";
import { buildSave, enc, questData, STAGES } from "./fixture";
import { inflate, lz4Block, parseQuest, parseSkills, readHeader, readSave, SaveError, SKILLS } from "./read";

// The reader (WO-112) against a small save built byte for byte as the game writes one (fixture.ts).

const FORMS = { "skyrim.esm:0242af": "MS11", "fixture.esp:000800": "FXQuest", "light.esl:000abc": "FXLight" };

const save = (o: Parameters<typeof buildSave>[0] = {}) =>
  buildSave({
    formIds: [0x01000800, 0xfe000abc],
    quests: [
      { form: 0x0242af, stages: [[10, 1], [100, 1], [250, 0]] },              // MS11: stage 100 run, 250 not
      { form: 1, viaArray: true, runtime: 0x2, stages: [[200, 1]], compress: true }, // through the form id array, compressed, Completed
      { form: 2, viaArray: true, stages: [[5, 1]] },                            // a light plugin's quest
      { form: 0x012345, stages: [[10, 1]] },                                    // a quest the planner doesn't know
    ],
    ...o,
  });

describe("readSave", () => {
  it("reads the header, the day and the quests the planner knows", () => {
    const s = readSave(save(), FORMS);
    expect(s).toMatchObject({ name: "Kyria Severa", level: 10, xp: 197, xpToNext: 525, day: 15, place: "The Rift", saveNumber: 62, race: "NordRace" });
    expect(s.quests).toEqual({
      MS11: { stage: 100, completed: false },
      FXQuest: { stage: 200, completed: true },
      FXLight: { stage: 5, completed: false },
    });
    expect(s.skills).toBeUndefined();
  });

  it("reads an uncompressed save the same way", () => {
    expect(readSave(save({ compression: 0 }), FORMS).quests.MS11).toEqual({ stage: 100, completed: false });
  });

  it("lists a save from its header alone", () => {
    expect(readHeader(save({ name: "Azrem Shieldbreaker", saveNumber: 243 }))).toMatchObject({ name: "Azrem Shieldbreaker", level: 10, saveNumber: 243 });
  });

  it("says plainly when a file isn't a save", () => {
    expect(() => readSave(enc("not a save at all, just text"))).toThrow(SaveError);
    expect(() => readSave(save().subarray(0, 120))).toThrow(SaveError);
  });
});

describe("skills and the lute (WO-123)", () => {
  // Kyria's skills menu at Save 70, in actor value order: One-Handed ... Enchanting.
  const KYRIA = [10, 50, 5, 10, 15, 50, 10, 1, 15, 0, 6, 45, 15, 0, 25, 0, 40, 5];

  it("reads the 18 skills from the player's base actor values, by LoreRim's names", () => {
    const s = readSave(save({ skills: KYRIA }), FORMS);
    expect(s.skills).toEqual({
      "One-Handed": 10, "Two-Handed": 50, Marksman: 5, Block: 10, Smithing: 15, "Heavy Armor": 50, Evasion: 10, Finesse: 1, Wayfarer: 15,
      Sneak: 0, Alchemy: 6, Speech: 45, Alteration: 15, Conjuration: 0, Destruction: 25, Illusion: 0, Restoration: 40, Enchanting: 5,
    });
    expect(Object.keys(s.skills!)).toEqual(SKILLS);
  });

  it("reads Skyrim's Got Talent's lute as a count, through the save's plugin list", () => {
    expect(readSave(save({ lute: 199 }), FORMS).counts).toEqual({ lute: 199 });
    expect(readSave(save(), FORMS).counts).toBeUndefined();
  });

  it("leaves skills out when the player's list isn't there, or isn't the only one", () => {
    expect(parseSkills(new Uint8Array(400))).toBeNull();
  });

  it("reads Save 114's own bytes, not a fixture (WO-149)", () => {
    // Kyria's own base actor-value list, bytes 70139 to 70355 of Save 114's decompressed player change form
    // (0x14), read by hand with a Python port of this file after the installed save connector (the .mcpb Dave
    // had) came back skills: {} -- that connector predates WO-123 (no parseSkills in its bundle at all); this
    // reader was never the bug. Checked against Kyria's own skills menu at Save 114.
    // prettier-ignore
    const hex = "000000000000000001000000000000000200000000004842030000000000404004000000000000000500000000000000060000" +
      "00000020410700000000008042080000000000a040090000000000a0410a000000000070410b000000000080420c0000000000" +
      "70410d0000000000803f0e000000000070410f00000000000000100000000000c040110000000000484212000000000080411300" +
      "000000000000140000000000c84115000000000000001600000000007042170000000000a0401800000000001b43190000000000" +
      "0243 1a00000000001143";
    const bytes = Uint8Array.from(hex.replace(/\s+/g, "").match(/../g)!.map((b) => parseInt(b, 16)));
    expect(parseSkills(bytes)).toEqual({
      "One-Handed": 10, "Two-Handed": 64, Marksman: 5, Block: 20, Smithing: 15, "Heavy Armor": 64, Evasion: 15, Finesse: 1, Wayfarer: 15,
      Sneak: 0, Alchemy: 6, Speech: 50, Alteration: 16, Conjuration: 0, Destruction: 25, Illusion: 0, Restoration: 60, Enchanting: 5,
    });
  });
});

describe("the decompressors", () => {
  it("LZ4 copies a match from what it has written", () => {
    // "abcd", then a match of 8 from 4 back, then a last literal: "abcdabcdabcd!".
    expect(new TextDecoder().decode(lz4Block(Uint8Array.of(0x44, ...enc("abcd"), 4, 0, 0x10, 0x21), 13))).toBe("abcdabcdabcd!");
  });

  it("zlib, as the game compresses a change form", () => {
    const text = enc("Stage 100 of this quest done. ".repeat(20));
    expect(inflate(new Uint8Array(deflateSync(text)), text.length)).toEqual(text);
    expect(inflate(new Uint8Array(deflateSync(text, { level: 0 })), text.length)).toEqual(text);
  });

  it("a quest with no stage run and not completed isn't listed", () => {
    expect(parseQuest(questData(0, [[10, 0]]), STAGES)).toBeNull();
  });
});
