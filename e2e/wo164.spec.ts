/**
 * WO-164: a character is one page. A run's page takes the build page's hero and its tab row (Playthrough open, Build beside it, which goes to
 * the build's own page); a run with no build has the same hero; What next ends making a character; the Playthrough tab with no run shows a
 * sample act; a character with no cover has a fallback card; Featured is a wide card, one row high (e2e/wo39.spec.ts).
 */
import { expect, test } from "@playwright/test";
import { signIn } from "./helpers";
import { FRESH_BUILD_ID, KYRIA_BUILD_ID, KYRIA_PLAYTHROUGH_ID, NOBUILD_PLAYTHROUGH_ID, FORTY_BUILD_ID } from "./seed";

for (const width of [1440, 390]) {
  test(`a run's page at ${width}: the build page's hero, the tab row with Playthrough open, and Build goes to the build's page`, async ({ page, context }) => {
    await signIn(context);
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`/p/${KYRIA_PLAYTHROUGH_ID}`);
    await expect(page.getByRole("heading", { level: 1, name: "Kyria, Knight of Stendarr" })).toBeVisible();
    const hero = page.locator("section[aria-label=Build]");
    await expect(hero).toBeVisible();
    expect((await hero.boundingBox())!.width).toBeGreaterThan(width - 20);
    const tabs = page.getByRole("tablist");
    await expect(tabs.getByRole("tab", { name: /^Playthrough/ })).toHaveAttribute("aria-selected", "true");
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `test-results/wo164-kyria-playthrough-${width}.png`, fullPage: false });
    await tabs.getByRole("tab", { name: /^Build/ }).click();
    await expect(page).toHaveURL(new RegExp(`/b/${KYRIA_BUILD_ID}\\?tab=levels$`));
    await expect(page.getByRole("tab", { name: /^Build/ })).toHaveAttribute("aria-selected", "true");
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `test-results/wo164-kyria-build-${width}.png`, fullPage: false });
    // The old addresses go to the build's page.
    await page.goto(`/p/${KYRIA_PLAYTHROUGH_ID}?tab=levels`);
    await expect(page).toHaveURL(new RegExp(`/b/${KYRIA_BUILD_ID}\\?tab=levels$`));
  });
}

test("a run with no build has the same hero: the full-width band, the name and line, Copy link and Edit, and the WO-159 back button", async ({ page, context }) => {
  await signIn(context);
  await page.setViewportSize({ width: 1440, height: 900 });
  // WO-179: a run with no build is a character of its own, named as the run, the first time its owner opens it.
  await page.goto(`/p/${NOBUILD_PLAYTHROUGH_ID}`);
  await expect(page).toHaveURL(/\/b\/[^/]+\?tab=playthrough$/);
  await expect(page.getByRole("heading", { level: 1, name: "Nora Nobuild" })).toBeVisible();
  const hero = page.getByRole("region", { name: "Build" }).first();
  expect((await hero.boundingBox())!.width).toBeGreaterThan(1400);
  await expect(hero.getByRole("button", { name: "Copy link" })).toBeVisible();
  await expect(hero.getByRole("link", { name: "Edit" })).toBeVisible();
  await expect(page.locator(".frame").filter({ has: page.getByRole("heading", { level: 1 }) })).toHaveCount(0);
  // No cover: the cards' fallback, the night scene's blues (a character with no race has no icon on them), not an empty hatched band.
  expect(await hero.locator("[class*='overNight']").evaluate((el) => getComputedStyle(el).backgroundImage)).toContain("linear-gradient");
  await expect(page.getByRole("heading", { name: "The first days" })).toBeVisible();
  // The hero's words rise in over half a second.
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "test-results/wo164-nobuild-1440.png", fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "test-results/wo164-nobuild-390.png", fullPage: true });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`/p/${NOBUILD_PLAYTHROUGH_ID}/build`);
  await expect(page).toHaveURL(/\/b\/[^/]+\?tab=levels$/);
});

test("What next ends making a character: Plan a playthrough makes the run and opens it", async ({ page, context }) => {
  await signIn(context);
  await page.goto("/new");
  await page.getByRole("article").filter({ hasText: "Nord" }).getByText("+15").click();
  await expect(page.getByText("Draft saved")).toBeVisible();
  await page.goto("/new?step=name");
  await page.getByLabel("Name", { exact: true }).fill("What Next Test");
  await page.getByRole("button", { name: "Next: What next" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "What next" })).toBeVisible();
  await page.screenshot({ path: "test-results/wo164-what-next-1440.png" });
  await page.getByRole("button", { name: "Plan a playthrough" }).click();
  await page.waitForURL(/\/b\/[^/]+\/edit\/play/);
});

test("the Playthrough tab with no run shows a sample act, faded, under Plan a playthrough", async ({ page, context }) => {
  await signIn(context);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`/b/${FORTY_BUILD_ID}/play`);
  const sample = page.getByLabel("A sample act, faded");
  await expect(sample).toContainText("Act I");
  await expect(sample.getByRole("listitem")).toHaveCount(3);
  await expect(sample).toContainText(/Levels 1 to \d+/);
  expect(Number(await sample.evaluate((el) => getComputedStyle(el).opacity))).toBeLessThan(1);
  await page.screenshot({ path: "test-results/wo164-playthrough-empty-1440.png" });
});

test("My characters: one character card each with Edit and Delete under it, and a character with no cover gets its race's icon on the night colours", async ({ page, context }) => {
  await signIn(context);
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/me");
    // Any of the author's cards: other specs make and delete builds, so none is named here.
    const fresh = page.getByRole("article").first();
    await expect(fresh).toBeVisible();
    await expect(fresh.getByRole("link", { name: "Edit" })).toHaveAttribute("href", /\/b\/[a-z0-9]+\/edit$/);
    await expect(fresh.getByRole("button", { name: /^Delete/ })).toBeVisible();
    await expect(page.getByText("Start a run")).toHaveCount(0);
    await expect(page.locator("main").getByRole("link", { name: /^Plan a playthrough/ }).first()).toBeVisible();
    const icon = page.locator("main article img[class*='plainIcon']:visible").first();
    await expect(icon).toBeVisible();
    await page.screenshot({ path: `test-results/wo164-me-${width}.png`, fullPage: true });
    // One layout under every card: Delete sits at the same height under every card in a row, and on a fallback card the icon ends above the name.
    const cells = page.locator("main article").filter({ has: page.getByRole("button", { name: /^Delete/ }) });
    const tops = await cells.evaluateAll((els) => els.map((el) => ({ row: Math.round(el.getBoundingClientRect().top), del: Math.round(Array.from(el.querySelectorAll("button")).find((b) => /^Delete/.test(b.textContent ?? b.getAttribute("aria-label") ?? ""))?.getBoundingClientRect().top ?? -1) })));
    for (const row of new Set(tops.map((t) => t.row))) {
      const dels = tops.filter((t) => t.row === row).map((t) => t.del);
      expect(new Set(dels).size, `Delete at ${dels.join(", ")} in the row at ${row}`).toBe(1);
    }
    const plain = page.locator("main article").filter({ has: page.locator("img[class*='plainIcon']:visible") });
    for (let i = 0; i < Math.min(await plain.count(), 3); i++) {
      const [img, name] = [await plain.nth(i).locator("img[class*='plainIcon']:visible").boundingBox(), await plain.nth(i).getByRole("heading").boundingBox()];
      expect(img!.y + img!.height, "the icon ends above the name").toBeLessThanOrEqual(name!.y);
    }
  }
  await page.goto(`/b/${FRESH_BUILD_ID}`);
  await expect(page.getByRole("link", { name: "Plan a playthrough" })).toBeVisible();
});
