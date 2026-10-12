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
import { textLength, type GuideDoc } from "../src/lib/guide/doc";
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
export const TEST_BUILD_ID = "e2eqq2e2eq";
/** A copy of the sample the tests may change freely (remove perks, add levels). */
export const SCRATCH_BUILD_ID = "e2eqq2e2e5";
/** A copy of the sample with no gear, for setting gear level by level. */
export const GEAR_BUILD_ID = "e2egearnew";
/** The sample with level 5's Destiny point unspent (Konahrik), for the editor's Destiny control. */
export const DESTINY_BUILD_ID = "e2edstnyaa";
/** A copy of Iriel from staging (e2e/fixtures/iriel.json): 30 levels, gear changes, Destiny, a note at every level. Listed. */
export const IRIEL_BUILD_ID = "e2eyrye7q2";
export const OTHER_USER_ID = "e2e-user-0002";
export const OTHER_BUILD_ID = "e2eqq2e2e2";
/** Made for the test-only older version (src/lib/rules/__fixtures__/test-version.ts). */
export const OLD_BUILD_ID = "e2eqq2e2e3";
export const OLD_VERSION = "0.0.0-test";
/** Made for a version the planner no longer has. */
export const RETIRED_BUILD_ID = "e2eqq2e2e4";

export function samplePlan(): BuildPlan {
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
    await db.delete(schema.builds).where(like(schema.builds.id, "e2e%"));
    await db.delete(schema.users).where(like(schema.users.id, "e2e-%"));
    await db.insert(schema.users).values([
      { id: TEST_USER_ID, name: TEST_USER_NAME, email: null, image: null, handle: TEST_USER_HANDLE },
      { id: OTHER_USER_ID, name: "Someone Else", email: null, image: null, handle: "e2e-someone-else" },
    ]);
    await db.insert(schema.sessions).values([
      { sessionToken: TEST_SESSION_TOKEN, userId: TEST_USER_ID, expires: new Date(Date.now() + 1000 * 60 * 60 * 24) },
      { sessionToken: OTHER_SESSION_TOKEN, userId: OTHER_USER_ID, expires: new Date(Date.now() + 1000 * 60 * 60 * 24) },
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
    ]);
    await db.insert(schema.buildGuides).values(
      [
        ...Object.entries(azrem.guide as Record<string, GuideDoc>).map(([key, doc]) => ({ buildId: AZREM_BUILD_ID, key, doc, textLength: textLength(doc) })),
        ...Object.entries(iriel.guide as Record<string, GuideDoc>).map(([key, doc]) => ({ buildId: IRIEL_BUILD_ID, key, doc, textLength: textLength(doc) })),
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
