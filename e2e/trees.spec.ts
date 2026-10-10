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
    await page.getByRole("button", { name: "Open perk trees" }).tap();
    await page.getByRole("tab", { name: /^Block/ }).tap();
    await page.getByRole("button", { name: /^Powerful Bashes, Block 25, taken/ }).tap();
    const sheet = page.getByRole("dialog", { name: "Powerful Bashes" });
    await expect(sheet).toContainText("Taken at level 6");
  });

  test("the List toggle shows the tree as a plain list", async ({ page }) => {
    await page.goto("/b/sample?level=6");
    await page.getByRole("button", { name: "Open perk trees" }).tap();
    await page.getByRole("tab", { name: /^Block/ }).tap();
    await page.getByRole("button", { name: "List", exact: true }).tap();
    const list = page.getByRole("group", { name: "Block perks" });
    await expect(list).toBeVisible();
    await expect(list.getByRole("region", { name: "Up to Block 25" })).toContainText("Powerful Bashes");
    await expect(list.getByRole("region", { name: "Up to Block 25" })).toContainText("Taken at level 6");
    await page.getByRole("button", { name: "Tree", exact: true }).tap();
    await expect(page.getByRole("button", { name: /^Powerful Bashes, Block 25, taken/ })).toBeVisible();
  });
});
