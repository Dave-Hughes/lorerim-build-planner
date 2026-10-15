/**
 * WO-72: things the app gets wrong, found building Sevari (src/lib/rules/__fixtures__/sevari.json).
 * Points 3, 11 and 12 also have unit tests (src/lib/rules/wo72.test.ts).
 */
import { expect, test, type Page } from "@playwright/test";
import { signIn } from "./helpers";
import { ONE_POINT_BUILD_ID, SEVARI_BUILD_ID } from "./seed";

test.use({ viewport: { width: 1440, height: 1000 } });

const pool = (page: Page, label: string) => page.getByRole("region", { name: "Level", exact: true }).locator("dl > div").filter({ hasText: label });

test.describe("WO-72 on Sevari, as a reader", () => {
  test("point 4: the byline merges only runs of single levels", async ({ page }) => {
    await page.goto(`/b/${SEVARI_BUILD_ID}`);
    await expect(page.getByText("Levels 1 to 5, 10, 19, 20, 30, 40, 50, 75, 100", { exact: true })).toBeVisible();
  });

  test("points 2 and 10: the 21 to 30 card gives rank 3's requirement and every capped skill's limit", async ({ page }) => {
    await page.goto(`/b/${SEVARI_BUILD_ID}?level=30`);
    const card = page.getByRole("region", { name: "Levels 21 to 30", exact: true });
    await expect(card).toContainText("Short Blade Focus 3 (One-Handed 75)");
    // One-Handed, Sneak and Illusion are all at 80.
    await expect(card.getByText("(max skill 80 at level 30)")).toHaveCount(3);
  });

  test("points 5 and 12: the last card says Unspent and lists perks by tree", async ({ page }) => {
    await page.goto(`/b/${SEVARI_BUILD_ID}?level=100`);
    const card = page.getByRole("region", { name: "Levels 76 to 100", exact: true });
    await expect(card.locator('[class*="changeKey"]').filter({ hasText: "Unspent" })).toBeVisible();
    await expect(card.locator('[class*="changeKey"]').filter({ hasText: "Banked" })).toHaveCount(0);
    const text = (await card.textContent()) ?? "";
    expect(text.indexOf("Improved Protection")).toBeLessThan(text.indexOf("Ward Mastery"));
    // Levels before the last keep Banked.
    await page.goto(`/b/${SEVARI_BUILD_ID}?level=50`);
    await expect(page.getByRole("region", { name: "Levels 41 to 50", exact: true }).locator('[class*="changeKey"]').filter({ hasText: "Banked" })).toBeVisible();
  });
});

test.describe("WO-72 on Sevari, as its author", () => {
  test.beforeEach(async ({ context }) => signIn(context));

  test("point 5: the last level's footer says unspent", async ({ page }) => {
    await page.goto(`/b/${SEVARI_BUILD_ID}/edit?level=100`);
    // (The speed test spends some of them first, so no exact count.)
    await expect(page.getByText(/\d+ skill points? unspent\./)).toBeVisible();
    await expect(page.getByText(/will carry over/)).toHaveCount(0);
  });

  test("points 7, 8 and 13: a stretch's trainers, notes heading and Destiny pool", async ({ page }) => {
    await page.goto(`/b/${SEVARI_BUILD_ID}/edit?level=10`);
    // Point 7: five sessions for each of 6 to 10's level-ups.
    await expect(pool(page, "Trainer sessions")).toContainText("25left in these levels");
    // Point 8.
    await expect(page.getByRole("region", { name: "About levels 6 to 10" })).toBeVisible();
    // Point 13: 31 to 40 earns no Destiny points and has none left: just 0, no breakdown.
    await page.goto(`/b/${SEVARI_BUILD_ID}/edit?level=40`);
    const destiny = pool(page, "Destiny points");
    await expect(destiny).toHaveText(/^Destiny points0$/);
    await expect(destiny).not.toContainText("spent");
  });

  test("point 6: changing gear at a later level starts with an empty note", async ({ page }) => {
    await page.goto(`/b/${SEVARI_BUILD_ID}/edit?level=30`);
    const gear = page.getByRole("region", { name: "Gear" });
    // The Elven Dagger's row (level 20) has a note; a change at 30 is a new row.
    await gear.getByRole("button", { name: "Change Main hand" }).click();
    await expect(gear.getByRole("textbox", { name: "Note (optional)" })).toHaveValue("");
  });

  test("point 11: no second enchantment line without Enchantment Mastery", async ({ page }) => {
    await page.goto(`/b/${SEVARI_BUILD_ID}/edit?level=75`);
    const gear = page.getByRole("region", { name: "Gear" });
    await gear.getByRole("button", { name: "Add gear" }).click();
    await gear.getByRole("checkbox", { name: "Made by you" }).check();
    await gear.getByRole("combobox", { name: "Item" }).fill("Daedric Dagger");
    await gear.getByRole("combobox", { name: "Enchantment 1" }).fill("Paralyze");
    await expect(gear.getByRole("combobox", { name: "Enchantment 2" })).toHaveCount(0);
    const locked = gear.getByText("Enchantment 2", { exact: true });
    await locked.hover();
    await expect(page.getByRole("tooltip")).toHaveText("Two enchantments need Enchantment Mastery.");
  });
});

test.describe("WO-72 with one perk point left", () => {
  test.beforeEach(async ({ context }) => signIn(context));

  test("point 9: short of points, the card says so", async ({ page }) => {
    await page.goto(`/b/${ONE_POINT_BUILD_ID}/edit?level=1`);
    // Alchemy (the first major) is the tree that opens.
    await page.locator('[data-perk="Alchemy:Concentrated Poisons"]').click();
    const card = page.getByRole("complementary", { name: "Perk details" }).first();
    await expect(card).toContainText("Needs Alchemical Lore first: 2 perk points, 1 left.");
    await expect(card.getByRole("button", { name: "Confirm" })).toHaveCount(0);
  });

  test("point 1: in List view, Weapon Mastery is taken from its card", async ({ page }) => {
    await page.goto(`/b/${ONE_POINT_BUILD_ID}/edit?level=1`);
    await page.getByRole("button", { name: "One-Handed", exact: true }).click();
    await page.getByRole("group", { name: "Show the tree as" }).getByRole("button", { name: "List" }).click();
    await page.locator('[data-perk="One-Handed:Weapon Mastery"]').click();
    const card = page.getByRole("dialog", { name: "Perk details" });
    await expect(card).toBeVisible();
    await card.getByRole("button", { name: "Confirm" }).click();
    // Rank 1 of 2 taken: the line at the top of the tree says so, and the last point is spent.
    await expect(page.getByRole("status").filter({ hasText: "Weapon Mastery taken." })).toBeVisible();
    await expect(pool(page, "Perk points")).toContainText("0to spend");
  });
});
