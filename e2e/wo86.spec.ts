/**
 * WO-86: the coming soon page, third pass. Iriel's gear timeline, Marksman tree and level cards (the
 * app's own, from her fixture). Since 17 Oct they follow the page's scroll instead of a clock, and
 * each box keeps one height the whole way, so nothing below it moves (Dave: on a phone the growing
 * boxes pushed the page around). (WO-87 replaced the hero's six shots with pixel art: wo87.spec.ts.)
 */
import { expect, test, type Page } from "@playwright/test";

const boxes = (page: Page) =>
  page.evaluate(() => {
    const h = (sel: string) =>
      Math.round(document.querySelector(sel)!.getBoundingClientRect().height);
    return {
      page: document.documentElement.scrollHeight,
      gear: h('[data-live="gear"]'),
      cards: h('[data-live="cards"]'),
      tree: h('[class*="treeSide"]'),
    };
  });

/** The page once its fonts and images are in, so nothing measured later is still loading. */
async function open(page: Page) {
  await page.goto("/coming-soon");
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
}

/** Scrolls in steps from `from` to `to` (the whole page by default), calling `each` after every step. */
async function scrollThrough(
  page: Page,
  each: () => Promise<void>,
  step = 30,
  from = 0,
  to?: number,
) {
  const total =
    to ?? (await page.evaluate(() => document.documentElement.scrollHeight));
  for (let y = from; y <= total; y += step) {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await page.waitForTimeout(20);
    await each();
  }
}

test.describe("desktop", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("with reduced motion nothing moves: the tree and gear at 50, the level 1 card", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await open(page);
    await page.evaluate(() =>
      window.scrollTo(0, document.documentElement.scrollHeight / 2),
    );
    await expect(page.locator("[data-level]")).toHaveText("50");
    await expect(
      page.locator('[data-live="gear"]').getByRole("heading", { level: 2 }),
    ).toHaveText(/Gear\s*at level 50/);
    await expect(page.locator("[data-card]")).toHaveAttribute(
      "data-card",
      "1-1",
    );
  });

  test("the gear, tree and cards follow the scroll: Elven Light Bow and Elven Arrow come in at 14, the card's range is on the ruler, and all of it ends at 50", async ({
    page,
  }) => {
    await open(page);
    const level = page.locator("[data-level]");
    const gear = page.locator('[data-live="gear"]');
    const cards = page.locator('[data-live="cards"]');
    await expect(level).toHaveText("20");
    await expect(gear.getByRole("heading", { level: 2 })).toHaveText(
      /Gear\s*at level 1$/,
    );

    // Where a box starts and stops playing: its top 85% down the screen, its bottom above the middle.
    const range = (sel: string) =>
      page.evaluate((sel) => {
        const r = document.querySelector(sel)!.getBoundingClientRect();
        const top = r.top + window.scrollY;
        return [
          Math.round(top - innerHeight * 0.85),
          Math.round(top + r.height - innerHeight * 0.55),
        ];
      }, sel);

    let sawFourteen = false;
    const [g0, g1] = await range('[data-live="gear"]');
    await scrollThrough(
      page,
      async () => {
        const head = (
          (await gear.getByRole("heading", { level: 2 }).textContent()) ?? ""
        ).replace(/\s+/g, " ");
        if (!sawFourteen && /at level 14$/.test(head)) {
          await expect(gear).toContainText("New: Elven Light Bow, Elven Arrow");
          sawFourteen = true;
        }
      },
      4,
      g0,
      g1,
    );
    expect(sawFourteen).toBe(true);

    let sawRange = false;
    const [c0, c1] = await range('[data-live="cards"]');
    await scrollThrough(
      page,
      async () => {
        const at = await cards.locator("[data-card]").getAttribute("data-card");
        if (!sawRange && at && at !== "1-1") {
          await expect(cards.locator("[data-range]")).toHaveAttribute(
            "data-range",
            at,
          );
          sawRange = true;
        }
      },
      40,
      c0,
      c1,
    );
    expect(sawRange).toBe(true);

    // Past them all, everything holds at the end.
    await page.evaluate(() =>
      window.scrollTo(0, document.documentElement.scrollHeight),
    );
    await expect(level).toHaveText("50");
    await expect(gear.getByRole("heading", { level: 2 })).toHaveText(
      /Gear\s*at level 50/,
    );
    await expect(cards.locator("[data-card]")).toHaveAttribute(
      "data-card",
      "46-50",
    );
  });
});

for (const [name, viewport] of [
  ["phone", { width: 390, height: 844 }],
  ["desktop", { width: 1440, height: 900 }],
] as const) {
  test(`on a ${name}, the page and the gear, tree and card boxes keep one height the whole way down`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await open(page);
    const first = await boxes(page);
    await scrollThrough(page, async () => {
      expect(await boxes(page)).toEqual(first);
    });
    // And sitting still, the art's clock moves nothing.
    await page.waitForTimeout(2000);
    expect(await boxes(page)).toEqual(first);
  });
}
