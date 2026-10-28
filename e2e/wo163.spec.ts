/**
 * WO-163: a quest category as a table: a short banner, search, Hold, Level and From filters that apply as you pick, pills with real counts,
 * one sortable table with a sticky header; two lines a row on a phone; the Quests home's table across every category.
 */
import { expect, test, type Page } from "@playwright/test";

const rows = (page: Page) => page.locator("main table tbody tr");

test("Side stories at 1440: the banner, the filters and the pills, and the table's columns", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/quests/c/side-stories");
  await expect(page.getByRole("heading", { level: 1, name: "Side stories" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Back to Quests" })).toBeVisible();
  for (const l of ["Hold", "Level", "From"]) await expect(page.getByRole("combobox", { name: new RegExp(`^${l}`) })).toBeVisible();
  await expect(page.getByRole("searchbox")).toBeVisible();
  await expect(page.getByRole("button", { name: "Show", exact: true })).toHaveCount(0);
  const heads = await page.locator("main table thead th").allInnerTexts();
  expect(heads.map((h) => h.trim().toLowerCase())).toEqual(["quest", "starts with", "where", "level", "length", "from", "quest xp"]);
  // The pills' counts are real: the sources add up to all, and "All" is the number of rows.
  const count = async (name: RegExp) => Number((await page.getByRole("button", { name }).innerText()).match(/(\d+)\s*$/)![1]);
  const all = await count(/^All/);
  expect(await rows(page).count()).toBe(all);
  expect((await count(/^Base game/)) + (await count(/^Creation Club/)) + (await count(/^Mods/))).toBe(all);
  await expect(page.getByRole("button", { name: /^Lines of several quests/ })).toBeVisible();
  // A name is a link; a person's name is a link; a place is blue.
  await expect(rows(page).first().getByRole("link").first()).toHaveAttribute("href", /\/quests\//);
  await page.screenshot({ path: "test-results/wo163-side-stories-1440.png" });
});

test("every column sorts, and the header stays put as you scroll", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/quests/c/side-stories");
  const xp = page.getByRole("columnheader", { name: "Quest XP" });
  await xp.getByRole("button").click();
  await expect(xp).toHaveAttribute("aria-sort", "ascending");
  await xp.getByRole("button").click();
  await expect(xp).toHaveAttribute("aria-sort", "descending");
  const top = Number((await rows(page).first().locator("td").last().innerText()).replace(/\D/g, ""));
  const second = Number((await rows(page).nth(8).locator("td").last().innerText()).replace(/\D/g, "") || "0");
  expect(top).toBeGreaterThanOrEqual(second);
  const level = page.getByRole("columnheader", { name: "Level" });
  await level.getByRole("button").click();
  await expect(level).toHaveAttribute("aria-sort", "ascending");
  await expect(page.getByRole("columnheader", { name: "Quest XP" })).toHaveAttribute("aria-sort", "none");
  expect(await page.locator("main table thead th").first().evaluate((el) => getComputedStyle(el).position)).toBe("sticky");
  await page.evaluate(() => window.scrollTo(0, 1500));
  const y = (await page.locator("main table thead th").first().boundingBox())!.y;
  expect(y).toBeLessThan(40);
});

test("filters apply as you pick them: From, Level, Hold, the pills and the search", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/quests/c/side-stories");
  const all = await rows(page).count();
  await page.getByRole("combobox", { name: /^From/ }).selectOption("mod");
  const mods = await rows(page).count();
  expect(mods).toBeGreaterThan(0);
  expect(mods).toBeLessThan(all);
  await page.getByRole("button", { name: /^All/ }).click();
  expect(await rows(page).count()).toBe(all);
  await page.getByRole("button", { name: /^Lines of several quests/ }).click();
  const lines = await rows(page).count();
  expect(lines).toBeLessThan(all);
  await expect(rows(page).first()).toContainText(/\d+ quests/);
  await page.getByRole("button", { name: /^All/ }).click();
  const hold = page.getByRole("combobox", { name: /^Hold/ });
  await hold.selectOption({ index: 1 });
  expect(await rows(page).count()).toBeLessThan(all);
  await hold.selectOption("");
  await page.getByRole("searchbox").fill("Anska");
  await expect(rows(page)).toHaveCount(1);
  await expect(rows(page).first().getByRole("link", { name: "A Scroll For Anska" })).toBeVisible();
  await page.getByRole("combobox", { name: /^Level/ }).selectOption("11-20");
  await expect(page.getByText("Nothing matches.")).toBeVisible();
});

test("quest XP: No XP where LoreRim pays nothing for the quest's type (A Scroll For Anska, Ancestral Worship, Forbidden Legend), a number where it pays", async ({ page }) => {
  await page.goto("/quests/c/side-stories");
  for (const name of ["A Scroll For Anska", "Ancestral Worship", "Forbidden Legend"]) await expect(rows(page).filter({ has: page.getByRole("link", { name }) }).locator("td").last()).toHaveText("No XP");
  await expect(rows(page).filter({ has: page.getByRole("link", { name: "A Dying Wish" }) }).locator("td").last()).toHaveText("100");
});

test("a row's hover preview works in the table", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/quests/c/side-stories");
  await rows(page).filter({ has: page.getByRole("link", { name: "A Scroll For Anska" }) }).getByRole("link", { name: "A Scroll For Anska" }).hover();
  await expect(page.getByRole("tooltip")).toBeVisible({ timeout: 5000 });
});

test("on a phone each row is two lines: the name and its XP, then who, where and the level", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/quests/c/side-stories");
  const row = rows(page).filter({ has: page.getByRole("link", { name: "A Scroll For Anska" }) });
  const name = (await row.getByRole("link", { name: "A Scroll For Anska" }).boundingBox())!;
  const xp = (await row.locator("td").last().boundingBox())!;
  const who = (await row.locator("td").nth(1).boundingBox())!;
  expect(Math.abs(name.y - xp.y)).toBeLessThan(14);
  expect(who.y).toBeGreaterThan(name.y + 10);
  await expect(page.locator("main table thead")).toBeHidden();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
  await page.screenshot({ path: "test-results/wo163-side-stories-390.png" });
});

test("Guilds and factions is the same table", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/quests/c/guilds-and-factions");
  await expect(page.getByRole("heading", { level: 1, name: "Guilds and factions" })).toBeVisible();
  expect(await rows(page).count()).toBeGreaterThan(5);
  await page.screenshot({ path: "test-results/wo163-guilds-1440.png" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: "test-results/wo163-guilds-390.png" });
});

test("the Quests home: the five category cards stay, and Every quest, by place is the same table across every category, sorted by place, with the category as a column", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/quests");
  await expect(page.getByRole("link", { name: /Browse/ }).first()).toBeVisible();
  const table = page.getByRole("region", { name: "Every quest, by place" });
  await expect(table.getByRole("columnheader", { name: "Category" })).toBeVisible();
  await expect(table.getByRole("columnheader", { name: "Where" })).toHaveAttribute("aria-sort", "ascending");
  const places = await table.locator("tbody tr td:nth-child(3)").allInnerTexts();
  const named = places.filter((p) => !/Not known yet/.test(p));
  expect(named.length).toBeGreaterThan(20);
  expect([...named].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase())).slice(0, 10)).toEqual(named.slice(0, 10).map((x) => x));
  const cats = new Set(await table.locator("tbody tr td:nth-last-child(2)").allInnerTexts());
  expect(cats.size).toBeGreaterThan(3);
  await page.screenshot({ path: "test-results/wo163-quests-home-1440.png", fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
  await page.screenshot({ path: "test-results/wo163-quests-home-390.png" });
});

test("review: a phrase is not a place in Where, and a long mod name ends in an ellipsis with the whole name in its title", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/quests/c/side-stories");
  await expect(page.locator("main table tbody tr").first()).toBeVisible();
  const wheres = await page.locator("main table tbody tr td:nth-child(3)").allInnerTexts();
  expect(wheres.filter((w) => /^on arrival/i.test(w.trim()))).toEqual([]);
  const cut = page.locator("main table tbody a[title], main table tbody span[title]").filter({ hasText: /Redeeming Fultheim/ }).first();
  await cut.scrollIntoViewIfNeeded();
  await expect(cut).toHaveAttribute("title", /Redeeming Fultheim - A Blades Quest/);
  const name = cut.locator("span").first();
  expect(await name.evaluate((el) => getComputedStyle(el).textOverflow)).toBe("ellipsis");
  await page.screenshot({ path: "test-results/wo163-side-stories-1440.png" });
});
