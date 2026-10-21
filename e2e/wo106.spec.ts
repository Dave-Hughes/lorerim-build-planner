/**
 * WO-106: the Become the Dragonborn story page (FEATURE_QUESTS on, the main server). Since WO-115
 * (20 Oct) it carries no player context: no next step, no Mark done, no marks against where you are.
 */
import { expect, test, type Page } from "@playwright/test";

test.use({ viewport: { width: 1440, height: 900 } });

async function open(page: Page) {
  await page.goto("/quests/s/become-the-dragonborn");
  await expect(page.getByRole("heading", { level: 1, name: "Become the Dragonborn" })).toBeVisible();
}

test("the story page is facts: how it starts, its chapters and what it opens, with no progress", async ({ page }) => {
  await open(page);
  await expect(page.getByRole("region", { name: "Your next step" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Mark done" })).toHaveCount(0);
  await expect(page.getByRole("region", { name: "How it starts" })).toContainText("Take a Dragonborn start");
  await expect(page.getByRole("region", { name: "The story" })).toContainText("19 quests");
  await expect(page.getByRole("region", { name: "The story" })).not.toContainText("quests done");

  const dragonborn = page.getByRole("list", { name: "Needs for Dragonborn" }).getByRole("listitem");
  await expect(dragonborn.filter({ hasText: "The Way of the Voice" })).toBeVisible();
  const lvl25 = dragonborn.filter({ hasText: "Level 25" });
  await expect(lvl25).toContainText("not checked yet");
  await expect(dragonborn.filter({ hasText: "Or sail to Raven Rock" })).toBeVisible();
  await expect(page.getByRole("list", { name: "Needs for Dragonborn" }).getByLabel("Done")).toHaveCount(0);
  await expect(page.getByRole("list", { name: "Needs for Wyrmstooth" }).getByRole("listitem").filter({ hasText: "Level 10" })).toBeVisible();
});

test("later chapters stay hidden until Show the rest; the main stories card and line page link to the story", async ({ page }) => {
  await open(page);
  const story = page.getByRole("region", { name: "The story" });
  await expect(story.getByRole("heading", { name: "Chapter 7" })).toBeVisible();
  await expect(story.getByText("Defeat Alduin")).toHaveCount(0);
  await story.getByRole("button", { name: "Show the rest" }).click();
  await expect(story.getByText("Defeat Alduin")).toBeVisible();

  await page.goto("/quests/c/main-stories");
  await page.getByRole("link", { name: "Become the Dragonborn" }).click();
  await expect(page).toHaveURL(/\/quests\/s\/become-the-dragonborn$/);
  await page.goto("/quests/main-quest");
  await page.getByRole("link", { name: "Read it as a story ›" }).click();
  await expect(page).toHaveURL(/\/quests\/s\/become-the-dragonborn$/);
});
