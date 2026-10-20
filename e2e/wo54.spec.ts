import { expect, test } from "@playwright/test";
import { signIn } from "./helpers";
import { POWERS_BUILD_ID, SEVARI_BUILD_ID } from "./seed";

test.use({ viewport: { width: 1440, height: 900 } });

test("a made ring with Fortify Magicka (Rank I) picked from the game's list: the card shows its name, text and the base-values line", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/b/${POWERS_BUILD_ID}/edit?level=36`);
  const gear = page.getByRole("region", { name: "Gear" });
  await gear.getByRole("button", { name: "Add gear" }).click();
  const form = page.getByRole("form", { name: "Add gear" });
  await form.getByLabel("Type").selectOption("Ring");
  await form.getByRole("combobox", { name: "Item" }).fill("Gold Ring");
  await form.getByLabel("Made by you").check();
  const line = form.getByRole("combobox", { name: "Enchantment 1" });
  await line.fill("magicka");
  const options = form.getByRole("listbox", { name: "Enchantments" });
  await expect(options.getByRole("option", { name: /^Fortify Magicka \(Rank I\)/ })).toBeVisible();
  // Weapon enchantments don't fit a ring.
  await expect(options.getByRole("option", { name: /^Absorb Magicka/ })).toHaveCount(0);
  await options.getByRole("option", { name: /^Fortify Magicka \(Rank I\)/ }).click();
  await expect(line).toHaveValue("Fortify Magicka (Rank I)");
  await form.getByRole("button", { name: "Add", exact: true }).click();
  await expect(page.getByText("✓ Saved", { exact: true })).toHaveCount(0);
  await expect(page.getByText("✓ Saved", { exact: true })).toBeVisible({ timeout: 15_000 });

  await page.goto(`/b/${POWERS_BUILD_ID}?level=36`);
  await page.getByRole("region", { name: "Gear at level 36" }).getByRole("button", { name: /^Gold Ring, level/ }).click();
  const card = page.getByRole("dialog", { name: "Gold Ring" });
  await expect(card).toContainText("Fortify Magicka (Rank I)");
  await expect(card).toContainText("Magicka increases by 20.");
  await expect(card).toContainText("Disenchant:");
  await expect(card).toContainText("Numbers are the game's base values. What you make depends on your Enchanting skill, perks and soul gem.");
});

test("the enchantment picked isn't offered again on the next line, and Esc closes the list, not the form", async ({ page, context }) => {
  await signIn(context);
  // Sevari's 76 to 100 holds Enchantment Mastery, so a second line is open (WO-72).
  await page.goto(`/b/${SEVARI_BUILD_ID}/edit?level=100`);
  await page.getByRole("region", { name: "Gear" }).getByRole("button", { name: "Add gear" }).click();
  const form = page.getByRole("form", { name: "Add gear" });
  await form.getByLabel("Type").selectOption("Ring");
  await form.getByRole("combobox", { name: "Item" }).fill("Gold Ring");
  await form.getByLabel("Made by you").check();
  await form.getByRole("combobox", { name: "Enchantment 1" }).fill("magicka");
  const options = form.getByRole("listbox", { name: "Enchantments" });
  await options.getByRole("option", { name: /^Fortify Magicka \(Rank I\)/ }).click();
  await form.getByRole("combobox", { name: "Enchantment 2" }).fill("fortify magicka");
  await expect(form.getByRole("option", { name: /^Fortify Magicka \(Rank I\)/ })).toHaveCount(0);
  await expect(options.getByRole("option", { name: /^Fortify Magicka \(Rank II\)/ })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(form.getByRole("listbox", { name: "Enchantments" })).toHaveCount(0);
  await expect(form).toBeVisible();
});
