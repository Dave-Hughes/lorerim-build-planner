import { expect, test } from "@playwright/test";
import { POWERS_BUILD_ID, PURE_MAGE_BUILD_ID } from "./seed";

test.use({ viewport: { width: 1440, height: 900 } });

/** Pure Mage's Spells section at level 57, 1440 wide, measured before WO-52 (one row per spell, three columns). */
const HEIGHT_BEFORE = 1655;

test("Pure Mage's section at level 57 is at most half its old height", async ({ page }) => {
  await page.goto(`/b/${PURE_MAGE_BUILD_ID}?level=57`);
  const section = page.getByRole("region", { name: "Spells and abilities at level 57" });
  await expect(section).toBeVisible();
  const height = Math.round((await section.boundingBox())!.height);
  console.log(`Spells and abilities at level 57: ${height}px, was ${HEIGHT_BEFORE}px`);
  expect(height).toBeLessThanOrEqual(HEIGHT_BEFORE / 2);
  // Artificer's Insight, from its perk.
  await expect(section.getByRole("group", { name: "Abilities" })).toContainText("Artificer's Insight");
});

test("a chip's tooltip opens on focus and shows where", async ({ page }) => {
  await page.goto(`/b/${POWERS_BUILD_ID}?level=25`);
  const section = page.getByRole("region", { name: "Spells and abilities at level 25" });
  // Rows: schools, then Abilities, then Shouts.
  const shouts = section.getByRole("group", { name: "Shouts" });
  await expect(shouts).toContainText("Slow Time 2 of 3 words");
  await expect(shouts).toContainText("Unrelenting Force 3 of 3 words");
  await shouts.getByText(/^Slow Time/).focus();
  const tip = page.getByRole("tooltip");
  await expect(tip).toContainText("Tiid Klo Ul: Time, Sand, Eternity");
  await expect(tip).toContainText("Where: Deepwood Redoubt");

  // A spell chip, and an ability from a perk.
  await section.getByRole("group", { name: "Restoration" }).getByText(/^Healing/).focus();
  await expect(page.getByRole("tooltip")).toContainText("Where: Known at the start");
  await section.getByRole("group", { name: "Abilities" }).getByText(/^War Cry/).focus();
  await expect(page.getByRole("tooltip")).toContainText("From the War Cry perk");
});

test.describe("at 2560", () => {
  test.use({ viewport: { width: 2560, height: 1440 } });
  test("the rail calls it Spells and abilities and counts spells, abilities and shouts", async ({ page }) => {
    await page.goto(`/b/${POWERS_BUILD_ID}?level=25`);
    // Flames, Healing, Fury; Aetherial Cloak, War Cry; Unrelenting Force, Slow Time.
    await expect(page.getByRole("navigation", { name: "On this page" }).getByRole("link", { name: /^Spells and abilities/ })).toContainText("7");
  });
});

test("the level card lists new abilities and new shouts", async ({ page }) => {
  await page.goto(`/b/${POWERS_BUILD_ID}?level=12`);
  const card12 = page.getByRole("region", { name: "Level 12", exact: true });
  await expect(card12).toContainText("New abilities");
  await expect(card12).toContainText("from the War Cry perk");
  await page.goto(`/b/${POWERS_BUILD_ID}?level=20`);
  const card20 = page.getByRole("region", { name: "Level 20", exact: true });
  await expect(card20).toContainText("New shouts");
  await expect(card20).toContainText("Unrelenting Force");
  await expect(card20).toContainText("3 of 3 words, High Hrothgar");
});
