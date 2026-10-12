import { expect, test } from "@playwright/test";
import { PURE_MAGE_BUILD_ID } from "./seed";

test.use({ viewport: { width: 1440, height: 900 } });

test("gear notes show on the level, the gear cards and the timeline", async ({ page }) => {
  await page.goto(`/b/${PURE_MAGE_BUILD_ID}?level=5`);
  const card = page.getByRole("region", { name: "Level 5", exact: true });
  await expect(card.getByText("On the Altar of Magnus.", { exact: true })).toBeVisible();
  await expect(card.getByText("Leaning on a tree above the sabre cat cave near the Thalmor Embassy.", { exact: true })).toBeVisible();

  // The main hand's card: the item's stats, then the note on its own line.
  const gear = page.getByRole("region", { name: "Gear at level 5" });
  const mainHand = gear.getByRole("listitem").filter({ hasText: "Main hand" });
  await expect(mainHand).toContainText("Staff of Fireball");
  await expect(mainHand).toContainText(/Staff, [\d.]+ damage, [\d.]+ weight/);
  await expect(mainHand.getByText("On the Altar of Magnus.", { exact: true })).toBeVisible();

  // The timeline bar's title and label carry the note after the levels.
  const bar = gear.getByRole("link", { name: /^Staff of Fireball, levels 5 to \d+\. On the Altar of Magnus\.$/ });
  await expect(bar).toHaveCount(1);
  await expect(bar).toHaveAttribute("title", /^Staff of Fireball, levels 5 to \d+\. On the Altar of Magnus\.$/);
});
