import { expect, test } from "@playwright/test";
import { signIn } from "./helpers";
import { DESTINY_BUILD_ID, FORTY_BUILD_ID, TEST_BUILD_ID } from "./seed";

test.describe("at 1440x900", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("no tree chips; Sneak in the list opens the Sneak tree and its row is marked", async ({ page, context }) => {
    await signIn(context);
    await page.goto(`/b/${TEST_BUILD_ID}/edit?level=6`);
    await expect(page.getByRole("tablist", { name: "Perk trees" })).toHaveCount(0);
    const sneak = page.getByRole("button", { name: "Sneak", exact: true });
    await sneak.click();
    await expect(sneak).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator('[data-tree="Sneak"]')).toBeVisible();
    await expect(page.getByRole("region", { name: "Perks" }).getByRole("heading", { name: "Sneak" })).toBeVisible();
  });

  test("scrolled down to the Mage rows the tree panel is still on screen; Illusion swaps it with no scroll jump", async ({ page, context }) => {
    await signIn(context);
    await page.goto(`/b/${FORTY_BUILD_ID}/edit?level=12`);
    // Scroll down until the Mage rows are all in view, at the bottom of the window.
    await page.getByRole("button", { name: "Restoration", exact: true }).evaluate((el) => window.scrollBy(0, el.getBoundingClientRect().bottom - (window.innerHeight - 24)));
    await expect(page.getByRole("button", { name: "Alteration", exact: true })).toBeInViewport();
    const panel = page.locator('[class*="treeBox"]').first();
    const top = (await panel.boundingBox())!.y;
    const bar = (await page.locator("[data-edit-bar]").boundingBox())!;
    expect(top).toBeGreaterThanOrEqual(bar.y + bar.height - 1);
    expect(top).toBeLessThan(900);
    const y = await page.evaluate(() => window.scrollY);
    await page.getByRole("button", { name: "Illusion", exact: true }).click();
    await expect(page.locator('[data-tree="Illusion"]')).toBeVisible();
    expect(await page.evaluate(() => window.scrollY)).toBe(y);
  });

  test("a row's count is the perks taken in its tree; the Destiny row says how many are left and opens Destiny", async ({ page, context }) => {
    await signIn(context);
    await page.goto(`/b/${TEST_BUILD_ID}/edit?level=6`);
    // The sample by level 6: Block has Improved Blocking, Experienced Blocking and Powerful Bashes.
    await expect(page.getByRole("button", { name: "Block", exact: true })).toHaveText(/Block\s*3$/);
    await expect(page.getByRole("button", { name: "Two-Handed", exact: true })).toHaveText(/^\s*Two-Handed\s*$/);
    await page.goto(`/b/${DESTINY_BUILD_ID}/edit?level=5`);
    const destiny = page.getByRole("button", { name: "Destiny", exact: true });
    // As many as the level's Destiny points show (WO-27's test may have spent this one).
    const left = Number((await page.locator("dt", { hasText: "Destiny points" }).locator("xpath=following-sibling::dd[1]/span[1]").textContent())!.trim());
    if (left > 0) await expect(destiny).toContainText(`${left} left`);
    else await expect(destiny).not.toContainText("left");
    await destiny.click();
    await expect(page.locator('[data-tree="Destiny"]')).toBeVisible();
  });
});

test.describe("at 390", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("tapping Block opens the sheet on List; taking a perk there takes it; closing returns focus to the Block row", async ({ page, context }) => {
    await signIn(context);
    await page.goto(`/b/${FORTY_BUILD_ID}/edit?level=30`);
    const block = page.getByRole("button", { name: "Block", exact: true });
    await block.click();
    const sheet = page.getByRole("dialog", { name: "Block perks" });
    await expect(sheet).toBeVisible();
    await expect(sheet.getByRole("button", { name: "List" })).toHaveAttribute("aria-pressed", "true");
    const canTake = sheet.getByRole("group", { name: "Block perks" }).getByRole("region", { name: "Can take now" });
    const first = canTake.getByRole("button").first();
    const name = (await first.locator('[class*="listName"]').textContent())!;
    await first.click();
    await sheet.getByRole("button", { name: "Confirm" }).click();
    await expect(sheet.getByRole("region", { name: "Taken" })).toContainText(name);
    await sheet.getByRole("button", { name: "Close" }).click();
    await expect(sheet).toHaveCount(0);
    await expect(block).toBeFocused();
  });
});
