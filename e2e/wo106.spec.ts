/**
 * WO-106: the Become the Dragonborn story page (FEATURE_QUESTS on, the main server). Where you are
 * is kept in the browser, so each test starts from nothing entered.
 */
import { expect, test, type Page } from "@playwright/test";

test.use({ viewport: { width: 1440, height: 900 } });

const where = (level: number, mainAt: string) => JSON.stringify({ level, mainAt, finished: [] });

async function open(page: Page, w: string) {
  await page.goto("/quests");
  await page.evaluate((v) => localStorage.setItem("quests:where", v), w);
  await page.goto("/quests/s/become-the-dragonborn");
  await expect(page.getByRole("heading", { level: 1, name: "Become the Dragonborn" })).toBeVisible();
}

test("level 22, done up to The Way of the Voice: the Horn is next, 5 of 19 done, and what it opens is checked", async ({ page }) => {
  await open(page, where(22, "MQ105"));
  const next = page.getByRole("region", { name: "Your next step" });
  await expect(next.getByRole("link", { name: "The Horn of Jurgen Windcaller" })).toHaveAttribute("href", "/quests/main-quest#q-MQ105Ustengrav");
  await expect(next).toContainText("Starts as The Way of the Voice ends");
  await expect(next).toContainText("Retrieve the Horn of Jurgen Windcaller");
  await expect(page.getByRole("region", { name: "The story so far" })).toContainText("5 of 19 quests done");

  const dragonborn = page.getByRole("list", { name: "Needs for Dragonborn" }).getByRole("listitem");
  await expect(dragonborn.filter({ hasText: "The Way of the Voice" }).getByLabel("Done")).toBeVisible();
  const lvl25 = dragonborn.filter({ hasText: "Level 25" });
  await expect(lvl25.getByLabel("Not yet")).toBeVisible();
  await expect(lvl25).toContainText("not checked yet");
  await expect(lvl25).toContainText("You're 22");
  await expect(dragonborn.filter({ hasText: "Or sail to Raven Rock" }).getByLabel("Done")).toBeVisible();

  const wyrmstooth = page.getByRole("list", { name: "Needs for Wyrmstooth" }).getByRole("listitem");
  await expect(wyrmstooth.filter({ hasText: "Level 10" }).getByLabel("Done")).toBeVisible();
  await expect(wyrmstooth.filter({ hasText: "Rise in the East" }).getByLabel("Not yet")).toBeVisible();
});

test("Mark done moves on to A Blade in the Dark and updates Where you are's main quest", async ({ page }) => {
  await open(page, where(22, "MQ105"));
  const next = page.getByRole("region", { name: "Your next step" });
  await next.getByRole("button", { name: "Mark done" }).click();
  await expect(next.getByRole("link", { name: "A Blade in the Dark" })).toBeVisible();
  await expect(page.getByRole("region", { name: "The story so far" })).toContainText("6 of 19 quests done");
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem("quests:where") ?? "{}").mainAt);
  expect(stored).toBe("MQ105Ustengrav");
  await page.goto("/quests");
  await expect(page.getByRole("combobox", { name: "Main quest, done up to" })).toHaveValue("MQ105Ustengrav");
});

test("later chapters stay hidden until Show the rest; the main stories card and line page link to the story", async ({ page }) => {
  await open(page, where(22, "MQ105"));
  const sofar = page.getByRole("region", { name: "The story so far" });
  await expect(sofar.getByRole("heading", { name: "Chapter 7" })).toBeVisible();
  await expect(sofar.getByText("Defeat Alduin")).toHaveCount(0);
  await sofar.getByRole("button", { name: "Show the rest" }).click();
  await expect(sofar.getByText("Defeat Alduin")).toBeVisible();

  await page.goto("/quests/c/main-stories");
  await page.getByRole("link", { name: "Become the Dragonborn" }).click();
  await expect(page).toHaveURL(/\/quests\/s\/become-the-dragonborn$/);
  await page.goto("/quests/main-quest");
  await page.getByRole("link", { name: "Read it as a story ›" }).click();
  await expect(page).toHaveURL(/\/quests\/s\/become-the-dragonborn$/);
});

test("with nothing entered, the next step is Unbound with how it starts", async ({ page }) => {
  await page.goto("/quests/s/become-the-dragonborn");
  const next = page.getByRole("region", { name: "Your next step" });
  await expect(next.getByRole("link", { name: "Unbound" })).toBeVisible();
  await expect(next).toContainText("Take a Dragonborn start");
  await expect(next).not.toContainText("Starts as");
});
