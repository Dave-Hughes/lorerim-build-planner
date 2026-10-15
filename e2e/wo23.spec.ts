import { expect, test } from "@playwright/test";
import { signIn } from "./helpers";
import { GEAR_BUILD_ID } from "./seed";

test.use({ viewport: { width: 1512, height: 806 } });

// Until the item extract is built into items.json, the index is empty and these wait.
test.beforeEach(async ({ request }) => {
  const items = await (await request.get("/api/items/5.0.4.8")).json();
  test.skip(items.length === 0, "items.json isn't built yet (WO-23: run items.py on the PC)");
});

test("the Main hand field searches the game's weapons", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/b/${GEAR_BUILD_ID}/edit?level=1`);
  const gear = page.getByRole("region", { name: "Gear" });
  await gear.getByRole("button", { name: "Add gear" }).click();
  await gear.getByRole("combobox", { name: "Slot" }).selectOption("Main hand");
  await gear.getByRole("combobox", { name: "Item" }).fill("steel sp");
  const option = gear.getByRole("option", { name: /^Steel Spear/i }).first();
  await expect(option).toBeVisible();
  await expect(option).toContainText(/damage/);
  await option.click();
  await expect(gear.getByRole("combobox", { name: "Item" })).toHaveValue(/^Steel Spear/i);
});

test("@ebony in a level note offers Ebony items with their card", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/b/${GEAR_BUILD_ID}/edit?level=2`);
  const note = page.getByRole("textbox", { name: "About level 2" });
  await note.click();
  await page.keyboard.type("Wear @ebony");
  const option = page.getByRole("listbox", { name: "Game things" }).getByRole("option", { name: /^Ebony/ }).first();
  await expect(option).toBeVisible();
  const name = (await option.locator("span span").first().innerText()).trim();
  await option.click();
  await expect(page.getByRole("region", { name: "About level 2" }).getByRole("status")).toHaveText(/Saved/, { timeout: 10_000 });

  await page.goto(`/b/${GEAR_BUILD_ID}?level=2`);
  const chip = page.getByRole("complementary", { name: "Author's note" }).getByRole("button", { name });
  await chip.hover();
  await expect(page.getByRole("tooltip").filter({ hasText: /armor|damage|weight/ }).first()).toBeVisible();
});
