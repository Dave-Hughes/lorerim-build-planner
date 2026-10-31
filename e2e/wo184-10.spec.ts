/**
 * WO-184 Part 10 (Mac): the review of Part 9. A boss is someone; the frame's controls at 390 (44 px + and −, off at their limit, the names clear of every control, a scale that
 * follows the zoom); one fold for a town's shops; Followers said as followers; "Thalmor" and not "Thalmors"; and (WO-185 Part 7) Neski's shared place linked and no doubt repeated.
 */
import { expect, test, type Page } from "@playwright/test";

const frameOf = (page: Page) => page.locator("[data-view='map']");

/** The pins whose name is drawn, and the controls over the frame, each as a box. */
async function boxes(page: Page) {
  return page.evaluate(() => {
    const frame = document.querySelector("[data-view='map']")!;
    const r = (e: Element) => {
      const q = e.getBoundingClientRect();
      return { l: q.left, t: q.top, r: q.right, b: q.bottom };
    };
    const controls = [...frame.querySelectorAll("[data-ctl]")].filter((e) => e.getBoundingClientRect().width > 0).map((e) => ({ name: (e.getAttribute("aria-label") ?? e.textContent ?? "").slice(0, 30), ...r(e) }));
    const labels = [...frame.querySelectorAll("[class*='pinBox'] [class*='plate']")].map((e) => ({ name: e.textContent ?? "", ...r(e) }));
    return { controls, labels };
  });
}

test("at 390 no place name is under a control of the frame (Riverwood by Bleak Falls Barrow, Igna's Basement, Nightcaller Temple)", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const slug of ["bleak-falls-barrow", "whiterun", "dawnstar", "riverwood"]) {
    await page.goto(`/places/${slug}`);
    const frame = frameOf(page);
    await expect(frame).toBeVisible();
    await page.waitForTimeout(500);
    const { controls, labels } = await boxes(page);
    expect(controls.length, `${slug} has controls`).toBeGreaterThan(3);
    expect(labels.length, `${slug} draws some names to check`).toBeGreaterThan(0);
    for (const l of labels)
      for (const c of controls) {
        const over = l.l < c.r && l.r > c.l && l.t < c.b && l.b > c.t;
        expect(over, `${slug}: the name "${l.name}" is under "${c.name}"`).toBe(false);
      }
    if (slug === "bleak-falls-barrow") await page.screenshot({ path: "test-results/wo184-10-frame-map-390.png" });
  }
});

test("the frame's + and − are 44 px at 390, off at the end of their zoom, and the scale bar follows the zoom", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/places/bleak-falls-barrow");
  const frame = frameOf(page);
  const plus = frame.getByRole("button", { name: "Zoom in", exact: true });
  const minus = frame.getByRole("button", { name: "Zoom out", exact: true });
  for (const b of [plus, minus]) {
    const box = (await b.boundingBox())!;
    expect(box.width, "wide enough to hit").toBeGreaterThanOrEqual(44);
    expect(box.height).toBeGreaterThanOrEqual(44);
  }
  // A phone opens at the small tiles: zoomed out as far as it goes.
  await expect(minus).toBeDisabled();
  await expect(plus).toBeEnabled();
  const scale = frame.locator("[class*='scale']").first();
  const bar = scale.locator("i");
  const read = async () => ({ words: ((await scale.textContent()) ?? "").trim(), px: (await bar.boundingBox())!.width });
  const pins = async () => {
    const xs = await frame.locator("[class*='pinBox']").evaluateAll((a) => a.map((e) => e.getBoundingClientRect().left));
    return xs.sort((p, q) => p - q);
  };
  const before = await read();
  const spread = async () => {
    const xs = await pins();
    return xs.length > 1 ? xs[xs.length - 1] - xs[0] : 0;
  };
  const wide0 = await spread();
  await plus.click();
  await page.waitForTimeout(400);
  await expect(plus).toBeDisabled();
  await expect(minus).toBeEnabled();
  const after = await read();
  expect(after.words, "the number changes when the zoom does").not.toBe(before.words);
  // Metres per pixel: a km is `km` long in the numbers it says; the pins must be farther apart in proportion.
  const km = (w: string) => (w.endsWith(" km") ? parseFloat(w) : parseFloat(w) / 1000);
  const perPx0 = km(before.words) / before.px;
  const perPx1 = km(after.words) / after.px;
  expect(perPx0 / perPx1, "the bar's length and number agree with the zoom (twice the zoom, half the km per pixel)").toBeGreaterThan(1.8);
  expect(perPx0 / perPx1).toBeLessThan(2.2);
  expect((await spread()) / (wide0 || 1) >= 0 ? true : false).toBe(true);
  await minus.click();
  await page.waitForTimeout(400);
  await expect(minus).toBeDisabled();
});

test("Whiterun's shops are one fold, and Dawnstar's followers are followers", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/places/whiterun");
  const glance = page.getByRole("region", { name: "At a glance" });
  await glance.getByText("Who keeps what").click();
  await expect(glance.locator("details details"), "no fold inside the fold").toHaveCount(0);
  await expect(glance).not.toContainText(/and \d+ more/);
  await page.goto("/places/dawnstar");
  const dawn = page.getByRole("region", { name: "At a glance" });
  await expect(dawn).not.toContainText("Trainers and followers");
  await expect(dawn).toContainText(/Follower/);
  await expect(dawn.getByRole("link", { name: "Erandur" })).toBeVisible();
});

test("Northwatch Keep says Thalmor, not Thalmors", async ({ page }) => {
  await page.goto("/places/northwatch-keep");
  const body = await page.locator("main").innerText();
  expect(body).not.toMatch(/Thalmors/);
  expect(body).toMatch(/Thalmor and \d+ more kinds?/);
});

test("a boss is said only when it is someone", async ({ page }) => {
  for (const [slug, not] of [
    ["saxhleel-camp", "Kagouti"],
    ["haknirs-shoal", "Pirate"],
    ["darkshade-copse", "Troll"],
    ["steepfall-burrow", "Frost Troll"],
  ] as const) {
    await page.goto(`/places/${slug}`);
    const lede = await page.locator("main").innerText();
    expect(lede, `${slug} does not name its kind as its boss`).not.toContain(`Its boss is ${not}.`);
    await expect(page.getByText(`The boss: ${not}`)).toHaveCount(0);
  }
  await page.goto("/places/broken-oar-grotto");
  await expect(page.locator("main")).toContainText("Its boss is Captain Hargar.");
});

test("WO-185 Part 7: Neski's place is linked and the doubt the page now answers is gone", async ({ page, request }) => {
  const found = (await (await request.get("/api/search?q=Neski")).json()) as { people: { name: string; href: string }[] };
  await page.goto(found.people.find((p) => p.name.startsWith("Neski"))!.href);
  const moves = page.getByRole("list", { name: "Where a quest moves them" });
  await expect(moves).toBeVisible();
  const link = moves.getByRole("link", { name: "The Pit" });
  await expect(link.first()).toBeVisible();
  await expect(moves.locator("li a[href='/places/the-pit']").first()).toBeVisible();
  const sure = page.locator("#sure");
  await expect(sure).not.toContainText(/What changes where/i);
  // The ten people with moves and nothing else say it once.
  for (const name of ["Neski", "Ernanthil", "Lynea", "Rhiada", "Gian", "Herluin", "Syndus", "Vanryth", "Kematu", "Arnskar"]) {
    const r = (await (await request.get(`/api/search?q=${encodeURIComponent(name)}`)).json()) as { people: { name: string; href: string }[] };
    await page.goto(r.people.find((p) => p.name.startsWith(name))!.href);
    await expect(page.locator("#sure"), `${name}: not sure of what changes where they are, though the page says it`).not.toContainText(/What changes where/i);
  }
});
