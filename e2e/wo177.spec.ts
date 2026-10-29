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
  await expect(follows).toContainText("Not sure yet");
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

/** The visible text of a page's HTML: no scripts, styles or tags. */
const textOf = (html: string) =>
  html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#x27;|&apos;/g, "'")
    .replace(/\s+/g, " ");
/** The page's own words: what the game says is left out (a step's objective, a quote and who said it in what quest), as the reads' tests do (WO-180 Part 4b). */
const ownWords = (html: string) =>
  textOf(
    html
      .replace(/<li><span class="[^"]*__num">[\s\S]*?<\/li>/g, " ")
      .replace(/<p class="[^"]*quote[^"]*">[\s\S]*?<\/p>/g, " ")
      .replace(/<small>[\s\S]*?<\/small>/g, " "),
  );

test("Part 5: no page shows a plugin file, a record id or a bracket hedge, and no quest says '1 ways'", async ({ request }) => {
  test.setTimeout(420_000);
  const get = async (url: string) => {
    for (let tries = 0; tries < 3; tries++) {
      try {
        const r = await request.get(url);
        return r.ok() ? await r.text() : "";
      } catch {
        await new Promise((ok) => setTimeout(ok, 300));
      }
    }
    return "";
  };
  const hrefs = (html: string, re: RegExp) => [...new Set([...html.matchAll(re)].map((m) => m[1]))];
  const home = await get("/quests");
  const lines = hrefs(home, /href="(\/quests\/(?!c\/|q\/|s\/)[a-z0-9-]+)"/g);
  expect(lines.length).toBeGreaterThan(50);
  const pages = new Set<string>(lines);
  const people = new Set<string>();
  const places = new Set<string>(["/places"]);
  const batch = async (urls: string[], fn: (u: string, html: string) => void) => {
    for (let i = 0; i < urls.length; i += 6) await Promise.all(urls.slice(i, i + 6).map(async (u) => fn(u, await get(u))));
  };
  const texts = new Map<string, string>();
  const own = new Map<string, string>();
  await batch(lines, (u, html) => {
    texts.set(u, textOf(html));
    own.set(u, ownWords(html));
    for (const q of hrefs(html, /href="(\/quests\/q\/[a-z0-9-]+)"/g)) pages.add(q);
    for (const p of hrefs(html, /href="(\/people\/[a-z0-9-]+)"/g)) people.add(p);
    for (const p of hrefs(html, /href="(\/places\/[a-z0-9-]+)"/g)) places.add(p);
  });
  const quests = [...pages].filter((u) => u.startsWith("/quests/q/"));
  await batch(quests, (u, html) => {
    texts.set(u, textOf(html));
    own.set(u, ownWords(html));
    for (const p of hrefs(html, /href="(\/people\/[a-z0-9-]+)"/g)) people.add(p);
    for (const p of hrefs(html, /href="(\/places\/[a-z0-9-]+)"/g)) places.add(p);
  });
  await batch([...people].slice(0, 400), (u, html) => {
    texts.set(u, textOf(html));
    own.set(u, ownWords(html));
  });
  await batch([...places].slice(0, 300), (u, html) => {
    texts.set(u, textOf(html));
    own.set(u, ownWords(html));
  });
  expect(texts.size).toBeGreaterThan(800);
  const bad: string[] = [];
  for (const [u, t] of texts) {
    const file = /\S+\.(?:esp|esm|esl)\b/i.exec(t)?.[0];
    if (file) bad.push(`${u}: file ${file}`);
    const id = /\b[A-Za-z][A-Za-z_]*\d[A-Za-z0-9_]*\b/.exec(t.replace(/\b(?:LoreRim|Mk|[A-Z]\d|[A-Z]{6,}\d[A-Z]?)\b/g, "") /* VOLUNR5D, BROMJUN1R: the game's own book, Holdings of Jarl Gjalund */)?.[0];
    if (id && !/^(?:ps\d|[a-z]\d)$/i.test(id)) bad.push(`${u}: id ${id} … ${t.slice(Math.max(0, t.indexOf(id) - 40), t.indexOf(id) + 40)}`);
    if (/\(not sure\)/i.test(t)) bad.push(`${u}: (not sure)`);
    if (/\b1 ways\b/.test(t)) bad.push(`${u}: 1 ways`);
    if (/&lt;Alias|<Alias|Alias=/i.test(t)) bad.push(`${u}: an alias tag`);
    // WO-180: the game's markup, holes where tags were, a game file's name as a source, editor words, a bare likely or probably.
    if (/\[pagebreak\]|size="\d|face="|<font|<img|WIDTH=|HEIGHT=|&lt;font|&lt;img/i.test(t)) bad.push(`${u}: book markup`);
    if (/\b(?:of|to|by) ,|, to ,/.test(t)) bad.push(`${u}: a hole in a quote`);
    const src = /\bin (?:[A-Z0-9][\w']* )*(?:Dialogue|Handler|Generic)\b(?! Expansion)|\bin 0[A-Za-z]\w+/.exec(t)?.[0];
    if (src) bad.push(`${u}: a game file as a source: ${src}`);
    if (/\(likely|\(probably/i.test(t.replace(/Information Confidence[\s\S]*$/, ""))) bad.push(`${u}: (likely or (probably`);
    const editor = /\bsandbox package|\btop package|\bmarket package|package's name|\bno packages?\b|\ba shared package|Named in its aliases|follower and marriage factions|\bTrains OneHanded|\bonehanded\b/i.exec(t.replace(/Information Confidence[\s\S]*$/, ""))?.[0];
    if (editor) bad.push(`${u}: an editor's word: ${editor}`);
    const key = /\b[a-z]+[A-Z]\w*\.\w+|\b(?:Starts|TakesYou|takesYou)\.\w+/.exec(t)?.[0];
    if (key) bad.push(`${u}: field key ${key}`);
    if (/(?<![-\w])(?:in|at) in\b|(?<![-\w])in around\b/.test(t)) bad.push(`${u}: in in`);
    if (/\(presumably\b|\(not checked yet\)|the records don't show/i.test(t.replace(/Information Confidence[\s\S]*$/, ""))) bad.push(`${u}: a hedge in the body`);
    // WO-180 Part 4b: what the fourth review found on rendered pages. What a character says in quotes is the game's own, hedges and all.
    const body = (own.get(u) ?? t).replace(/Information Confidence[\s\S]*$/, "");
    const said = body.replace(/["“][^"”]*["”]/g, "");
    const slip = [
      [/\(\s*\)/, "an empty bracket", body],
      [/ in (?:where|most likely|probably)\b/i, "a guess after in", said],
      [/\b(?:probably|most likely)\b/i, "a guess in the body", said],
      [/&lt;[^&]{1,40}&gt;|<[A-Za-z][^<>]{0,40}>/, "an angle-bracket blank", body],
      [/\bthe the\b/i, "the the", body],
      [/\b(?:riverwood|faction) friend\b/i, "a role name from the files", said],
      [/\bquest'?s? script\b|\bthese files\b/i, "a note about the files", said],
      [/\bSpeechcraft\b/, "Speechcraft (the skill is Speech)", said],
    ] as const;
    for (const [re, what, text] of slip) {
      const m = re.exec(text);
      if (m) bad.push(`${u}: ${what}: ${text.slice(Math.max(0, m.index - 40), m.index + 60)}`);
    }
  }
  expect(bad.slice(0, 40)).toEqual([]);
});

test("Part 5: on a phone a quest's whole route shows, every stop above the sheet's bar; temples are drawn at their towns", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/map?quest=forbidden-legend");
  await expect(page.getByRole("group", { name: "Map of Skyrim" })).toBeVisible();
  await page.waitForTimeout(1600);
  for (const n of ["1", "2", "3", "4"]) {
    const b = await page.getByRole("group", { name: "Map of Skyrim" }).locator("a[class*='pin'] i", { hasText: new RegExp(`^${n}$`) }).first().boundingBox();
    expect(b, `stop ${n}`).not.toBeNull();
    expect(b!.x).toBeGreaterThan(0);
    expect(b!.x + b!.width).toBeLessThan(390);
    expect(b!.y).toBeGreaterThan(56);
    expect(b!.y + b!.height).toBeLessThan(844 - 50);
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/map?types=temples");
  const panel = page.getByRole("complementary", { name: "Map controls" });
  await expect(panel.getByRole("button", { name: /^Temples and guilds/ })).toContainText(/2\d/);
  await expect(panel.getByText(/^2\d of \d+ places on the map$/)).toBeVisible();
  await expect(page.getByRole("group", { name: "Map of Skyrim" }).locator("a[href^='/places/']").first()).toBeVisible();
});

test("Part 6: every kind of page lines its body up with its title (50 places, 50 people, 50 quests)", async ({ page, request }) => {
  test.setTimeout(420_000);
  await page.setViewportSize({ width: 1440, height: 900 });
  const html = async (u: string) => (await request.get(u)).text();
  const pick = (h: string, re: RegExp, n: number) => {
    const all = [...new Set([...h.matchAll(re)].map((m) => m[1]))];
    return all.filter((_, i) => i % Math.max(1, Math.floor(all.length / n)) === 0).slice(0, n);
  };
  const places = pick(await html("/places"), /href="(\/places\/[a-z0-9-]+)"/g, 50);
  const lines = pick(await html("/quests"), /href="(\/quests\/(?!c\/|q\/|s\/)[a-z0-9-]+)"/g, 30);
  const quests: string[] = [];
  for (const l of lines) quests.push(...pick(await html(l), /href="(\/quests\/q\/[a-z0-9-]+)"/g, 2));
  const people = pick(await html(lines[0]) + (await html(lines[1])) + (await html(lines[2])) + (await html(lines[3])), /href="(\/people\/[a-z0-9-]+)"/g, 50);
  expect(places.length + people.length + quests.length).toBeGreaterThan(80);
  const off: string[] = [];
  for (const u of [...places, ...people, ...quests.slice(0, 50)]) {
    await page.goto(u);
    const title = await page.getByRole("heading", { level: 1 }).first().boundingBox();
    if (!title) continue;
    const xs = await page.locator("main section[aria-labelledby], main section[aria-label]").evaluateAll((els) => els.map((e) => e.getBoundingClientRect()).filter((r) => r.width > 100 && r.width < window.innerWidth - 20 && r.height > 20).map((r) => r.x));
    if (!xs.length) continue;
    const left = Math.min(...xs);
    if (Math.abs(left - title.x) > 3) off.push(`${u}: title ${Math.round(title.x)}, body ${Math.round(left)}`);
  }
  expect(off).toEqual([]);
});

test("WO-178 Part 3 (Mac): one 'on the map' number, temples at their town's pin with a count, Lydia in Dragonsreach's drawer", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/map");
  const n = async (text: string) => Number((await page.locator("main, body").first().innerText()).match(new RegExp(`(\\d[\\d,]*) ${text}`))?.[1]?.replace(/,/g, ""));
  const onMap = Number((await page.getByRole("complementary", { name: "Map controls" }).getByText(/^\d+ places on the map$/).innerText()).split(" ")[0]);
  expect(onMap).toBeGreaterThan(600);
  await page.goto("/places");
  expect(await n("places on the map")).toBe(onMap);
  await page.goto("/");
  expect(await n("places are pinned")).toBe(onMap);

  // A group picked: the town's pin says how many, at the opening zoom, and hovering lists them.
  await page.goto("/map?types=temples");
  const pin = page.getByRole("group", { name: "Map of Skyrim" }).locator("a[class*='pin']").filter({ hasText: /^[A-Z][\w' -]+, \d+$/ }).first();
  await expect(pin).toBeVisible();
  await pin.hover();
  await expect(page.getByRole("group", { name: "Map of Skyrim" }).locator("[role='tooltip']").first()).toBeVisible();

  // The person you pick to fly there is in the drawer of the place.
  await page.goto("/map?place=dragonsreach");
  await expect(page.getByRole("complementary", { name: "Dragonsreach" })).toContainText("Lydia");
});

test("WO-176 Part 2 (Mac): a reward is said once, and an unknown danger is a cell and a Not sure yet item", async ({ page }) => {
  for (const slug of ["extracting-an-argonian", "the-bonds-of-matrimony", "through-a-glass-darkly", "return-aegisbane", "the-kagrumez-gauntlet"]) {
    const res = await page.goto(`/quests/q/${slug}`);
    if (res?.status() !== 200) continue;
    await expect(page.getByRole("region", { name: "At a glance" })).toContainText("Rewards");
    await expect(page.getByRole("region", { name: "Rewards", exact: true })).toHaveCount(0);
  }
  await page.goto("/places/moss-mother-cavern");
  await expect(page.getByRole("region", { name: "At a glance" })).toContainText("Danger");
  await expect(page.getByRole("region", { name: "At a glance" })).toContainText("Not known yet");
  // The one short block says what is known, and ends with what is not (WO-180); no lone line in an empty column.
  await expect(page.getByRole("region", { name: "What is known" })).toContainText("How dangerous it is isn't known yet");
  await expect(page.getByRole("region", { name: "Information Confidence" })).toContainText("How dangerous it is");
  await expect(page.getByRole("region", { name: "Information Confidence" })).not.toContainText("Nothing is flagged");
});


test("WO-180 Part 3 (Mac): no label under the panel with a kind picked, a route's stops all numbered and never overlapping on a phone, /places headings are the hold's own name", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const zoom of ["0.35", "0.6", "0.9"]) {
    await page.goto(`/map?types=temples&z=${zoom}`);
    await page.waitForTimeout(700);
    const panel = (await page.getByRole("complementary", { name: "Map controls" }).boundingBox())!;
    const plates = await page.getByRole("group", { name: "Map of Skyrim" }).locator("a[class*='pin'] [class*='plate']").all();
    for (const p of plates) {
      const b = (await p.boundingBox())!;
      expect(b.x + b.width <= panel.x || b.x >= panel.x + panel.width || b.y + b.height <= panel.y || b.y >= panel.y + panel.height, `${await p.innerText()} under the panel at ${zoom}`).toBe(true);
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  for (const [quest, stops] of [["forbidden-legend", 4], ["the-golden-claw", 2]] as const) {
    await page.goto(`/map?quest=${quest}`);
    await page.waitForTimeout(1800);
    const pins = page.getByRole("group", { name: "Map of Skyrim" }).locator("a[class*='pin']").filter({ has: page.locator("i", { hasText: /^\d$/ }) });
    expect(await pins.count(), quest).toBeGreaterThanOrEqual(stops);
    const plates = await page.getByRole("group", { name: "Map of Skyrim" }).locator("a[class*='pin'] [class*='plate']").all();
    const boxes = await Promise.all(plates.map((p) => p.boundingBox()));
    for (let i = 0; i < boxes.length; i++)
      for (let j = i + 1; j < boxes.length; j++) {
        const a = boxes[i]!;
        const b = boxes[j]!;
        expect(a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y, `${quest}: two labels overlap`).toBe(false);
      }
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/places");
  const heads = await page.locator("main h2").allInnerTexts();
  for (const h of heads) expect(h, h).not.toMatch(/ hold$/);
});

test("WO-180 Part 4b (Mac): a route's stops stay clear of every label after each zoom out at 390, and the Traps flag sits in Northwind Mine's danger line", async ({ page }) => {
  test.setTimeout(120_000);
  await page.setViewportSize({ width: 390, height: 844 });
  for (const quest of ["forbidden-legend", "the-golden-claw"]) {
    await page.goto(`/map?quest=${quest}`);
    await page.waitForTimeout(1800);
    const map = page.getByRole("group", { name: "Map of Skyrim" });
    const check = async (step: string) => {
      // Every numbered stop and every name, in the window's pixels: no stop's number sits on another place's name, and no two names overlap.
      const boxes = await map.locator("a[class*='pin']").evaluateAll((pins) =>
        pins.map((p) => {
          const r = (el: Element | null) => {
            const b = el?.getBoundingClientRect();
            return b && b.width ? [b.left, b.top, b.right, b.bottom] : null;
          };
          return { num: r(p.querySelector("i")), plate: r(p.querySelector("[class*='plate']")), label: p.textContent ?? "" };
        }),
      );
      const hit = (a: number[], b: number[]) => a[0] < b[2] && a[2] > b[0] && a[1] < b[3] && a[3] > b[1];
      for (let i = 0; i < boxes.length; i++) {
        for (let j = 0; j < boxes.length; j++) {
          if (i === j) continue;
          const [a, b] = [boxes[i], boxes[j]];
          if (a.num && b.plate && hit(a.num, b.plate)) throw new Error(`${quest} ${step}: stop ${a.label} sits on the name ${b.label}`);
          if (i < j && a.plate && b.plate && hit(a.plate, b.plate)) throw new Error(`${quest} ${step}: the names ${a.label} and ${b.label} overlap`);
        }
      }
    };
    await check("on opening");
    for (let n = 1; n <= 3; n++) {
      await page.getByRole("button", { name: "Zoom out" }).click();
      await page.waitForTimeout(900);
      await check(`after zoom out ${n}`);
      await page.screenshot({ path: `test-results/wo180-4b-${quest}-zoom${n}-390.png` });
    }
  }
  // /map at 390: no count badge under the zoom buttons, the N or the search, at the opening view and zoomed out; the panel says what its numbers are.
  await page.goto("/map");
  await page.waitForTimeout(1500);
  for (let n = 0; n <= 2; n++) {
    if (n) {
      await page.getByRole("button", { name: "Zoom out" }).click();
      await page.waitForTimeout(700);
    }
    const controls = await page.locator("[class*='plate'][aria-label='Zoom in'], [class*='plate'][aria-label='Zoom out'], [class*='plate'][aria-label^='North']").evaluateAll((els) => els.map((e) => e.getBoundingClientRect()).map((b) => [b.left, b.top, b.right, b.bottom]));
    const badges = await page.locator("button[class*='cluster']").evaluateAll((els) => els.map((e) => e.getBoundingClientRect()).map((b) => [b.left, b.top, b.right, b.bottom]));
    for (const b of badges) for (const c of controls) expect(b[0] < c[2] && b[2] > c[0] && b[1] < c[3] && b[3] > c[1], `a count under a control after ${n} zoom outs`).toBe(false);
  }
  await page.getByRole("button", { name: "Open search and filters" }).click();
  await expect(page.getByRole("complementary", { name: "Map controls" })).toContainText("The number beside each kind is how many of them are on the map.");
  await page.screenshot({ path: "test-results/wo180-4b-map-panel-390.png" });
  await page.goto("/places/northwind-mine");
  await expect(page.getByRole("region", { name: "Danger" })).toContainText("How dangerous it is isn't known yet");
  await expect(page.getByRole("region", { name: "Danger" })).toContainText("Traps");
  await page.screenshot({ path: "test-results/wo180-4b-northwind-390.png", fullPage: true });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/places/northwind-mine");
  await page.screenshot({ path: "test-results/wo180-4b-northwind-1440.png", fullPage: true });
});
