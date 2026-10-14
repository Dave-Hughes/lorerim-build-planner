/**
 * WO-74: tree labels on phones, labels that read as their star's, and small layout faults. Point 1
 * (level nav under 120 ms) is perf.spec.ts. Each test is named by its point.
 */
import { expect, test, type Locator, type Page } from "@playwright/test";
import { FOUR_BUILD_ID, SEVARI_BUILD_ID } from "./seed";

const sky = (page: Page, tree: string) => page.locator(`[aria-label="${tree} tree: drag or use the arrow keys to move around, Ctrl and the wheel to zoom"]`).first();

/** Facts about one tree's labels, measured on the page. */
function labelFacts(box: Locator) {
  return box.evaluate((el) => {
    const b = el.getBoundingClientRect();
    const stars = [...el.querySelectorAll<HTMLElement>("button[data-perk]")];
    const centre = (s: HTMLElement) => {
      const r = s.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2, id: s.dataset.perk! };
    };
    const all = stars.map(centre);
    const labelOf = (s: HTMLElement) => (s.nextElementSibling?.querySelector('[class*="labelName"]') ? (s.nextElementSibling as HTMLElement) : null);
    const dist = (r: DOMRect, p: { x: number; y: number }) => Math.hypot(Math.max(r.left - p.x, 0, p.x - r.right), Math.max(r.top - p.y, 0, p.y - r.bottom));
    const missing: string[] = [];
    const nearer: string[] = [];
    const rects: DOMRect[] = [];
    let cut = 0;
    for (const s of stars) {
      const important = /taken|partial|open/.test(s.className) && !/ruled/.test(s.className);
      const label = labelOf(s);
      if (important && !label) missing.push(s.dataset.perk!);
      if (!label) continue;
      const r = label.getBoundingClientRect();
      rects.push(r);
      if (r.left < b.left - 0.5 || r.top < b.top - 0.5 || r.right > b.right + 0.5 || r.bottom > b.bottom + 0.5) cut++;
      const own = dist(r, centre(s));
      const other = all.find((o) => o.id !== s.dataset.perk && dist(r, o) < own - 0.5);
      if (other) nearer.push(`${s.dataset.perk} (by ${other.id})`);
    }
    let overlaps = 0;
    const tight: string[] = [];
    for (let i = 0; i < rects.length; i++)
      for (let j = i + 1; j < rects.length; j++) {
        const a = rects[i];
        const c = rects[j];
        const sameRow = a.top < c.bottom && c.top < a.bottom;
        if (sameRow && a.left < c.right && c.left < a.right) overlaps++;
        else if (sameRow && Math.min(Math.abs(c.left - a.right), Math.abs(a.left - c.right)) < 10) tight.push(`${i}/${j}`);
      }
    // The tree's own link lines (not leader lines) through a label's text.
    const svg = el.querySelector("svg")!;
    const ctm = svg.getScreenCTM()!;
    const pt = (x: number, y: number) => new DOMPoint(x, y).matrixTransform(ctm);
    const lines = [...svg.querySelectorAll("line")].filter((l) => !/leader|edgeHalo/.test(l.getAttribute("class") ?? ""));
    const crossesBox = (r: DOMRect, a: DOMPoint, c: DOMPoint) => {
      let t0 = 0;
      let t1 = 1;
      const dx = c.x - a.x;
      const dy = c.y - a.y;
      for (const [p, q] of [[-dx, a.x - r.left], [dx, r.right - a.x], [-dy, a.y - r.top], [dy, r.bottom - a.y]]) {
        if (p === 0) {
          if (q < 0) return false;
        } else {
          const t = q / p;
          if (p < 0) t0 = Math.max(t0, t);
          else t1 = Math.min(t1, t);
          if (t0 > t1) return false;
        }
      }
      return true;
    };
    const crossing = new Set<string>();
    for (const s of stars) {
      const label = labelOf(s);
      if (!label) continue;
      for (const t of label.querySelectorAll('[class*="labelName"], [class*="labelReq"]')) {
        const range = document.createRange();
        range.selectNodeContents(t);
        const r = range.getBoundingClientRect();
        if (lines.some((l) => crossesBox(r, pt(+l.getAttribute("x1")!, +l.getAttribute("y1")!), pt(+l.getAttribute("x2")!, +l.getAttribute("y2")!)))) crossing.add(s.dataset.perk!);
      }
    }
    return { missing, nearer, cut, overlaps, tight, crossing: [...crossing] };
  });
}

/** Opens a tree on the build page: Destiny from its fold, a skill tree from its tab (on a phone, after Tree). */
async function openTree(page: Page, tree: string, phone: boolean) {
  if (tree === "Destiny") {
    const show = page.getByRole("button", { name: "Show the tree" });
    if (await show.count()) await show.click();
  } else {
    if (phone) await page.getByRole("button", { name: "Tree", exact: true }).first().click();
    await page.getByRole("tablist", { name: "Perk trees" }).getByRole("tab", { name: new RegExp(`^${tree}`) }).click();
  }
  return sky(page, tree);
}

test.describe("on a phone", () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

  for (const level of [30, 100])
    for (const tree of ["One-Handed", "Destiny"])
      test(`point 2: ${tree} at level ${level}: every taken and can-take star has a label, none overlapping, cut or nearer another star`, async ({ page }) => {
        await page.goto(`/b/${SEVARI_BUILD_ID}?level=${level}`);
        const f = await labelFacts(await openTree(page, tree, true));
        expect(f.missing, "taken and can-take stars without a label").toEqual([]);
        expect(f.overlaps, "overlapping labels").toBe(0);
        expect(f.cut, "labels cut by the box").toBe(0);
        expect(f.nearer, "labels nearer another star").toEqual([]);
      });

  test("point 5: four cells fill the level row", async ({ page }) => {
    await page.goto(`/b/${FOUR_BUILD_ID}?level=1`);
    const frame = page.locator("[data-row-frame]").first();
    const [f, r] = [await frame.boundingBox(), await frame.locator("> div").boundingBox()];
    expect(Math.abs(r!.width - f!.width)).toBeLessThan(1.5);
  });

  test("point 6: Destiny diamonds on the ruler never overlap", async ({ page }) => {
    await page.goto(`/b/${SEVARI_BUILD_ID}?level=30`);
    const boxes = await page
      .getByLabel("Whole build, levels 1 to 100")
      .locator('[class*="markDestiny"]')
      .evaluateAll((els) => els.map((e) => e.getBoundingClientRect()).map((r) => ({ l: r.left, r: r.right })));
    expect(boxes.length).toBeGreaterThan(3);
    const sorted = boxes.sort((a, b) => a.l - b.l);
    for (let i = 1; i < sorted.length; i++) expect(sorted[i].l, `diamond ${i}`).toBeGreaterThanOrEqual(sorted[i - 1].r - 0.5);
  });
});

test.describe("at 1440", () => {
  test.use({ viewport: { width: 1440, height: 1000 } });

  for (const tree of ["One-Handed", "Destiny"])
    test(`point 3: ${tree}: no link line crosses a label's text, and labels on one row are 10px apart`, async ({ page }) => {
      await page.goto(`/b/${SEVARI_BUILD_ID}?level=30`);
      const f = await labelFacts(await openTree(page, tree, false));
      expect(f.tight, "labels on one row under 10px apart").toEqual([]);
      expect(f.overlaps).toBe(0);
      expect(f.crossing, "labels a link line crosses").toEqual([]);
    });

  test("point 4: the Taken-by panel keeps a gutter between a tree's name and its first perk", async ({ page }) => {
    await page.goto(`/b/${SEVARI_BUILD_ID}?level=30`);
    // The open tree's group lists its perks; the others fold to a count.
    await page.getByRole("tablist", { name: "Perk trees" }).getByRole("tab", { name: /^One-Handed/ }).click();
    const group = page.getByRole("region", { name: "Taken by level 30", exact: true }).locator('[class*="perkGroup"]').filter({ hasText: "One-Handed" }).first();
    const gap = await group.evaluate((g) => {
      const name = g.firstElementChild!;
      const range = document.createRange();
      range.selectNodeContents(name);
      const perk = g.querySelector("button")!.getBoundingClientRect();
      return perk.left - range.getBoundingClientRect().right;
    });
    expect(gap).toBeGreaterThanOrEqual(10);
  });

  test("point 6: the ruler's numbers stay clear of the selected diamond and the zoom lines", async ({ page }) => {
    await page.goto(`/b/${SEVARI_BUILD_ID}?level=30`);
    const ruler = page.getByLabel("Whole build, levels 1 to 100");
    for (const n of ["1", "30"]) {
      const label = ruler.getByText(n, { exact: true });
      // The number is on top where it sits: nothing drawn over its middle.
      const onTop = await label.evaluate((l) => {
        const r = l.getBoundingClientRect();
        return document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2) === l;
      });
      expect(onTop, `number ${n}`).toBe(true);
    }
  });
});
