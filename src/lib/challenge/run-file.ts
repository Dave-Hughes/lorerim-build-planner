import { createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";

/**
 * The run file the Zenithar's Challenge mod writes on every save: `{"run":{...},"seal":"<hex>"}`. The seal is an
 * HMAC-SHA-256 over the exact text of the run object, so a file edited by hand no longer matches.
 *
 * The key ships inside the mod (it has to), so the seal stops casual edits, not a determined forger. That is the
 * agreed bar for a for-fun challenge (Dave, 9 Nov 2026).
 */
const DEFAULT_SEAL_KEY = "zenithars-challenge/run-file/v1/3f9c1e7a52b84d06a1c7e0d49b6f8235";
export const sealKey = (env: Record<string, string | undefined> = process.env) => env.CHALLENGE_SEAL_KEY?.trim() || DEFAULT_SEAL_KEY;

/** The largest file taken: under the 1 MB a form may send. A long run with thousands of items made is well under this. */
export const MAX_RUN_FILE_BYTES = 900_000;

const count = z.number().int().min(0).max(100_000_000);
const made = z.object({
  crafted: count,
  cooked: count,
  brewed: count,
  mined: count,
  chopped: count,
  hunted: count,
  items: z
    .array(
      z
        .object({ id: z.string().max(200), name: z.string().max(200) })
        .catchall(z.unknown()),
    )
    .max(50_000),
});

export const RULES = ["gear", "food", "potion", "sale", "magic", "missive", "material", "console", "other"] as const;

const runSchema = z.object({
  format: z.literal(1),
  mod: z.string().max(40),
  written: z.string().max(40),
  character: z.object({ name: z.string().min(1).max(80), race: z.string().max(80), level: z.number().int().min(1).max(1000) }),
  mode: z.enum(["oath", "honor"]),
  modeChosen: z.boolean(),
  options: z
    .object({
      lootGems: z.boolean(),
      lootSoulGems: z.boolean(),
      coinPurseGems: z.boolean(),
      questRewards: z.boolean(),
      startingItems: z.boolean(),
      othersKills: z.boolean(),
      /** Written by one test build of the mod (10 Nov) and dropped again; read and ignored. */
      startingClothes: z.boolean().optional(),
    })
    .optional(),
  daysPassed: z.number().min(0).max(1_000_000),
  /**
   * When the challenge was taken (in-game days passed), and whether by a new character or one that already had a
   * past (the mod's bAskOnLoad switch). From mod builds of 11 Nov on; older files have none.
   */
  taken: z.object({ day: z.number().min(0).max(1_000_000), character: z.enum(["new", "existing"]) }).optional(),
  made,
  rulesBroken: z
    .array(z.object({ rule: z.enum(RULES), id: z.string().max(200), name: z.string().max(200), count: z.number().int(), day: z.number() }))
    .max(20_000),
  kills: z.array(z.object({ kind: z.string().max(200), id: z.string().max(200), count })).max(5_000),
  consoleOpened: count,
  /** Followed by the mod itself: times the character went down, and game units travelled (about 70 to a metre). */
  deaths: count.optional(),
  distance: z.number().min(0).max(1e12).optional(),
  /** The game's own totals for the character (places found, quests done, gold found...), from mod builds that write them. */
  stats: z.record(z.string().max(40), count).optional(),
  plugins: z.object({ count, fingerprint: z.string().max(80) }),
});

export type Run = z.infer<typeof runSchema>;
export type RunOptions = NonNullable<Run["options"]>;

export type RunFileResult = { ok: true; run: Run; seal: string } | { ok: false; error: string };

export const RUN_FILE_WORDS = {
  tooBig: "That file is too large to be a run file.",
  notRunFile: "That is not a run file. It is the .json file the mod writes next to your SKSE logs.",
  edited: "That file was changed after the mod wrote it, so it can't be taken.",
  shape: "That run file is from a version of the mod this page doesn't read yet.",
  notChallenge: "That run was not played under the challenge, so it can't go on the leaderboard.",
} as const;

/**
 * Reads and checks a run file. The seal is checked against the bytes between `{"run":` and `,"seal":"`, exactly
 * as the mod sealed them, before anything is parsed out of it.
 */
export function readRunFile(text: string, key: string = sealKey()): RunFileResult {
  if (Buffer.byteLength(text, "utf8") > MAX_RUN_FILE_BYTES) return { ok: false, error: RUN_FILE_WORDS.tooBig };
  const trimmed = text.trim();
  const head = '{"run":';
  const mark = ',"seal":"';
  const at = trimmed.lastIndexOf(mark);
  if (!trimmed.startsWith(head) || at < 0 || !trimmed.endsWith('"}')) return { ok: false, error: RUN_FILE_WORDS.notRunFile };
  const body = trimmed.slice(head.length, at);
  const seal = trimmed.slice(at + mark.length, -2);
  if (!/^[0-9a-f]{64}$/.test(seal)) return { ok: false, error: RUN_FILE_WORDS.notRunFile };

  const expected = createHmac("sha256", key).update(body, "utf8").digest();
  if (!timingSafeEqual(expected, Buffer.from(seal, "hex"))) return { ok: false, error: RUN_FILE_WORDS.edited };

  let parsed: unknown;
  try {
    parsed = JSON.parse(body);
  } catch {
    return { ok: false, error: RUN_FILE_WORDS.notRunFile };
  }
  const run = runSchema.safeParse(parsed);
  if (!run.success) return { ok: false, error: RUN_FILE_WORDS.shape };
  // Early builds of the mod had a warn-only mode, "honor". The challenge is the refusing one alone now.
  if (run.data.mode !== "oath") return { ok: false, error: RUN_FILE_WORDS.notChallenge };
  return { ok: true, run: run.data, seal };
}

/** Seals a run the way the mod does. For tests and fixtures only. */
export function sealRunFile(run: unknown, key: string = sealKey()): string {
  const body = JSON.stringify(run);
  const seal = createHmac("sha256", key).update(body, "utf8").digest("hex");
  return `{"run":${body},"seal":"${seal}"}\n`;
}

/**
 * The in-game days a run has been on the challenge: days passed since the day it was taken. A new character takes it
 * in its first hour, so this is its whole life; a character that joined late does not bring its earlier days with it.
 */
export const daysOnChallenge = (run: Pick<Run, "daysPassed" | "taken">) => Math.max(0, run.daysPassed - (run.taken?.day ?? 0));
/** Everything a run made, across the six ways. */
export const madeTotal = (run: Pick<Run, "made">) => run.made.crafted + run.made.cooked + run.made.brewed + run.made.mined + run.made.chopped + run.made.hunted;
/** Every kill, across the kinds. */
export const killTotal = (run: Pick<Run, "kills">) => run.kills.reduce((n, k) => n + k.count, 0);
