import { expect, test } from "@playwright/test";
import { IRIEL_BUILD_ID } from "./seed";

test.use({ viewport: { width: 1440, height: 900 } });

test("folder tabs with icons; once scrolled away, small tabs in the pinned bar switch tabs; arrows move between tabs", async ({ page }) => {
  await page.goto(`/b/${IRIEL_BUILD_ID}?level=10`);
  const tabs = page.getByRole("tablist", { name: "Build sections" });
  await expect(tabs.locator('img[src="/icons/tab-levels.svg"]')).toBeVisible();
  await expect(tabs.locator('img[src="/icons/tab-guide.svg"]')).toBeVisible();
  const levels = tabs.getByRole("tab", { name: /^Levels/ });
  await expect(levels).toHaveAttribute("aria-selected", "true");
  // Keyboard: the arrows move between the tabs.
  await levels.focus();
  await page.keyboard.press("ArrowRight");
  await expect(tabs.getByRole("tab", { name: /^Guide/ })).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("ArrowLeft");
  await expect(levels).toHaveAttribute("aria-selected", "true");

  await page.getByRole("region", { name: "Perks at level 10" }).scrollIntoViewIfNeeded();
  const pinned = page.getByRole("region", { name: "Pinned bar" });
  await expect(pinned.getByRole("button", { name: "Levels" })).toHaveAttribute("aria-pressed", "true");
  await pinned.getByRole("button", { name: "Guide" }).click();
  await expect(tabs.getByRole("tab", { name: /^Guide/ })).toHaveAttribute("aria-selected", "true");
});
