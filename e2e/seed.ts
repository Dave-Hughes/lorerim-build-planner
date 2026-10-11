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
import type { BuildPlan } from "../src/lib/rules/types";

config({ path: ".env.local", quiet: true });

export const TEST_USER_ID = "e2e-user-0001";
export const TEST_USER_NAME = "Test Author";
export const TEST_USER_HANDLE = "e2e-test-author";
/** The test author's link-only build: never on their public page. */
export const LINK_ONLY_BUILD_ID = "e2eqq2e2e7";
export const TEST_SESSION_TOKEN = "e2e-session-token-0001";
export const TEST_BUILD_ID = "e2eqq2e2eq";
/** A copy of the sample the tests may change freely (remove perks, add levels). */
export const SCRATCH_BUILD_ID = "e2eqq2e2e5";
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
    await db.insert(schema.sessions).values({
      sessionToken: TEST_SESSION_TOKEN,
      userId: TEST_USER_ID,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    });
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
