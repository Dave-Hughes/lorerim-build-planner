/**
 * WO-82: gear by type, any number at once. The type comes first, the search shows only that type,
 * Search every item drops the filter, and pieces add to what's worn unless they replace one.
 */
import { expect, test, type Locator, type Page } from "@playwright/test";
import { signIn } from "./helpers";
import { GEAR82_BUILD_ID } from "./seed";

test.use({ viewport: { width: 1440, height: 900 } });

/** Add gear: the type, then an item from the search (typed, then picked from the list). */
async function add(page: Page, gear: Locator, type: string, query: string, pick: string, opts: { keep?: boolean } = {}) {
  await gear.getByRole("button", { name: "Add gear" }).click();
  await gear.getByRole("combobox", { name: "Type" }).selectOption(type);
  await gear.getByRole("combobox", { name: "Item" }).fill(query);
  await gear.getByRole("listbox", { name: "Items" }).getByRole("option", { name: new RegExp(`^${pick}`) }).first().click();
  // A piece of a type already worn offers to replace it, ticked: untick to keep both.
  if (opts.keep) await gear.getByRole("checkbox", { name: /^Replaces / }).uncheck();
  await gear.getByRole("button", { name: "Add", exact: true }).click();
  await expect(gear.getByRole("listitem").filter({ hasText: pick }).first()).toBeVisible();
}

test("point 2 and 3: a Cloak (the search shows cloaks only), a Backpack and a second Accessory are all worn at the next level and on the card", async ({ page, context }) => {
  test.setTimeout(90_000);
  await signIn(context);
  await page.goto(`/b/${GEAR82_BUILD_ID}/edit?level=2`);
  const gear = page.getByRole("region", { name: "Gear" });

  // The type list, in order: the hands and ammunition, then LoreRim's types.
  await gear.getByRole("button", { name: "Add gear" }).click();
  const types = await gear.getByRole("combobox", { name: "Type" }).locator("option").allTextContents();
  expect(types.slice(0, 6)).toEqual(["Main hand", "Off hand", "Ammo", "Head", "Circlet", "Face"]);
  expect(types.at(-1)).toBe("Accessory");
  // Cloak: "fur" finds the fur capes and cloaks, never the fur armor or helmet.
  await gear.getByRole("combobox", { name: "Type" }).selectOption("Cloak");
  await gear.getByRole("combobox", { name: "Item" }).fill("fur");
  const options = gear.getByRole("listbox", { name: "Items" }).getByRole("option");
  await expect(options.first()).toBeVisible();
  const found = await options.locator('[class*="gearOptionName"]').allTextContents();
  expect(found).toContain("Fur Cape");
  expect(found).not.toContain("Fur Armor");
  expect(found).not.toContain("Fur Helmet");
  // Search every item drops the filter: the fur armor now shows too.
  await gear.getByRole("button", { name: "Search every item" }).click();
  await expect(options.filter({ hasText: "Fur Armor" }).first()).toBeVisible();
  await gear.getByRole("button", { name: "Cancel" }).click();

  await add(page, gear, "Cloak", "Fur Cape", "Fur Cape");
  await add(page, gear, "Backpack", "Adventurer Backpack", "Adventurer Backpack");
  await add(page, gear, "Accessory", "Beacon of Magnus", "Beacon of Magnus");
  await add(page, gear, "Accessory", "Histus Flask", "Histus Flask", { keep: true });
  await expect(page.getByText("Saved", { exact: true })).toBeVisible({ timeout: 15_000 });

  // The next level: all four carried.
  await page.goto(`/b/${GEAR82_BUILD_ID}/edit?level=3`);
  for (const name of ["Fur Cape", "Adventurer Backpack", "Beacon of Magnus", "Histus Flask"]) await expect(gear).toContainText(`${name}, since level 2`);

  // The build page: the level card lists them by type, and the timeline has a lane each.
  await page.goto(`/b/${GEAR82_BUILD_ID}?level=2`);
  const card = page.getByRole("region", { name: "Level 2", exact: true });
  for (const line of ["Cloak: Fur Cape", "Backpack: Adventurer Backpack", "Accessory: Beacon of Magnus", "Accessory: Histus Flask"]) await expect(card).toContainText(line);
  await expect(card).not.toContainText("replaces");
  const at = page.getByRole("region", { name: "Gear at level 2" });
  for (const name of ["Fur Cape", "Adventurer Backpack", "Beacon of Magnus", "Histus Flask"]) await expect(at).toContainText(name);
});

test("point 2: replacing one piece of several, and Empty from here on one", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/b/${GEAR82_BUILD_ID}/edit?level=4`);
  const gear = page.getByRole("region", { name: "Gear" });
  // Two Accessories worn: Replaces is a choice, nothing by default.
  await gear.getByRole("button", { name: "Add gear" }).click();
  await gear.getByRole("combobox", { name: "Type" }).selectOption("Accessory");
  await expect(gear.getByRole("combobox", { name: "Replaces" })).toHaveValue("");
  await gear.getByRole("combobox", { name: "Replaces" }).selectOption("Histus Flask");
  await gear.getByRole("combobox", { name: "Item" }).fill("Old Histus Flask");
  await gear.getByRole("listbox", { name: "Items" }).getByRole("option", { name: /^Old Histus Flask/ }).first().click();
  await gear.getByRole("button", { name: "Add", exact: true }).click();
  await expect(gear).toContainText("Old Histus Flask");
  await expect(gear).not.toContainText("Histus Flask, since level 2");
  await expect(gear).toContainText("Beacon of Magnus, since level 2");
  await gear.getByRole("button", { name: "Empty Beacon of Magnus (Accessory) from here" }).click();
  await expect(gear).toContainText("Beacon of Magnus (Accessory) removed");
  await expect(page.getByText("Saved", { exact: true })).toBeVisible({ timeout: 15_000 });

  await page.goto(`/b/${GEAR82_BUILD_ID}?level=4`);
  const card = page.getByRole("region", { name: "Level 4", exact: true });
  await expect(card).toContainText("Accessory: Old Histus Flask, replaces Histus Flask");
  await expect(card).toContainText("Beacon of Magnus (Accessory) removed");
});
