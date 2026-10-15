import { expect, test, type Page } from "@playwright/test";
import { FOUR_BUILD_ID, IRIEL_BUILD_ID, REPORTER_TOKENS } from "./seed";

test.use({ viewport: { width: 1440, height: 900 }, storageState: { cookies: [], origins: [] } });

/** Clicks Next through the tour from its first stop; the titles, in order. (WO-80 changed the stops.) */
async function walk(page: Page): Promise<string[]> {
  const titles: string[] = [];
  for (;;) {
    const card = page.getByRole("dialog");
    await expect(card).toContainText(/\d+ of \d+/);
    titles.push((await card.getByRole("heading").textContent())!);
    const done = card.getByRole("button", { name: "Done" });
    if (await done.count()) {
      await done.click();
      return titles;
    }
    await card.getByRole("button", { name: "Next", exact: true }).click();
  }
}

test("a fresh browser on a build: the welcome, every stop, not again on reload, and Show me around restarts it", async ({ page }) => {
  await page.goto(`/b/${IRIEL_BUILD_ID}?level=10`);
  const welcome = page.getByRole("dialog", { name: "Tapps here" });
  await expect(welcome).toBeVisible();
  await welcome.getByRole("button", { name: "Show me" }).click();
  const titles = await walk(page);
  expect(titles[0]).toBe("Levels");
  expect(titles.at(-1)).toBe("Guide");
  await expect(page.getByRole("dialog")).toHaveCount(0);

  await page.reload();
  await expect(page.getByRole("heading", { name: "Level 10", exact: true })).toBeVisible();
  await expect(page.getByRole("dialog", { name: "Tapps here" })).toHaveCount(0);

  await page.getByRole("contentinfo").getByRole("button", { name: "Show me around" }).click();
  await expect(page.getByRole("dialog", { name: "Levels" })).toContainText(`1 of ${titles.length}`);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("a build without a guide has no Guide stop", async ({ page }) => {
  // Four Levels has no guide (other tests write one on the test build).
  await page.goto(`/b/${FOUR_BUILD_ID}`);
  await page.getByRole("dialog", { name: "Tapps here" }).getByRole("button", { name: "Show me" }).click();
  const titles = await walk(page);
  expect(titles).not.toContain("Guide");
  expect(titles.at(-1)).not.toBe("Guide");
});

test("a new build lands on level 1 with the author's welcome; Later asks again, Skip doesn't", async ({ page, context }) => {
  // One of WO-40's reporters: the test author is at the day's build limit by now.
  await context.addCookies([{ name: "authjs.session-token", value: REPORTER_TOKENS[1], domain: "localhost", path: "/" }]);
  await page.goto("/new");
  await page.getByRole("article").filter({ hasText: "Nord" }).getByRole("button", { name: /^Choose/ }).click();
  await expect(page.getByText("Draft saved")).toBeVisible();
  await page.goto("/new?step=name");
  await page.getByLabel("Build name").fill("Tapps' Test");
  await page.getByRole("button", { name: "Create build" }).click();
  await page.waitForURL(/\/b\/\w{10}\/edit/);
  const welcome = page.getByRole("dialog", { name: "Build saved" });
  await expect(welcome).toBeVisible();
  await welcome.getByRole("button", { name: "Later" }).click();
  await expect(welcome).toHaveCount(0);
  await page.reload();
  await expect(page.getByRole("dialog", { name: "Build saved" })).toBeVisible();
  await page.getByRole("dialog", { name: "Build saved" }).getByRole("button", { name: "Show me" }).click();
  await expect(page.getByRole("dialog", { name: "Points to spend" })).toContainText("1 of 4");
  await page.getByRole("dialog", { name: "Points to spend" }).getByRole("button", { name: "Skip" }).click();
  await page.reload();
  await expect(page.getByText("Level 1 follows every rule.").or(page.getByRole("region", { name: "Attribute and skills" }))).toBeVisible();
  await expect(page.getByRole("dialog", { name: "Build saved" })).toHaveCount(0);
});
