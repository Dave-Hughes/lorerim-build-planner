/**
 * WO-181 Part 3: progress tracking is one setting, off for now, and with it on everything comes back as it was. This runs on the fourth server
 * (PROGRESS_TRACKING=on); every other spec runs with it off, as it ships. The ticks, the done counts, where she is in your game, Ticks from your
 * save, and the tools that write a save's word.
 */
import { expect, test } from "@playwright/test";
import { call, ip, savedInBand, signIn, tokenFor } from "./helpers";
import { KYRIA_BUILD_ID, KYRIA_PLAYTHROUGH_ID } from "./seed";

const PAGE = `/b/${KYRIA_BUILD_ID}?tab=playthrough`;

test.describe.configure({ mode: "serial" });

test("with tracking on, an objective has a box and the tick holds; the rail and the tab count what is done", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`${PAGE}&act=1`);
  await expect(page.getByRole("tab", { name: /^Playthrough/ })).toContainText(/\d+ of \d+ done/);
  await expect(page.getByRole("complementary").getByText(/^\d+ of \d+ done$/).first()).toBeVisible();
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

test("with tracking on, where she is in your game is there again, on the page and in the editor", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`${PAGE}&act=1`);
  await expect(page.getByLabel("Where she is")).toContainText(/^Level 6, day 7, Riften\. From Save 7, \d+ \w+\. Update ›$/);
  await page.goto(`/b/${KYRIA_BUILD_ID}/edit/play`);
  await expect(page.getByRole("region", { name: "Where you stand" })).toBeVisible();
  await page.getByRole("button", { name: "Edit Hunt and tan her first hides" }).click();
  await expect(page.getByRole("switch")).toHaveCount(0);
  await page.getByRole("button", { name: "Edit Warn Haelga, or expose her" }).click();
  const sw = page.getByRole("switch", { name: /Ticks from your save/ });
  await expect(sw).toBeChecked();
  await sw.uncheck();
  await savedInBand(page);
  await page.reload();
  await page.getByRole("button", { name: "Edit Warn Haelga, or expose her" }).click();
  await expect(page.getByRole("switch", { name: /Ticks from your save/ })).not.toBeChecked();
  await page.getByRole("switch", { name: /Ticks from your save/ }).check();
  await savedInBand(page);
});

test("with tracking on, the tools that tick or read a save work, and get_playthrough says what is done", async ({ page, context, baseURL }) => {
  await signIn(context);
  const from = ip();
  const t = await tokenFor(page, context, baseURL!, from);
  const go = (name: string, args: object) => call(baseURL!, from, t.access_token, name, args);
  const got = (await go("get_playthrough", { playthrough: KYRIA_PLAYTHROUGH_ID })).json();
  expect(got.done).toMatch(/^\d+ of \d+$/);
  expect(got.acts[0].objectives[0]).toHaveProperty("status");
  const set = await go("set_status", { playthrough: KYRIA_PLAYTHROUGH_ID, objective: "Take a room at the Bee and Barb", status: "done" });
  expect(set.isError, set.text).toBe(false);
  expect((await go("set_status", { playthrough: KYRIA_PLAYTHROUGH_ID, objective: "Take a room at the Bee and Barb", status: "done" })).isError).toBe(false);
});

test("with tracking on, a character's pin sits where its latest save puts it, from the address", async ({ page, context }) => {
  await signIn(context);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`/map?character=${KYRIA_PLAYTHROUGH_ID}`);
  await expect(page.getByRole("group", { name: "Map of Skyrim" })).toBeVisible();
  await expect(page.getByTestId("my-character")).toContainText("Kyria Severa");
});
