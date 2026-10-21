// What the save reader (WO-112) finds in a save, printed: npx tsx scripts/save/check.mjs <file.ess> [more.ess ...]
// It reads the file on this PC and prints the reader's fields; the save itself goes nowhere.
import { readFileSync } from "node:fs";
import { basename } from "node:path";
import { readHeader, readSave } from "../../src/lib/save/read.ts";

const forms = JSON.parse(readFileSync(new URL("../../src/data/lorerim-5.0.4.8/quest_forms.json", import.meta.url), "utf8"));
const files = process.argv.slice(2);
if (!files.length) {
  console.error("usage: npx tsx scripts/save/check.mjs <file.ess> [more.ess ...]");
  process.exit(1);
}
for (const file of files) {
  const bytes = new Uint8Array(readFileSync(file));
  const h = readHeader(bytes);
  const s = readSave(bytes, forms);
  const quests = Object.entries(s.quests);
  console.log(`## ${basename(file)}`);
  console.log("");
  console.log(`- Header: ${h.name}, level ${h.level}, ${h.place}, game date ${h.gameDate}, save ${h.saveNumber}, XP ${h.curExp.toFixed(1)} of ${h.lvlUpExp}`);
  console.log(`- Reader: ${s.name}, level ${s.level}, XP ${s.xp} of ${s.xpToNext}, day ${s.day}, ${s.place}, save ${s.saveNumber}`);
  console.log(`- Skills: ${s.skills ? JSON.stringify(s.skills) : "not read"}`);
  console.log(`- Quests the planner knows: ${quests.length}, ${quests.filter(([, q]) => q.completed).length} completed`);
  console.log(`- ${quests.slice(0, 400).map(([k, q]) => `${k} ${q.stage}${q.completed ? " done" : ""}`).join("; ")}`);
  console.log("");
}
