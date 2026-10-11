/**
 * Gives every user without a handle one (see src/lib/users/handles.ts). Only rows whose handle is
 * empty are written, so running it again changes nothing.
 *
 *   Local:   npx tsx scripts/backfill-handles.ts   -> dev branch only
 *   Vercel:  runs after the migrations in `vercel-build`, so staging gets it when the staging
 *            branch deploys and production when staging is published.
 */
import { config } from "dotenv";
import { Pool } from "@neondatabase/serverless";
import { isNull } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-serverless";
import { assertDatabaseMatchesEnvironment, currentEnvironment } from "../src/db/environments";
import * as schema from "../src/db/schema";
import { assignHandle } from "../src/lib/users/assign-handle";

if (!process.env.VERCEL) config({ path: ".env.local", quiet: true });

async function main() {
  if (process.env.VERCEL_ENV === "preview" && process.env.VERCEL_GIT_COMMIT_REF !== "staging") {
    console.log(`Skipping the handle backfill: preview of "${process.env.VERCEL_GIT_COMMIT_REF}".`);
    return;
  }
  const pool = new Pool({ connectionString: assertDatabaseMatchesEnvironment() });
  const database = drizzle(pool, { schema });
  try {
    const empty = await database.select({ id: schema.users.id }).from(schema.users).where(isNull(schema.users.handle)).orderBy(schema.users.id);
    let set = 0;
    for (const u of empty) if (await assignHandle(database, u.id)) set++;
    console.log(`Handles (${currentEnvironment()}): ${set} set, ${empty.length - set} left empty.`);
  } finally {
    await pool.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
