# Fill to a level: the prototype (WO-64)

The script the chat session ran on 13 Oct to get the canvas numbers for Jo'Vashar (levels 2 to 30, no problems from the rules engine). A sketch of the algorithm in WO-64, not production code. To run it, copy it to the repo root as `.tmp-fill.ts` and run `npx tsx --tsconfig tsconfig.json ./.tmp-fill.ts`.

```ts
// Prototype of "Fill to a level" (WO-63): round-robin skill raises toward targets, perks at the first level they fit.
import { computeBuild } from "@/lib/rules/engine";
import { requireGameData } from "@/lib/rules/data";
import type { BuildPlan, LevelPlan } from "@/lib/rules/types";
const d = requireGameData("5.0.4.8");
const TO = 30;
const targets: [string, number][] = [["Two-Handed", 75], ["Evasion", 90], ["Alteration", 60], ["Block", 40], ["Smithing", 30]];
const picks: Record<string, number> = { magicka: 10, stamina: 12, health: 7 };
const first = "magicka";
const wish = ["Two-Handed:Great Weapon Mastery", "Evasion:Agility", "Alteration:Novice Alteration", "Evasion:Unarmored", "Alteration:Apprentice Alteration", "Two-Handed:Barbaric Might", "Two-Handed:Quarterstaff & Battlestaff Focus", "Alteration:Improved Mage Armor", "Evasion:Dodge", "Block:Improved Blocking", "Alteration:Adept Alteration", "Two-Handed:Mighty Strike", "Alteration:Expert Alteration"];
const plan = { schema: 1, gameVersion: "5.0.4.8", race: "Khajiit", birthsign: "Lord", mode: "Konahrik", deity: "Riddle'Thar", start: "Merchant", startOption: "Cyrodiil", majors: ["Two-Handed", "Evasion", "Alteration"], minors: ["Block", "Wayfarer", "Smithing", "Restoration", "Sneak", "Speech"], traits: ["Focused Combat", "Monk"], traitChoices: { "Focused Combat": "Two-Handed" }, levels: [], gear: [], notes: "" } as unknown as BuildPlan;
const blank = (): LevelPlan => ({ skillPoints: {}, perks: [], destiny: [], extras: [], note: "" }) as LevelPlan;
const st = () => computeBuild(plan, d);
const order: string[] = []; const left = { ...picks };
while (left[first] > 0) { order.push(first); left[first]--; }
while (order.length < TO - 1) { for (const a of ["health", "stamina", "magicka"]) if (left[a] > 0 && order.length < TO - 1) { order.push(a); left[a]--; } }
for (let L = 1; L <= TO; L++) {
  const lv = blank(); plan.levels.push(lv);
  if (L > 1) {
    lv.attribute = order[L - 2] as LevelPlan["attribute"];
    const prev = st()[L - 2]; const sk = { ...prev.skills }; let pts = 30 + prev.skillPointsBanked; const raised: Record<string, number> = {};
    const max = d.maxSkillAt(L); let moved = true;
    while (moved) { moved = false; for (const [s, t] of targets) { if ((raised[s] ?? 0) >= 5 || sk[s] >= Math.min(t, max)) continue; const c = d.skillPointCost(sk[s]); if (c > pts) continue; pts -= c; sk[s]++; raised[s] = (raised[s] ?? 0) + 1; moved = true; } }
    lv.skillPoints = raised;
  }
  for (let g = 0; g < 6; g++) { const s = st()[L - 1]; if (s.perkPoints - s.perkPointsSpent <= 0) break; let took = false;
    for (let i = 0; i < wish.length; i++) { const w = wish[i]; const rank = wish.slice(0, i + 1).filter((x) => x === w).length; if ((s.perksTaken[w]?.length ?? 0) >= rank) continue; lv.perks.push(w); if (st()[L - 1].issues.length === 0) { took = true; break; } lv.perks.pop(); }
    if (!took) break; }
}
const all = st(); const last = all[TO - 1];
const placed: Record<string, number> = {}; plan.levels.forEach((l, i) => l.perks.forEach((p) => { placed[p] ??= i + 1; }));
const reached = targets.map(([s, t]) => [s, t, all[0].skills[s], last.skills[s], (all.find((x) => x.skills[s] >= t)?.level) ?? null]);
console.log(JSON.stringify({ issues: all.flatMap((s) => s.issues).length, reached, hms: [last.health, last.magicka, last.stamina], perks: wish.map((w) => [w.split(":")[1], placed[w] ?? null]), banked: last.skillPointsBanked, perkLeft: last.perkPoints - last.perkPointsSpent, perLevel: plan.levels.map((l) => l.perks.length) }));
```

Its output: `{"issues":0,"reached":[["Two-Handed",75,20,75,25],["Evasion",90,30,80,null],["Alteration",60,20,60,12],["Block",40,15,40,9],["Smithing",30,15,30,6]],"hms":[135,150,220],...,"banked":450,"perkLeft":21}`
