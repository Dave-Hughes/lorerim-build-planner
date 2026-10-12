import { expect, test } from "@playwright/test";
import { PURE_MAGE_BUILD_ID } from "./seed";

test.use({ viewport: { width: 1440, height: 900 } });

test("the build page's section titles are h2 headings", async ({ page }) => {
  await page.goto(`/b/${PURE_MAGE_BUILD_ID}?level=11`);
  for (const name of ["Attributes", "Skills", "Perks", "Gear", "Spells"])
    await expect(page.getByRole("heading", { level: 2, name: `${name} at level 11` })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Destiny" })).toBeVisible();
  // The level card's title stays the largest.
  const size = async (name: string | RegExp) => parseFloat(await page.getByRole("heading", { name }).first().evaluate((el) => getComputedStyle(el).fontSize));
  expect(await size("Level 11")).toBeGreaterThan(await size("Gear at level 11"));
  // An accessibility snapshot lists them as level-2 headings.
  const tree = await page.locator("main").ariaSnapshot();
  for (const name of ["Attributes", "Skills", "Perks", "Gear", "Spells"]) expect(tree).toContain(`heading "${name} at level 11" [level=2]`);
});
