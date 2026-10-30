/**
 * WO-180 Part 6b (Mac): the map's labels with Homes picked, and the small fixes on the quest, place and people pages.
 * The step check and the capital letters are unit tests (src/lib/pages/wo180-6b.test.ts).
 */
import { expect, test, type Page } from "@playwright/test";

type R = [number, number, number, number];
const hit = (a: R, b: R) => a[0] < b[2] && a[2] > b[0] && a[1] < b[3] && a[3] > b[1];

/** Every plate on the map, in the window's pixels, with what it says. */
async function plates(page: Page) {
  return page.locator("a[class*='pin'] [class*='plate']").evaluateAll((els) =>
    els.flatMap((e) => {
      const b = e.getBoundingClientRect();
      return b.width ? [{ text: (e.textContent ?? "").trim(), box: [b.left, b.top, b.right, b.bottom] as [number, number, number, number] }] : [];
    }),
  );
}

for (const [w, h] of [[1440, 900], [390, 844]] as const) {
  test(`Homes picked at ${w}: no name sits on another, and a town's count is not covered`, async ({ page }) => {
    test.setTimeout(120_000);
    await page.setViewportSize({ width: w, height: h });
    await page.goto("/map?types=homes");
    await page.waitForTimeout(2000);
    for (let n = 0; n <= 2; n++) {
      if (n) {
        await page.getByRole("button", { name: "Zoom out" }).click();
        await page.waitForTimeout(900);
      }
      const all = await plates(page);
      for (let i = 0; i < all.length; i++)
        for (let j = i + 1; j < all.length; j++) expect(hit(all[i].box, all[j].box), `${w}, ${n} zoom outs: "${all[i].text}" and "${all[j].text}" overlap`).toBe(false);
      // And no count badge pokes out from behind a name.
      const badges = await page.locator("button[class*='cluster']").evaluateAll((els) => els.map((e) => e.getBoundingClientRect()).map((b) => [b.left, b.top, b.right, b.bottom] as [number, number, number, number]));
      for (const b of badges) for (const p of all) expect(hit(b, p.box), `${w}, ${n} zoom outs: a count sits under "${p.text}"`).toBe(false);
      await page.screenshot({ path: `test-results/wo180-6b-homes-zoom${n}-${w}.png` });
    }
  });
}

test("The Golden Claw keeps both names after the second and third zoom out at 390", async ({ page }) => {
  test.setTimeout(120_000);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/map?quest=the-golden-claw");
  await page.waitForTimeout(1800);
  for (let n = 1; n <= 3; n++) {
    await page.getByRole("button", { name: "Zoom out" }).click();
    await page.waitForTimeout(900);
    const named = await page.getByRole("group", { name: "Map of Skyrim" }).locator("a[class*='pin']").evaluateAll((pins) => pins.filter((p) => p.querySelector("i")).map((p) => (p.querySelector("[class*='plate']")?.textContent ?? "").trim()).filter(Boolean));
    expect(named, `after ${n} zoom outs`).toHaveLength(2);
    if (n === 2) await page.screenshot({ path: "test-results/wo180-6b-golden-claw-zoom2-390.png" });
  }
});

const text = async (page: Page, path: string) => {
  await page.goto(path);
  return page.locator("main").innerText();
};

test("the small fixes on the pages", async ({ page }) => {
  // Hunter's Mark: its jobs have no pages, so it does not say to open one.
  expect(await text(page, "/quests/hunters-mark")).not.toContain("Open one for how it starts");
  // Feral Soul-Shriven: no colon on a colon.
  const feral = await text(page, "/quests/q/feral-soul-shriven");
  expect(feral).not.toMatch(/Repeats: a radiant job: /);
  expect(feral).toContain("Repeats: a radiant job. A short");
  // Moss Mother Cavern's block does not say the lede again.
  const moss = await text(page, "/places/moss-mother-cavern");
  expect(moss.match(/short walk from Falkreath/g) ?? []).toHaveLength(1);
  // Belrand: his pronoun, and the unknown said once.
  const belrand = await text(page, "/people/belrand");
  expect(belrand).toContain("What he does for you isn't known yet.");
  expect(belrand).not.toMatch(/What they do for you/);
  expect(belrand.match(/isn't known yet/g) ?? []).toHaveLength(1);
  // The Dwemer Specialist: capitals on its branches and steps.
  const dwemer = await text(page, "/quests/q/the-dwemer-specialist");
  expect(dwemer).toContain("You had already killed Nimhe");
  expect(dwemer).toContain("Then as the main branch");
  expect(dwemer).not.toMatch(/^then as the main branch/m);
  // Where it takes you starts with a capital (Hired Muscle, Unusual Imports), and Not sure yet says it once.
  for (const slug of ["hired-muscle", "unusual-imports"]) {
    await page.goto(`/quests/q/${slug}`);
    const cell = page.getByRole("region", { name: "At a glance" }).locator("div", { hasText: /^Where it takes you/ }).first();
    const t = (await cell.innerText().catch(() => "")).replace(/^Where it takes you\s*/, "");
    if (t) expect(t, slug).toMatch(/^[^a-z]/);
    const sure = await page.getByRole("region", { name: "Information Confidence" }).innerText();
    expect(/^Where\.$/m.test(sure) && /^Where it takes you\.$/m.test(sure), `${slug}: Where. and Where it takes you.`).toBe(false);
  }
});

test("screenshots of the pages these fixes touch, at 1440 and 390", async ({ page }) => {
  for (const [w, h] of [[1440, 900], [390, 844]] as const) {
    await page.setViewportSize({ width: w, height: h });
    for (const [name, path] of [["hired-muscle", "/quests/q/hired-muscle"], ["unusual-imports", "/quests/q/unusual-imports"], ["feral", "/quests/q/feral-soul-shriven"], ["hunters-mark", "/quests/hunters-mark"], ["moss-mother", "/places/moss-mother-cavern"], ["belrand", "/people/belrand"], ["dwemer", "/quests/q/the-dwemer-specialist"]] as const) {
      await page.goto(path);
      await page.waitForTimeout(400);
      await page.screenshot({ path: `test-results/wo180-6b-${name}-${w}.png`, fullPage: true });
    }
  }
});
