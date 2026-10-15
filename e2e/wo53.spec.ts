import { expect, test, type Page } from "@playwright/test";
import { signIn } from "./helpers";
import { FORTY_BUILD_ID, SEVARI_BUILD_ID } from "./seed";

/** Add gear, a made Silver Ring: the form. */
async function addRing(page: Page) {
  await page.getByRole("region", { name: "Gear" }).getByRole("button", { name: "Add gear" }).click();
  const form = page.getByRole("form", { name: "Add gear" });
  await form.getByLabel("Type").selectOption("Ring");
  await form.getByRole("combobox", { name: "Item" }).fill("Silver Ring");
  await form.getByLabel("Made by you").check();
  return form;
}

test.use({ viewport: { width: 1440, height: 900 } });

test("a made ring: each enchantment field appears after the last, as far as the perks allow (WO-72)", async ({ page, context }) => {
  await signIn(context);
  // Level 34 holds neither enchanting perk: one line, and the second's rule in a tooltip.
  await page.goto(`/b/${FORTY_BUILD_ID}/edit?level=34`);
  let form = await addRing(page);
  const line = (n: number) => form.getByRole("combobox", { name: `Enchantment ${n}` });
  await expect(line(1)).toBeVisible();
  await expect(line(2)).toHaveCount(0);
  await line(1).fill("Fortify Magicka 40");
  await expect(line(2)).toHaveCount(0);
  await form.getByText("Enchantment 2", { exact: true }).hover();
  await expect(page.getByRole("tooltip")).toHaveText("Two enchantments need Enchantment Mastery.");

  // Sevari's 76 to 100 holds Enchantment Mastery and Artifact Enchanter: three lines, one after another.
  // (The rules' own check of a third line without the perk is in src/lib/rules/gear.test.ts.)
  await page.goto(`/b/${SEVARI_BUILD_ID}/edit?level=100`);
  form = await addRing(page);
  await expect(line(1)).toBeVisible();
  await expect(line(2)).toHaveCount(0);
  await line(1).fill("Fortify Magicka 40");
  await expect(line(2)).toBeVisible();
  await expect(line(3)).toHaveCount(0);
  await line(2).fill("Fortify Destruction 20%");
  await expect(line(3)).toBeVisible();
  await expect(form.getByText("Enchantment 4", { exact: true })).toHaveCount(0);
});
