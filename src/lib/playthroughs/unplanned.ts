/** A character nothing was planned on (WO-179): no race and no perk taken at any level. A run's own character, before a build is planned for it. */
export function unplanned(plan: { race?: unknown; levels: { perks?: unknown[] }[] }) {
  return !plan.race && plan.levels.every((l) => !l.perks?.length);
}
