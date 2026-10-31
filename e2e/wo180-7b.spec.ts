/**
 * WO-180 Part 7b (Mac): the map's labels and counts on the homes view, capitals on the How it starts cell, pronouns in Not sure yet, and a branch joiner that is not a step.
 */
import { expect, test, type Page } from "@playwright/test";

const map = (page: Page) => page.getByRole("group", { name: "Map of Skyrim" });
const plate = (page: Page, text: RegExp) => map(page).locator("a[class*='pin'] [class*='plate']").filter({ hasText: text });

for (const width of [1440, 390]) {
  test(`the homes map at ${width}: Whiterun's own label stays at the opening view and after zooming out, and no count sits on a count`, async ({ page }) => {
    await page.setViewportSize({ width, height: width === 1440 ? 900 : 844 });
    await page.goto("/map?types=homes");
    await expect(map(page)).toBeVisible();
    await page.waitForTimeout(1200);
    const badgesApart = async () => {
      const boxes = await map(page).locator("button[class*='cluster']").evaluateAll((els) => els.map((e) => e.getBoundingClientRect()).map((r) => ({ x: r.x, y: r.y, w: r.width, h: r.height })));
      for (let i = 0; i < boxes.length; i++)
        for (let j = i + 1; j < boxes.length; j++) {
          const a = boxes[i];
          const b = boxes[j];
          expect(a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y, `two counts overlap at ${Math.round(a.x)},${Math.round(a.y)}`).toBe(false);
        }
    };
    await expect(plate(page, /^Whiterun, \d+$/).first()).toBeVisible();
    await badgesApart();
    await page.screenshot({ path: `test-results/wo180-7b-homes-${width}.png` });
    for (let i = 0; i < 2; i++) {
      await page.getByRole("button", { name: "Zoom out", exact: true }).click();
      await page.waitForTimeout(600);
      await expect(plate(page, /^Whiterun, \d+$/).first(), `Whiterun named after ${i + 1} zoom-out`).toBeVisible();
      await badgesApart();
    }
    await page.screenshot({ path: `test-results/wo180-7b-homes-out-${width}.png` });
  });
}

test("no name covers another pin's diamond on the homes map after one zoom in (Anga's Mill and Windhelm)", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/map?types=homes");
  await page.waitForTimeout(1200);
  await page.getByRole("button", { name: "Zoom in", exact: true }).click();
  await page.waitForTimeout(700);
  const covered = await map(page).evaluate((root) => {
    const plates = [...root.querySelectorAll("a[class*='pin'] [class*='plate']")].map((p) => ({ el: p, r: p.getBoundingClientRect(), pin: p.closest("a") }));
    const diamonds = [...root.querySelectorAll("a[class*='pin'] i")].map((d) => ({ r: d.getBoundingClientRect(), pin: d.closest("a") }));
    const hits: string[] = [];
    for (const p of plates) for (const d of diamonds) if (d.pin !== p.pin && d.r.x + d.r.width > p.r.x && d.r.x < p.r.x + p.r.width && d.r.y + d.r.height > p.r.y && d.r.y < p.r.y + p.r.height) hits.push(`${p.el.textContent} covers ${d.pin?.textContent}`);
    return hits;
  });
  expect(covered.filter((h) => /Windhelm|Anga/.test(h))).toEqual([]);
  await page.screenshot({ path: "test-results/wo180-7b-homes-in-1440.png" });
});

test("a phrase that stands alone starts with a capital in the How it starts cell", async ({ page }) => {
  for (const path of ["/quests/q/the-golden-claw", "/quests/q/hunting-the-monster"]) {
    await page.goto(path);
    const cell = page.getByRole("region", { name: "At a glance" }).locator("> div").filter({ hasText: "How it starts" }).first();
    const lines = (await cell.innerText()).split("\n").map((l) => l.trim()).filter(Boolean).slice(1);
    expect(lines.length, path).toBeGreaterThan(0);
    for (const l of lines) expect(l, `${path}: ${l}`).toMatch(/^[^a-z]/);
  }
});

test("Not sure yet says he or she on a page that says he or she", async ({ page }) => {
  await page.goto("/people/sondas-drenim");
  await expect(page.getByRole("heading", { level: 1, name: "Sondas Drenim" })).toBeVisible();
  const ic = page.getByRole("region", { name: "Information Confidence" });
  for (const line of ["Where he is through the day and night.", "What changes where he is.", "How to recruit or marry him."]) await expect(ic.getByText(line, { exact: true })).toBeVisible();
  await page.goto("/people/hrefna");
  const f = page.getByRole("region", { name: "Information Confidence" });
  for (const line of ["Where she is through the day and night.", "What changes where she is."]) await expect(f.getByText(line, { exact: true })).toBeVisible();
  await expect(f.getByText(/^(Where they|What changes where they|How to recruit or marry them)/)).toHaveCount(0);
});

test("The Dwemer Specialist: 'Then as the main branch' is a sentence under its branch, not a numbered step", async ({ page }) => {
  await page.goto("/quests/q/the-dwemer-specialist");
  const steps = page.getByRole("region", { name: "The steps" });
  await expect(steps).toContainText("You had already killed Nimhe");
  await expect(steps.locator("li").filter({ hasText: /^Then as the main branch/ })).toHaveCount(0);
  await expect(steps.getByText("Then as the main branch.", { exact: true })).toBeVisible();
});
