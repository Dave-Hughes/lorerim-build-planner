/**
 * WO-157: the site's structure. The menu (Characters, World, Guide), the home page, the Characters address and its redirects, Information
 * Confidence alone at the foot, the preview on a link, and the phone's menu.
 */
import { expect, test } from "@playwright/test";
import { signIn } from "./helpers";

test.describe("at 1440", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("the header: LoreRim Planner, Characters, World with an icon on each page, Guide, and the search hint", async ({ page }) => {
    await page.goto("/");
    const header = page.getByRole("banner");
    await expect(header.getByRole("link", { name: "LoreRim Planner" })).toBeVisible();
    await expect(header.getByRole("navigation", { name: "Site" }).getByRole("link")).toHaveText(["Characters", "Guide"]);
    await header.getByRole("button", { name: "World" }).click();
    const world = header.locator("ul").filter({ has: page.getByRole("link", { name: /^Quests/ }) });
    await expect(world.getByRole("link")).toHaveText([/^Quests/, /^People/, /^Places/, /^Gear/]);
    await expect(world.locator("img")).toHaveCount(4);
    await expect(header.getByRole("button", { name: "Search the site" })).toContainText(/Ctrl K|⌘K/);
    await page.keyboard.press("Escape");
    await expect(world).toHaveCount(0);
  });

  test("home for a new visitor: the night scene, the big search box opens the palette, then what's new and three ways", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1, name: "LoreRim Planner" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Make a character", exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "Browse characters" })).toHaveAttribute("href", "/characters");
    await page.getByRole("button", { name: "Search the site" }).last().click();
    await expect(page.getByRole("dialog", { name: "Search the site" })).toBeVisible();
    await page.keyboard.press("Escape");
    // Real changes only: each is a link to a page that exists, with a date.
    const news = page.getByRole("region", { name: "New in the world" });
    await expect(news.getByRole("link").nth(1)).toHaveAttribute("href", /\/quests\//);
    await expect(news.locator("time").first()).toHaveAttribute("datetime", /^\d{4}-\d{2}-\d{2}$/);
    await expect(page.getByRole("region", { name: "Three ways to use it" })).toBeVisible();
    await page.getByRole("link", { name: "Everything that changed ›" }).click();
    await expect(page).toHaveURL(/\/changes$/);
  });

  test("the old browse addresses go to Characters, and /playthroughs to its Has a playthrough filter", async ({ page }) => {
    await page.goto("/?q=iriel");
    await expect(page).toHaveURL(/\/characters\?q=iriel$/);
    await page.goto("/playthroughs");
    await expect(page).toHaveURL(/\/characters\?run=1$/);
    await expect(page.getByRole("heading", { level: 1, name: "Characters" })).toBeVisible();
  });

  test("Information Confidence is alone at the foot of a quest, a person and a place page, in a box", async ({ page }) => {
    for (const url of ["/quests/q/lights-out", "/people/captain-aldis", "/places/broken-oar-grotto", "/quests/thieves-guild"]) {
      await page.goto(url);
      const box = page.getByRole("region", { name: "Information Confidence" });
      await expect(box, url).toBeVisible();
      await expect(page.getByText("How sure we are")).toHaveCount(0);
      // Nothing after it in the main column but the footer.
      const after = await box.evaluate((el) => {
        let n = el.nextElementSibling;
        let count = 0;
        while (n) {
          count++;
          n = n.nextElementSibling;
        }
        return count;
      });
      expect(after, url).toBe(0);
    }
    await page.goto("/quests/q/lights-out");
    await expect(page.getByRole("region", { name: "Information Confidence" })).toContainText("Read from the game files and checked by a second reader");
  });

  test("a link to a person shows a preview after a moment", async ({ page }) => {
    await page.goto("/quests/q/lights-out");
    await page.getByRole("region", { name: "People" }).getByRole("link", { name: "Captain Aldis" }).hover();
    const tip = page.getByRole("tooltip");
    await expect(tip).toContainText("Captain Aldis");
    await expect(tip).toContainText("Solitude");
  });

  test("home signed in is the visitor's home: the shorter hero, Recent characters, New in the world, then Your characters small and last (Part 9)", async ({ page, context }) => {
    await signIn(context);
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1, name: "LoreRim Planner" })).toBeVisible();
    expect((await page.locator("section[aria-label='LoreRim Planner']").boundingBox())!.height).toBeLessThan(700);
    await expect(page.getByRole("link", { name: "Make a character", exact: true })).toHaveCount(0);
    await expect(page.getByRole("region", { name: "New in the world" })).toBeVisible();
    await expect(page.getByRole("region", { name: "Three ways to use it" })).toHaveCount(0);
    // Your characters: last, a row of covers with names that link, and the way to all of them; none of the run, drafts or Claude.
    const mine = page.getByRole("region", { name: "Your characters" });
    await expect(mine.getByRole("link", { name: "All my characters ›" })).toHaveAttribute("href", "/me");
    await expect(mine.locator('a[href^="/b/"]').first()).toBeVisible();
    await expect(page.getByRole("heading", { name: /^(Drafts|Your Claude)$/ })).toHaveCount(0);
    const after = await mine.evaluate((el) => {
      let n = el.nextElementSibling;
      let c = 0;
      while (n) {
        c++;
        n = n.nextElementSibling;
      }
      return c;
    });
    expect(after).toBe(0);
    await page.screenshot({ path: "test-results/wo157-home-signed-in-1440.png", fullPage: true });
    await page.getByRole("banner").getByRole("button", { name: /account menu/ }).click();
    await expect(page.getByRole("menuitem", { name: "My characters" })).toBeVisible();
  });

  test("Part 10: a recent character card carries its race, name, tagline, maker, likes and level, and lifts under the pointer", async ({ page }) => {
    await page.goto("/");
    const strip = page.locator("[data-rise]");
    const card = strip.getByRole("link").first();
    await expect(card).toBeVisible();
    await expect(card.locator("img[src^='/icons/race-']")).toBeVisible();
    await expect(card.locator("b")).not.toBeEmpty();
    await expect(card).toContainText("LV");
    await expect(card.getByLabel(/likes?$/)).toBeVisible();
    await expect(card.getByLabel(/^Planned to level \d+$/)).toBeVisible();
    // The cover drifts at rest.
    const cover = strip.locator("span[style*='background-image']").first();
    if (await cover.count()) expect(await cover.evaluate((el) => getComputedStyle(el).animationName)).toContain("drift");
    // The strip waits below the hero; once scrolled to it the cards rise, and the pointer then lifts one.
    await strip.scrollIntoViewIfNeeded();
    await page.mouse.wheel(0, 200);
    await expect.poll(() => card.evaluate((el) => Math.abs(new DOMMatrix(getComputedStyle(el).transform).m42)), { timeout: 4000 }).toBeLessThan(0.5);
    await card.hover();
    await expect.poll(() => card.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m42), { timeout: 3000 }).toBeLessThan(-6);
    await page.screenshot({ path: "test-results/wo157-recent-hover-1440.png", clip: { x: 0, y: (await strip.boundingBox())!.y - 80, width: 1440, height: 560 } }).catch(() => {});
    // Keyboard focus lifts it too, and the corners show.
    await page.mouse.move(5, 5);
    await expect.poll(() => card.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m42), { timeout: 3000 }).toBeGreaterThan(-1);
    // Keyboard focus lifts it too.
    await page.locator("body").press("Tab");
    for (let i = 0; i < 60 && !(await card.evaluate((el) => el === document.activeElement)); i++) await page.keyboard.press("Tab");
    await expect.poll(() => card.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m42), { timeout: 3000 }).toBeLessThan(-6);
  });

  test("Part 10: with reduced motion the covers don't drift and the cards don't rise, but the card still lifts", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const card = page.locator("[data-rise]").getByRole("link").first();
    await expect(card).toBeVisible();
    expect(await card.evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
    const cover = card.locator("span[style*='background-image']").first();
    if (await cover.count()) expect(await cover.evaluate((el) => getComputedStyle(el).animationName)).toBe("none");
    await card.hover();
    await expect.poll(() => card.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m42), { timeout: 3000 }).toBeLessThan(-6);
  });

  test("Part 8: the place page's grammar, one Level, the respawn words, quotes without boxes, no broken characters", async ({ page }) => {
    await page.goto("/places/bleak-falls-barrow");
    const main = page.locator("main");
    await expect(main).toContainText("A Nordic ruin next to Riverwood.");
    await expect(page.getByText("Next to Riverwood", { exact: true })).toBeVisible();
    await expect(main).toContainText("Level 40");
    await expect(main).not.toContainText(/level level/i);
    await expect(main).toContainText("In 30 days, or 300 once cleared");
    expect(await main.innerText()).not.toContain("\ufffd");
    const hear = page.getByRole("region", { name: "What points here" });
    await expect(hear).toContainText("What’s this about his court wizards");
    await expect(hear).toContainText("Arvel");
    await expect(hear.getByText(/^The other \d+ lines$/)).toBeVisible();
    // The Arvel journal ends on a sentence, not in the middle of "keep th".
    await expect(hear).not.toContainText(/keep th\b/);
  });

  test("Part 8: a place is said once, a person's offers don't repeat their quests, rewards start with a capital", async ({ page }) => {
    await page.goto("/quests/q/the-golden-claw");
    await expect(page.getByRole("region", { name: "How to start it" })).not.toContainText("in Bleak Falls Barrow in Bleak Falls Barrow");
    await page.goto("/quests/q/lights-out");
    await expect(page.getByRole("region", { name: "Rewards" })).toContainText("The loot from the Icerunner");
    await page.goto("/people/captain-aldis");
    await expect(page.getByRole("region", { name: "His quests" })).toBeVisible();
    await expect(page.getByRole("region", { name: /What he offers/ })).toHaveCount(0);
    await page.goto("/people/lucan-valerius");
    await expect(page.getByRole("region", { name: "What he offers" })).not.toContainText("Quests");
    await expect(page.getByRole("region", { name: "Information Confidence" })).toContainText("Read from the game files and checked by a second reader.");
  });

  test("Part 8: the home buttons sit clear of the fire scene", async ({ page }) => {
    await page.goto("/");
    const hero = await page.locator("section[aria-label='LoreRim Planner']").boundingBox();
    const button = await page.getByRole("link", { name: "Browse characters" }).boundingBox();
    expect(hero!.y + hero!.height - (button!.y + button!.height)).toBeGreaterThan(180);
  });

  test("a person with no hours known has no Where to find section", async ({ page }) => {
    await page.goto("/people/captain-aldis");
    await expect(page.getByRole("heading", { name: /Where to find/ })).toHaveCount(0);
  });
});

test.describe("at 390", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("a menu button opens Characters, World with its icons and Guide; search fills the screen", async ({ page }) => {
    await page.goto("/");
    const header = page.getByRole("banner");
    await expect(header.getByRole("navigation", { name: "Site" })).toBeHidden();
    await header.getByRole("button", { name: "Menu" }).click();
    const menu = header.getByRole("navigation", { name: "Menu" });
    await expect(menu.getByRole("link")).toHaveText(["Characters", /^Quests/, /^People/, /^Places/, /^Gear/, "Guide"]);
    await expect(menu.locator("img")).toHaveCount(4);
    await header.getByRole("button", { name: "Menu" }).click();
    {
      const hero = await page.locator("section[aria-label='LoreRim Planner']").boundingBox();
      const button = await page.getByRole("link", { name: "Browse characters" }).boundingBox();
      expect(hero!.y + hero!.height - (button!.y + button!.height)).toBeGreaterThan(150);
    }
    await header.getByRole("button", { name: "Search the site" }).click();
    const box = await page.getByRole("dialog", { name: "Search the site" }).boundingBox();
    expect(box!.width).toBe(390);
    expect(box!.height).toBeGreaterThan(800);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
  });

  test("Part 10: at 390 the recent characters scroll sideways in cards about 272 px wide", async ({ page }) => {
    await page.goto("/");
    const card = page.locator("[data-rise]").getByRole("link").first();
    await expect(card).toBeVisible();
    expect((await card.boundingBox())!.width).toBeGreaterThan(260);
    expect((await card.boundingBox())!.width).toBeLessThan(285);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
    await page.locator("[data-rise]").scrollIntoViewIfNeeded();
    await page.screenshot({ path: "test-results/wo157-recent-390.png" });
  });

  test("home signed in at 390: Your characters is a row that scrolls sideways, and the page doesn't", async ({ page, context }) => {
    await signIn(context);
    await page.goto("/");
    await expect(page.getByRole("region", { name: "Your characters" })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
    await page.screenshot({ path: "test-results/wo157-home-signed-in-390.png", fullPage: true });
  });
});
