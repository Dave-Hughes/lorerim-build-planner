/**
 * WO-179, "nothing alone": a playthrough from before the character was one shell, on no build, becomes a character of its own (a build with nothing
 * planned yet, named as the run, with its line, cover and visibility). Dry run by default: lists what it would do and changes nothing.
 *
 *   npx tsx --conditions react-server scripts/backfill-characters.ts           (list)
 *   npx tsx --conditions react-server scripts/backfill-characters.ts --apply   (do it)
 *
 * `--conditions react-server` lets the app's `server-only` imports load outside Next. On staging: DATABASE_URL set to the staging branch's own
 * string (it is a hidden secret in Vercel, so copy it from the Neon console) and VERCEL_ENV=preview, so the environment guard agrees.
 *
 * The environment guard applies: it refuses a DATABASE_URL that does not match the environment. A run opened by its owner is made the same way
 * on the site, one at a time, so this is only for doing them all at once. Idempotent.
 */
import { config } from "dotenv";
import { isNull } from "drizzle-orm";
import { db, schema } from "../src/db";
import { makeCharacterOfRun } from "../src/lib/playthroughs/writes";

config({ path: ".env.local", quiet: true });

async function main() {
  const apply = process.argv.includes("--apply");
  const rows = await db().select({ id: schema.playthroughs.id, ownerId: schema.playthroughs.ownerId, name: schema.playthroughs.name }).from(schema.playthroughs).where(isNull(schema.playthroughs.buildId));
  console.log(`${rows.length} playthrough${rows.length === 1 ? "" : "s"} on no build.`);
  for (const r of rows) {
    if (!apply) {
      console.log(`would make a character of "${r.name}" (${r.id})`);
      continue;
    }
    const buildId = await makeCharacterOfRun(r.ownerId, r.id);
    console.log(`"${r.name}" (${r.id}) is now on ${buildId}`);
  }
  if (!apply && rows.length) console.log("Nothing changed. Run again with --apply to make them.");
}

main().then(
  () => process.exit(0),
  (e) => {
    console.error(e);
    process.exit(1);
  },
);
