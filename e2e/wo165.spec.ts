/**
 * WO-165: the quest and person pages get the At a glance band and the colours of the line and place pages; a person's day as a strip; Not sure
 * yet lists only what the checker marked unsure; a contents rail on a page taller than two screens.
 */
import { expect, test } from "@playwright/test";

for (const width of [1440, 390]) {
  test(`The Golden Claw at ${width}: At a glance with how it starts, level and danger, where it takes you, rewards and the ways, and the Rewards box stays`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/quests/q/the-golden-claw");
    const glance = page.getByRole("region", { name: "At a glance" });
    for (const w of ["How it starts", "Level and danger", "Where it takes you", "Rewards", "Ways to finish it"]) await expect(glance).toContainText(w);
    await expect(glance).toContainText("Lucan Valerius");
    await expect(glance).toContainText("100 XP");
    await expect(glance).toContainText("3 ways");
    await expect(glance).toContainText("Bleak Falls Barrow");
    await expect(page.getByRole("region", { name: "Rewards" }).last()).toBeVisible();
    // A place named in a step is teal, a person orange.
    const place = page.getByRole("region", { name: "How to start it" }).getByRole("link", { name: "Bleak Falls Barrow" }).first();
    expect(await place.evaluate((el) => getComputedStyle(el).color)).toBe("rgb(159, 211, 225)");
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
    await page.screenshot({ path: `test-results/wo165-golden-claw-${width}.png`, fullPage: true });
  });

  test(`Lights Out! at ${width}: the band`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/quests/q/lights-out");
    const glance = page.getByRole("region", { name: "At a glance" });
    await expect(glance).toContainText("How it starts");
    await expect(glance).toContainText("Jaree-Ra");
    await expect(glance).toContainText("5 ways");
    await page.screenshot({ path: `test-results/wo165-lights-out-${width}.png`, fullPage: true });
  });

  test(`Aela the Huntress at ${width}: At a glance, her day as a strip, and Not sure yet lists only what the checker marked unsure`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/people/aela-the-huntress");
    const glance = page.getByRole("region", { name: "At a glance" });
    for (const w of ["Where to find them", "What they are", "Follows you", "Quests"]) await expect(glance).toContainText(w);
    await expect(glance).toContainText("Jorrvaskr");
    const strip = page.getByRole("img", { name: /^Through the day:/ });
    await expect(strip).toBeVisible();
    expect(await strip.locator('[class*="stripBar"] i').count()).toBe(24);
    const sure = page.getByRole("region", { name: "Information Confidence" });
    await expect(sure).toContainText("What they train");
    await expect(sure).toContainText("How they join you");
    await expect(sure).toContainText("How they fight");
    // Not every field the template has: Aela's quests, day and can-die were settled.
    await expect(sure.getByRole("list").first().getByRole("listitem")).toHaveCount(3);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
    await page.screenshot({ path: `test-results/wo165-aela-${width}.png`, fullPage: true });
  });

  test(`Lydia at ${width}: the band, and one place all day is no strip`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/people/lydia");
    await expect(page.getByRole("region", { name: "At a glance" })).toContainText("Dragonsreach");
    await expect(page.getByRole("img", { name: /^Through the day:/ })).toHaveCount(0);
    await page.screenshot({ path: `test-results/wo165-lydia-${width}.png`, fullPage: true });
  });
}

test("a contents rail on a page taller than two screens, and none on a short one", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 700 });
  await page.goto("/quests/q/the-golden-claw");
  const toc = page.getByRole("navigation", { name: "On this page" });
  await expect(toc).toBeVisible();
  await expect(toc.getByRole("link", { name: "How to start it" })).toBeVisible();
  await toc.getByRole("link", { name: "Where it takes you" }).click();
  await expect(page.getByRole("heading", { name: "Where it takes you", level: 2 })).toBeInViewport();
  await page.setViewportSize({ width: 1440, height: 5000 });
  await page.reload();
  await expect(page.getByRole("navigation", { name: "On this page" })).toHaveCount(0);
});
