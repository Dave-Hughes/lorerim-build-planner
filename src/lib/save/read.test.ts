import { deflateSync } from "node:zlib";
import { describe, expect, it } from "vitest";
import { inflate, lz4Block, parseQuest, readHeader, readSave, SaveError } from "./read";

// A small Skyrim SE save, built byte for byte as the game writes one (WO-112).

const enc = (s: string) => Uint8Array.from(s, (c) => c.charCodeAt(0));
const cat = (...parts: Uint8Array[]) => {
  const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
  let o = 0;
  for (const p of parts) {
    out.set(p, o);
    o += p.length;
  }
  return out;
};
const u8 = (n: number) => Uint8Array.of(n);
const u16 = (n: number) => Uint8Array.of(n & 255, n >> 8);
const u32 = (n: number) => {
  const b = new Uint8Array(4);
  new DataView(b.buffer).setUint32(0, n >>> 0, true);
  return b;
};
const f32 = (n: number) => {
  const b = new Uint8Array(4);
  new DataView(b.buffer).setFloat32(0, n, true);
  return b;
};
const ws = (s: string) => cat(u16(s.length), enc(s));
/** A vsval holding n (one byte up to 63, two bytes beyond). */
const vsval = (n: number) => (n < 64 ? u8(n << 2) : u16((n << 2) | 1));
/** A refid: type 0 indexes the form id array (from 1), type 1 is a Skyrim.esm form, type 2 a created form. */
const ref = (type: number, v: number) => Uint8Array.of((type << 6) | ((v >> 16) & 0x3f), (v >> 8) & 255, v & 255);

/** An LZ4 block with no matches: one sequence of literals, which any LZ4 reader accepts. */
function lz4Literals(data: Uint8Array) {
  const n = data.length;
  const parts: Uint8Array[] = [u8(15 << 4)];
  let rest = n - 15;
  while (rest >= 255) {
    parts.push(u8(255));
    rest -= 255;
  }
  parts.push(u8(rest), data);
  return cat(...parts);
}

/** A quest change form's data: runtime flags, then its stages (index, done). */
function questData(runtime: number, stages: [number, number][]) {
  return cat(u16(runtime), vsval(stages.length), ...stages.map(([i, d]) => cat(u16(i), u8(d))));
}

function changeForm(r: Uint8Array, flags: number, data: Uint8Array, compress = false) {
  const stored = compress ? new Uint8Array(deflateSync(data)) : data;
  return cat(r, u32(flags), u8(8), u8(1), u8(stored.length), u8(compress ? data.length : 0), stored);
}

const STAGES = 0x80000000 | 0x2;

function save({ name = "Kyria Severa", compression = 2 } = {}) {
  const header = cat(u32(12), u32(62), ws(name), u32(10), ws("The Rift"), ws("014.01.27"), ws("NordRace"), u16(1), f32(197.3), f32(525),
    new Uint8Array(8), u32(1), u32(1), u16(compression));
  const head = cat(enc("TESV_SAVEGAME"), u32(header.length), header, new Uint8Array(4)); // one RGBA pixel of screenshot

  const pluginInfo = cat(u8(2), ws("Skyrim.esm"), ws("Fixture.esp"), u16(1), ws("Light.esl"));
  const globals = cat(vsval(1), ref(1, 0x39), f32(15.36));
  const table1 = cat(u32(3), u32(globals.length), globals);
  const forms = cat(
    changeForm(ref(1, 0x0242af), STAGES, questData(0, [[10, 1], [100, 1], [250, 0]])),           // MS11: stage 100 run, 250 not
    changeForm(ref(0, 1), STAGES, questData(0x2, [[200, 1]]), true),                              // through the form id array, compressed
    changeForm(ref(0, 2), STAGES, questData(0, [[5, 1]])),                                         // a light plugin quest
    changeForm(ref(1, 0x012345), STAGES, questData(0, [[10, 1]])),                                 // a quest the planner doesn't know
  );
  const formIds = cat(u32(2), u32(0x01000800), u32(0xfe000abc));
  // The body: offsets count from the start of the save as if it weren't compressed.
  const fixedLen = 1 + 4 + pluginInfo.length + 6 * 4 + 4 * 4 + 15 * 4;
  const at = head.length + fixedLen;
  const changeAt = at + table1.length;
  const formIdAt = changeAt + forms.length;
  const table = cat(u32(formIdAt), u32(0), u32(at), u32(0), u32(changeAt), u32(0), u32(1), u32(0), u32(0), u32(4), new Uint8Array(15 * 4));
  const body = cat(u8(78), u32(pluginInfo.length), pluginInfo, table, table1, forms, formIds);
  if (compression === 0) return cat(head, body);
  const packed = lz4Literals(body);
  return cat(head, u32(body.length), u32(packed.length), packed);
}

const FORMS = { "skyrim.esm:0242af": "MS11", "fixture.esp:000800": "FXQuest", "light.esl:000abc": "FXLight" };

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
    expect(readHeader(save({ name: "Azrem Shieldbreaker" }))).toMatchObject({ name: "Azrem Shieldbreaker", level: 10, saveNumber: 62 });
  });

  it("says plainly when a file isn't a save", () => {
    expect(() => readSave(enc("not a save at all, just text"))).toThrow(SaveError);
    expect(() => readSave(save().subarray(0, 120))).toThrow(SaveError);
  });
});

describe("the decompressors", () => {
  it("LZ4 copies a match from what it has written", () => {
    // "abcd" then a match of 8 from 4 back: "abcdabcdabcd", then the end's literals.
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
