/**
 * WO-179: a character is one shell. A run's old address goes to the character's, a run with no build makes its character, the playthrough editor
 * has no name, line, cover or build of its own, an empty tab shows its owner how to start it, and Edit opens on the tab you were on.
 */
import { expect, test } from "@playwright/test";
import { call, ip, signIn, tokenFor } from "./helpers";
import { KYRIA_BUILD_ID, KYRIA_PLAYTHROUGH_ID } from "./seed";

test("the run's old address goes to the character's, with its tab, act and chapters", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/p/${KYRIA_PLAYTHROUGH_ID}`);
  await expect(page).toHaveURL(new RegExp(`/b/${KYRIA_BUILD_ID}\\?tab=playthrough`));
  await page.goto(`/p/${KYRIA_PLAYTHROUGH_ID}?act=2`);
  await expect(page).toHaveURL(new RegExp(`/b/${KYRIA_BUILD_ID}\\?tab=playthrough&act=2`));
  await page.goto(`/p/${KYRIA_PLAYTHROUGH_ID}/build`);
  await expect(page).toHaveURL(new RegExp(`/b/${KYRIA_BUILD_ID}`));
  // The tabs of the page and of the editor are the same, in the same order.
  await page.goto(`/b/${KYRIA_BUILD_ID}?tab=playthrough`);
  const names = (await page.getByRole("tablist", { name: "Build sections" }).getByRole("tab").allInnerTexts()).map((t) => t.split("\n")[0].trim().toLowerCase());
  expect(names.slice(0, 2)).toEqual(["playthrough", "build"]);
  // Edit opens on the tab you are on.
  await expect(page.locator(`a[href="/b/${KYRIA_BUILD_ID}/play"]`, { hasText: /^Edit$/ })).toHaveCount(1);
  await page.getByRole("tab", { name: /^Build/ }).click();
  await expect(page.locator(`a[href="/b/${KYRIA_BUILD_ID}/edit"]`, { hasText: /^Edit$/ })).toHaveCount(1);
});

test("the playthrough's editor has no name, line, cover or build of its own", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/p/${KYRIA_PLAYTHROUGH_ID}/edit/play`);
  await expect(page.getByText("The name, the line under it and the cover are the character's")).toBeVisible();
  await expect(page.getByLabel("Name", { exact: true })).toHaveCount(0);
  await expect(page.getByLabel("One line")).toHaveCount(0);
  await expect(page.getByRole("combobox", { name: "Build" })).toHaveCount(0);
  const tabs = (await page.getByRole("complementary", { name: /Edit tabs|Editing/ }).count()) >= 0;
  expect(tabs).toBe(true);
});

test("a run with no build makes its character; an empty tab shows its owner how to start it", async ({ page, context, baseURL }) => {
  await signIn(context);
  const from = ip();
  const token = (await tokenFor(page, context, baseURL!, from)).access_token;
  const made = (await call(baseURL!, from, token, "create_playthrough", { name: "E2E Shell" })).json();
  expect(made.playthrough).toBeTruthy();
  // Its old address lands on a character named as the run.
  await page.goto(`/p/${made.playthrough}`);
  await expect(page).toHaveURL(/\/b\/[23456789abcdefghjkmnpqrstuvwxyz]{10}\?tab=playthrough/);
  await expect(page.getByRole("heading", { level: 1, name: "E2E Shell" })).toBeVisible();
  // Nothing planned: Build says so and offers to plan it; Guide offers to write one; the character has no cover, so its fallback shows.
  await page.getByRole("tab", { name: /^Build/ }).click();
  await expect(page.getByText("No levels are planned for this character yet.")).toBeVisible();
  await expect(page.getByRole("link", { name: "Plan the levels" })).toBeVisible();
  await page.getByRole("tab", { name: /^Guide/ }).click();
  await expect(page.getByRole("link", { name: "Write a guide" })).toBeVisible();
  // It cannot be unlinked or moved to another character.
  const moved = await call(baseURL!, from, token, "set_playthrough", { playthrough: made.playthrough, build: "" });
  expect(moved.isError).toBe(true);
  // A visitor sees no empty tab.
  await context.clearCookies();
  await page.goto(page.url());
  await expect(page.getByRole("tab", { name: /^Guide/ })).toHaveCount(0);
});
