/**
 * The save reader (WO-112): what a Skyrim SE save (.ess) says about the player, read in the browser or in
 * Node, so the save never leaves the PC. A port of the field guide's ess.py and questscan.py.
 *
 * It reads the header (name, level, XP, place, save number), the LZ4 body (decompressed here, no native
 * module), the plugin and light plugin lists, the globals (the day is GameDaysPassed), and the quest change
 * forms (each stage the game has run, and the Completed runtime flag). Quests are named through
 * quest_forms.json ("Skyrim.esm:0242AF" -> "MS11"); a quest the planner doesn't know is left out.
 *
 * Skills are left out: they sit in the player's change form behind several sections whose layout isn't
 * documented well enough to read without guessing (WO-112's Done when says what was tried).
 */

export interface SaveQuest {
  /** The highest stage the game has run. */
  stage: number;
  /** The quest's Completed runtime flag. */
  completed: boolean;
}

export interface SaveRead {
  name: string;
  level: number;
  /** XP into the current level, and the XP that level needs. */
  xp: number;
  xpToNext: number;
  /** The in-game day: the whole part of GameDaysPassed, which is 1 on the first morning. */
  day: number;
  place: string;
  /** The save's number in its file name ("Save 62"). */
  saveNumber: number;
  race: string;
  quests: Record<string, SaveQuest>;
  skills?: Record<string, number>;
}

export class SaveError extends Error {}

/** Quest editor ids by plugin and local form id: { "skyrim.esm:0242af": "MS11" } (keys lower case). */
export type QuestForms = Record<string, string>;

// ---- bytes -----------------------------------------------------------------------------------------

class Reader {
  p = 0;
  private v: DataView;
  constructor(public b: Uint8Array) {
    this.v = new DataView(b.buffer, b.byteOffset, b.byteLength);
  }
  need(n: number) {
    if (this.p + n > this.b.length) throw new SaveError("The save ends early: it may be cut short or not a Skyrim SE save.");
  }
  u8() {
    this.need(1);
    return this.b[this.p++];
  }
  u16() {
    this.need(2);
    const x = this.v.getUint16(this.p, true);
    this.p += 2;
    return x;
  }
  u32() {
    this.need(4);
    const x = this.v.getUint32(this.p, true);
    this.p += 4;
    return x;
  }
  f32() {
    this.need(4);
    const x = this.v.getFloat32(this.p, true);
    this.p += 4;
    return x;
  }
  bytes(n: number) {
    this.need(n);
    const x = this.b.subarray(this.p, this.p + n);
    this.p += n;
    return x;
  }
  /** A wstring: u16 length, then Windows-1252 text (Latin-1 covers the names the game writes). */
  ws() {
    const n = this.u16();
    let s = "";
    for (const c of this.bytes(n)) s += String.fromCharCode(c);
    return s;
  }
  /** A vsval: 1, 2 or 3 bytes, its size in the low two bits. */
  vsval() {
    this.need(1);
    const t = this.b[this.p] & 3;
    if (t === 0) return this.u8() >> 2;
    if (t === 1) return this.u16() >> 2;
    this.need(3);
    const x = this.b[this.p] | (this.b[this.p + 1] << 8) | (this.b[this.p + 2] << 16);
    this.p += 3;
    return x >> 2;
  }
}

/** An LZ4 block (no frame), as the game writes the body. */
export function lz4Block(src: Uint8Array, size: number): Uint8Array {
  const out = new Uint8Array(size);
  let s = 0;
  let d = 0;
  while (s < src.length) {
    const token = src[s++];
    let lit = token >> 4;
    if (lit === 15) {
      let x;
      do {
        x = src[s++];
        lit += x;
      } while (x === 255);
    }
    if (d + lit > size || s + lit > src.length) throw new SaveError("The save's body doesn't decompress: it may be damaged.");
    out.set(src.subarray(s, s + lit), d);
    s += lit;
    d += lit;
    if (s >= src.length) break;
    const off = src[s] | (src[s + 1] << 8);
    s += 2;
    let len = token & 15;
    if (len === 15) {
      let x;
      do {
        x = src[s++];
        len += x;
      } while (x === 255);
    }
    len += 4;
    if (off === 0 || off > d || d + len > size) throw new SaveError("The save's body doesn't decompress: it may be damaged.");
    for (let i = 0; i < len; i++, d++) out[d] = out[d - off];
  }
  return d === size ? out : out.subarray(0, d);
}

// A zlib stream (RFC 1950 around RFC 1951), for the change forms the game compresses.
const LEN_BASE = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258];
const LEN_EXTRA = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0];
const DIST_BASE = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577];
const DIST_EXTRA = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13];
const CL_ORDER = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];

interface Huff {
  counts: number[];
  symbols: number[];
}

function huff(lengths: number[]): Huff {
  const counts = new Array(16).fill(0);
  for (const l of lengths) counts[l]++;
  counts[0] = 0;
  const offs = new Array(16).fill(0);
  for (let i = 1; i < 16; i++) offs[i] = offs[i - 1] + counts[i - 1];
  const symbols = new Array(lengths.length).fill(0);
  lengths.forEach((l, sym) => {
    if (l) symbols[offs[l]++] = sym;
  });
  return { counts, symbols };
}

export function inflate(src: Uint8Array, size: number): Uint8Array {
  let pos = 2; // the zlib header
  let bitBuf = 0;
  let bitCnt = 0;
  const out = new Uint8Array(size);
  let d = 0;
  const bits = (n: number) => {
    while (bitCnt < n) {
      if (pos >= src.length) throw new SaveError("A compressed part of the save ends early.");
      bitBuf |= src[pos++] << bitCnt;
      bitCnt += 8;
    }
    const v = bitBuf & ((1 << n) - 1);
    bitBuf >>>= n;
    bitCnt -= n;
    return v;
  };
  const decode = (h: Huff) => {
    let code = 0;
    let first = 0;
    let index = 0;
    for (let len = 1; len < 16; len++) {
      code |= bits(1);
      const count = h.counts[len];
      if (code - count < first) return h.symbols[index + (code - first)];
      index += count;
      first += count;
      first <<= 1;
      code <<= 1;
    }
    throw new SaveError("A compressed part of the save is damaged.");
  };
  const fixedLit = huff([...new Array(144).fill(8), ...new Array(112).fill(9), ...new Array(24).fill(7), ...new Array(8).fill(8)]);
  const fixedDist = huff(new Array(30).fill(5));
  let last = 0;
  while (!last) {
    last = bits(1);
    const type = bits(2);
    if (type === 0) {
      bitBuf = 0;
      bitCnt = 0;
      const len = src[pos] | (src[pos + 1] << 8);
      pos += 4;
      out.set(src.subarray(pos, pos + len), d);
      pos += len;
      d += len;
      continue;
    }
    let lit = fixedLit;
    let dist = fixedDist;
    if (type === 2) {
      const nlen = bits(5) + 257;
      const ndist = bits(5) + 1;
      const ncode = bits(4) + 4;
      const cl = new Array(19).fill(0);
      for (let i = 0; i < ncode; i++) cl[CL_ORDER[i]] = bits(3);
      const clh = huff(cl);
      const lengths: number[] = [];
      while (lengths.length < nlen + ndist) {
        const sym = decode(clh);
        if (sym < 16) lengths.push(sym);
        else if (sym === 16) lengths.push(...new Array(3 + bits(2)).fill(lengths[lengths.length - 1]));
        else if (sym === 17) lengths.push(...new Array(3 + bits(3)).fill(0));
        else lengths.push(...new Array(11 + bits(7)).fill(0));
      }
      lit = huff(lengths.slice(0, nlen));
      dist = huff(lengths.slice(nlen));
    } else if (type === 3) {
      throw new SaveError("A compressed part of the save is damaged.");
    }
    for (;;) {
      const sym = decode(lit);
      if (sym < 256) out[d++] = sym;
      else if (sym === 256) break;
      else {
        const len = LEN_BASE[sym - 257] + bits(LEN_EXTRA[sym - 257]);
        const ds = decode(dist);
        const back = DIST_BASE[ds] + bits(DIST_EXTRA[ds]);
        for (let i = 0; i < len; i++, d++) out[d] = out[d - back];
      }
    }
  }
  return out;
}

// ---- the save --------------------------------------------------------------------------------------

const MAGIC = "TESV_SAVEGAME";
const GAME_DAYS_PASSED = 0x39; // Skyrim.esm's GameDaysPassed global
const QUEST_TYPE = 8; // change form type for a quest
const CF_FORM_FLAGS = 0x1;
const CF_QUEST_FLAGS = 0x2;
const CF_QUEST_STAGES = 0x80000000;
const QUEST_COMPLETED = 0x2;

/** The header alone: enough to list saves without reading the body. */
export function readHeader(bytes: Uint8Array) {
  // Too short to hold the magic: not a save at all, rather than one cut short.
  if (bytes.length < MAGIC.length) throw new SaveError("This isn't a Skyrim save (.ess).");
  const r = new Reader(bytes);
  let magic = "";
  for (const c of r.bytes(MAGIC.length)) magic += String.fromCharCode(c);
  if (magic !== MAGIC) throw new SaveError("This isn't a Skyrim save (.ess).");
  const headerSize = r.u32();
  const headerStart = r.p;
  const version = r.u32();
  if (version < 12) throw new SaveError("This save is from Skyrim before the Special Edition; the reader reads SE saves.");
  const saveNumber = r.u32();
  const name = r.ws();
  const level = r.u32();
  const place = r.ws();
  const gameDate = r.ws();
  const race = r.ws();
  const sex = r.u16();
  const curExp = r.f32();
  const lvlUpExp = r.f32();
  r.p += 8; // the file time
  const width = r.u32();
  const height = r.u32();
  const compression = r.u16();
  if (r.p !== headerStart + headerSize) throw new SaveError("The save's header doesn't read as Skyrim SE's.");
  return { version, saveNumber, name, level, place, gameDate, race, sex, curExp, lvlUpExp, width, height, compression, end: r.p };
}

function formKey(plugin: string, local: number) {
  return `${plugin.toLowerCase()}:${local.toString(16).toUpperCase().padStart(6, "0").toLowerCase()}`;
}

export function readSave(bytes: Uint8Array, questForms: QuestForms = {}): SaveRead {
  const h = readHeader(bytes);
  const r0 = new Reader(bytes);
  r0.p = h.end + h.width * h.height * 4; // the screenshot, RGBA
  let body: Uint8Array;
  // Offsets in the file location table count from the start of the save as if it weren't compressed.
  let base: number;
  if (h.compression === 0) {
    body = bytes.subarray(r0.p);
    base = -r0.p;
  } else if (h.compression === 2) {
    const size = r0.u32();
    const packed = r0.u32();
    body = lz4Block(r0.bytes(packed), size);
    base = -(r0.p - packed - 8);
  } else {
    throw new SaveError("This save is compressed with zlib; the reader reads LZ4 saves, the game's default.");
  }
  const r = new Reader(body);
  const formVersion = r.u8();
  const pluginInfoSize = r.u32();
  const pluginStart = r.p;
  const plugins = Array.from({ length: r.u8() }, () => r.ws());
  const light = formVersion >= 78 ? Array.from({ length: r.u16() }, () => r.ws()) : [];
  r.p = pluginStart + pluginInfoSize;
  const offsets = Array.from({ length: 6 }, () => r.u32()); // formIDArrayCount, unknownTable3, global 1, global 2, changeForms, global 3
  const counts = Array.from({ length: 4 }, () => r.u32()); // global 1, global 2, global 3, change forms
  r.p += 15 * 4;

  // The form id array: refids of type 0 index into it.
  const formIds = (() => {
    const at = offsets[0] + base;
    const fr = new Reader(body);
    fr.p = at;
    const n = fr.u32();
    if (n > 5_000_000) throw new SaveError("The save's form list doesn't read: it may be damaged.");
    return Array.from({ length: n }, () => fr.u32());
  })();
  const resolve = (b0: number, b1: number, b2: number): number | null => {
    const t = b0 >> 6;
    const v = ((b0 & 0x3f) << 16) | (b1 << 8) | b2;
    if (t === 0) return v > 0 && v <= formIds.length ? formIds[v - 1] : null;
    if (t === 1) return v;
    if (t === 2) return (0xff000000 | v) >>> 0;
    return null;
  };
  const nameOf = (full: number): string | null => {
    const top = full >>> 24;
    if (top === 0xfe) {
      const lp = light[(full >>> 12) & 0xfff];
      return lp ? formKey(lp, full & 0xfff) : null;
    }
    const p = plugins[top];
    return p ? formKey(p, full & 0xffffff) : null;
  };

  // Global data table 1, right after the file location table: type 3 holds the globals.
  let gameDaysPassed: number | null = null;
  for (let i = 0; i < counts[0]; i++) {
    const type = r.u32();
    const len = r.u32();
    const start = r.p;
    if (type === 3) {
      const n = r.vsval();
      for (let j = 0; j < n; j++) {
        const ref = r.bytes(3);
        const value = r.f32();
        if (resolve(ref[0], ref[1], ref[2]) === GAME_DAYS_PASSED) gameDaysPassed = value;
      }
    }
    r.p = start + len;
  }

  // Change forms: the quests' stages and Completed flag.
  const quests: Record<string, SaveQuest> = {};
  const cf = new Reader(body);
  cf.p = offsets[4] + base;
  for (let i = 0; i < counts[3]; i++) {
    const ref = cf.bytes(3);
    const flags = cf.u32();
    const type = cf.u8();
    cf.u8(); // version
    const size = type >> 6;
    let len1: number;
    let len2: number;
    if (size === 0) {
      len1 = cf.u8();
      len2 = cf.u8();
    } else if (size === 1) {
      len1 = cf.u16();
      len2 = cf.u16();
    } else {
      len1 = cf.u32();
      len2 = cf.u32();
    }
    const data = cf.bytes(len1);
    if ((type & 0x3f) !== QUEST_TYPE) continue;
    const full = resolve(ref[0], ref[1], ref[2]);
    const key = full === null ? null : nameOf(full);
    const edid = key ? questForms[key] : undefined;
    if (!edid) continue;
    const q = parseQuest(len2 ? inflate(data, len2) : data, flags);
    if (q) quests[edid] = q;
  }

  // GameDaysPassed is 1 on the first morning and counts up: day 15 is 15.x (the header then says 14 days passed).
  const day = gameDaysPassed === null ? 1 : Math.max(1, Math.floor(gameDaysPassed));
  return {
    name: h.name,
    level: h.level,
    xp: Math.floor(h.curExp),
    xpToNext: Math.round(h.lvlUpExp),
    day,
    place: h.place,
    saveNumber: h.saveNumber,
    race: h.race,
    quests,
  };
}

/** A quest change form: runtime flags, then the stages the game has run (index, and a done flag). */
export function parseQuest(data: Uint8Array, flags: number): SaveQuest | null {
  const r = new Reader(data);
  if (flags & CF_FORM_FLAGS) r.p += 4;
  const runtime = flags & CF_QUEST_FLAGS ? r.u16() : 0;
  let stage = -1;
  if ((flags & CF_QUEST_STAGES) !== 0) {
    const n = r.vsval();
    for (let i = 0; i < n; i++) {
      const index = r.u16();
      const done = r.u8();
      if (done & 1 && index > stage) stage = index;
    }
  }
  const completed = (runtime & QUEST_COMPLETED) !== 0;
  if (stage < 0 && !completed) return null;
  return { stage: Math.max(stage, 0), completed };
}
