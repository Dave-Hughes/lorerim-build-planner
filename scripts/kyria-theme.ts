/**
 * WO-181 Part 5: Kyria's text from the design canvas frames (CharacterTheme), written through the same set_theme write the tool uses, and her
 * Act II's Whiterun to Solitude leg set to go by carriage. Dry run by default: says what it would write and changes nothing.
 *
 *   npx tsx --conditions react-server scripts/kyria-theme.ts <playthrough id>           (say what it would do)
 *   npx tsx --conditions react-server scripts/kyria-theme.ts <playthrough id> --apply   (do it)
 *
 * On staging: DATABASE_URL set to the staging branch's own string (a hidden secret in Vercel: copy it from the Neon console) and VERCEL_ENV=preview.
 *
 * The environment guard applies: it refuses a DATABASE_URL that does not match the environment. Production waits for Dave.
 * One sentence of the frame's backstory is left out: its last, which says she tells no one why she came, is a tease and the writing rules (Who she
 * is, rule 38) have none.
 */
import { config } from "dotenv";
import { eq } from "drizzle-orm";
import { db, schema } from "../src/db";
import { setAct, setTheme } from "../src/lib/playthroughs/writes";

config({ path: ".env.local", quiet: true });

const THEME = {
  backstory: [
    "Kyria was left as a baby at Dibella's chapel in Anvil and raised by its priestesses. She learned the lute there before she could read. The priestesses taught her that work done with care is a way of worshipping Dibella.",
    "She grew up tall and learned early that people treated her better when she smiled at them. Mother Valeria, who ran the chapel, warned her that people would want things from her because of it.",
    "At seventeen she saw a sailor drag a novice away while the town watch did nothing. The next day she asked Corva, captain of the Anvil guard, to train her to fight, and kept training with her for two years.",
    "At nineteen, during the Night of Lanterns, slavers from a Stros M'Kai galley raided the chapel for its novices. Kyria held a door long enough for nine of them to get out. A large man wearing a ring on every finger broke her cheek and her fretting hand. Four girls were taken. Three were never found. One of them was Pia, a red-haired novice Kyria had taught to play.",
    "Valeria sent her to the Order of Stendarr. In Chorrol an old knight trained her with a greatsword and in heavy armor, and she rode with the Vigilants against Molag Bal's cultists, who buy captives. She took her vows at twenty-two. Her vow is to give an enemy one chance to yield, and to fight to kill if they don't.",
    "Seven years after the raid, a Nord sellsword in an Anvil tavern hummed a tune Kyria had taught Pia. He had heard it in Solitude, at the Winking Skeever, played by a red-haired girl who was brought in each night by a large man with rings. Kyria thought a knight asking questions would get the girl moved, and a bard would not. She left her armor in Chorrol and crossed into Skyrim as a bard.",
  ].join("\n\n"),
  from: "Anvil, raised at Dibella's chapel",
  gods: "Stendarr, and Dibella",
  goal: "Find Pia, and the man with the rings",
  will: ["Work inn shifts and play for coin", "Free captives she finds held by bandits, slavers or necromancers", "Let an enemy who yields go", "Attack vampires, necromancers and Daedra worshippers on sight"],
  never: ["Steal from homes, farms or shops", "Take paid killing, including Dark Brotherhood contracts", "Kill anyone who has yielded", "Keep a thrall, or take a job that sells a person", "Wear heavy armor in towns before Solitude"],
  grey: ["Gives a false name and story to anyone who asks", "Loots bandit camps and keeps the gold", "Picks locks only to reach a captive", "Uses Speech to get better prices and answers"],
};

async function main() {
  const [id, ...flags] = process.argv.slice(2);
  const apply = flags.includes("--apply");
  if (!id) throw new Error("Give the playthrough's id: npx tsx scripts/kyria-theme.ts <id> [--apply]");
  const [p] = await db().select().from(schema.playthroughs).where(eq(schema.playthroughs.id, id)).limit(1);
  if (!p) throw new Error(`No playthrough ${id} in this database.`);
  console.log(`${p.name} (${p.id}), owner ${p.ownerId}`);
  console.log(`would write: a ${THEME.backstory.length}-character backstory, From, Gods, Goal, ${THEME.will.length} will, ${THEME.never.length} won't (replacing ${p.never?.length ?? 0} kept), ${THEME.grey.length} grey`);
  const acts = await db().select().from(schema.playthroughActs).where(eq(schema.playthroughActs.playthroughId, id));
  const road = acts.find((a) => (a.route ?? []).some((r) => /^solitude$/i.test(r.place)) && (a.route ?? []).some((r) => /^whiterun$/i.test(r.place)));
  if (road) console.log(`would set Solitude on act "${road.name}"'s route to arrive by carriage`);
  else console.log("no act's route has Whiterun and Solitude: no leg to set");
  if (!apply) return console.log("Nothing changed. Run again with --apply to write it.");
  await setTheme(p.ownerId, id, THEME);
  if (road) await setAct(p.ownerId, id, road.id, { route: (road.route ?? []).map((r) => (/^solitude$/i.test(r.place) ? { ...r, by: "carriage" as const } : r)) });
  console.log("Written.");
}

main().then(
  () => process.exit(0),
  (e) => {
    console.error(e);
    process.exit(1);
  },
);
