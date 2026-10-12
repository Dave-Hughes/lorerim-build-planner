/**
 * Test data for the end-to-end tests: a user, a signed-in session for that
 * user, and a build they own. Runs against the dev database only; the
 * environment guard refuses anything else.
 */
import { config } from "dotenv";
import { del, list } from "@vercel/blob";
import { and, eq, like } from "drizzle-orm";
import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { assertDatabaseMatchesEnvironment } from "../src/db/environments";
import * as schema from "../src/db/schema";
import sample from "../src/lib/rules/__fixtures__/sample-build.json";
import azrem from "./fixtures/azrem.json";
import iriel from "./fixtures/iriel.json";
import pureMage from "./fixtures/pure-mage.json";
import { textLength, type GuideDoc } from "../src/lib/guide/doc";
import { snowflakeAt } from "../src/lib/moderation/age";
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
export const AT_LIMIT_TOKEN = "e2e-session-token-0007";
/** The test author's Discord id; playwright.config.ts gives it to the server as ADMIN_DISCORD_IDS. */
export const E2E_ADMIN_DISCORD_ID = "e2e-discord-admin-0001";
export const TEST_BUILD_ID = "e2eqq2e2eq";
/** A copy of the sample the tests may change freely (remove perks, add levels). */
export const SCRATCH_BUILD_ID = "e2eqq2e2e5";
/** A copy of the sample with no gear, for setting gear level by level. */
export const GEAR_BUILD_ID = "e2egearnew";
/** The sample with level 5's Destiny point unspent (Konahrik), for the editor's Destiny control. */
export const DESTINY_BUILD_ID = "e2edstnyaa";
/** A copy of Iriel from staging (e2e/fixtures/iriel.json): 30 levels, gear changes, Destiny, a note at every level. Listed. */
export const IRIEL_BUILD_ID = "e2eyrye7q2";
/** A copy of Pure Mage from staging (e2e/fixtures/pure-mage.json): 57 levels, 21 gear rows with notes, Frost. Link only. */
export const PURE_MAGE_BUILD_ID = "e2epuremag";
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
      ],
    );
  } finally {
    await pool.end();
  }
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

export async function cleanup() {
  await cleanupImages();
  const url = assertDatabaseMatchesEnvironment();
  const pool = new Pool({ connectionString: url });
  const db = drizzle(pool, { schema });
  try {
    await db.delete(schema.imageChecks).where(like(schema.imageChecks.uploaderId, "e2e-%"));
    await db.delete(schema.builds).where(and(like(schema.builds.id, "e2e%")));
    await db.delete(schema.builds).where(eq(schema.builds.ownerId, TEST_USER_ID));
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
