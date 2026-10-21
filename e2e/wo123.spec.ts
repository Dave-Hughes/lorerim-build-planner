/**
 * WO-123 Part 1: every objective has a box, a number to reach too; one the save can read shows Ticks from your save
 * in Edit's Play tab, on by default, and one with nothing to read shows no switch. Part 2: drafting through the door,
 * an objective that names a quest but isn't linked comes back with a warning, counted on /admin.
 */
import { expect, test } from "@playwright/test";
import { KYRIA_PLAYTHROUGH_ID } from "./seed";
import { call, ip, savedInBand, signIn, tokenFor } from "./helpers";

test("a number to reach has a box on Play, and the tick holds", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/p/${KYRIA_PLAYTHROUGH_ID}`);
  const box = page.getByRole("checkbox", { name: "Play the Bee and Barb until Speech 40" });
  await expect(box).toHaveAttribute("aria-checked", "false");
  await box.click();
  await expect(box).toHaveAttribute("aria-checked", "true");
  await page.reload();
  await expect(box).toHaveAttribute("aria-checked", "true");
  // Back as it was, for the tests after.
  await box.click();
  await expect(box).toHaveAttribute("aria-checked", "false");
});

test("Edit's Play tab: Ticks from your save on a linked objective, none on one of her own", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/p/${KYRIA_PLAYTHROUGH_ID}/edit/play`);
  await page.getByRole("button", { name: "Edit Hunt and tan her first hides" }).click();
  await expect(page.getByRole("switch")).toHaveCount(0);

  await page.getByRole("button", { name: "Edit Warn Haelga, or expose her" }).click();
  const sw = page.getByRole("switch", { name: /Ticks from your save/ });
  await expect(sw).toBeChecked();
  await expect(page.getByRole("button", { name: "About ticking from your save" })).toBeVisible();
  await sw.uncheck();
  await savedInBand(page);
  await page.reload();
  await page.getByRole("button", { name: "Edit Warn Haelga, or expose her" }).click();
  await expect(page.getByRole("switch", { name: /Ticks from your save/ })).not.toBeChecked();
  // On again, as the seed has it; the stage the save reads comes back with the link.
  await page.getByRole("switch", { name: /Ticks from your save/ }).check();
  await savedInBand(page);

  await page.getByRole("button", { name: "Edit Play the Bee and Barb until Speech 40" }).click();
  await expect(page.getByRole("switch", { name: /Ticks from your save/ })).toBeChecked();
});

test("drafting through the door: an unlinked quest objective and an unreadable number come back with warnings, counted", async ({ page, context, baseURL }) => {
  const from = ip();
  await signIn(context);
  const t = await tokenFor(page, context, baseURL!, from);
  const go = (name: string, args: object) => call(baseURL!, from, t.access_token, name, args);
  const added = await go("add_objective", { playthrough: KYRIA_PLAYTHROUGH_ID, act: "2", text: "Get a Mark of Dibella from Haelga at the bunkhouse", kind: "once" });
  expect(added.isError, added.text).toBe(false);
  expect(added.json().warnings).toEqual([
    { code: "objective-not-linked", message: "'Get a Mark of Dibella from Haelga at the bunkhouse' is Caught Red Handed (FreeformRiften11); link it so the save can tick it." },
  ]);
  const books = await go("add_objective", { playthrough: KYRIA_PLAYTHROUGH_ID, act: "2", text: "Read ten books", kind: "reach", reachKey: "books read", reachTarget: 10 });
  expect(books.json().warnings).toEqual([{ code: "reach-not-readable", message: "books read 10 can't be read from a save; the player ticks it." }]);
  const lute = await go("add_objective", { playthrough: KYRIA_PLAYTHROUGH_ID, act: "2", text: "Play the lute well", kind: "reach", reachKey: "Lute", reachTarget: 66 });
  expect(lute.json()).not.toHaveProperty("warnings");
  const got = (await go("get_playthrough", { playthrough: KYRIA_PLAYTHROUGH_ID })).json();
  expect(got.warnings.map((w: { objective: string }) => w.objective)).toEqual(expect.arrayContaining([added.json().objective, books.json().objective]));
  const done = (await go("finish_draft_playthrough", { playthrough: KYRIA_PLAYTHROUGH_ID })).json();
  expect(done).toMatchObject({ ready: true, warningsNote: "Fix these or tell the player why you left them." });
  for (const r of [added, books, lute]) {
    const removed = await go("remove_objective", { playthrough: KYRIA_PLAYTHROUGH_ID, objective: r.json().objective });
    expect(removed.isError, removed.text).toBe(false);
  }

  await page.goto("/admin");
  const connector = page.getByRole("region", { name: "Connector" });
  await expect(connector).toContainText("objective-not-linked");
  await expect(connector).toContainText("reach-not-readable");
});
