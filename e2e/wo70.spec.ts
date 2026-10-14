import fs from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";

const dir = path.join(process.cwd(), "content", "guide");
const TERMS = count(fs.readFileSync(path.join(dir, "terms.md"), "utf8"), /^## /gm);
const chapters = fs.readdirSync(dir).filter((f) => /^\d+-.+\.md$/.test(f));
const all = chapters.map((f) => fs.readFileSync(path.join(dir, f), "utf8")).join("\n");
function count(text: string, re: RegExp) {
  return text.match(re)?.length ?? 0;
}

test.describe("at 1440", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("hovering MO2 shows its definition and Read more; Esc closes; a term opens on keyboard focus", async ({ page }) => {
    await page.goto("/guide/what-lorerim-changes");
    const mo2 = page.locator('a.guide-term[data-term="mo2"]').first();
    await mo2.hover();
    const tip = page.getByRole("tooltip");
    await expect(tip).toContainText("Mod Organizer 2");
    await expect(tip).toContainText("The program LoreRim installs");
    await expect(tip.getByRole("link", { name: "Read more" })).toHaveAttribute("href", "/guide/what-lorerim-changes#profiles");
    await page.keyboard.press("Escape");
    await expect(tip).toHaveCount(0);
    // Tab through the page to the first term: it opens on focus.
    await page.mouse.move(0, 0);
    const first = page.locator("article a.guide-term").first();
    for (let i = 0; i < 60; i++) {
      await page.keyboard.press("Tab");
      if (await first.evaluate((el) => el === document.activeElement)) break;
    }
    await expect(first).toBeFocused();
    await expect(page.getByRole("tooltip")).toBeVisible();
  });

  test("the terms page lists every term A to Z with Used in links", async ({ page }) => {
    expect(TERMS).toBe(191);
    await page.goto("/guide/terms");
    const entries = page.locator("main dl > div[id]");
    await expect(entries).toHaveCount(TERMS);
    const names = await entries.locator("dt").evaluateAll((els) => els.map((e) => [...e.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join("").trim()));
    const sorted = [...names].sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" }));
    expect(names).toEqual(sorted);
    const mo2 = page.locator("#mo2");
    await expect(mo2.getByText("Used in")).toBeVisible();
    await mo2.getByRole("link", { name: /What LoreRim changes/ }).first().click();
    await expect(page).toHaveURL(/\/guide\/what-lorerim-changes/);
  });

  test("Related Mods and Which mod runs what link every mod with a Nexus id", async ({ page }) => {
    const ids = count(all, /^ {2}- nexus:/gm);
    let linked = 0;
    for (const f of chapters) {
      await page.goto(`/guide/${f.replace(/^\d+-|\.md$/g, "")}`);
      linked += await page.locator('article dt a[href^="https://www.nexusmods.com/skyrimspecialedition/mods/"]').count();
    }
    expect(linked).toBe(ids);
    const names = new Set<string>();
    const block = /^- \*\*(.+?)\*\*:.*\n(?:\s+- .*\n)*?\s+- nexus:/gm;
    for (const m of all.matchAll(block)) names.add(m[1]);
    await page.goto("/guide/mods");
    const external = page.locator('main dt a[href^="https://www.nexusmods.com/"]');
    await expect(external).toHaveCount(names.size);
    await expect(external.first()).toHaveAttribute("target", "_blank");
  });

  test("chapter icons show in the list, the header, the index and Previous and Next", async ({ page }) => {
    await page.goto("/guide/fighting");
    await expect(page.locator('aside img[src="/icons/chapter-fighting.svg"]').first()).toBeVisible();
    await expect(page.locator('article header img[src="/icons/chapter-fighting.svg"]')).toBeVisible();
    await expect(page.locator('nav[aria-label="Chapters"] img[src="/icons/chapter-staying-alive.svg"]')).toBeVisible();
    await page.goto("/guide/character#race");
    await expect(page.locator('#race table img[src="/icons/race-nord.svg"]')).toBeVisible();
    await page.goto("/guide");
    await expect(page.locator('main img[src="/icons/chapter-keys.svg"]')).toBeVisible();
  });
});

test.describe("at 390", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

  test("tapping a term opens its tooltip on screen; tapping elsewhere closes it", async ({ page }) => {
    await page.goto("/guide/what-lorerim-changes");
    const term = page.locator("article a.guide-term").nth(3);
    await term.scrollIntoViewIfNeeded();
    await term.tap();
    const tip = page.getByRole("tooltip");
    await expect(tip).toBeVisible();
    await expect(page).toHaveURL(/\/guide\/what-lorerim-changes$/);
    const box = (await tip.boundingBox())!;
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(390);
    await page.locator("article h1").tap();
    await expect(tip).toHaveCount(0);
  });
});

test.describe("without scripts", () => {
  test.use({ javaScriptEnabled: false });
  test("a term is a link to its entry on the terms page", async ({ page }) => {
    await page.goto("/guide/what-lorerim-changes");
    await expect(page.locator('a.guide-term[data-term="mo2"]').first()).toHaveAttribute("href", "/guide/terms#mo2");
  });
});
