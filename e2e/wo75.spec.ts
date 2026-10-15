/**
 * WO-75: closing out WO-74's open checks. Point 1 (level nav's median and worst) is perf.spec.ts.
 * Each test is named by its point.
 */
import { expect, test, type Locator, type Page } from "@playwright/test";
import { signIn } from "./helpers";
import { SEVARI_BUILD_ID } from "./seed";

const sky = (page: Page, tree: string) => page.locator(`[aria-label="${tree} tree: drag or use the arrow keys to move around, Ctrl and the wheel to zoom"]`).first();

interface Facts {
  stars: number;
  labels: number;
  overlaps: number;
  cut: number;
  /** Taken stars, by name. */
  taken: string[];
  /** Not-yet labels sitting where an unlabelled taken or can-take star could have had its name. */
  inTheWay: string[];
  /** Labels without the halo. */
  noHalo: number;
}

/** Facts about one tree's labels, measured on the page. */
function facts(box: Locator): Promise<Facts> {
  return box.evaluate((el) => {
    const b = el.getBoundingClientRect();
    const stars = [...el.querySelectorAll<HTMLElement>("button[data-perk]")];
    const centre = (s: HTMLElement) => {
      const r = s.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    };
    const labelOf = (s: HTMLElement) => (s.nextElementSibling?.querySelector('[class*="labelName"]') ? (s.nextElementSibling as HTMLElement) : null);
    const dist = (r: DOMRect, p: { x: number; y: number }) => Math.hypot(Math.max(r.left - p.x, 0, p.x - r.right), Math.max(r.top - p.y, 0, p.y - r.bottom));
    const kind = (s: HTMLElement) => (/ruled/.test(s.className) ? "ruled" : /taken|partial/.test(s.className) ? "taken" : /open/.test(s.className) ? "open" : "locked");
    const rects: DOMRect[] = [];
    let cut = 0;
    let noHalo = 0;
    const wanting = stars.filter((s) => (kind(s) === "taken" || kind(s) === "open") && !labelOf(s));
    const inTheWay: string[] = [];
    for (const s of stars) {
      const label = labelOf(s);
      if (!label) continue;
      const r = label.getBoundingClientRect();
      rects.push(r);
      if (r.left < b.left - 0.5 || r.top < b.top - 0.5 || r.right > b.right + 0.5 || r.bottom > b.bottom + 0.5) cut++;
      const shadow = getComputedStyle(label).textShadow;
      if (!shadow || shadow === "none" || shadow.split("px,").length < 4) noHalo++;
      // A not-yet label at least as near an unlabelled taken or can-take star as its own.
      if (kind(s) === "locked") {
        const own = dist(r, centre(s));
        const w = wanting.find((x) => dist(r, centre(x)) <= own);
        if (w) inTheWay.push(`${s.dataset.perk} (by ${w.dataset.perk})`);
      }
    }
    let overlaps = 0;
    for (let i = 0; i < rects.length; i++)
      for (let j = i + 1; j < rects.length; j++) {
        const a = rects[i];
        const c = rects[j];
        if (a.left < c.right && c.left < a.right && a.top < c.bottom && c.top < a.bottom) overlaps++;
      }
    const taken = stars.filter((s) => kind(s) === "taken").map((s) => s.dataset.perk!.split(":")[1]);
    return { stars: stars.length, labels: rects.length, overlaps, cut, taken, inTheWay, noHalo };
  });
}

/** The build page's tree: Destiny from its fold, a skill tree from its tab (on a phone, after Tree). */
async function pageTree(page: Page, tree: string, phone: boolean) {
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
      test(`point 2: ${tree} at level ${level}: names ranked, none overlapping or cut, every taken perk listed below`, async ({ page }) => {
        await page.goto(`/b/${SEVARI_BUILD_ID}?level=${level}`);
        const f = await facts(await pageTree(page, tree, true));
        expect(f.inTheWay, "not-yet labels in a taken or can-take star's place").toEqual([]);
        expect(f.overlaps, "overlapping labels").toBe(0);
        expect(f.cut, "labels cut by the box").toBe(0);
        // Below the tree: the held list (a skill tree) or Destiny's own.
        const held = page.getByRole("region", { name: tree === "Destiny" ? `Destiny taken by level ${level}` : `Taken by level ${level}`, exact: true });
        for (const name of f.taken) await expect(held, name).toContainText(name);
      });
});

test.describe("at 1440", () => {
  test.use({ viewport: { width: 1440, height: 1000 } });

  for (const level of [30, 100])
    for (const tree of ["One-Handed", "Destiny"]) {
      test(`points 3 and 4: the build page's ${tree} at level ${level} keeps every label, each with its halo`, async ({ page }) => {
        await page.goto(`/b/${SEVARI_BUILD_ID}?level=${level}`);
        const f = await facts(await pageTree(page, tree, false));
        expect(f.labels, "stars with a label").toBe(f.stars);
        expect(f.noHalo, "labels without the halo").toBe(0);
        expect(f.overlaps).toBe(0);
        expect(f.cut).toBe(0);
      });

      test(`points 3 and 4: the editor's ${tree} at level ${level} keeps every label, each with its halo`, async ({ page, context }) => {
        await signIn(context);
        await page.goto(`/b/${SEVARI_BUILD_ID}/edit?level=${level}`);
        await page.getByRole("region", { name: "Attribute and skills" }).getByRole("button", { name: tree, exact: true }).click();
        const f = await facts(sky(page, tree));
        expect(f.labels, "stars with a label").toBe(f.stars);
        expect(f.noHalo, "labels without the halo").toBe(0);
        expect(f.overlaps).toBe(0);
        expect(f.cut).toBe(0);
      });
    }
});
