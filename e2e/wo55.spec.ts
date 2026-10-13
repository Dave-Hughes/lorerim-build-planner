import { expect, test } from "@playwright/test";
import { KHAJIIT_BUILD_ID, PURE_MAGE_BUILD_ID } from "./seed";

test.use({ viewport: { width: 1440, height: 900 } });

test("a Khajiit build's shared page has Night Eye in Abilities at level 1, from the race", async ({ page }) => {
  await page.goto(`/b/${KHAJIIT_BUILD_ID}?level=1`);
  const abilities = page.getByRole("region", { name: "Spells and abilities at level 1" }).getByRole("group", { name: "Abilities" });
  await expect(abilities).toContainText("Night Eye");
  await abilities.getByText(/^Night Eye/).focus();
  await expect(page.getByRole("tooltip")).toContainText("From the Khajiit race");
  await expect(page.getByRole("region", { name: "Level 1", exact: true })).toContainText("from the Khajiit race");
});

test("an Altmer's race tooltip in the about bar lists Highborn and Weakness to Elements", async ({ page }) => {
  await page.goto(`/b/${PURE_MAGE_BUILD_ID}?level=1`);
  await page.getByRole("region", { name: "Character", exact: true }).getByText("Altmer", { exact: true }).hover();
  const tip = page.getByRole("tooltip").filter({ hasText: "Starts with" });
  await expect(tip).toContainText("Highborn");
  await expect(tip).toContainText("Weakness to Elements");
});
