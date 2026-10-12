import { expect, test } from "@playwright/test";
import { PURE_MAGE_BUILD_ID } from "./seed";

test.use({ viewport: { width: 1440, height: 900 } });

test("gear is the timeline; a bar opens its card, Esc closes it, Go to level moves", async ({ page }) => {
  await page.goto(`/b/${PURE_MAGE_BUILD_ID}?level=34`);
  const gear = page.getByRole("region", { name: "Gear at level 34" });
  await expect(gear.getByRole("listitem")).toHaveCount(0);

  const robes = gear.getByRole("button", { name: /^Arch-Mage Robes, levels 34/ });
  await robes.click();
  const card = page.getByRole("dialog", { name: "Arch-Mage Robes" });
  await expect(card).toContainText("Clothing, 1 weight");
  await expect(card).toContainText("Finish the College questline.");
  await expect(card).toContainText("Levels 34 to 57, replaces College Robes");
  await expect(card.getByRole("button", { name: "Go to level 34" })).toBeVisible();
  await expect(card).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(card).toHaveCount(0);
  await expect(robes).toBeFocused();

  // Clicking the same bar again closes it; another bar's card replaces it.
  await robes.click();
  await robes.click();
  await expect(card).toHaveCount(0);

  // Keyboard: Enter opens Morokei's card; Go to level 32 moves the page there.
  const morokei = gear.getByRole("button", { name: /^Morokei, levels 32/ });
  await morokei.focus();
  await page.keyboard.press("Enter");
  const helm = page.getByRole("dialog", { name: "Morokei" });
  await expect(helm).toBeVisible();
  await helm.getByRole("button", { name: "Go to level 32" }).click();
  await expect(page.getByRole("region", { name: "Gear at level 32" })).toBeVisible();
  await expect(page).toHaveURL(/level=32/);
});
