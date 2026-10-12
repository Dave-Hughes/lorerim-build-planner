import { expect, test } from "@playwright/test";
import { signIn } from "./helpers";
import { FORTY_BUILD_ID } from "./seed";

test.use({ viewport: { width: 1440, height: 900 } });

test("a staff made by you from level 40: the hammer mark and its tooltip", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/b/${FORTY_BUILD_ID}/edit?level=40`);
  const gear = page.getByRole("region", { name: "Gear" });
  // Main hand carries over from level 1: change it from here.
  await gear.getByRole("button", { name: "Change Main hand" }).click();
  const form = page.getByRole("form", { name: "Change Main hand" });
  await form.getByRole("combobox", { name: "Item" }).fill("Apprentice's Staff");
  await form.getByLabel("Made by you").check();
  await form.getByRole("combobox", { name: "Spell" }).fill("Forbidden Sun");
  await expect(form).toContainText("Staff of Forbidden Sun");
  await form.getByRole("button", { name: "Save" }).click();
  await expect(gear).toContainText("Staff of Forbidden Sun");
  await expect(page.getByText("Saved", { exact: true })).toBeVisible({ timeout: 15_000 });

  await page.goto(`/b/${FORTY_BUILD_ID}?level=40`);
  const card = page.getByRole("region", { name: "Level 40", exact: true });
  await expect(card).toContainText("Staff of Forbidden Sun");
  await card.getByLabel("Made by you").hover();
  const tip = page.getByRole("tooltip").filter({ hasText: "Made by you" });
  await expect(tip).toContainText("Apprentice's Staff");
  await expect(tip).toContainText("Spell: Forbidden Sun");
  await expect(page.getByRole("region", { name: "Gear at level 40" }).getByLabel("Made by you")).toBeVisible();
});
