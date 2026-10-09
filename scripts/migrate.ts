/**
 * Applies committed migrations in ./drizzle to the database for the current
 * environment, after checking DATABASE_URL points at that environment's own
 * Neon branch.
 *
 *   Local:                 npm run db:migrate          -> dev branch only
 *   Vercel preview build:  runs only for the `staging` git branch -> staging
 *   Vercel production:     runs on every production build -> production
 *
 * There is no way to run production migrations from a laptop on purpose.
 */
import { config } from "dotenv";
import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { migrate } from "drizzle-orm/neon-serverless/migrator";
import { assertDatabaseMatchesEnvironment, currentEnvironment } from "../src/db/environments";

if (!process.env.VERCEL) config({ path: ".env.local", quiet: true });

async function main() {
  const env = currentEnvironment();

  if (process.env.VERCEL_ENV === "preview" && process.env.VERCEL_GIT_COMMIT_REF !== "staging") {
    console.log(
      `Skipping migrations: preview of "${process.env.VERCEL_GIT_COMMIT_REF}". ` +
        "Only the staging branch migrates the staging database.",
    );
    return;
  }

  const url = assertDatabaseMatchesEnvironment();
  console.log(`Migrating the ${env} database...`);
  const pool = new Pool({ connectionString: url });
  try {
    await migrate(drizzle(pool), { migrationsFolder: "./drizzle" });
    console.log("Migrations applied.");
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
