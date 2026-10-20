/**
 * WO-83: each gear type's own icon, in the editor, the level card's New gear row and the gear
 * timeline. Free-text gear on the card keeps the plain satchel (WO-46).
 */
import { expect, test, type Locator } from "@playwright/test";
import { signIn } from "./helpers";
import { GEAR83_BUILD_ID } from "./seed";

test.use({ viewport: { width: 1440, height: 900 } });

/** The icon, 16px (or the card's 24px), beside a label or the piece it's for. */
async function icon(scope: Locator, file: string, text: string, size = 16) {
  const img = scope.locator(`img[src="/icons/${file}.svg"]`).filter({ visible: true }).first();
  await expect(img).toBeVisible();
  await expect(img).toHaveAttribute("width", String(size));
  await expect(img.locator("xpath=..")).toContainText(text);
}

test("a Cloak and a Lantern show their own icons in the editor, the level card and the timeline; free text keeps the satchel", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/b/${GEAR83_BUILD_ID}/edit?level=2`);
  const gear = page.getByRole("region", { name: "Gear" });
  for (const [type, query, pick] of [
    ["Cloak", "Fur Cape", "Fur Cape"],
    ["Lantern", "Lantern", "Trader's Resource & Lantern"],
  ] as const) {
    await gear.getByRole("button", { name: "Add gear" }).click();
    await gear.getByRole("combobox", { name: "Type" }).selectOption(type);
    await gear.getByRole("combobox", { name: "Item" }).fill(query);
    await gear.getByRole("listbox", { name: "Items" }).getByRole("option", { name: new RegExp(`^${pick.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`) }).first().click();
    await gear.getByRole("button", { name: "Add", exact: true }).click();
  }
  // Free text: nothing picked from the list.
  await gear.getByRole("button", { name: "Add gear" }).click();
  await gear.getByRole("combobox", { name: "Type" }).selectOption("Accessory");
  await gear.getByRole("combobox", { name: "Item" }).fill("Lucky river stone");
  await gear.getByRole("textbox", { name: "Note (optional)" }).click();
  await gear.getByRole("button", { name: "Add", exact: true }).click();
  await expect(gear).toContainText("Lucky river stone");
  await expect(page.getByText("✓ Saved", { exact: true })).toBeVisible({ timeout: 15_000 });

  // The editor's gear rows: each type's label with its icon.
  await icon(gear, "slot-cloak", "Cloak");
  await icon(gear, "slot-lantern", "Lantern");

  await page.goto(`/b/${GEAR83_BUILD_ID}?level=2`);
  // The level card's New gear row, at 24px.
  const card = page.getByRole("region", { name: "Level 2", exact: true });
  await icon(card, "slot-cloak", "Fur Cape", 24);
  await icon(card, "slot-lantern", "Trader's Resource & Lantern", 24);
  await icon(card, "slot-other", "Lucky river stone", 24);
  // The gear timeline's rows.
  const at = page.getByRole("region", { name: "Gear at level 2" });
  await icon(at, "slot-cloak", "Cloak");
  await icon(at, "slot-lantern", "Lantern");
});
