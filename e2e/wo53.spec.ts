import { expect, test } from "@playwright/test";
import { signIn } from "./helpers";
import { FORTY_BUILD_ID } from "./seed";

test.use({ viewport: { width: 1440, height: 900 } });

test("a made ring with three enchantments: each field appears after the last, and the level asks for Artifact Enchanter", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/b/${FORTY_BUILD_ID}/edit?level=34`);
  const gear = page.getByRole("region", { name: "Gear" });
  await gear.getByRole("button", { name: "Add gear" }).click();
  const form = page.getByRole("form", { name: "Add gear" });
  await form.getByLabel("Slot").selectOption("Ring");
  await form.getByRole("combobox", { name: "Item" }).fill("Silver Ring");
  await form.getByLabel("Made by you").check();

  const line = (n: number) => form.getByRole("textbox", { name: `Enchantment ${n}` });
  await expect(line(1)).toBeVisible();
  await expect(line(2)).toHaveCount(0);
  await line(1).fill("Fortify Magicka 40");
  await expect(line(2)).toBeVisible();
  await expect(line(3)).toHaveCount(0);
  await line(2).fill("Fortify Destruction 20%");
  await expect(line(3)).toBeVisible();
  await line(3).fill("Regenerate Magicka 50%");
  await form.getByRole("button", { name: "Add", exact: true }).click();
  await expect(page.getByText("Saved", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Saved", { exact: true })).toBeVisible({ timeout: 15_000 });

  await expect(page.getByText("Three enchantments need Artifact Enchanter, not taken by level 34.").first()).toBeVisible();
  await page.goto(`/b/${FORTY_BUILD_ID}?level=34`);
  await expect(page.getByRole("region", { name: "Level 34", exact: true })).toContainText("Three enchantments need Artifact Enchanter, not taken by level 34.");
});
