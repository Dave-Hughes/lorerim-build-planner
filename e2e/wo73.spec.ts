/**
 * WO-73: layout and polish. Point 5's check is in wo22.spec.ts and point 12's in
 * src/lib/rules/wo73.test.ts; the rest are here, by point number.
 */
import { expect, test, type Locator, type Page } from "@playwright/test";
import { signIn } from "./helpers";
import { FOUR_BUILD_ID, FRESH_BUILD_ID, SEVARI_BUILD_ID, SPELLS_BUILD_ID } from "./seed";

const sky = (page: Page, tree: string) => page.locator(`[aria-label="${tree} tree: drag or use the arrow keys to move around, Ctrl and the wheel to zoom"]`).first();

/** Every star in the tree has its label, inside the box, and no two labels overlap. */
async function labelsFit(box: Locator) {
  const r = await box.evaluate((el) => {
    const b = el.getBoundingClientRect();
    const stars = el.querySelectorAll("[data-perk]").length;
    const rects = [...el.querySelectorAll('[aria-hidden="true"]')].filter((l) => l.querySelector('[class*="labelName"]')).map((l) => l.getBoundingClientRect());
    const outside = rects.filter((r) => r.left < b.left - 0.5 || r.top < b.top - 0.5 || r.right > b.right + 0.5 || r.bottom > b.bottom + 0.5).length;
    let overlaps = 0;
    for (let i = 0; i < rects.length; i++)
      for (let j = i + 1; j < rects.length; j++) {
        const a = rects[i];
        const c = rects[j];
        if (a.left < c.right && c.left < a.right && a.top < c.bottom && c.top < a.bottom) overlaps++;
      }
    return { stars, labels: rects.length, outside, overlaps };
  });
  expect(r.outside, "labels outside the box").toBe(0);
  expect(r.overlaps, "overlapping labels").toBe(0);
  expect(r.labels, "stars with a label").toBe(r.stars);
}

test.describe("on a 1512 × 806 laptop window", () => {
  test.use({ viewport: { width: 1512, height: 806 } });

  test("point 1: One-Handed and Destiny open fitted in the editor, every star labelled, nothing cut or overlapping", async ({ page, context }) => {
    await signIn(context);
    await page.goto(`/b/${SEVARI_BUILD_ID}/edit?level=30`);
    for (const tree of ["One-Handed", "Destiny"]) {
      await page.getByRole("region", { name: "Attribute and skills" }).getByRole("button", { name: tree, exact: true }).click();
      // Fitted: zooming out is already as far as it goes.
      await expect(page.getByRole("button", { name: "Zoom out" })).toBeDisabled();
      await labelsFit(sky(page, tree));
    }
  });

  test("point 2: a skill's perk badge never runs into its values", async ({ page, context }) => {
    await signIn(context);
    await page.goto(`/b/${SEVARI_BUILD_ID}/edit?level=100`);
    const rows = page.getByRole("region", { name: "Attribute and skills" }).locator('[class*="skillRow"]').filter({ has: page.locator('[class*="heldCount"]') });
    expect(await rows.count()).toBeGreaterThan(0);
    for (const row of await rows.all()) {
      const gap = await row.evaluate((r) => {
        const badge = r.querySelector('[class*="heldCount"]')!.getBoundingClientRect();
        const range = document.createRange();
        range.selectNodeContents(r.querySelector('[class*="skillVals"]')!);
        return range.getBoundingClientRect().left - badge.right;
      });
      expect(gap).toBeGreaterThan(0);
    }
  });

  test("point 3: One-Handed, the max skill note and the traits keep their words together", async ({ page, context }) => {
    // One line each: a single box for the text.
    const lines = (l: Locator) => l.evaluate((el) => el.getClientRects().length);
    await page.goto(`/b/${SEVARI_BUILD_ID}?level=30`);
    const taken = page.getByRole("region", { name: "Taken by level 30", exact: true });
    expect(await lines(taken.getByText("One-Handed", { exact: true }).first())).toBe(1);
    // "Focused Combat: One-Handed": the hyphenated word is kept whole.
    expect(await lines(page.getByRole("region", { name: "Character" }).locator('span[style*="nowrap"]', { hasText: "One-Handed" }).first())).toBe(1);
    await signIn(context);
    await page.goto(`/b/${SEVARI_BUILD_ID}/edit?level=1`);
    // The note's own text, beside its "i" (one line: a single box).
    const note = page.locator('[class*="maxSkill"]').first();
    await expect(note).toContainText("Max skill 51 at level 1");
    expect(await note.evaluate((el) => { const r = document.createRange(); r.selectNodeContents(el.firstChild!); return r.getClientRects().length; })).toBe(1);
  });

  test("point 6: Reset and Remove sit by the level title; the footer keeps the ways forward", async ({ page, context }) => {
    await signIn(context);
    await page.goto(`/b/${SEVARI_BUILD_ID}/edit?level=75`);
    const bar = page.getByRole("region", { name: "Level", exact: true });
    const footer = page.locator('[data-tour="footer"]');
    await expect(bar.getByRole("button", { name: "Reset levels 51 to 75" })).toBeVisible();
    await expect(footer.getByRole("button", { name: /^(Reset|Remove) / })).toHaveCount(0);
    await expect(footer.getByRole("button", { name: "Go to levels 76 to 100" })).toBeVisible();
    // The last level: Remove, by the title too.
    await page.goto(`/b/${SEVARI_BUILD_ID}/edit?level=100`);
    await expect(bar.getByRole("button", { name: "Remove levels 76 to 100" })).toBeVisible();
    await expect(footer.getByRole("button", { name: /^(Reset|Remove) / })).toHaveCount(0);
  });

  test("point 10: a clicked star shows its card, not its hover tag too", async ({ page, context }) => {
    await signIn(context);
    await page.goto(`/b/${SEVARI_BUILD_ID}/edit?level=30`);
    const star = page.locator('[data-perk="One-Handed:Deathbringer"]');
    await star.click();
    await expect(page.getByRole("dialog", { name: "Perk details" })).toBeVisible();
    await star.hover();
    await expect(star.locator('[class*="tag"]')).toBeHidden();
  });
});

test.describe("at 1440", () => {
  test.use({ viewport: { width: 1440, height: 1000 } });

  test("point 1: the build page opens One-Handed and Destiny fitted, every star labelled, nothing cut or overlapping", async ({ page }) => {
    await page.goto(`/b/${SEVARI_BUILD_ID}?level=30`);
    await page.getByRole("tablist", { name: "Perk trees" }).getByRole("tab", { name: /One-Handed/ }).click();
    await labelsFit(sky(page, "One-Handed"));
    await labelsFit(sky(page, "Destiny"));
  });

  test("point 7: two levels don't fill the row; cells keep a full row's width, from the left", async ({ page }) => {
    await page.goto(`/b/${FOUR_BUILD_ID}?level=1`);
    const frame = page.locator("[data-row-frame]").first();
    const row = frame.locator("> div");
    const [f, r] = [await frame.boundingBox(), await row.boundingBox()];
    // Four of twelve: a third of the width, at the left edge.
    expect(Math.abs(r!.width - f!.width / 3)).toBeLessThan(2);
    expect(Math.abs(r!.x - f!.x)).toBeLessThan(1);
  });

  test("point 8: spells show their game description, and a search with no match says so", async ({ page, context }) => {
    await signIn(context);
    await page.goto(`/b/${SPELLS_BUILD_ID}/edit?level=1`);
    const picks = page.getByRole("region", { name: "Novice Destruction spells" });
    // wo42.spec.ts may have taken Novice Destruction here already.
    if (!(await picks.count())) {
      await page.getByRole("button", { name: "Destruction", exact: true }).click();
      await page.getByRole("button", { name: /^Novice Destruction, No requirement, can take now/ }).click();
      await page.getByRole("complementary", { name: "Perk details" }).getByRole("button", { name: "Confirm" }).click();
    }
    // Full from before: open it again.
    const change = picks.getByRole("button", { name: "Change" });
    if (await change.count()) await change.click();
    await expect(picks.getByRole("listitem").filter({ hasText: "Flames" }).first()).toContainText(/fire damage/i);
    await picks.getByPlaceholder("Search spells").fill("zzzz");
    await expect(picks).toContainText("No spells match.");
  });

  test("point 9: Ruled out shows in the legend only for a tree with a star ruled out", async ({ page, context }) => {
    await signIn(context);
    await page.goto(`/b/${FRESH_BUILD_ID}/edit?level=1`);
    const skills = page.getByRole("region", { name: "Attribute and skills" });
    const legend = page.getByRole("region", { name: "Perks" }).locator('[class*="legend"]').getByText("Ruled out", { exact: true });
    await skills.getByRole("button", { name: "One-Handed", exact: true }).click();
    await expect(legend).toHaveCount(0);
    // Weapon Mastery rules out Block's Weapons Master.
    await page.locator('[data-perk="One-Handed:Weapon Mastery"]').click();
    await page.getByRole("dialog", { name: "Perk details" }).getByRole("button", { name: "Confirm" }).click();
    await expect(legend).toHaveCount(0);
    await skills.getByRole("button", { name: "Block", exact: true }).click();
    await expect(legend).toBeVisible();
  });

  test("point 11: the wizard's preview shows the build page's tabs", async ({ page, context }) => {
    await signIn(context);
    await page.goto("/new?kind=alone");
    await page.getByRole("article").filter({ hasText: "Altmer" }).getByRole("button", { name: /^Choose/ }).click();
    await expect(page.getByText("Draft saved")).toBeVisible();
    await page.goto("/new?kind=alone&step=name");
    const preview = page.getByRole("img", { name: /^Preview in / }).first();
    await expect(preview.locator('[class*="tabOn"]')).toHaveText("Levels");
    await expect(preview).toContainText("Guide");
  });
});

test.describe("on a phone", () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

  test("point 4: the ruler labels every 25 on a long build, and the start wraps", async ({ page }) => {
    await page.goto(`/b/${SEVARI_BUILD_ID}?level=30`);
    const ruler = page.getByLabel("Whole build, levels 1 to 100");
    for (const n of ["25", "50", "75", "100"]) await expect(ruler.getByText(n, { exact: true })).toBeVisible();
    for (const n of ["5", "10", "95"]) await expect(ruler.getByText(n, { exact: true })).toBeHidden();
    const start = page.getByRole("region", { name: "Character" }).getByRole("button", { name: /From Overseas/ });
    await expect(start).toBeVisible();
    expect(await start.evaluate((b) => b.scrollWidth <= b.clientWidth)).toBe(true);
  });
});
