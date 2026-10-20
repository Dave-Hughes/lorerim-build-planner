import { expect, test } from "@playwright/test";
import { signIn } from "./helpers";
import { AZREM_BUILD_ID, DESTINY_BUILD_ID } from "./seed";

test.use({ viewport: { width: 1512, height: 806 } });

test("the editor's Destiny control counts the points left at level 5, and taking one spends it", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/b/${DESTINY_BUILD_ID}/edit?level=5`);
  // Since WO-62 Destiny is the skill list's last row.
  const destiny = page.getByRole("button", { name: "Destiny", exact: true });
  await expect(destiny).toContainText("1 left");
  await destiny.click();
  await expect(destiny).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: /^Constitution, .*can take now/ }).click();
  await page.getByRole("complementary", { name: "Perk details" }).getByRole("button", { name: "Confirm" }).click();
  // No points left: the row says nothing (WO-62).
  await expect(destiny).not.toContainText("left");
  await expect(page.getByText("✓ Saved", { exact: true })).toBeVisible({ timeout: 15_000 });
});

test("Azrem's level 5 card has its own Destiny row, and the page a Destiny section", async ({ page }) => {
  await page.goto(`/b/${AZREM_BUILD_ID}?level=5`);
  const card = page.getByRole("region", { name: "Level 5", exact: true });
  const keys = await card.locator('[class*="changeKey"]').allTextContents();
  expect(keys).toContain("Destiny");
  const row = card.locator('[class*="changeRow"]').filter({ has: page.locator('[class*="destinyKey"]') });
  await expect(row).toContainText("Constitution");
  const section = page.getByRole("region", { name: "Destiny at level 5" });
  await expect(section).toBeVisible();
  await expect(section.getByRole("region", { name: "Destiny taken by level 5" })).toContainText("Constitution");
  // Destiny is no longer a chip among the perk trees.
  await expect(page.getByRole("region", { name: "Perks at level 5" }).getByRole("tab", { name: /^Destiny/ })).toHaveCount(0);
});
