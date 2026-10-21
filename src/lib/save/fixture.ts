import { deflateSync } from "node:zlib";

/**
 * A small Skyrim SE save built byte for byte as the game writes one (WO-112), for the reader's tests and the
 * Read a save e2e. Node only (it compresses with node:zlib).
 */

export const enc = (s: string) => Uint8Array.from(s, (c) => c.charCodeAt(0));
export const cat = (...parts: Uint8Array[]) => {
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
/** A vsval holding n (one byte up to 63, two beyond). */
const vsval = (n: number) => (n < 64 ? u8(n << 2) : u16((n << 2) | 1));
/** A refid: type 0 indexes the form id array (from 1), type 1 is a Skyrim.esm form. */
const ref = (type: number, v: number) => Uint8Array.of((type << 6) | ((v >> 16) & 0x3f), (v >> 8) & 255, v & 255);

/** An LZ4 block with no matches: one sequence of literals, which any LZ4 reader accepts. */
function lz4Literals(data: Uint8Array) {
  const parts: Uint8Array[] = [u8(15 << 4)];
  let rest = data.length - 15;
  while (rest >= 255) {
    parts.push(u8(255));
    rest -= 255;
  }
  parts.push(u8(rest), data);
  return cat(...parts);
}

/** A quest change form's data: runtime flags, then its stages (index, done flag). */
export function questData(runtime: number, stages: [number, number][]) {
  return cat(u16(runtime), vsval(stages.length), ...stages.map(([i, d]) => cat(u16(i), u8(d))));
}

export const STAGES = 0x80000000 | 0x2; // the change flags for a quest's runtime flags and stages

/**
 * The player's change form (0x14) with its base actor values: some bytes before, then (u32 actor value, f32 value)
 * entries 0 to 40, the skills at 6 to 23, and a later list that doesn't start at 0, as the game's has.
 */
function player(skills: number[]) {
  const av = (i: number) => (i >= 6 && i <= 23 ? skills[i - 6] : i === 24 ? 145 : i === 25 ? 125 : i === 26 ? 135 : 1);
  const data = cat(Uint8Array.of(7, 0, 3, 0xe0, 0, 0, 0), ...Array.from({ length: 41 }, (_, i) => cat(u32(i), f32(av(i)))), ...[46, 47, 52].map((i) => cat(u32(i), f32(0.5))));
  return cat(ref(1, 0x14), u32(0xb0000c22), u8(1 | (1 << 6)), u8(1), u16(data.length), u16(0), data);
}

export interface FixtureQuest {
  /** A Skyrim.esm form (refid type 1), or a place in the form id array (refid type 0, from 1). */
  form: number;
  viaArray?: boolean;
  runtime?: number;
  stages: [number, number][];
  compress?: boolean;
}

export function buildSave({
  name = "Kyria Severa",
  saveNumber = 62,
  level = 10,
  place = "The Rift",
  day = 15.36,
  compression = 2,
  formIds = [],
  quests = [],
  skills,
  lute,
}: {
  name?: string; saveNumber?: number; level?: number; place?: string; day?: number; compression?: 0 | 2; formIds?: number[]; quests?: FixtureQuest[];
  /** The 18 skills in actor value order (6 to 23), in the player's change form as the game keeps them (WO-123). */
  skills?: number[];
  /** Skyrim's Got Talent's _Talent_Lute global. */
  lute?: number;
} = {}) {
  const header = cat(u32(12), u32(saveNumber), ws(name), u32(level), ws(place), ws("014.01.27"), ws("NordRace"), u16(1), f32(197.3), f32(525),
    new Uint8Array(8), u32(1), u32(1), u16(compression));
  const head = cat(enc("TESV_SAVEGAME"), u32(header.length), header, new Uint8Array(4)); // one RGBA pixel of screenshot

  const pluginInfo = cat(u8(3), ws("Skyrim.esm"), ws("Fixture.esp"), ws("SkyrimsGotTalent-Bards.esp"), u16(1), ws("Light.esl"));
  const allIds = lute === undefined ? formIds : [...formIds, 0x02000d62]; // _Talent_Lute, through the form id array
  const globals = lute === undefined
    ? cat(vsval(1), ref(1, 0x39), f32(day)) // GameDaysPassed
    : cat(vsval(2), ref(1, 0x39), f32(day), ref(0, allIds.length), f32(lute));
  const table1 = cat(u32(3), u32(globals.length), globals);
  const forms = cat(
    ...quests.map((q) => {
      const data = questData(q.runtime ?? 0, q.stages);
      const stored = q.compress ? new Uint8Array(deflateSync(data)) : data;
      return cat(ref(q.viaArray ? 0 : 1, q.form), u32(STAGES), u8(8), u8(1), u8(stored.length), u8(q.compress ? data.length : 0), stored);
    }),
    ...(skills ? [player(skills)] : []),
  );
  const ids = cat(u32(allIds.length), ...allIds.map(u32));
  // The body: offsets count from the start of the save as if it weren't compressed.
  const fixedLen = 1 + 4 + pluginInfo.length + 6 * 4 + 4 * 4 + 15 * 4;
  const at = head.length + fixedLen;
  const changeAt = at + table1.length;
  const formIdAt = changeAt + forms.length;
  const table = cat(u32(formIdAt), u32(0), u32(at), u32(0), u32(changeAt), u32(0), u32(1), u32(0), u32(0), u32(quests.length + (skills ? 1 : 0)), new Uint8Array(15 * 4));
  const body = cat(u8(78), u32(pluginInfo.length), pluginInfo, table, table1, forms, ids);
  if (compression === 0) return cat(head, body);
  const packed = lz4Literals(body);
  return cat(head, u32(body.length), u32(packed.length), packed);
}
