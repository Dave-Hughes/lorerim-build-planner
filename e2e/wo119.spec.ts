/**
 * WO-119: an assistant drafts a build the way Kyria's was drafted, a few skills and Speech at 5 a level
 * with the rest of the points left, and the door warns; once it spends the points, the warning goes.
 */
import { expect, test } from "@playwright/test";
import { call, ip, signIn, tokenFor } from "./helpers";

const from = ip();
type Warning = { code: string; message: string };
const codes = (r: { json: () => { warnings?: Warning[] } }) => (r.json().warnings ?? []).map((w) => w.code);

test("skill points piling up come back as a warning, and spending them clears it", async ({ page, context, baseURL }) => {
  await signIn(context, "other");
  const t = await tokenFor(page, context, baseURL!, from);
  const go = (name: string, args: object) => call(baseURL!, from, t.access_token, name, args);

  const made = await go("create_build", { name: "E2E Piled Points", race: "Nord", birthsign: "Warrior", majors: ["Two-Handed", "Heavy Armor", "Speech"], minors: ["Smithing", "Restoration", "Block", "One-Handed", "Evasion", "Wayfarer"], start: "Regular (Inn)", startOption: "Random" });
  expect(made.isError, made.text).toBe(false);
  const build = made.json().build;

  // Three levels as Kyria's were drafted: 5 into Speech, the rest carried.
  let last = made;
  for (let level = 2; level <= 4; level++) {
    last = await go("add_level", { build, attribute: "Stamina", skillPoints: { Speech: 5 } });
    expect(last.isError, last.text).toBe(false);
  }
  expect(codes(last)).toContain("skill-points-piling");
  const piling = last.json().warnings!.find((w: Warning) => w.code === "skill-points-piling")!;
  expect(piling.message).toMatch(/^\d+ skill points unspent since level 2\./);
  // get_build says the same, and finish_draft keeps it standing without refusing.
  expect(codes(await go("get_build", { build }))).toContain("skill-points-piling");
  const done = (await go("finish_draft", { build })).json();
  expect(done).toMatchObject({ ready: true, warningsNote: "Fix these or tell the player why you left them." });

  // Spend every level's 30: six skills from 10, at 1 point a raise.
  const spend = { Marksman: 5, Sneak: 5, Finesse: 5, Alchemy: 5, Alteration: 5, Conjuration: 5 };
  for (let level = 2; level <= 4; level++) {
    last = await go("set_level", { build, level, attribute: "Stamina", skillPoints: spend });
    expect(last.isError, last.text).toBe(false);
  }
  expect(codes(last)).not.toContain("skill-points-piling");
  expect(codes(await go("get_build", { build }))).not.toContain("skill-points-piling");

  // The admin page counts it (an admin is the test author).
  await context.clearCookies();
  await signIn(context);
  await page.goto("/admin");
  const connector = page.getByRole("region", { name: "Connector" });
  await expect(connector).toContainText("add_level");
  await expect(connector).toContainText("skill-points-piling");
  await expect(connector).toContainText(/finished with warnings standing/);
});
