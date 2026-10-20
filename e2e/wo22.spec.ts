import { expect, test } from "@playwright/test";
import { signIn } from "./helpers";
import { AZREM_BUILD_ID, GEAR_BUILD_ID, TEST_BUILD_ID } from "./seed";

test.use({ viewport: { width: 1440, height: 900 } });

test("gear set at one level carries on, and a later change shows from its own level", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/b/${GEAR_BUILD_ID}/edit?level=2`);
  const gear = page.getByRole("region", { name: "Gear" });
  // No gear yet: only Add gear.
  await expect(gear.getByRole("listitem")).toHaveCount(0);
  await gear.getByRole("button", { name: "Add gear" }).click();
  await gear.getByRole("combobox", { name: "Type" }).selectOption("Main hand");
  await gear.getByRole("combobox", { name: "Item" }).fill("Iron sword");
  await gear.getByRole("button", { name: "Add", exact: true }).click();
  await expect(gear.getByRole("listitem")).toContainText("Iron sword");
  await expect(gear.getByRole("button", { name: "Undo Iron sword (Main hand)" })).toBeVisible();

  await page.getByRole("button", { name: "Level 5" }).click();
  await expect(gear).toContainText("Iron sword, since level 2");
  await gear.getByRole("button", { name: "Change Iron sword (Main hand)" }).click();
  await gear.getByRole("combobox", { name: "Item" }).fill("Steel spear");
  await gear.getByRole("textbox", { name: "Note (optional)" }).fill("Bought in Whiterun");
  await gear.getByRole("button", { name: "Save" }).click();
  await expect(gear).toContainText("Steel spear");
  await expect(page.getByText("✓ Saved", { exact: true })).toBeVisible();

  await page.goto(`/b/${GEAR_BUILD_ID}?level=3`);
  await expect(page.getByRole("region", { name: "Gear at level 3" })).toContainText("Iron sword");
  await expect(page.getByRole("region", { name: "Level 3", exact: true })).not.toContainText("Iron sword");
  await page.goto(`/b/${GEAR_BUILD_ID}?level=5`);
  const card = page.getByRole("region", { name: "Level 5", exact: true });
  // WO-32, WO-82: "New gear", the type, the piece in a chip, and what it replaces.
  await expect(card).toContainText("Main hand: Steel spear, replaces Iron sword");
  await expect(page.getByRole("region", { name: "Gear at level 5" })).toContainText("Steel spear");
});

test("Empty from here and Undo", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/b/${GEAR_BUILD_ID}/edit?level=6`);
  const gear = page.getByRole("region", { name: "Gear" });
  await gear.getByRole("button", { name: /^Empty .* \(Main hand\) from here$/ }).click();
  await expect(gear).toContainText(/\(Main hand\) removed/);
  await gear.getByRole("button", { name: /^Undo .* \(Main hand\) removed$/ }).click();
  await expect(gear).toContainText("since level");
});

test("the old Gear page goes to the editor, and ?tab=gear opens Levels", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/b/${TEST_BUILD_ID}/gear`);
  await expect(page).toHaveURL(new RegExp(`/b/${TEST_BUILD_ID}/edit`));
  await page.goto(`/b/${TEST_BUILD_ID}?tab=gear`);
  await expect(page.getByRole("tab", { name: /^Levels/ })).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tab", { name: /^Gear/ })).toHaveCount(0);
});

test("existing gear shows under the new slot names", async ({ page }) => {
  await page.goto(`/b/${AZREM_BUILD_ID}?level=8`);
  const at = page.getByRole("region", { name: "Gear at level 8" });
  await expect(at).toContainText("Main hand");
  await expect(at).toContainText("Steel spear");
  await expect(at).toContainText("Off hand");
  await expect(at).toContainText("Leather shield");
  // Into an empty slot: the slot alone, no "replaces nothing" (WO-73 point 5).
  const card = page.getByRole("region", { name: "Level 8", exact: true });
  await expect(card).toContainText("Ammo");
  await expect(card).not.toContainText("replaces nothing");
});
