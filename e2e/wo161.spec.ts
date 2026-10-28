/**
 * WO-161: small fixes from Bob's walk of every page: the site's name, characters not builds, one character card, search results that
 * say what they are and why, Everything that changed folded by day, People's town filter, and the phone's New button and top.
 */
import { expect, test } from "@playwright/test";
import { TEST_USER_HANDLE } from "./seed";

test("the tab says LoreRim Planner, and a quest that is its own line is named once", async ({ page }) => {
  await page.goto("/characters");
  await expect(page).toHaveTitle(/LoreRim Planner$/);
  await page.goto("/quests/q/the-golden-claw");
  await expect(page).toHaveTitle("The Golden Claw | LoreRim Planner");
  await page.goto("/quests/q/lights-out");
  await expect(page).toHaveTitle("Lights Out! | LoreRim Planner");
});

test("a player's page says characters: the title, the tabs and the count; the card is the home card", async ({ page }) => {
  await page.goto(`/u/${TEST_USER_HANDLE}`);
  await expect(page).toHaveTitle(/Test Author's characters/);
  await expect(page.getByRole("tab", { name: /^Characters/ })).toBeVisible();
  await expect(page.getByRole("tab", { name: /^Liked/ })).toBeVisible();
  await expect(page.getByText("Builds by")).toHaveCount(0);
  const card = page.getByRole("link").filter({ has: page.getByRole("heading", { name: "Test Shield-Wall" }) });
  await expect(card).toHaveAttribute("href", /\/b\//);
  await expect(card).toContainText("Test Author");
  await page.screenshot({ path: "test-results/wo161-player-1440.png", fullPage: true });
});

test("My characters signed out; Characters is a grid of the same card", async ({ page }) => {
  await page.goto("/me");
  await expect(page.getByRole("heading", { level: 1, name: "My characters" })).toBeVisible();
  await expect(page.getByText("Sign in to see the characters you have made.")).toBeVisible();
  await page.goto("/characters?version=all");
  await expect(page.getByRole("link").filter({ has: page.getByRole("heading", { name: "Test Shield-Wall" }) })).toBeVisible();
  await page.screenshot({ path: "test-results/wo161-characters-1440.png", fullPage: true });
  await page.setViewportSize({ width: 390, height: 900 });
  await page.reload();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
  await page.screenshot({ path: "test-results/wo161-characters-390.png", fullPage: true });
});

test("a new playthrough, signed out, says what a playthrough is above Sign in", async ({ page }) => {
  await page.goto("/playthroughs/new");
  await expect(page.getByText(/plans a character's run through the game in acts, each with a goal, a place and its quests/)).toBeVisible();
  await expect(page.getByRole("button", { name: /Sign in/ }).last()).toBeVisible();
});

test("search results carry the kind and say why in plain words", async ({ page }) => {
  await page.goto("/search?q=Brynjolf");
  const people = page.getByRole("region", { name: "People" });
  await expect(people.getByText("Person", { exact: true }).first()).toBeVisible();
  await expect(people).toContainText("Matches the name");
  await expect(people.locator("img").first()).toBeVisible();
  await expect(page.getByRole("region", { name: "Quests" }).getByText("Quest", { exact: true }).first()).toBeVisible();
  await expect(page.locator("main")).not.toContainText("Its name");
  await page.screenshot({ path: "test-results/wo161-search-1440.png", fullPage: true });
});

test("Everything that changed: the newest day open, older days folded with their counts, and a filter by kind", async ({ page }) => {
  await page.goto("/changes");
  const days = page.locator("details");
  expect(await days.count()).toBeGreaterThan(0);
  await expect(days.first()).toHaveAttribute("open", "");
  for (let i = 1; i < (await days.count()); i++) await expect(days.nth(i)).not.toHaveAttribute("open", "");
  await expect(days.first().locator("summary")).toContainText(/\d+ changes?/);
  const nav = page.getByRole("navigation", { name: "Filter by kind" });
  await expect(nav.getByRole("link")).toHaveText([/^Everything/, /^Quests/, /^Quest lines/, /^Player reports/]);
  await nav.getByRole("link", { name: /^Quest lines/ }).click();
  await expect(page).toHaveURL(/kind=line$/);
  await expect(page.locator("main").getByRole("link", { name: "The main quest" })).toBeVisible();
  await page.screenshot({ path: "test-results/wo161-changes-1440.png", fullPage: true });
});

test("New in the world: a line has its own icon and a line of words about it, not the same sentence on every row", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const rows = page.locator("section[aria-labelledby=new]");
  const sentences = await rows.locator("span[class*=what]").allInnerTexts();
  expect(new Set(sentences).size).toBeGreaterThan(1);
  await expect(rows.locator('img[src="/icons/quest-main-stories.svg"]').first()).toBeVisible();
});

test("People: picking a town applies it, with no Show button", async ({ page }) => {
  await page.goto("/people");
  await expect(page.getByRole("button", { name: "Show", exact: true })).toHaveCount(0);
  await page.getByRole("combobox", { name: "Town" }).selectOption({ label: /Whiterun/ as unknown as string }).catch(async () => {
    const options = await page.getByRole("combobox", { name: "Town" }).locator("option").allInnerTexts();
    const value = options.find((o) => o.startsWith("Whiterun"))!;
    await page.getByRole("combobox", { name: "Town" }).selectOption({ label: value });
  });
  await expect(page).toHaveURL(/town=Whiterun/);
  await expect(page.getByRole("heading", { name: "Whiterun", level: 2 })).toBeVisible();
});

test("a phone: the header's button says New beside the plus, and the back button and search box are the content's width, one above the other", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/people/lydia");
  const add = page.getByRole("banner").getByRole("link", { name: "New character" });
  await expect(add).toContainText("+");
  await expect(add).toContainText("New");
  const back = (await page.locator("main").getByRole("link", { name: /^Back to / }).first().boundingBox())!;
  const search = (await page.locator("main").getByRole("combobox").first().locator("xpath=ancestor::div[contains(@class,'box')][1]").boundingBox())!;
  const main = (await page.locator("main").boundingBox())!;
  expect(back.y + back.height).toBeLessThanOrEqual(search.y + 1);
  expect(Math.abs(back.width - search.width)).toBeLessThanOrEqual(8);
  expect(back.width).toBeGreaterThan(main.width - 40 * 2);
  await page.screenshot({ path: "test-results/wo161-phone-390.png", clip: { x: 0, y: 0, width: 390, height: 360 } });
});
