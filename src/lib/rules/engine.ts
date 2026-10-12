import { rankCount, requireGameData, type GameData, type Perk } from "./data";
import type { BuildPlan, Issue, IssueCode, LevelState } from "./types";

/** LoreRim's Oghma Infinium reward (LoreRim Oghma Reward.esp): +5 to each of six skills, then 3 perk points. */
export const OGHMA_SKILLS = 6;
export const OGHMA_SKILL = 5;
export const OGHMA_PERK_POINTS = 3;

const issue = (code: IssueCode, message: string): Issue => ({ code, message });

/** "1 skill point", "2 skill points". */
function count(n: number, one: string): string {
  return `${n} ${one}${n === 1 ? "" : "s"}`;
}

function perkLabel(d: GameData, id: string, inTree?: string): string {
  const p = d.perkById.get(id);
  if (!p) return id;
  if (p.tree === "Destiny" || p.tree === inTree) return p.name;
  return `${p.tree}: ${p.name}`;
}

/** Problems with the creation choices (shown on level 1). */
export function checkCreation(b: BuildPlan, d: GameData = requireGameData(b.gameVersion)): Issue[] {
  const rules = d.rules;
  const out: Issue[] = [];
  if (!d.raceByName.has(b.race)) out.push(issue("creation", `Unknown race "${b.race}".`));
  if (!b.traits.includes("Master of Destiny") && !d.signByName.has(b.birthsign))
    out.push(issue("creation", `Unknown birthsign "${b.birthsign}".`));
  if (b.majors.length > rules.majorCount)
    out.push(issue("creation", `Only ${rules.majorCount} major skills.`));
  if (b.minors.length > rules.minorCount)
    out.push(issue("creation", `Only ${rules.minorCount} minor skills.`));
  for (const s of b.majors.filter((s) => b.minors.includes(s)))
    out.push(issue("creation", `${s} can't be both major and minor.`));
  for (const s of [...b.majors, ...b.minors].filter((s) => !d.skills.includes(s)))
    out.push(issue("creation", `Unknown skill "${s}".`));
  if (b.traits.length > rules.maxTraits)
    out.push(issue("creation", `Only ${rules.maxTraits} traits.`));
  for (const t of b.traits.filter((t) => !d.traitByName.has(t)))
    out.push(issue("creation", `Unknown trait "${t}".`));
  if (b.traits.includes("Master of One") && !b.masterOfOneSkill)
    out.push(issue("creation", "Choose the Master of One skill."));
  return out;
}

/**
 * Replays a build level by level, against the data of the build's own LoreRim version and returns the state after each level.
 * `states[0]` is level 1 (character creation plus starting perks).
 */
export function computeBuild(b: BuildPlan, d: GameData = requireGameData(b.gameVersion)): LevelState[] {
  const rules = d.rules;
  const traits = new Set(b.traits);
  const masterOfDestiny = traits.has("Master of Destiny");
  const masterOfOne = traits.has("Master of One");
  const skilled = traits.has("Skilled");
  const naaktiid = b.mode === "Naaktiid";
  const mooSkill = masterOfOne && b.masterOfOneSkill ? b.masterOfOneSkill : null;

  const skills: Record<string, number> = Object.fromEntries(d.skills.map((s) => [s, rules.baseSkill]));
  const race = d.raceByName.get(b.race);
  if (race) {
    skills[race.primary] += rules.racePrimaryBonus;
    for (const s of race.secondary) skills[s] += rules.raceSecondaryBonus;
  }
  for (const s of b.majors) if (s in skills) skills[s] += rules.majorBonus;
  for (const s of b.minors) if (s in skills) skills[s] += rules.minorBonus;
  if (masterOfDestiny) for (const s of d.skills) skills[s] += rules.masterOfDestinySkillBonus;
  if (mooSkill && mooSkill in skills) skills[mooSkill] = rules.skillCeiling;

  const granted = (id: string) => !!mooSkill && d.perkById.get(id)?.tree === mooSkill;

  let perkPoints =
    rules.startingPerkPoints +
    (naaktiid ? rules.naaktiidBonusPerkPoints : 0) +
    (masterOfDestiny ? rules.masterOfDestinyPerkPoints : 0);
  let perkPointsSpent = 0;
  /** The level the Oghma Infinium was read at, once read. */
  let oghmaAt = 0;
  let banked = 0;
  let trainerUsed = 0;
  let stone = "";
  let deity = b.deity;
  let destinySpent = 0;
  const attributePicks = { health: 0, magicka: 0, stamina: 0 };
  const taken: Record<string, number[]> = {};
  const destinyTaken: Record<string, number> = {};
  /** Spell id -> the level it was learned (WO-42). */
  const spellsLearned: Record<string, number> = {};
  const states: LevelState[] = [];

  const has = (id: string) => granted(id) || (taken[id]?.length ?? 0) > 0 || id in destinyTaken;

  b.levels.forEach((lv, index) => {
    const L = index + 1;
    const issues: Issue[] = L === 1 ? checkCreation(b, d) : [];
    const max = d.maxSkillAt(L);
    const before = { ...skills };
    let available = 0;
    let spent = 0;

    if (L > 1) {
      if (lv.attribute) attributePicks[lv.attribute]++;
      else issues.push(issue("attribute-missing", "Pick Health, Magicka or Stamina."));

      available = rules.skillPointsPerLevel + banked;
      for (const s of d.skills) {
        const n = lv.skillPoints[s] ?? 0;
        if (!n) continue;
        if (n > rules.maxRaisePerSkillPerLevel)
          issues.push(issue("skill-over-five", `${s}: +${n} is more than +${rules.maxRaisePerSkillPerLevel} in one level-up.`));
        for (let i = 0; i < n; i++) {
          spent += d.skillPointCost(skills[s]);
          skills[s]++;
        }
        if (skills[s] > max && s !== mooSkill)
          issues.push(issue("skill-over-max", `${s} reaches ${skills[s]}, over the max skill of ${max} at level ${L}.`));
      }
      if (spent > available)
        issues.push(issue("skill-points-over", `${count(spent, "skill point")} spent, ${available} available.`));
      banked = Math.max(0, available - spent);
      if (!masterOfOne && !(skilled && L % 5 === 0)) perkPoints++;
    }

    for (const ex of lv.extras) {
      // The Oghma Infinium (WO-44): sets the skills straight, so it may go past the level's max.
      if (ex.kind === "oghma") {
        if (oghmaAt) {
          issues.push(issue("oghma-repeat", "The Oghma Infinium can only be read once."));
          continue;
        }
        oghmaAt = L;
        for (const sk of new Set(ex.skills)) if (sk in skills) skills[sk] = Math.min(100, skills[sk] + OGHMA_SKILL);
        perkPoints += OGHMA_PERK_POINTS;
        continue;
      }
      if (!(ex.skill in skills)) continue;
      if (ex.kind === "trainer") {
        trainerUsed++;
        skills[ex.skill]++;
        if (trainerUsed > rules.trainerSessionsPerLevel * L)
          issues.push(issue("trainer-limit", `${count(trainerUsed, "trainer session")} by level ${L}, limit ${rules.trainerSessionsPerLevel * L}.`));
        if (skills[ex.skill] > max)
          issues.push(issue("trainer-over-max", `${ex.skill}: trainers can't go past ${max} at level ${L}.`));
      } else {
        const gain = skilled ? 2 : 1;
        const next = Math.min(max, skills[ex.skill] + gain);
        if (next <= skills[ex.skill])
          issues.push(issue("book-wasted", `${ex.skill} skill book gives nothing at max skill ${max}.`));
        skills[ex.skill] = Math.max(skills[ex.skill], next);
      }
    }

    if (lv.stone !== undefined && lv.stone !== "") stone = lv.stone === "none" ? "" : lv.stone;
    if (lv.deity) deity = lv.deity;

    // Count this level's picks first so prerequisites taken the same level work in any order.
    const ranksBefore: Record<string, number> = {};
    for (const id of lv.perks) if (!(id in ranksBefore)) ranksBefore[id] = taken[id]?.length ?? 0;
    for (const id of lv.perks) (taken[id] ??= []).push(L);
    const seen: Record<string, number> = {};
    // Held before this pick: taken at an earlier level, granted, or listed earlier this level.
    const heldBefore = (x: string, i: number) => {
      const j = lv.perks.indexOf(x);
      return granted(x) || (ranksBefore[x] ?? 0) > 0 || (j !== -1 && j < i);
    };
    for (const [i, id] of lv.perks.entries()) {
      const p = d.perkById.get(id);
      if (!p || p.tree === "Destiny") {
        issues.push(issue("perk-unknown", `Unknown perk "${id}".`));
        continue;
      }
      seen[id] = (seen[id] ?? 0) + 1;
      const rank = ranksBefore[id] + seen[id] - 1;
      const ranks = rankCount(p);
      const rankLabel = ranks > 1 ? ` rank ${rank + 1}` : "";
      if (granted(id)) {
        issues.push(issue("perk-granted", `${p.name} comes free with Master of One.`));
        continue;
      }
      if (rank >= ranks) {
        issues.push(issue("perk-ranks", `${p.name} has ${ranks} rank${ranks > 1 ? "s" : ""}.`));
        continue;
      }
      const skillNeeded = p.rankSkills ? p.rankSkills[rank] : (p.skill ?? 0);
      const levelNeeded = p.rankLevels?.[rank] ?? 0;
      if (skills[p.tree] < skillNeeded)
        issues.push(issue("perk-skill", `${p.name}${rankLabel} needs ${p.tree} ${skillNeeded}; it is ${skills[p.tree]}.`));
      if (L < levelNeeded)
        issues.push(issue("perk-level", `${p.name}${rankLabel} needs level ${levelNeeded}.`));
      if (p.requires.length && !(p.anyOf ? p.requires.some(has) : p.requires.every(has)))
        issues.push(
          issue(
            "perk-prerequisite",
            `${p.name} needs ${p.requires.map((r) => perkLabel(d, r, p.tree)).join(p.anyOf ? " or " : " and ")} first.`,
          ),
        );
      for (const x of (p.excludes ?? []).filter((x) => heldBefore(x, i)))
        issues.push(issue("perk-excluded", `${p.name} can't be held with ${perkLabel(d, x, p.tree)}.`));
      if (!p.book) perkPointsSpent++;
    }
    if (perkPointsSpent > perkPoints)
      issues.push(issue("perk-points-over", `${count(perkPointsSpent, "perk point")} spent, ${perkPoints} earned by level ${L}.`));

    const destinyPoints = d.destinyPointsAt(L);
    for (const id of lv.destiny) {
      const dp = d.perkById.get(id);
      if (!dp || dp.tree !== "Destiny") {
        issues.push(issue("destiny-unknown", `Unknown Destiny perk "${id}".`));
        continue;
      }
      if (id in destinyTaken) {
        issues.push(issue("destiny-repeat", `${dp.name} was already taken at level ${destinyTaken[id]}.`));
        continue;
      }
      destinyTaken[id] = L;
      destinySpent++;
      if (dp.requires.length) {
        const ok = dp.anyOf ? dp.requires.some((x) => x in destinyTaken) : dp.requires.every((x) => x in destinyTaken);
        if (!ok)
          issues.push(
            issue("destiny-prerequisite", `${dp.name} needs ${dp.requires.map((x) => perkLabel(d, x)).join(dp.anyOf ? " or " : " and ")} first.`),
          );
      }
    }
    if (destinySpent > destinyPoints)
      issues.push(issue("destiny-points-over", `${count(destinySpent, "Destiny point")} spent, ${destinyPoints} earned by level ${L}.`));

    // Spells (WO-42): each learned once, and known to this version.
    for (const row of lv.spells ?? []) {
      const sp = d.spellById.get(row.id);
      if (!sp) {
        issues.push(issue("spell-unknown", `A spell is not in LoreRim ${d.version.id}.`));
        continue;
      }
      if (row.id in spellsLearned) {
        issues.push(issue("spell-repeat", `${sp.name} was already learned at level ${spellsLearned[row.id]}.`));
        continue;
      }
      spellsLearned[row.id] = L;
    }

    // Health, Magicka, Stamina
    let health = (race?.health ?? 100) + rules.attributePerLevel * attributePicks.health;
    let magicka = (race?.magicka ?? 100) + rules.attributePerLevel * attributePicks.magicka;
    let stamina = (race?.stamina ?? 100) + rules.attributePerLevel * attributePicks.stamina;
    const sign = masterOfDestiny ? undefined : d.signByName.get(b.birthsign);
    if (sign) {
      health += sign.health;
      magicka += sign.magicka;
      stamina += sign.stamina;
    }
    const st = d.stoneByName.get(stone);
    if (st) {
      health += st.health;
      magicka += st.magicka;
      stamina += st.stamina;
    }
    if (traits.has("Blood Warrior")) health += 50 + 5 * (L - 1);
    if (traits.has("Blood Mage")) health -= 2 * L;
    if (traits.has("Quester")) {
      health -= 50;
      magicka -= 50;
      stamina -= 50;
    }
    if (traits.has("Wanderer")) stamina -= 50;
    if (traits.has("Self-Taught")) magicka -= 100;
    for (const id of Object.keys(destinyTaken)) {
      const bonus = d.perkById.get(id)?.allAttributes ?? 0;
      health += bonus;
      magicka += bonus;
      stamina += bonus;
    }

    let carryWeight =
      rules.baseCarryWeight +
      (naaktiid ? rules.naaktiidCarryWeight : 0) +
      (sign?.carryWeight ?? 0) +
      (traits.has("Hoarder") ? 200 : 0);
    for (const [id, levels] of Object.entries(taken))
      if (levels.length) carryWeight += d.perkById.get(id)?.carryWeight ?? 0;
    if (mooSkill)
      for (const p of d.perksByTree.get(mooSkill) ?? ([] as Perk[])) carryWeight += p.carryWeight ?? 0;
    for (const id of Object.keys(destinyTaken)) carryWeight += d.perkById.get(id)?.carryWeight ?? 0;

    states.push({
      level: L,
      maxSkill: max,
      skillsBefore: before,
      skills: { ...skills },
      skillPointsAvailable: available,
      skillPointsSpent: spent,
      skillPointsBanked: banked,
      perkPoints,
      perkPointsSpent,
      trainerSessionsUsed: trainerUsed,
      stone,
      deity,
      destinyPoints,
      destinyPointsSpent: destinySpent,
      health,
      magicka,
      stamina,
      carryWeight,
      perksTaken: Object.fromEntries(Object.entries(taken).map(([k, v]) => [k, [...v]])),
      destinyTaken: { ...destinyTaken },
      grantedTree: mooSkill,
      issues,
    });
  });

  return states;
}
