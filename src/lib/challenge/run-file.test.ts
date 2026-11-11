import { describe, expect, it } from "vitest";
import { challengeOn, isChallengePath } from "./gate";
import { RUN_FILE_WORDS, daysOnChallenge, killTotal, madeTotal, readRunFile, sealRunFile } from "./run-file";
import { passesComingSoon } from "@/lib/coming-soon";

/** A run file exactly as the mod wrote it in play (9 Nov 2026, build b9b8612), with the character renamed and sealed again. */
const run = {
  format: 1,
  mod: "0.1.0.0",
  written: "2026-11-10T04:31:40Z",
  character: { name: "Test Smith", race: "Redguard", level: 29 },
  mode: "oath",
  modeChosen: true,
  daysPassed: 54.71,
  made: {
    crafted: 1,
    cooked: 1,
    brewed: 0,
    mined: 0,
    chopped: 0,
    hunted: 0,
    items: [
      { id: "evgnnsmpaccessories.esp|00080B", name: "Patchwork Satchel", crafted: 1 },
      { id: "Journey to Baan Malur.esp|04CF16", name: "Cheese Soup", cooked: 1 },
    ],
  },
  rulesBroken: [{ rule: "gear", id: "Skyrim.esm|01393B", name: "Glass Helmet", count: 1, day: 54.2 }],
  kills: [
    { kind: "Elk", id: "Skyrim.esm|0131ED", count: 2 },
    { kind: "Wolf", id: "Skyrim.esm|01320A", count: 5 },
  ],
  consoleOpened: 0,
  plugins: { count: 3526, fingerprint: "d5046da0c95e7cec289e5ea257dff65a1a904f16ed5be303236b57b6d37dc8dc" },
};

describe("the run file", () => {
  it("reads a file the mod sealed", () => {
    const read = readRunFile(sealRunFile(run));
    expect(read.ok).toBe(true);
    if (!read.ok) return;
    expect(read.run.character.name).toBe("Test Smith");
    expect(read.run.options).toBeUndefined();
    expect(madeTotal(read.run)).toBe(2);
    expect(killTotal(read.run)).toBe(7);
    expect(read.seal).toMatch(/^[0-9a-f]{64}$/);
  });

  it("seals the way the mod does", () => {
    // HMAC-SHA-256 of this exact text with the mod's built-in key, worked out outside this code (Python's hmac),
    // the same check the plugin's own Sha256.h was held to.
    expect(sealRunFile({ format: 1 })).toBe('{"run":{"format":1},"seal":"fa8ae20087e145efc1fdaf7d1f60841ce432bbb7c2ed3bffd3ae0f3ccccdea0a"}\n');
  });

  it("counts a run's days from the day the challenge was taken", () => {
    // A file from before the mod wrote the day: the character's whole life counts, as it did.
    expect(daysOnChallenge(run)).toBe(54.71);
    // A new character takes it in its first hour.
    const fresh = readRunFile(sealRunFile({ ...run, taken: { day: 0.02, character: "new" } }));
    expect(fresh.ok && daysOnChallenge(fresh.run)).toBeCloseTo(54.69, 2);
    // A character asked later does not bring its earlier days onto the board.
    const late = readRunFile(sealRunFile({ ...run, taken: { day: 50, character: "existing" } }));
    expect(late.ok && late.run.taken).toEqual({ day: 50, character: "existing" });
    expect(late.ok && daysOnChallenge(late.run)).toBeCloseTo(4.71, 2);
    // A day later than the file's own is a broken file, not a negative run.
    expect(daysOnChallenge({ daysPassed: 3, taken: { day: 9, character: "existing" } })).toBe(0);
  });

  it("reads the rules a player chose", () => {
    const options = { lootGems: true, lootSoulGems: false, coinPurseGems: false, questRewards: false, startingItems: false, othersKills: true };
    const read = readRunFile(sealRunFile({ ...run, mode: "oath", modeChosen: true, options }));
    expect(read.ok && read.run.options).toEqual(options);
    expect(read.ok && read.run.mode).toBe("oath");
  });

  it("refuses a file changed by hand", () => {
    const sealed = sealRunFile(run);
    expect(readRunFile(sealed.replace('"level":29', '"level":80'))).toEqual({ ok: false, error: RUN_FILE_WORDS.edited });
    expect(readRunFile(sealed.replace('"rulesBroken":[{', '"rulesBroken":[{"x":1,'))).toEqual({ ok: false, error: RUN_FILE_WORDS.edited });
  });

  it("refuses a file sealed with another key", () => {
    expect(readRunFile(sealRunFile(run, "someone else's key"))).toEqual({ ok: false, error: RUN_FILE_WORDS.edited });
  });

  it("refuses what isn't a run file", () => {
    expect(readRunFile("")).toEqual({ ok: false, error: RUN_FILE_WORDS.notRunFile });
    expect(readRunFile('{"hello":"world"}')).toEqual({ ok: false, error: RUN_FILE_WORDS.notRunFile });
    expect(readRunFile('{"run":{},"seal":"abc"}')).toEqual({ ok: false, error: RUN_FILE_WORDS.notRunFile });
    expect(readRunFile("x".repeat(1_000_001))).toEqual({ ok: false, error: RUN_FILE_WORDS.tooBig });
  });

  it("refuses a sealed file of a shape it doesn't know", () => {
    expect(readRunFile(sealRunFile({ ...run, format: 2 }))).toEqual({ ok: false, error: RUN_FILE_WORDS.shape });
    expect(readRunFile(sealRunFile({ ...run, mode: "easy" }))).toEqual({ ok: false, error: RUN_FILE_WORDS.shape });
  });

  it("keeps the game's own totals when a run carries them", () => {
    const read = readRunFile(sealRunFile({ ...run, deaths: 3, distance: 250000, stats: { locationsDiscovered: 41, questsCompleted: 7 } }));
    expect(read.ok && read.run.stats).toEqual({ locationsDiscovered: 41, questsCompleted: 7 });
    expect(read.ok && [read.run.deaths, read.run.distance]).toEqual([3, 250000]);
  });

  it("refuses a run from the old warn-only mode", () => {
    expect(readRunFile(sealRunFile({ ...run, mode: "honor" }))).toEqual({ ok: false, error: RUN_FILE_WORDS.notChallenge });
  });
});

describe("the challenge's switch", () => {
  it("is on in dev and on staging, off on production until set", () => {
    expect(challengeOn({ NODE_ENV: "development" })).toBe(true);
    expect(challengeOn({ NODE_ENV: "production", VERCEL_ENV: "preview" })).toBe(true);
    expect(challengeOn({ NODE_ENV: "production", VERCEL_ENV: "production" })).toBe(false);
    expect(challengeOn({ NODE_ENV: "production", VERCEL_ENV: "production", FEATURE_CHALLENGE: "on" })).toBe(true);
    expect(challengeOn({ NODE_ENV: "development", FEATURE_CHALLENGE: "off" })).toBe(false);
  });

  it("knows its own addresses, and they stay open behind the coming soon page", () => {
    for (const path of ["/challenge", "/challenge/leaderboard", "/challenge/run/k3jd9slm2q"]) {
      expect(isChallengePath(path)).toBe(true);
      expect(passesComingSoon(path)).toBe(true);
    }
    for (const path of ["/challenges", "/characters", "/b/k3jd9slm2q"]) {
      expect(isChallengePath(path)).toBe(false);
      expect(passesComingSoon(path)).toBe(false);
    }
  });
});
