/**
 * WO-177: a cold review of staging. What was broken (the wheel on Places, a wrong link, a sentence missing a word, the featured card on a phone,
 * a quest page off the grid), what was ragged and uneven, and what read wrong. Each page is looked at at the width the review named, with the
 * wheel and the pointer, and screenshotted.
 */
import { expect, test, type Page } from "@playwright/test";
import { IRIEL_BUILD_ID } from "./seed";
import { signIn } from "./helpers";

const shot = (page: Page, name: string) => page.screenshot({ path: `test-results/wo177-${name}.png`, fullPage: true });

test("Part 1: the wheel scrolls /places, and zoom is the buttons", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/places");
  const map = page.getByRole("group", { name: "Map of Skyrim" });
  await expect(map).toBeVisible();
  const box = (await map.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  const before = await page.evaluate(() => window.scrollY);
  await page.mouse.wheel(0, 700);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(before + 200);
  // The buttons still zoom.
  const imgWidth = () => map.locator("img").first().evaluate((i) => (i as HTMLImageElement).width);
  const w0 = await imgWidth();
  await map.getByRole("button", { name: "Zoom in" }).click();
  await expect.poll(imgWidth).toBeGreaterThan(w0);
  await shot(page, "places-1440");
});

test("Part 1: a word that ends another name is not a person (Dragon Blood), and Lydia's sentence has its verb", async ({ page }) => {
  await page.goto("/quests/q/dragon-research");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator("main a[href*='blood-curse']")).toHaveCount(0);
  await expect(page.locator("main")).toContainText("Dragon Blood");
  await page.goto("/people/lydia");
  await expect(page.locator("main")).toContainText("She is in 2 quests.");
  await expect(page.locator("main")).not.toContainText("She in 2 quests");
});

test("Part 1: a quest page's body starts where its title does, however little it has to say", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const url of ["/quests/q/dungeon-delving-bandits", "/quests/q/the-golden-claw"]) {
    await page.goto(url);
    const title = (await page.getByRole("heading", { level: 1 }).boundingBox())!;
    const body = (await page.locator("main section").filter({ has: page.getByRole("heading", { name: "How to start it" }) }).boundingBox())!;
    expect(Math.abs(body.x - title.x), url).toBeLessThan(2);
    expect(body.width, url).toBeGreaterThan(800);
  }
  await page.goto("/quests/q/dungeon-delving-bandits");
  await shot(page, "dungeon-delving-1440");
});

test("Part 1: the featured character is the ordinary card on a phone, cover above and words under", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/b/${IRIEL_BUILD_ID}`);
  await page.getByRole("region", { name: "Build" }).getByRole("button", { name: "More" }).click();
  await page.getByRole("menuitem", { name: /Feature this build/ }).click();
  const more = page.getByRole("region", { name: "Build" }).getByRole("button", { name: "More" });
  await expect(async () => {
    await more.click();
    await expect(page.getByRole("menuitem", { name: /Stop featuring/ })).toBeVisible({ timeout: 1000 });
  }).toPass();
  await page.keyboard.press("Escape");
  try {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/characters");
    const card = page.getByRole("article").first().locator("a").first();
    await expect(card).toBeVisible();
    const name = (await card.locator("h3, h2, [class*='name']").first().boundingBox())!;
    const c = (await card.boundingBox())!;
    // The name sits in the lower part of the card, across its width, and is not cut: the card is as wide as the page.
    expect(c.width).toBeGreaterThan(300);
    expect(name.width).toBeGreaterThan(c.width * 0.6);
    expect(name.y).toBeGreaterThan(c.y + c.height * 0.4);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
    await shot(page, "characters-390");
  } finally {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`/b/${IRIEL_BUILD_ID}`);
    await page.getByRole("region", { name: "Build" }).getByRole("button", { name: "More" }).click();
    await page.getByRole("menuitem", { name: /Stop featuring/ }).click();
    await expect(async () => {
      await more.click();
      await expect(page.getByRole("menuitem", { name: /Feature this build/ })).toBeVisible({ timeout: 1000 });
    }).toPass();
  }
});

for (const width of [1440, 390]) {
  test(`Part 2: a line page at ${width}: names whole, places teal, one heading style, a link for the rest`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/quests/dragonborn");
    const cell = page.getByRole("region", { name: "At a glance" }).filter({ hasText: "Where it takes you" });
    await expect(cell).toBeVisible();
    // Each name is a link, whole on one line.
    for (const a of await cell.getByRole("link").all()) {
      const text = (await a.innerText()).trim();
      if (/more$/.test(text)) {
        await expect(a).toHaveAttribute("href", /^#/);
        continue;
      }
      const h = (await a.boundingBox())!.height;
      const lh = await a.evaluate((e) => parseFloat(getComputedStyle(e).lineHeight) || 22);
      expect(h, text).toBeLessThan(lh * 1.6);
    }
    // A place in the story is teal, a person orange.
    const place = page.getByRole("region", { name: "The story" }).locator("a[href^='/places/']").first();
    const person = page.getByRole("region", { name: "The story" }).locator("a[href^='/people/']").first();
    expect(await place.evaluate((e) => getComputedStyle(e).color)).toBe("rgb(159, 211, 225)");
    expect(await person.evaluate((e) => getComputedStyle(e).color)).not.toBe("rgb(159, 211, 225)");
    // Every section heading has its icon.
    for (const name of ["What the whole line gives", "What it closes", "Opens other stories"]) {
      const h = page.getByRole("heading", { name, level: 2 });
      await expect(h.locator("img")).toHaveCount(1);
    }
    // The editors' words are not on the page.
    await expect(page.locator("main")).not.toContainText("Not counted as a step");
    await shot(page, `dragonborn-${width}`);
  });
}

test("Part 2: the main quest says no hedge in a bracket, and Paarthurnax's line names its quest", async ({ page }) => {
  await page.goto("/quests/main-quest");
  const main = page.locator("main");
  await expect(main).not.toContainText("the records don't show");
  await expect(main).not.toContainText("(not checked yet)");
  await expect(main).not.toContainText("not checked yet:");
  await expect(main).toContainText("Paarthurnax dies if you kill him in the quest Paarthurnax");
  await expect(page.getByRole("region", { name: "Information Confidence" })).toContainText("Not sure yet");
});

test("Part 2: /quests at 390 has one width for its heading, search and three filters; the table never breaks a level or a place", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/quests");
  const rest = page.getByRole("region", { name: "Every quest, by place" });
  await expect(rest).toBeVisible();
  const widths = await Promise.all(
    [rest.getByRole("searchbox"), rest.getByLabel("Hold"), rest.getByLabel("Level"), rest.getByLabel("From")].map(async (l) => (await l.locator("xpath=ancestor-or-self::*[self::label or self::form][1]").boundingBox())!.width),
  );
  for (const w of widths) expect(Math.abs(w - widths[0])).toBeLessThan(2);
  const intro = (await rest.getByText(/Every quest and line in every category/).boundingBox())!;
  const search = (await rest.getByRole("searchbox").locator("xpath=ancestor::form[1]").boundingBox())!;
  expect(Math.abs(intro.x - search.x)).toBeLessThan(2);
  expect(await rest.getByRole("searchbox").getAttribute("placeholder")).toBe("Name, person, place or journal");
  await shot(page, "quests-390");

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/quests");
  const rows = rest.locator("tbody tr");
  for (const sel of ["td:nth-child(3) a", "td:nth-child(4) span"]) {
    for (const el of await rows.locator(sel).all()) {
      const text = (await el.innerText()).trim();
      const h = (await el.boundingBox())!.height;
      expect(h, text).toBeLessThan(30);
    }
  }
  // From shows the mod's own short name, the full one is in its title.
  const mod = rest.locator("a[class*='mod']").first();
  await expect(mod).toBeVisible();
  expect(await mod.getAttribute("title")).toBeTruthy();
  await expect(rest).not.toContainText("- 10th");
  await expect(rest).toContainText("No XP");
  await expect(rest.locator("tbody")).not.toContainText(/\bNone\b/);
  await shot(page, "quests-1440");
});

test("Part 2: home at 390 puts a heading's link under it", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  for (const [heading, link] of [["Three stories to live through", "Every quest line ›"], ["New in the world", "Everything that changed ›"]] as const) {
    const h = (await page.getByRole("heading", { name: heading }).boundingBox())!;
    const a = (await page.getByRole("link", { name: link }).first().boundingBox())!;
    expect(a.y, heading).toBeGreaterThanOrEqual(h.y + h.height - 2);
  }
  await shot(page, "home-390");
});

test("Part 2: a place with one building lists its people from the left edge, an inside place says where it is, and the tags follow one pattern", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/places/sleeping-giant-inn");
  const people = page.getByRole("region", { name: "Who is here" });
  const head = (await people.getByRole("heading", { level: 2 }).boundingBox())!;
  const first = (await people.getByRole("link").first().boundingBox())!;
  expect(Math.abs(first.x - head.x)).toBeLessThan(50);
  await expect(page.getByRole("region", { name: "Map" })).toContainText("Getting there");
  await expect(page.getByRole("region", { name: "Map" })).toContainText("In Riverwood");
  await expect(page.getByRole("region", { name: "At a glance" })).not.toContainText("in 1 place");
  await expect(page.locator("main")).toContainText("Whiterun hold");
  await expect(page.locator("main")).not.toContainText("Vanilla");
  await shot(page, "sleeping-giant-inn-1440");
  // A place of danger has the same tags: its kind, its hold in teal, base game; the distance is in Getting there.
  await page.goto("/places/bleak-falls-barrow");
  const tags = page.locator("main h1").locator("xpath=following-sibling::*[1]");
  await expect(tags).toContainText("Whiterun hold");
  await expect(tags).toContainText("Base game");
  await expect(tags).not.toContainText("Next to");
  await shot(page, "bleak-falls-barrow-1440");
});

test("Part 2: /changes spaces its tab counts, draws a chevron, and says nothing a row does not need to", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/changes");
  const tab = page.getByRole("navigation", { name: "Filter by kind" }).getByRole("link").first();
  const label = (await tab.evaluate((e) => e.childNodes[0].textContent)) ?? "";
  expect(label.trim()).toBe("Everything");
  const count = (await tab.locator("span").boundingBox())!;
  const text = (await tab.boundingBox())!;
  expect(count.x).toBeGreaterThan(text.x + 60);
  await expect(page.locator("main")).not.toContainText("read from the game files");
  const chevron = await page.locator("summary").first().evaluate((e) => {
    const s = getComputedStyle(e, "::before");
    return { w: parseFloat(s.width), h: parseFloat(s.height) };
  });
  expect(chevron.w).toBeGreaterThanOrEqual(10);
  expect(chevron.h).toBeGreaterThanOrEqual(10);
  await shot(page, "changes-1440");
});

test("Part 2: on the map All unlights while a route shows, and no name sits under a control or the drawer", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/map?quest=forbidden-legend");
  const panel = page.getByRole("complementary", { name: "Map controls" });
  await expect(panel.getByText(/The route of/)).toBeVisible();
  await expect(panel.getByRole("button", { name: "All", exact: true })).toHaveAttribute("aria-pressed", "false");
  await panel.getByRole("button", { name: "All", exact: true }).click();
  await expect(panel.getByRole("button", { name: "All", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(panel.getByText(/The route of/)).toHaveCount(0);
  // Zoomed in on a picked place: every plate is clear of the zoom buttons, the credit, the panel and the drawer.
  await page.goto("/map?place=whiterun&z=1.4");
  const drawer = page.getByRole("complementary", { name: "Whiterun" });
  await expect(drawer).toBeVisible();
  await page.waitForTimeout(900);
  const over = [
    ...(await page.getByRole("button", { name: /^Zoom (in|out)$/ }).all()),
    page.getByRole("button", { name: "North, and the whole map" }),
    page.getByRole("link", { name: /Map: Skyrim Paper Map/ }),
    drawer,
    panel,
  ];
  const blockers = await Promise.all(over.map(async (l) => (await l.boundingBox())!));
  const plates = await page.getByRole("group", { name: "Map of Skyrim" }).locator("a[class*='pin'] [class*='plate']").all();
  for (const p of plates) {
    const b = (await p.boundingBox())!;
    for (const o of blockers) {
      const hit = b.x < o.x + o.width && b.x + b.width > o.x && b.y < o.y + o.height && b.y + b.height > o.y;
      expect(hit, `${await p.innerText()} under a control`).toBe(false);
    }
  }
  await shot(page, "map-whiterun-1440");
});

test("Part 3: search says a result once, Aela's cells say Yes and how it isn't sure, a quest's links keep its size, Lydia's tag says only what is sure", async ({ page }) => {
  await page.goto("/search?q=riverwood");
  const text = await page.locator("main").innerText();
  expect(/Goes to Riverwood[\s\S]{0,40}It goes to Riverwood/.test(text)).toBe(false);
  expect(text).not.toContain("It goes to Riverwood");

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/people/aela-the-huntress");
  const glance = page.getByRole("region", { name: "At a glance" });
  const follows = glance.locator("div").filter({ hasText: /^Follows you/ }).first();
  await expect(follows).toContainText("Yes");
  await expect(follows).toContainText("How isn't sure yet");
  await expect(glance).toContainText("Take Up Arms");
  // A link in the words about a quest is as big as the words.
  const row = page.getByRole("region", { name: "Her quests" }).locator("div", { hasText: "Skjor offer you" }).last();
  const link = row.getByRole("link", { name: "Skjor" });
  const words = row.locator("span").filter({ hasText: "she and" }).first();
  expect(await link.evaluate((e) => getComputedStyle(e).fontSize)).toBe(await words.evaluate((e) => getComputedStyle(e).fontSize));
  await shot(page, "aela-1440");

  await page.goto("/people/lydia");
  const tags = page.locator("main h1").locator("xpath=following-sibling::*[1]");
  await expect(tags).toContainText("Follower");
  await expect(tags).not.toContainText("Can marry");
  await expect(page.getByRole("heading", { name: "Where to find her" }).first()).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/people/lydia");
  // On a phone the band keeps the cell the sections do not repeat.
  const cells = page.getByRole("region", { name: "At a glance" }).locator("> div > div");
  const visible: string[] = [];
  for (const c of await cells.all()) if (await c.isVisible()) visible.push((await c.innerText()).split("\n")[0].trim());
  expect(visible).toEqual(["WHAT SHE IS"].map((s) => expect.stringMatching(new RegExp(s, "i"))));
  await shot(page, "lydia-390");
});

test("Part 3: the same thing has the same name, and an assembled sentence reads", async ({ page }) => {
  await page.goto("/quests/q/the-golden-claw");
  const main = page.locator("main");
  await expect(main).toContainText("Base game");
  await expect(main).not.toContainText("Vanilla");
  await expect(main.getByText("Bandits in Bleak Falls Barrow")).toBeVisible();
  for (const who of ["Lucan Valerius", "Gerdur", "Hilde", "Frodnar", "Delphine"]) {
    const link = page.getByRole("region", { name: "People" }).getByRole("link", { name: who, exact: true });
    await expect(link).toBeVisible();
    await expect(link.locator("xpath=ancestor::span[2]").locator("small")).toHaveCount(1);
  }
  await page.goto("/quests/q/song-of-the-green");
  await expect(page.locator("main")).not.toContainText("in her house, Auri");
  await page.goto("/quests/q/dungeon-delving-bandits");
  await expect(page.locator("main")).not.toContainText("own copy of it)");
  await page.goto("/quests/dawnguard");
  await expect(page.getByRole("heading", { level: 1 }).locator("xpath=following-sibling::*[1]")).toContainText("Dawnguard");
  await expect(page.getByRole("heading", { level: 1 }).locator("xpath=following-sibling::*[1]")).not.toContainText("Base game");
  await page.goto("/places/riverwood");
  await expect(page.locator("main")).toContainText("Faendal trains Marksman");
});
