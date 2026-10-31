/**
 * WO-185: Dave's notes from using the app. Part 2: the map's zoom and its pins (a pin opens on a click by its diamond and by its name, even after the map has been dragged);
 * Part 3: search says what each row is and lists a thing once.
 */
import { expect, test, type Page } from "@playwright/test";

const map = (page: Page) => page.getByRole("group", { name: "Map of Skyrim" });

for (const width of [1440, 390]) {
  test(`Part 2 at ${width}: ten pins each open by their diamond and by their name, after the map has been dragged`, async ({ page }) => {
    await page.setViewportSize({ width, height: width === 1440 ? 900 : 844 });
    await page.goto("/map");
    await expect(map(page)).toBeVisible();
    await page.waitForTimeout(600);
    for (let i = 0; i < (width === 1440 ? 3 : 4); i++) await page.getByRole("button", { name: "Zoom in", exact: true }).click();
    await page.waitForTimeout(500);
    // A drag first: it used to leave a mark that made every pin click after it read as the end of the drag.
    const m = (await map(page).boundingBox())!;
    const start = { x: m.x + m.width * (width === 1440 ? 0.65 : 0.5), y: m.y + m.height * 0.3 };
    await page.mouse.move(start.x, start.y);
    await page.mouse.down();
    await page.mouse.move(start.x - 40, start.y + 20, { steps: 5 });
    await page.mouse.up();
    await page.waitForTimeout(300);

    const free = width === 1440 ? { left: 380, right: 1420, top: 90, bottom: 860 } : { left: 10, right: 380, top: 70, bottom: 740 };
    const pins: { name: string; named: boolean }[] = [];
    for (const pin of await map(page).locator("a[class*='pin']").all()) {
      const b = await pin.locator("i").boundingBox();
      if (!b || b.x < free.left || b.x > free.right || b.y < free.top || b.y > free.bottom) continue;
      // A pin that another pin's target covers (two places a few pixels apart) is not what this test clicks: a person would hit the other.
      const alone = await pin.evaluate((a) => {
        const i = a.querySelector("i")!.getBoundingClientRect();
        return document.elementFromPoint(i.x + i.width / 2, i.y + i.height / 2)?.closest("a[class*='pin']") === a;
      });
      if (!alone) continue;
      const named = (await pin.locator("[class*='plate']").count()) > 0;
      const name = (await (named ? pin.locator("[class*='plate']") : pin.locator("[class*='sr']")).first().innerText()).replace(/\d+$/, "").trim();
      if (name && !pins.some((p) => p.name === name)) pins.push({ name, named });
      if (pins.length >= 10) break;
    }
    expect(pins.length).toBeGreaterThanOrEqual(6);
    const drawer = page.locator("aside[class*='drawer']");
    for (const { name, named } of pins) {
      for (const how of named ? (["diamond", "name"] as const) : (["diamond"] as const)) {
        const label = new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\d*$`);
        const pin = map(page).locator("a[class*='pin']", { has: page.locator("[class*='plate'], [class*='sr']").filter({ hasText: label }) }).first();
        await expect(pin, `${name} is on the map`).toBeVisible();
        const target = how === "diamond" ? pin.locator("i") : pin.locator("[class*='plate']");
        await target.click();
        await expect(drawer, `${name} by its ${how}`).toBeVisible();
        if (name === pins[0].name && how === "diamond") await page.screenshot({ path: `test-results/wo185-map-pin-${width}.png` });
        await expect(drawer).toContainText(name.split(",")[0]);
        await drawer.getByRole("button", { name: "Close" }).click();
        await expect(drawer).toBeHidden();
      }
    }
  });
}

test("Part 2: one wheel notch zooms the map by one small step, toward the pointer", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/map");
  await expect(map(page)).toBeVisible();
  await page.waitForTimeout(600);
  for (let i = 0; i < 2; i++) await page.getByRole("button", { name: "Zoom in", exact: true }).click();
  await page.waitForTimeout(500);
  const spread = async () => {
    const pts = await map(page).locator("a[class*='pin'] i").evaluateAll((els) => els.map((e) => ({ x: e.getBoundingClientRect().x, y: e.getBoundingClientRect().y })).filter((p) => p.x > 400 && p.x < 1400 && p.y > 100 && p.y < 850));
    const a = pts[0];
    const far = pts.reduce((best, p) => (Math.hypot(p.x - a.x, p.y - a.y) > Math.hypot(best.x - a.x, best.y - a.y) ? p : best), a);
    return Math.hypot(far.x - a.x, far.y - a.y);
  };
  const m = (await map(page).boundingBox())!;
  await page.mouse.move(m.x + m.width * 0.6, m.y + m.height * 0.5);
  const before = await spread();
  await page.screenshot({ path: "test-results/wo185-map-zoom-before-1440.png" });
  await page.mouse.wheel(0, -100);
  await page.waitForTimeout(400);
  const ratio = (await spread()) / before;
  await page.screenshot({ path: "test-results/wo185-map-zoom-after-one-notch-1440.png" });
  // One notch is a step of about 1.2, not the several-fold jump a notch used to make.
  expect(ratio).toBeGreaterThan(1.1);
  expect(ratio).toBeLessThan(1.35);
  // And a small trackpad-sized scroll is a small zoom.
  await page.mouse.wheel(0, -10);
  await page.waitForTimeout(300);
  const small = (await spread()) / (before * ratio);
  expect(small).toBeGreaterThan(1.0);
  expect(small).toBeLessThan(1.1);
});

test("Part 3: every search row says what it is, a thing is listed once, and Deliver a Letter opens its kind", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/search?q=di");
  await expect(page.getByRole("heading", { level: 1, name: "Results for “di”" })).toBeVisible();
  const rows = page.locator("main [class*='result']");
  const names = await rows.locator("a").allInnerTexts();
  const labels = await rows.locator("[class*='kindQuiet']").allTextContents();
  expect(labels.length).toBe(names.length);
  for (const l of labels) expect(["Quest", "Quest line", "Place", "Person", "Character", "Guide"]).toContain(l);
  const keyed = names.map((n, i) => `${labels[i]}|${n}`);
  expect(new Set(keyed).size).toBe(keyed.length);
  const letter = page.getByRole("link", { name: "Deliver a Letter Distant" });
  await expect(letter).toHaveCount(1);
  await expect(letter).toHaveAttribute("href", "/quests/missives#kind-deliver-a-letter");
  await expect(rows.filter({ has: letter }).getByText(/^Missives, on \d+ boards$/)).toBeVisible();
  await page.screenshot({ path: "test-results/wo185-search-di-1440.png", fullPage: true });
  await letter.click();
  await expect(page).toHaveURL(/\/quests\/missives#kind-deliver-a-letter$/);
  await expect(page.locator("#kind-deliver-a-letter")).toBeVisible();
  // The suggestions under a search box say it too, quietly on the right.
  await page.goto("/search");
  await page.getByRole("combobox").first().fill("dawn");
  const list = page.getByRole("listbox", { name: "Suggestions" });
  await expect(list).toBeVisible();
  const opts = list.getByRole("option");
  expect(await opts.count()).toBeGreaterThan(1);
  for (const o of await opts.all()) expect(["Quest", "Quest line", "Place", "Person", "Character", "Guide"]).toContain(((await o.locator("[class*='kind']").textContent()) ?? "").trim());
  await page.screenshot({ path: "test-results/wo185-search-dawn-1440.png" });
});

for (const width of [1440, 390]) {
  test(`screenshots for Dave at ${width}: a place's Worth going for and enemies, and a person's Where to find`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/places/bleak-falls-barrow");
    await expect(page.getByRole("heading", { level: 2, name: "Worth going for" })).toBeVisible();
    await page.screenshot({ path: `test-results/wo185-place-worth-${width}.png`, fullPage: true });
    await page.goto("/people/arch-paladin-laracin");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.screenshot({ path: `test-results/wo185-person-where-${width}.png`, fullPage: true });
  });
}

/** WO-185 Part 6b: a person with `moves` shows them whatever else they have, and a person with no Where to find section still says where on a phone. */
test("Part 6b: ten people with moves and no day show their After and During lines", async ({ page, request }) => {
  for (const name of ["Neski", "Ernanthil", "Lynea", "Rhiada", "Gian", "Herluin", "Syndus", "Vanryth", "Kematu", "Arnskar"]) {
    const found = (await (await request.get(`/api/search?q=${encodeURIComponent(name)}`)).json()) as { people: { name: string; href: string }[] };
    const hit = found.people.find((p) => p.name.startsWith(name));
    expect(hit, name).toBeTruthy();
    await page.goto(hit!.href);
    const moves = page.getByRole("list", { name: "Where a quest moves them" });
    await expect(moves, `${hit!.name} shows where a quest moves them`).toBeVisible();
    await expect(moves.locator("li").first()).toContainText(/^(After|During) /);
  }
});

test("Part 6b: Abbot Cosmas says where he is on a phone, the place as a whole or as plain words", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/people/abbot-cosmas");
  const where = page.getByRole("region", { name: "At a glance" }).locator("> div").filter({ hasText: /Where to find/ }).first();
  await expect(where).toBeVisible();
  await expect(where).toContainText("Marukh's Underground Priory");
  // The whole name, never a piece of it linked to a person.
  expect(await where.getByRole("link", { name: "Marukh", exact: true }).count()).toBe(0);
  await page.screenshot({ path: "test-results/wo185-6b-abbot-cosmas-390.png", fullPage: true });
});
