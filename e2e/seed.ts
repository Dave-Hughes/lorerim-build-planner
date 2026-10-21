/**
 * Test data for the end-to-end tests: a user, a signed-in session for that
 * user, and a build they own. Runs against the dev database only; the
 * environment guard refuses anything else.
 */
import { config } from "dotenv";
import { del, list } from "@vercel/blob";
import { and, eq, isNull, like, or } from "drizzle-orm";
import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { assertDatabaseMatchesEnvironment } from "../src/db/environments";
import * as schema from "../src/db/schema";
import sample from "../src/lib/rules/__fixtures__/sample-build.json";
import azrem from "./fixtures/azrem.json";
import iriel from "./fixtures/iriel.json";
import pureMage from "./fixtures/pure-mage.json";
import sevari from "../src/lib/rules/__fixtures__/sevari.json";
import { lineDoc, textLength, type GuideDoc } from "../src/lib/guide/doc";
import { snowflakeAt } from "../src/lib/moderation/age";
import { emptyLevel } from "../src/lib/rules/derive";
import { altmerSkipsPlan } from "../src/lib/rules/__fixtures__/altmer-skips";
import type { BuildPlan } from "../src/lib/rules/types";

config({ path: ".env.local", quiet: true });

export const TEST_USER_ID = "e2e-user-0001";
export const TEST_USER_NAME = "Test Author";
export const TEST_USER_HANDLE = "e2e-test-author";
/** A copy of Azrem from staging (e2e/fixtures/azrem.json): a real 20-level build with a guide and a note at every level. */
export const AZREM_BUILD_ID = "e2eazrem22";
/** A 20-level build, for the level ruler. */
export const LONG_BUILD_ID = "e2eqq2e2e8";
/** The test author's link-only build: never on their public page. */
export const LINK_ONLY_BUILD_ID = "e2eqq2e2e7";
export const TEST_SESSION_TOKEN = "e2e-session-token-0001";
export const OTHER_SESSION_TOKEN = "e2e-session-token-0002";
/** WO-40: three players who report a build, an account made 2 days ago, and one already at its daily build limit. */
export const REPORTER_TOKENS = ["e2e-session-token-0003", "e2e-session-token-0004", "e2e-session-token-0005"];
export const NEW_ACCOUNT_TOKEN = "e2e-session-token-0006";
export const NEW_ACCOUNT_BUILD_ID = "e2enewacct";
/** WO-42: the sample build with level 1's perks cleared, so a test can take tier perks there. */
export const SPELLS_BUILD_ID = "e2espe22ss";
/** WO-45: forty levels, for gear made late in a build. */
export const FORTY_BUILD_ID = "e2emadesta";
/** WO-52: forty levels with War Cry from its perk at 12, a quest ability, Unrelenting Force and Slow Time. */
export const POWERS_BUILD_ID = "e2ewarcrya";
/** WO-55: the sample as a Khajiit, for the race's Night Eye. */
export const KHAJIIT_BUILD_ID = "e2ekhajeet";
/** WO-57: the sample cut to 4 levels, so level 4 is the last (Continue and repeat); no guide (WO-61). */
export const FOUR_BUILD_ID = "e2efa4rtwe";
/** WO-57: the sample with only Novice Destruction at level 1, for the Add spell starting list. */
export const NOVICE_DESTRUCTION_BUILD_ID = "e2edestrvc";
/** WO-64: Jo'Vashar, fresh (level 1 only, nothing taken). */
export const FRESH_BUILD_ID = "e2efresh2a";
/** WO-65: the canvas's Altmer, fresh (level 1 only): a new build to skip ahead on (WO-69). */
export const FRESH_MAGE_BUILD_ID = "e2efreshmg";
/** WO-69: the Skip ahead canvas's Altmer, written at levels 1, 10, 25 and 50 (src/lib/rules/__fixtures__/altmer-skips.ts). */
export const SKIPS_BUILD_ID = "e2eskyp2ah";
export const AT_LIMIT_TOKEN = "e2e-session-token-0007";
/** The test author's Discord id; playwright.config.ts gives it to the server as ADMIN_DISCORD_IDS. */
export const E2E_ADMIN_DISCORD_ID = "e2e-discord-admin-0001";
export const TEST_BUILD_ID = "e2eqq2e2eq";
/** A copy of the sample the tests may change freely (remove perks, add levels). */
export const SCRATCH_BUILD_ID = "e2eqq2e2e5";
/** A copy of the sample with no gear, for setting gear level by level. */
export const GEAR_BUILD_ID = "e2egearnew";
/** WO-82: no gear yet, for gear by type. */
export const GEAR82_BUILD_ID = "e2egear82x";
/** WO-83: no gear yet, for the gear icons. */
export const GEAR83_BUILD_ID = "e2egear83x";
/** WO-89: no cover, for the Aurora theme's pixel hero. */
export const AURORA_BUILD_ID = "e2eavrvra2";
/** The sample with level 5's Destiny point unspent (Konahrik), for the editor's Destiny control. */
export const DESTINY_BUILD_ID = "e2edstnyaa";
/** A copy of Iriel from staging (e2e/fixtures/iriel.json): 30 levels, gear changes, Destiny, a note at every level. Listed. */
export const IRIEL_BUILD_ID = "e2eyrye7q2";
/** A copy of Pure Mage from staging (e2e/fixtures/pure-mage.json): 57 levels, 21 gear rows with notes, Frost. Link only. */
export const PURE_MAGE_BUILD_ID = "e2epuremag";
/** WO-71: a copy of Sevari from staging (src/lib/rules/__fixtures__/sevari.json): 100 levels, skipping ahead from 5, about 100 perks. For the speed tests. */
export const SEVARI_BUILD_ID = "e2esevar22";
/** WO-72: a Breton poisoner at level 1 (Alchemy 30), two of its three perk points spent: one left. */
export const ONE_POINT_BUILD_ID = "e2ew72pq2s";
/** WO-76: a Breton healer, Novice Restoration at level 1 and level 2 empty: Apprentice Restoration can be taken there. */
export const HEALER_BUILD_ID = "e2ew76rest";
/** WO-81: the healer's Story, a title and two paragraphs (no images). */
const HEALER_STORY: Record<string, GuideDoc> = {
  "story:title": lineDoc("The Mender"),
  "story:line": lineDoc("Every wound in Skyrim is somebody's business."),
  story: {
    type: "doc",
    content: [
      { type: "paragraph", content: [{ type: "text", text: "She came north with a satchel of herbs and a temple's letter of leave." }] },
      { type: "paragraph", content: [{ type: "text", text: "By spring the Bannered Mare kept a chair for her by the fire." }] },
    ],
  },
};
/** WO-79: a copy of Sevari's plan with no Story yet; the Story tests write one. */
export const STORY_BUILD_ID = "e2estry222";
export const OTHER_USER_ID = "e2e-user-0002";
export const OTHER_BUILD_ID = "e2eqq2e2e2";
/** Made for the test-only older version (src/lib/rules/__fixtures__/test-version.ts). */
export const OLD_BUILD_ID = "e2eqq2e2e3";
export const OLD_VERSION = "0.0.0-test";
/** Made for a version the planner no longer has. */
export const RETIRED_BUILD_ID = "e2eqq2e2e4";

export /** WO-52's build: the sample stretched to 40 levels, with spells, War Cry (from its perk), an ability and two shouts. */
function powersPlan(): BuildPlan {
  const base = samplePlan();
  const levels = [...base.levels, ...Array.from({ length: 34 }, () => ({ skillPoints: {}, perks: [] as string[], destiny: [] as string[], extras: [], note: "", attribute: "stamina" as const }))];
  const at = (n: number, more: Partial<BuildPlan["levels"][number]>) => (levels[n - 1] = { ...levels[n - 1], ...more });
  at(1, { spells: [{ id: "Skyrim.esm:012FCD", where: "Known at the start" }] });
  at(3, { spells: [{ id: "Skyrim.esm:012FCC", where: "Known at the start" }], abilities: [{ id: "Tools of Kagrenac.esp:1267AB", where: "Tools of Kagrenac, Aetherium Forge" }] });
  at(5, { shouts: [{ id: "Skyrim.esm:013E07", words: 1, where: "Bleak Falls Barrow" }] });
  at(12, { perks: [...levels[11].perks, "Speech:War Cry"], spells: [{ id: "Skyrim.esm:04DEEB", where: "Farengar, Dragonsreach" }] });
  at(20, { shouts: [{ id: "Skyrim.esm:013E07", words: 3, where: "High Hrothgar" }] });
  at(25, { shouts: [{ id: "Skyrim.esm:048AC9", words: 2, where: "Deepwood Redoubt" }] });
  return { ...base, levels, mainSpells: ["Skyrim.esm:012FCD"] };
}

/** Jo'Vashar's set up from the WO-64 canvas, with level 1 empty: what a build looks like just after it's made. */
function freshPlan(): BuildPlan {
  return {
    ...samplePlan(),
    race: "Khajiit",
    birthsign: "Lord",
    mode: "Konahrik",
    deity: "Riddle'Thar",
    start: "Merchant",
    startOption: "Cyrodiil",
    majors: ["Two-Handed", "Evasion", "Alteration"],
    minors: ["Block", "Wayfarer", "Smithing", "Restoration", "Sneak", "Speech"],
    traits: ["Focused Combat", "Monk"],
    traitChoices: { "Focused Combat": "Two-Handed" },
    levels: [emptyLevel()],
    gear: [],
    notes: "",
  } as BuildPlan;
}

/** The WO-65 canvas's Altmer: a fresh mage, Destruction, Alteration and Conjuration majors. */
function freshMagePlan(): BuildPlan {
  return {
    ...freshPlan(),
    race: "Altmer",
    birthsign: "Mage",
    majors: ["Destruction", "Alteration", "Conjuration"],
    minors: ["Restoration", "Illusion", "Enchanting", "Alchemy", "Speech", "Evasion"],
    traits: [],
    traitChoices: {},
  } as BuildPlan;
}

function samplePlan(): BuildPlan {
  const { name: _n, description: _d, ...plan } = sample as unknown as BuildPlan & { name: string; description: string };
  void _n;
  void _d;
  return plan;
}

export async function seed() {
  const url = assertDatabaseMatchesEnvironment();
  const pool = new Pool({ connectionString: url });
  const db = drizzle(pool, { schema });
  try {
    // The test players' image checks (WO-40) would outlive them with no uploader.
    await db.delete(schema.imageChecks).where(like(schema.imageChecks.uploaderId, "e2e-%"));
    await db.delete(schema.builds).where(like(schema.builds.id, "e2e%"));
    // The test players' invites (WO-96), made or used: they'd outlive them with no one on them.
    await db.delete(schema.invites).where(or(like(schema.invites.createdBy, "e2e-%"), like(schema.invites.usedBy, "e2e-%")));
    await db.delete(schema.users).where(like(schema.users.id, "e2e-%"));
    await db.insert(schema.users).values([
      { id: TEST_USER_ID, name: TEST_USER_NAME, email: null, image: null, handle: TEST_USER_HANDLE },
      { id: OTHER_USER_ID, name: "Someone Else", email: null, image: null, handle: "e2e-someone-else" },
      ...[3, 4, 5].map((n) => ({ id: `e2e-user-000${n}`, name: `Reporter ${n - 2}`, email: null, image: null, handle: `e2e-reporter-${n - 2}` })),
      { id: "e2e-user-0006", name: "New Account", email: null, image: null, handle: "e2e-new-account" },
      { id: "e2e-user-0007", name: "Busy Builder", email: null, image: null, handle: "e2e-busy-builder" },
    ]);
    // The test author signs in with a Discord account the e2e server lists as an admin (WO-39).
    await db.insert(schema.accounts).values([
      { userId: TEST_USER_ID, type: "oauth", provider: "discord", providerAccountId: E2E_ADMIN_DISCORD_ID },
      // A Discord account made 2 days ago (its id is a snowflake of that time), for the 7-day rule (WO-40).
      { userId: "e2e-user-0006", type: "oauth", provider: "discord", providerAccountId: snowflakeAt(new Date(Date.now() - 2 * 86_400_000)) },
    ]);
    await db.insert(schema.sessions).values([
      { sessionToken: TEST_SESSION_TOKEN, userId: TEST_USER_ID, expires: new Date(Date.now() + 1000 * 60 * 60 * 24) },
      { sessionToken: OTHER_SESSION_TOKEN, userId: OTHER_USER_ID, expires: new Date(Date.now() + 1000 * 60 * 60 * 24) },
      ...[...REPORTER_TOKENS, NEW_ACCOUNT_TOKEN, AT_LIMIT_TOKEN].map((sessionToken, i) => ({ sessionToken, userId: `e2e-user-000${i + 3}`, expires: new Date(Date.now() + 1000 * 60 * 60 * 24) })),
    ]);
    await db.insert(schema.builds).values([
      {
        id: TEST_BUILD_ID,
        ownerId: TEST_USER_ID,
        name: "Test Shield-Wall",
        description: "A build owned by the test author.",
        visibility: "public",
        gameVersion: "5.0.4.8",
        plan: samplePlan(),
      },
      {
        id: SCRATCH_BUILD_ID,
        ownerId: TEST_USER_ID,
        name: "Scratch Shield-Wall",
        description: "A build the tests change.",
        visibility: "private",
        gameVersion: "5.0.4.8",
        plan: samplePlan(),
      },
      {
        id: GEAR_BUILD_ID,
        ownerId: TEST_USER_ID,
        name: "Gearless Shield-Wall",
        description: "No gear yet.",
        visibility: "unlisted",
        gameVersion: "5.0.4.8",
        plan: { ...samplePlan(), gear: [] },
      },
      {
        id: GEAR82_BUILD_ID,
        ownerId: TEST_USER_ID,
        createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000),
        name: "Gear by Type",
        description: "No gear yet.",
        visibility: "unlisted",
        gameVersion: "5.0.4.8",
        plan: { ...samplePlan(), gear: [] },
      },
      {
        id: AURORA_BUILD_ID,
        ownerId: TEST_USER_ID,
        createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000),
        name: "Under the Aurora",
        // Stored with Parchment: themes are off for now (WO-118), so it draws in Ember.
        description: "No cover, stored with a theme.",
        visibility: "unlisted",
        gameVersion: "5.0.4.8",
        plan: { ...samplePlan(), gear: [], theme: "parchment" },
      },
      {
        id: GEAR83_BUILD_ID,
        ownerId: TEST_USER_ID,
        createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000),
        name: "Gear Icons",
        description: "No gear yet.",
        visibility: "unlisted",
        gameVersion: "5.0.4.8",
        plan: { ...samplePlan(), gear: [] },
      },
      {
        id: DESTINY_BUILD_ID,
        ownerId: TEST_USER_ID,
        name: "Destiny Shield-Wall",
        description: "Level 5's Destiny point unspent.",
        visibility: "private",
        gameVersion: "5.0.4.8",
        plan: { ...samplePlan(), mode: "Konahrik" as const, levels: samplePlan().levels.map((lv, i) => (i === 4 ? { ...lv, destiny: [] } : lv)) },
      },
      {
        id: IRIEL_BUILD_ID,
        ownerId: OTHER_USER_ID,
        name: iriel.name,
        description: iriel.description,
        coverImageUrl: iriel.coverImageUrl,
        visibility: "public",
        gameVersion: "5.0.4.8",
        plan: iriel.plan as unknown as BuildPlan,
      },
      {
        id: PURE_MAGE_BUILD_ID,
        ownerId: OTHER_USER_ID,
        name: pureMage.name,
        description: pureMage.description,
        coverImageUrl: pureMage.coverImageUrl,
        visibility: "unlisted",
        gameVersion: "5.0.4.8",
        plan: pureMage.plan as unknown as BuildPlan,
      },
      {
        id: HEALER_BUILD_ID,
        ownerId: TEST_USER_ID,
        // Made 2 days ago, out of the author's daily build limit (WO-40).
        createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000),
        name: "Breton Healer",
        description: "Two levels, for spell picks.",
        visibility: "private",
        gameVersion: "5.0.4.8",
        plan: {
          ...freshPlan(),
          race: "Breton",
          birthsign: "Mage",
          mode: "Konahrik" as const,
          majors: ["Restoration", "Alteration", "Illusion"],
          minors: ["Destruction", "Conjuration", "Enchanting", "Alchemy", "Speech", "Evasion"],
          traits: [],
          traitChoices: {},
          levels: [{ ...emptyLevel(), perks: ["Restoration:Novice Restoration"] }, { ...emptyLevel(), attribute: "magicka" as const }],
        } as BuildPlan,
      },
      {
        id: ONE_POINT_BUILD_ID,
        ownerId: TEST_USER_ID,
        // Made 2 days ago, out of the author's daily build limit (WO-40).
        createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000),
        name: "One Point Left",
        description: "Level 1, one perk point left.",
        visibility: "private",
        gameVersion: "5.0.4.8",
        plan: {
          ...freshPlan(),
          race: "Breton",
          mode: "Konahrik" as const,
          majors: ["Alchemy", "Sneak", "Illusion"],
          minors: ["Evasion", "Finesse", "Speech", "Restoration", "Enchanting", "Destruction"],
          traits: [],
          traitChoices: {},
          levels: [{ ...emptyLevel(), perks: ["Sneak:Stealth", "Illusion:Novice Illusion"] }],
        } as BuildPlan,
      },
      {
        id: SEVARI_BUILD_ID,
        ownerId: TEST_USER_ID,
        // Made 2 days ago, out of the author's daily build limit (WO-40).
        createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000),
        name: sevari.name,
        description: sevari.description,
        visibility: "unlisted",
        gameVersion: "5.0.4.8",
        plan: sevari.plan as unknown as BuildPlan,
      },
      {
        id: STORY_BUILD_ID,
        ownerId: TEST_USER_ID,
        createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000),
        name: "Sevari, a story",
        description: sevari.description,
        visibility: "unlisted",
        gameVersion: "5.0.4.8",
        plan: sevari.plan as unknown as BuildPlan,
      },
      {
        id: AZREM_BUILD_ID,
        ownerId: OTHER_USER_ID,
        name: azrem.name,
        description: azrem.description,
        coverImageUrl: azrem.coverImageUrl,
        visibility: "unlisted",
        gameVersion: "5.0.4.8",
        plan: azrem.plan as unknown as BuildPlan,
      },
      {
        id: LONG_BUILD_ID,
        ownerId: TEST_USER_ID,
        name: "Long Shield-Wall",
        description: "Twenty levels.",
        visibility: "unlisted",
        gameVersion: "5.0.4.8",
        plan: {
          ...samplePlan(),
          // No guide: the shared page has no Guide tab.
          notes: "",
          levels: [
            ...samplePlan().levels,
            ...Array.from({ length: 14 }, () => ({ attribute: "health" as const, skillPoints: {}, perks: [], destiny: [], extras: [], note: "" })),
          ],
        },
      },
      {
        id: LINK_ONLY_BUILD_ID,
        ownerId: TEST_USER_ID,
        name: "Link-Only Shield-Wall",
        description: "Shared by link, not listed.",
        visibility: "unlisted",
        gameVersion: "5.0.4.8",
        plan: samplePlan(),
      },
      {
        id: OLD_BUILD_ID,
        ownerId: OTHER_USER_ID,
        name: "Old Version Shield-Wall",
        description: "A build made for an older LoreRim version.",
        visibility: "public",
        gameVersion: OLD_VERSION,
        plan: { ...samplePlan(), gameVersion: OLD_VERSION, traits: ["Witcher"] },
      },
      {
        id: RETIRED_BUILD_ID,
        ownerId: OTHER_USER_ID,
        name: "Retired Version Build",
        description: "A build for a version the planner no longer has.",
        visibility: "unlisted",
        gameVersion: "4.0.0-retired",
        plan: { ...samplePlan(), gameVersion: "4.0.0-retired" },
      },
      {
        id: OTHER_BUILD_ID,
        ownerId: OTHER_USER_ID,
        name: "Private Elsewhere",
        description: "A private build owned by someone else.",
        visibility: "private",
        gameVersion: "5.0.4.8",
        plan: samplePlan(),
      },
      {
        id: SPELLS_BUILD_ID,
        ownerId: TEST_USER_ID,
        name: "Spellsword Test",
        description: "Level 1's perks left free for tier perks.",
        visibility: "unlisted",
        gameVersion: "5.0.4.8",
        plan: { ...samplePlan(), levels: samplePlan().levels.map((lv, i) => (i === 0 ? { ...lv, perks: [] } : lv)) },
      },
      {
        id: FORTY_BUILD_ID,
        ownerId: TEST_USER_ID,
        name: "Forty Levels",
        description: "Gear made late.",
        visibility: "unlisted",
        gameVersion: "5.0.4.8",
        plan: { ...samplePlan(), levels: [...samplePlan().levels, ...Array.from({ length: 34 }, () => ({ skillPoints: {}, perks: [], destiny: [], extras: [], note: "", attribute: "magicka" as const }))] },
      },
      {
        id: POWERS_BUILD_ID,
        ownerId: TEST_USER_ID,
        name: "Voice of the Spartan",
        description: "War Cry, shouts and a few spells.",
        visibility: "unlisted",
        gameVersion: "5.0.4.8",
        plan: powersPlan(),
        // Made two days ago, so it doesn't count toward the test author's builds for the day (WO-40's limit).
        createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000),
      },
      {
        id: KHAJIIT_BUILD_ID,
        ownerId: TEST_USER_ID,
        name: "Night Prowler",
        description: "A Khajiit, for the race's Night Eye.",
        visibility: "unlisted",
        gameVersion: "5.0.4.8",
        plan: { ...samplePlan(), race: "Khajiit" },
        // Made two days ago, so it doesn't count toward the test author's builds for the day (WO-40's limit).
        createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000),
      },
      {
        id: FOUR_BUILD_ID,
        ownerId: TEST_USER_ID,
        name: "Four Levels",
        description: "The sample, cut to level 4.",
        visibility: "unlisted",
        gameVersion: "5.0.4.8",
        // No notes either, so no guide: the reader's tour has three stops here (WO-61).
        plan: { ...samplePlan(), levels: samplePlan().levels.slice(0, 4), notes: "" },
        // Made two days ago, so it doesn't count toward the test author's builds for the day (WO-40's limit).
        createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000),
      },
      {
        id: FRESH_BUILD_ID,
        ownerId: TEST_USER_ID,
        name: "Jo'Vashar",
        description: "A fresh build: level 1 only.",
        visibility: "unlisted",
        gameVersion: "5.0.4.8",
        plan: freshPlan(),
        // Made two days ago, so it doesn't count toward the test author's builds for the day (WO-40's limit).
        createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000),
      },
      {
        id: SKIPS_BUILD_ID,
        ownerId: TEST_USER_ID,
        name: "Altmer Battlemage, Skipping Ahead",
        description: "Destruction up close, Alteration for armor, a shield for when it goes wrong.",
        visibility: "unlisted",
        gameVersion: "5.0.4.8",
        plan: altmerSkipsPlan(),
        // Made two days ago, so it doesn't count toward the test author's builds for the day (WO-40's limit).
        createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000),
      },
      {
        id: FRESH_MAGE_BUILD_ID,
        ownerId: TEST_USER_ID,
        name: "Altmer Battlemage",
        description: "A fresh Altmer mage: level 1 only.",
        visibility: "unlisted",
        gameVersion: "5.0.4.8",
        plan: freshMagePlan(),
        // Made two days ago, so it doesn't count toward the test author's builds for the day (WO-40's limit).
        createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000),
      },
      {
        id: NOVICE_DESTRUCTION_BUILD_ID,
        ownerId: TEST_USER_ID,
        name: "Novice Destruction",
        description: "Level 1 takes only Novice Destruction.",
        visibility: "unlisted",
        gameVersion: "5.0.4.8",
        plan: { ...samplePlan(), levels: samplePlan().levels.map((lv, i) => (i === 0 ? { ...lv, perks: ["Destruction:Novice Destruction"] } : lv)) },
        // Made two days ago, so it doesn't count toward the test author's builds for the day (WO-40's limit).
        createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000),
      },
      {
        id: NEW_ACCOUNT_BUILD_ID,
        ownerId: "e2e-user-0006",
        name: "Brand New Build",
        description: "Made by a 2-day-old account.",
        visibility: "unlisted",
        gameVersion: "5.0.4.8",
        plan: samplePlan(),
      },
      // Ten builds made today: the next is over the daily limit (WO-40).
      ..."23456789ab".split("").map((c, i) => ({
        id: `e2ecapaax${c}`,
        ownerId: "e2e-user-0007",
        name: `Busy Build ${i + 1}`,
        description: "",
        visibility: "private" as const,
        gameVersion: "5.0.4.8",
        plan: samplePlan(),
      })),
    ]);
    await db.insert(schema.buildGuides).values(
      [
        ...Object.entries(azrem.guide as Record<string, GuideDoc>).map(([key, doc]) => ({ buildId: AZREM_BUILD_ID, key, doc, textLength: textLength(doc) })),
        ...Object.entries(iriel.guide as Record<string, GuideDoc>).map(([key, doc]) => ({ buildId: IRIEL_BUILD_ID, key, doc, textLength: textLength(doc) })),
        ...Object.entries(pureMage.guide as Record<string, GuideDoc>).map(([key, doc]) => ({ buildId: PURE_MAGE_BUILD_ID, key, doc, textLength: textLength(doc) })),
        ...Object.entries(sevari.guide as Record<string, GuideDoc>).map(([key, doc]) => ({ buildId: SEVARI_BUILD_ID, key, doc, textLength: textLength(doc) })),
        // WO-81: a written Story, which the launch view (Story off) must hide.
        ...Object.entries(HEALER_STORY).map(([key, doc]) => ({ buildId: HEALER_BUILD_ID, key, doc, textLength: textLength(doc) })),
      ],
    );
    await seedKyria(db);
    // The test author's seeded builds were all made two days ago, so the day's limit of 10 new builds
    // (WO-40) is left for the tests that make builds. The limit's own tests use Busy Builder.
    await db.update(schema.builds).set({ createdAt: new Date(Date.now() - 2 * 86_400_000) }).where(eq(schema.builds.ownerId, TEST_USER_ID));
  } finally {
    await pool.end();
  }
}

/** WO-111: Kyria's playthrough, from the Playthrough boards on canvas row 23, on the test author's build. */
export const KYRIA_PLAYTHROUGH_ID = "e2ekyrya22";
/** WO-114: a build alone with a Story, for Add a run (the Story becomes the run's first chapter). */
export const MENDER_BUILD_ID = "e2estry333";
/** Kyria's own build (WO-114): the character's cover is the build's, so hers has one. */
export const KYRIA_BUILD_ID = "e2ekyryb22";

const para = (...texts: string[]): GuideDoc => ({ type: "doc", content: texts.map((text) => ({ type: "paragraph", content: [{ type: "text", text }] })) });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function seedKyria(db: any) {
  // Made two days ago, so neither counts toward the test author's 10 new builds a day.
  const earlier = new Date(Date.now() - 2 * 86_400_000);
  await db.insert(schema.builds).values({ id: MENDER_BUILD_ID, ownerId: TEST_USER_ID, name: "The Mender", description: "A Breton healer in Whiterun.", visibility: "unlisted", gameVersion: "5.0.4.8", plan: samplePlan(), createdAt: earlier });
  await db.insert(schema.buildGuides).values(Object.entries(HEALER_STORY).map(([key, doc]) => ({ buildId: MENDER_BUILD_ID, key, doc, textLength: textLength(doc) })));
  await db.insert(schema.builds).values({
    id: KYRIA_BUILD_ID,
    ownerId: TEST_USER_ID,
    name: "Kyria, Knight of Stendarr",
    description: "A Nord in heavy armor with a greatsword, hiding as a bard.",
    coverImageUrl: azrem.coverImageUrl,
    visibility: "unlisted",
    gameVersion: "5.0.4.8",
    plan: samplePlan(),
    createdAt: earlier,
  });
  await db.insert(schema.playthroughs).values({
    id: KYRIA_PLAYTHROUGH_ID,
    ownerId: TEST_USER_ID,
    buildId: KYRIA_BUILD_ID,
    name: "Kyria Severa",
    line: "A knight of Stendarr, raised in Dibella's chapel in Anvil, hiding as a bard in Riften.",
    gameVersion: "5.0.4.8",
    visibility: "private",
    draftedBy: "Claude",
  });
  const acts: { id: number }[] = await db
    .insert(schema.playthroughActs)
    .values([
      { playthroughId: KYRIA_PLAYTHROUGH_ID, position: 1, name: "The Sister's House", levelFrom: 1, levelTo: 6, place: "Riften", goal: "Earn a bed and coin in Riften as a bard and a worker. Keep the sword wrapped until Act III.", standingRule: "Play the Bee and Barb most nights; read the books you find." },
      { playthroughId: KYRIA_PLAYTHROUGH_ID, position: 2, name: "The Bard's Road", levelFrom: 6, levelTo: 8, place: "Ivarstead and Whiterun", goal: "On foot, a song at every inn." },
      { playthroughId: KYRIA_PLAYTHROUGH_ID, position: 3, name: "The Winking Skeever", levelFrom: 8, levelTo: 20, place: "Solitude", goal: "Join the Bards College and take the sword out." },
      { playthroughId: KYRIA_PLAYTHROUGH_ID, position: 4, name: "The Knight Returns", levelFrom: 20, levelTo: 35, place: "The Reach and Riften", goal: "Take Stendarr's work to the Reach." },
      { playthroughId: KYRIA_PLAYTHROUGH_ID, position: 5, name: "King Olaf's Verse", levelFrom: 40, levelTo: null, place: "Dead Men's Respite", goal: "Finish the verse." },
    ])
    .returning({ id: schema.playthroughActs.id });
  const [a1, a2, a3, a4, a5] = acts.map((a) => a.id);
  const o = (actId: number, position: number, v: Record<string, unknown>) => ({ actId, position, kind: "once", doneBy: "hand", status: "todo", accepted: true, ...v });
  const objs: { id: number }[] = await db
    .insert(schema.playthroughObjectives)
    .values([
      o(a1, 1, { text: "Walk out of the Temple of Mara", why: "The start quest. 200 XP.", status: "done" }),
      o(a1, 2, { text: "Warn Haelga, or expose her", link: { kind: "quest", id: "FreeformRiften11" }, doneBy: "save", detect: { quest: "FreeformRiften11", stage: 12 }, why: "Caught Red Handed, from Svana at the bunkhouse. Stage 12: Haelga was warned." }),
      o(a1, 3, { text: "Take a room at the Bee and Barb", status: "done" }),
      o(a1, 4, { text: "Get a lute, then a spare", status: "doing", why: "Riften's general goods merchant stocks instruments some of the time. Not checked yet." }),
      o(a1, 5, { text: "Play the Bee and Barb until Speech 40", kind: "reach", doneBy: "save", reach: { key: "skill:Speech", target: 40 }, why: "Tips start at Speech 40. Playing most nights is the act's standing rule, not a box to tick." }),
      o(a1, 6, { text: "Reach level 6", kind: "reach", doneBy: "save", reach: { key: "level", target: 6 } }),
      o(a1, 7, { text: "Bring bread to the cells and meet Inigo", link: { kind: "follower", id: "inigo" }, why: "Her first companion. The Khajiit in Riften's jail talks his way into her service." }),
      o(a1, 8, { text: "Hunt and tan her first hides", why: "Deer or elk around Lake Honrich, tanned at a tanning rack." }),
      o(a1, 9, { text: "Sing for the children at Honorhall", why: "Maramal asked her to. Grelod the Kind runs the place." }),
      o(a1, 10, { text: "Spread the Love", link: { kind: "quest", id: "FreeformRiften05" }, doneBy: "save", detect: { quest: "FreeformRiften05" }, why: "Mara's errand, from Dinya Balu at the temple. No fighting." }),
      o(a1, 11, { text: "The Book of Love", link: { kind: "line", id: "the-book-of-love" }, why: "Mara's temple sends her to Fastred in Ivarstead, on the road Act II takes.", suggestedBy: "Claude", accepted: false }),
      o(a1, 12, { text: "Hire Marcurio for the road", status: "later", why: "Not needed. Inigo doesn't use the follower slot." }),
      o(a2, 1, { text: "Sing at the Vilemyr Inn" }),
      o(a2, 2, { text: "Reach level 8", kind: "reach", doneBy: "save", reach: { key: "level", target: 8 } }),
      o(a3, 1, { text: "Join the Bards College" }),
      o(a4, 1, { text: "Reach level 35", kind: "reach", doneBy: "save", reach: { key: "level", target: 35 } }),
      o(a5, 1, { text: "Reach level 40", kind: "reach", doneBy: "save", reach: { key: "level", target: 40 } }),
    ])
    .returning({ id: schema.playthroughObjectives.id });
  const id = (n: number) => objs[n - 1].id;
  const c = (position: number, v: Record<string, unknown> & { doc: GuideDoc }) => ({ playthroughId: KYRIA_PLAYTHROUGH_ID, position, kind: "chapter", textLength: textLength(v.doc), ...v });
  await db.insert(schema.playthroughChapters).values([
    c(1, { title: "Chapter One: The Chapel by the Sea", doc: para("The chapel bells in Anvil rang the hours for the girl who swept its floors.", "She learned the songs before she learned her letters.") }),
    c(2, { title: "Chapter Two: The Night of Lanterns", doc: para("On the night of lanterns the priests let her carry the brass one at the front.") }),
    c(3, { title: "Chapter Three: The Shield and the Sword", doc: para("The Vigilants came through in autumn and one of them stayed to teach her the sword.") }),
    // Act I's own chapter (WO-116): the story of that stretch, on the act's card.
    c(4, { kind: "act", actId: a1, title: "The Sister's House", doc: para("The road north ended at a temple in Riften, where a sister of Mara took her in without a question.", "She wrapped the sword in sackcloth and put it under the bed.") }),
    c(5, { kind: "entry", actId: a1, title: "The first set", opensAfter: id(5), fromSave: "Save 5", writtenBy: "Claude", doc: para("The Bee and Barb was half empty and the lute was out of tune, and she played anyway.") }),
    c(6, { kind: "entry", actId: a1, title: "The Mark of Dibella", opensAfter: id(2), fromSave: "Save 7", writtenBy: "Claude", doc: para("She told Haelga what Svana knew, and Haelga thanked her with a look she did not like.") }),
    c(7, { kind: "beat", actId: a1, title: "Made with Care", opensAfter: id(8), writtenBy: "Claude", doc: para("The hide was rough under her hands, and she thought of the chapel's leather prayer books.") }),
    c(8, { kind: "beat", actId: a1, title: "The Note Under the Door", opensAfter: id(5), writtenBy: "Claude", doc: para("Someone had slid a folded note under her door while she slept.") }),
  ]);
  await db.insert(schema.playthroughSnapshots).values({
    playthroughId: KYRIA_PLAYTHROUGH_ID,
    source: "save",
    label: "Save 7",
    level: 6,
    xp: 112,
    day: 7,
    place: "Riften",
    skills: { Speech: 30, "Two-Handed": 36 },
    questStages: { FreeformRiften11: 12 },
    readBy: "Claude",
    prevLabel: "Save 5",
    prevLevel: 4,
    prevSkills: { Speech: 22, "Two-Handed": 30 },
  });
}

/** Images the tests uploaded (dev/builds/e2e…). */
async function cleanupImages() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return;
  let cursor: string | undefined;
  do {
    const page = await list({ prefix: "dev/builds/e2e", cursor, limit: 1000 });
    if (page.blobs.length) await del(page.blobs.map((b) => b.url));
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
}

/** Removes one build a test made (WO-90's import), so it doesn't sit in other tests' lists. */
export async function deleteBuild(id: string) {
  const pool = new Pool({ connectionString: assertDatabaseMatchesEnvironment() });
  try {
    await drizzle(pool, { schema }).delete(schema.builds).where(eq(schema.builds.id, id));
  } finally {
    await pool.end();
  }
}

export async function cleanup() {
  await cleanupImages();
  const url = assertDatabaseMatchesEnvironment();
  const pool = new Pool({ connectionString: url });
  const db = drizzle(pool, { schema });
  try {
    await db.delete(schema.imageChecks).where(like(schema.imageChecks.uploaderId, "e2e-%"));
    await db.delete(schema.builds).where(and(like(schema.builds.id, "e2e%")));
    await db.delete(schema.builds).where(eq(schema.builds.ownerId, TEST_USER_ID));
    // The MCP route's calls (WO-108): the tests' made-up addresses, counted by subject with no account.
    await db.delete(schema.rateEvents).where(and(or(eq(schema.rateEvents.kind, "mcp"), eq(schema.rateEvents.kind, "oauth")), isNull(schema.rateEvents.userId)));
    // The assistants the sign-in tests registered or served (WO-109); their codes and tokens go with the test users.
    await db.delete(schema.oauthClients).where(like(schema.oauthClients.name, "E2E %"));
    await db.delete(schema.invites).where(or(like(schema.invites.createdBy, "e2e-%"), like(schema.invites.usedBy, "e2e-%")));
    await db.delete(schema.users).where(like(schema.users.id, "e2e-%"));
  } finally {
    await pool.end();
  }
}

if (process.argv[1]?.endsWith("seed.ts")) {
  const task = process.argv[2] === "cleanup" ? cleanup : seed;
  task().then(
    () => console.log(process.argv[2] === "cleanup" ? "Test data removed." : "Test data ready."),
    (e) => {
      console.error(e);
      process.exit(1);
    },
  );
}
