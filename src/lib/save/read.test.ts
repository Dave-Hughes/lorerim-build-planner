import { deflateSync } from "node:zlib";
import { describe, expect, it } from "vitest";
import { buildSave, enc, questData, STAGES } from "./fixture";
import { inflate, lz4Block, parseQuest, readHeader, readSave, SaveError } from "./read";

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
