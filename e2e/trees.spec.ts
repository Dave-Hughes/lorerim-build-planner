import { expect, test } from "@playwright/test";
import { signIn } from "./helpers";
import { TEST_BUILD_ID } from "./seed";

test.describe("perk trees on a phone", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

  test("tapping a star opens its details in a bottom sheet", async ({ page, context }) => {
    await signIn(context);
    await page.goto(`/b/${TEST_BUILD_ID}/edit?level=6`);
    await page.getByRole("tab", { name: /^Block/ }).click();
    await page.getByRole("button", { name: /^Overpowering Bashes, Block 50/ }).tap();
    const sheet = page.getByRole("dialog", { name: "Overpowering Bashes" });
    await expect(sheet).toBeVisible();
    await expect(sheet.getByRole("complementary", { name: "Perk details" })).toContainText("Overpowering Bashes");
    await sheet.getByRole("button", { name: "Close" }).tap();
    await expect(sheet).toBeHidden();
  });

  test("the shared build page's sheet shows the perk's own words", async ({ page }) => {
    await page.goto("/b/sample?level=6");
    await page.getByRole("button", { name: "Tree", exact: true }).tap();
    await page.getByRole("tab", { name: /^Block/ }).tap();
    await page.getByRole("button", { name: /^Powerful Bashes, Block 25, taken/ }).tap();
    const sheet = page.getByRole("dialog", { name: "Powerful Bashes" });
    await expect(sheet).toContainText("Taken at level 6");
  });

  test("perks open on the held list, and the Tree switch shows the tree", async ({ page }) => {
    await page.goto("/b/sample?level=6");
    const held = page.getByRole("region", { name: "Held" });
    await expect(held).toContainText("Powerful Bashes");
    await expect(page.getByRole("button", { name: "List", exact: true })).toHaveAttribute("aria-pressed", "true");
    await page.getByRole("button", { name: "Tree", exact: true }).tap();
    await page.getByRole("tab", { name: /^Block/ }).tap();
    await expect(page.getByRole("button", { name: /^Powerful Bashes, Block 25, taken/ })).toBeVisible();
    await expect(held).toHaveCount(0);
    await page.getByRole("button", { name: "List", exact: true }).tap();
    await expect(page.getByRole("region", { name: "Held" })).toBeVisible();
  });
});

test.describe("tree tabs on a phone", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

  test("the tabs are one row and the selected tab is in view", async ({ page }) => {
    await page.goto("/b/sample?level=6");
    await page.getByRole("button", { name: "Tree", exact: true }).tap();
    const tabs = page.getByRole("tablist", { name: "Perk trees" });
    await tabs.getByRole("tab", { name: /^Destiny/ }).click();
    const boxes = await tabs.getByRole("tab").evaluateAll((els) => els.map((e) => e.getBoundingClientRect().top));
    expect(new Set(boxes.map(Math.round)).size).toBe(1);
    const row = (await tabs.boundingBox())!;
    expect(row.height).toBeLessThan(60);
    const chosen = (await tabs.getByRole("tab", { name: /^Destiny/ }).boundingBox())!;
    expect(chosen.x).toBeGreaterThanOrEqual(row.x - 1);
    expect(chosen.x + chosen.width).toBeLessThanOrEqual(row.x + row.width + 1);
    // The Tree / List switch sits beside the section's heading, above the row.
    const list = (await page.getByRole("button", { name: "List", exact: true }).boundingBox())!;
    expect(list.y + list.height).toBeLessThanOrEqual(row.y + 1);
  });
});

test.describe("the editor at 1456", () => {
  test.use({ viewport: { width: 1456, height: 900 } });

  test("selecting a star shows its name in the pinned panel without scrolling", async ({ page, context }) => {
    await signIn(context);
    await page.goto(`/b/${TEST_BUILD_ID}/edit?level=6`);
    await page.getByRole("tab", { name: /^Block/ }).click();
    const star = page.getByRole("button", { name: /^Overpowering Bashes, Block 50/ });
    await star.scrollIntoViewIfNeeded();
    const before = await page.evaluate(() => window.scrollY);
    await star.click();
    const panel = page.getByRole("complementary", { name: "Perk details" });
    await expect(panel).toContainText("Overpowering Bashes");
    expect(await page.evaluate(() => window.scrollY)).toBe(before);
    const box = (await panel.boundingBox())!;
    expect(box.y).toBeGreaterThanOrEqual(0);
    expect(box.y + box.height).toBeLessThanOrEqual(900);
    await page.keyboard.press("Escape");
    await expect(panel).toBeHidden();
  });
});
