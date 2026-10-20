/**
 * WO-110: an assistant drafts a build through the door, with a token from the WO-109 flow and plain
 * fetch as the assistant: create, three levels (one refused, then fixed), gear, finish_draft; then
 * the draft on the site, the Details checkbox, and another player's token turned away.
 */
import { expect, test } from "@playwright/test";
import { call, ip, signIn, tokenFor } from "./helpers";

test.describe.configure({ mode: "serial" });

let buildId = "";
let token = "";
const from = ip();

// The drafter is the second seeded player: the full run's other tests make builds as the test author,
// and the site's own limit (10 new builds a day) holds for drafts too.
test("an assistant drafts a build: create, three levels with one refused and fixed, gear, finish_draft", async ({ page, context, baseURL }) => {
  await signIn(context, "other");
  const t = await tokenFor(page, context, baseURL!, from);
  expect(t.scope).toBe("facts builds:write playthroughs:write");
  token = t.access_token;

  const made = await call(baseURL!, from, token, "create_build", { name: "E2E Drafted Nord", race: "Nord", birthsign: "Warrior", majors: ["Two-Handed", "Heavy Armor", "Smithing"], minors: ["Block", "Restoration", "Speech"] });
  expect(made.isError, made.text).toBe(false);
  const created = made.json();
  expect(created).toMatchObject({ visibility: "private", level: { level: 1 } });
  expect(created.canTakeNext.length).toBeGreaterThan(0);
  buildId = created.build;

  const two = await call(baseURL!, from, token, "add_level", { build: buildId, attribute: "Stamina", skillPoints: { "Two-Handed": 3, "Heavy Armor": 2 }, perks: ["Great Weapon Mastery"], note: "Pick up a greatsword." });
  expect(two.isError, two.text).toBe(false);
  expect(two.json().level.level).toBe(2);

  // A perk the build can't take yet: refused with the rule and the level, and nothing saved.
  const bad = await call(baseURL!, from, token, "add_level", { build: buildId, attribute: "Stamina", perks: ["Two-Handed:Mighty Strike"] });
  expect(bad.isError).toBe(true);
  expect(bad.text).toMatch(/^Nothing was saved\. Level 3: /);
  expect((await call(baseURL!, from, token, "get_build", { build: buildId })).json().levels).toHaveLength(2);

  const three = await call(baseURL!, from, token, "add_level", { build: buildId, attribute: "Health", skillPoints: { "Two-Handed": 3 }, perks: ["Barbaric Might"] });
  expect(three.isError, three.text).toBe(false);
  const four = await call(baseURL!, from, token, "add_level", { build: buildId, attribute: "Stamina", skillPoints: { Block: 2 } });
  expect(four.isError, four.text).toBe(false);

  const gear = await call(baseURL!, from, token, "set_gear", { build: buildId, gear: [{ slot: "Main hand", name: "Steel Greatsword", fromLevel: 1 }, { slot: "Body", name: "Steel Armor", fromLevel: 2 }] });
  expect(gear.isError, gear.text).toBe(false);
  const wrong = await call(baseURL!, from, token, "set_gear", { build: buildId, gear: [{ slot: "Head", name: "Steel Greatsword", fromLevel: 1 }] });
  expect(wrong.text).toBe("Gear 1: Steel Greatsword doesn't go in Head.");

  // On to level 20, the way an assistant would: one level at a time, by names.
  for (let level = 5; level <= 20; level++) {
    const r = await call(baseURL!, from, token, "add_level", { build: buildId, attribute: level % 3 ? "Stamina" : "Health", skillPoints: { "Two-Handed": 1, "Heavy Armor": 1 }, note: `Level ${level}.` });
    expect(r.isError, `level ${level}: ${r.text}`).toBe(false);
  }
  expect((await call(baseURL!, from, token, "get_build", { build: buildId })).json().levels).toHaveLength(20);

  const done = await call(baseURL!, from, token, "finish_draft", { build: buildId });
  expect(done.json()).toMatchObject({ ready: true, link: `${baseURL!.replace(/\/$/, "")}/b/${buildId}` });

  const listed = await call(baseURL!, from, token, "list_my_builds", {});
  expect(listed.json().find((b: { build: string }) => b.build === buildId)).toMatchObject({ name: "E2E Drafted Nord", visibility: "private", levels: 20, draftedByAnAssistant: true });
});

test("the draft is private under My builds, marked as drafted, and opens in the editor with every level", async ({ page, context }) => {
  await signIn(context, "other");
  await page.goto("/me");
  const card = page.getByRole("article").filter({ has: page.getByRole("link", { name: "E2E Drafted Nord" }) });
  await expect(card.getByText("Drafted with E2E Claude")).toBeVisible();
  await expect(card.getByText("Only you")).toBeVisible();
  await expect(page.getByRole("list", { name: "Assistants" })).toContainText(/\d+ builds? drafted/);

  await page.goto(`/b/${buildId}`);
  await expect(page.getByText("Drafted with E2E Claude")).toBeVisible();
  // In the editor, every level as sent: level 4 follows every rule, and level 2 has its note.
  await page.goto(`/b/${buildId}/edit?level=4`);
  await expect(page.getByRole("region", { name: "Edit bar" }).getByText("E2E Drafted Nord")).toBeVisible();
  await expect(page.getByText(/^Level 4 follows every rule/)).toBeVisible();
  await page.goto(`/b/${buildId}/edit?level=2`);
  await expect(page.getByText(/^Level 2 follows every rule/)).toBeVisible();
  await expect(page.getByText("Pick up a greatsword.").first()).toBeVisible();
});

test("the Details checkbox hides the drafted line", async ({ page, context }) => {
  await signIn(context, "other");
  await page.goto(`/b/${buildId}/setup?step=name`);
  const box = page.getByLabel("Show that an assistant drafted it");
  await expect(box).toBeChecked();
  await box.uncheck();
  await page.getByRole("button", { name: "Save changes" }).click();
  await page.waitForURL(new RegExp(`/b/${buildId}/edit`));
  await page.goto(`/b/${buildId}`);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("E2E Drafted Nord");
  await expect(page.getByText("Drafted with E2E Claude")).toHaveCount(0);
});

test("another player's token can't read it, and a token without builds:write can't write", async ({ page, context, baseURL }) => {
  const other = ip();
  await signIn(context);
  const t = await tokenFor(page, context, baseURL!, other);
  const read = await call(baseURL!, other, t.access_token, "get_build", { build: buildId });
  expect(read.isError).toBe(true);
  expect(read.text).toMatch(/^No build of yours has the id/);

  const factsOnly = await tokenFor(page, context, baseURL!, other, "facts");
  expect(factsOnly.scope).toBe("facts");
  const refused = await call(baseURL!, other, factsOnly.access_token, "create_build", { name: "No", race: "Nord", majors: [], minors: [] });
  expect(refused.text).toBe("Your sign-in doesn't allow this. Reconnect and allow draft builds in your account.");
});
