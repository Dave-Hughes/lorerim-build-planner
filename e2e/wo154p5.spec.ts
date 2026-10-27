/**
 * WO-154 Part 5: one Characters page in place of Builds and Playthroughs. A character is a build and, if it has a listed run, the run's
 * acts on its card; "Has a playthrough" narrows the list; /playthroughs goes there.
 */
import { expect, test } from "@playwright/test";
import { LISTED_CHARACTER_RUN_ID } from "./seed";

test("the menu has Characters and no Playthroughs; the page lists builds, and a card with a listed run shows where the run stands", async ({ page }) => {
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Site" });
  await expect(nav.getByRole("link", { name: "Characters" })).toHaveAttribute("href", "/");
  await expect(nav.getByRole("link", { name: "Playthroughs" })).toHaveCount(0);
  await expect(nav.getByRole("link", { name: "Builds" })).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1, name: "Characters" })).toBeVisible();
  const ranger = page.getByRole("article").filter({ hasText: "Part Five Ranger" });
  await expect(ranger.getByText("Where the run stands")).toBeVisible();
  await expect(ranger).toContainText("Act II The Rift");
  await expect(ranger.getByRole("link", { name: "Play ›" })).toHaveAttribute("href", `/p/${LISTED_CHARACTER_RUN_ID}`);
  // A build with no run shows no run box on the public page.
  const plain = page.getByRole("article").filter({ hasText: "Test Shield-Wall" });
  await expect(plain).toBeVisible();
  await expect(plain.getByText("Where the run stands")).toHaveCount(0);
  await expect(plain.getByText("Build alone")).toHaveCount(0);
});

test("Has a playthrough narrows the list to characters with a listed run, and keeps the other filters", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Playthrough").selectOption("run");
  await expect(page).toHaveURL(/run=1/);
  await expect(page.getByRole("article").filter({ hasText: "Part Five Ranger" })).toBeVisible();
  await expect(page.getByRole("article").filter({ hasText: "Test Shield-Wall" })).toHaveCount(0);
  // Search still works within it.
  await page.getByRole("main").getByLabel("Search").fill("nobody has this");
  await expect(page.getByText("No characters match.")).toBeVisible();
});

test("/playthroughs goes to the Characters page with the filter on; the run's own page stays where it is", async ({ page }) => {
  await page.goto("/playthroughs");
  await expect(page).toHaveURL(/\/\?run=1$/);
  await expect(page.getByLabel("Playthrough")).toHaveValue("run");
  expect((await page.goto(`/p/${LISTED_CHARACTER_RUN_ID}`))?.status()).toBe(200);
});

test("screenshots: Characters, and with a playthrough, at 1440 and 390", async ({ page }) => {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
    await page.screenshot({ path: `test-results/wo154p5-characters-${width}.png`, fullPage: true });
    await page.goto("/?run=1");
    await page.screenshot({ path: `test-results/wo154p5-characters-run-${width}.png`, fullPage: true });
  }
});
