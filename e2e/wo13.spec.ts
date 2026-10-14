import { expect, test, type Page } from "@playwright/test";
import { signIn } from "./helpers";
import { SCRATCH_BUILD_ID, TEST_BUILD_ID } from "./seed";

// A MacBook window, where the test drive found these.
test.use({ viewport: { width: 1512, height: 806 } });

const top = (page: Page, name: string) => page.getByRole("region", { name, exact: true }).evaluate((e) => e.getBoundingClientRect().top);

test.describe("nothing moves under you", () => {
  test("Confirm and Remove keep the page where it is", async ({ page, context }) => {
    await signIn(context);
    await page.goto(`/b/${SCRATCH_BUILD_ID}/edit?level=6`);
    await page.getByRole("button", { name: "Block", exact: true }).click();
    const star = page.getByRole("button", { name: /^Powerful Bashes, Block 25, taken/ });
    await star.scrollIntoViewIfNeeded();
    await page.mouse.wheel(0, 120);
    await star.click();
    const panel = page.getByRole("complementary", { name: "Perk details" });
    const y = await page.evaluate(() => window.scrollY);
    await panel.getByRole("button", { name: "Remove" }).click();
    await expect(panel.getByRole("button", { name: "Confirm" })).toBeFocused();
    expect(Math.abs((await page.evaluate(() => window.scrollY)) - y)).toBeLessThanOrEqual(2);
    await panel.getByRole("button", { name: "Confirm" }).click();
    // Taking it closes the card (WO-31); the star says it's taken, and the page hasn't moved.
    await expect(page.getByRole("complementary", { name: "Perk details" }).filter({ hasText: "Powerful Bashes" })).toHaveCount(0);
    await expect(star).toBeVisible();
    expect(Math.abs((await page.evaluate(() => window.scrollY)) - y)).toBeLessThanOrEqual(2);
  });

  test("changing level keeps the level row where it is on screen, in the editor and on the shared page", async ({ page, context }) => {
    await signIn(context);
    for (const url of [`/b/${TEST_BUILD_ID}/edit?level=6`, `/b/${TEST_BUILD_ID}?level=6`]) {
      await page.goto(url);
      const row = page.getByRole("button", { name: /^Level 3/ });
      await row.scrollIntoViewIfNeeded();
      await page.mouse.wheel(0, 150);
      await page.waitForTimeout(100);
      const before = await top(page, "Level");
      await row.click();
      await expect(page.getByRole("button", { name: /^Level 3/ })).toHaveAttribute("aria-current", "true");
      expect(Math.abs((await top(page, "Level")) - before), url).toBeLessThanOrEqual(2);
    }
  });

  test("trait cards keep their order while the step is open", async ({ page }) => {
    await page.goto("/new");
    await page.getByRole("article").filter({ hasText: "Nord" }).getByRole("heading", { name: "Nord" }).click();
    await page.getByRole("button", { name: "Next: Birthsign" }).click();
    await page.getByRole("article").filter({ hasText: "The Lord" }).getByRole("heading", { name: "The Lord" }).click();
    await page.getByRole("button", { name: "Next: Skills" }).click();
    for (const s of ["Heavy Armor", "Block", "One-Handed"]) await page.getByRole("group", { name: s }).getByRole("button", { name: "Major" }).click();
    for (const s of ["Smithing", "Alchemy"]) await page.getByRole("group", { name: s }).getByRole("button", { name: "Minor" }).click();
    await page.getByRole("button", { name: "Next: Traits" }).click();
    const names = () => page.getByRole("main").getByRole("article").getByRole("heading").allTextContents();
    const before = await names();
    await page.getByRole("main").getByRole("article").nth(2).getByRole("heading").click();
    await expect(page.getByRole("main").getByText("1 of 2 chosen")).toBeVisible();
    const after = await names();
    expect(after[1]).toBe(before[1]);
    expect(after).toEqual(before);
  });
});

test.describe("breaking an earlier level", () => {
  test("removing a perk a later level needs asks first; Keep keeps, Remove all three removes", async ({ page, context }) => {
    await signIn(context);
    await page.goto(`/b/${SCRATCH_BUILD_ID}/edit?level=1`);
    await page.getByRole("button", { name: "Block", exact: true }).click();
    await page.getByRole("button", { name: /^Improved Blocking, .*taken/ }).click();
    const panel = page.getByRole("complementary", { name: "Perk details" });
    await panel.getByRole("button", { name: "Remove" }).click();
    await expect(panel.getByRole("alert")).toHaveText(/Experienced Blocking \(level 2\) and Powerful Bashes \(level 6\) need this\./);
    await panel.getByRole("button", { name: "Keep" }).click();
    await expect(panel.getByRole("alert")).toHaveCount(0);
    await expect(page.getByRole("button", { name: /^Improved Blocking, .*taken/ })).toBeVisible();
    await expect(page.getByRole("region", { name: "Problems in this build" })).toHaveCount(0);

    await panel.getByRole("button", { name: "Remove" }).click();
    await panel.getByRole("button", { name: "Remove all three" }).click();
    await expect(page.getByRole("button", { name: /^Improved Blocking, .*can take now/ })).toBeVisible();
    await expect(page.getByRole("region", { name: "Problems in this build" })).toHaveCount(0);
    await page.getByRole("button", { name: /^Level 6/ }).click();
    await expect(page.getByRole("button", { name: /^Powerful Bashes, .*(can take now|not available)/ })).toBeVisible();
    await page.getByRole("button", { name: /^Level 2/ }).click();
    await expect(page.getByRole("button", { name: /^Experienced Blocking, .*(can take now|not available)/ })).toBeVisible();
  });

  test("a problem at a later level shows in a bar under the level row", async ({ page, context }) => {
    await signIn(context);
    await page.goto(`/b/${SCRATCH_BUILD_ID}/edit?level=6`);
    await page.getByRole("button", { name: /^Continue to level/ }).click();
    const last = 7;
    await page.getByRole("button", { name: "Previous level" }).click();
    const bar = page.getByRole("region", { name: "Problems in this build" });
    await expect(bar).toContainText(`Level ${last}: Pick Health, Magicka or Stamina.`);
    await bar.getByRole("button", { name: `Go to level ${last}` }).click();
    await expect(page.getByText("Level up to").locator("..")).toContainText(String(last));
    await page.getByRole("button", { name: new RegExp(`^Level ${last}`) }).hover();
    await expect(page.getByRole("tooltip")).toHaveText(`1 problem at level ${last}`);
  });
});

test.describe("gear", () => {
  test("is set in each level's editor, under the new slot names", async ({ page, context }) => {
    await signIn(context);
    await page.goto(`/b/${SCRATCH_BUILD_ID}/edit?level=1`);
    await expect(page.getByRole("link", { name: "Gear" })).toHaveCount(0);
    const gear = page.getByRole("region", { name: "Gear" });
    await expect(gear).toContainText("Main hand");
    await expect(gear).toContainText("Steel sword");
  });
});
