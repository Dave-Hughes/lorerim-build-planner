/**
 * WO-182: launch without playthroughs. The "noruns" project's server has FEATURE_PLAYTHROUGHS off and the rest of the launch on
 * (quests, places, people, the guide, the door); this crawls it as a visitor and as the seeded author, and fails on any of
 * the playthrough words in a page or in what the door lists.
 *
 * The words, and where they are the game's own: Playthrough, Who she is, Begin Act, Read a save, Where is she, Your save and story card
 * are ours and fail everywhere. Objective, chapter and an act's name ("Act I") are also the game's words on a quest page (its steps, a
 * line's chapters), so on the quest, place, person, map, search and changes pages, and in the tools that read quests, only the first group fails.
 */
import { expect, test, type APIRequestContext, type Page } from "@playwright/test";
import { ip, signIn } from "./helpers";
import { addRunMadeCharacter, KYRIA_BUILD_ID, KYRIA_PLAYTHROUGH_ID, removeRunMadeCharacter, RUN_MADE_BUILD_ID, TEST_USER_HANDLE } from "./seed";

const OURS = [/playthrough/i, /who she is/i, /begin act/i, /read a save/i, /where is she/i, /your save/i, /story card/i, /save connector/i];
const ALSO = [/objectives?\b/i, /chapters?\b/i, /^\s*acts?\b/im, /\bact [ivx]+\b/i, /\bacts\b/i];
/** Pages where the game's own words (a quest's steps, a line's chapters) appear. */
const GAME = /^\/(quests|places|people|map|search|changes|guide|gear)(\/|\?|$)/;
/** The beginner's guide is about the game: it tells a player to back up their saves and talks of a playthrough in the player's sense. */
const GUIDE_PLAYS = [/playthrough/i, /your save/i];

/** All the text a page shows: its title, its text, and the labels and descriptions a reader or a link preview gets. */
async function everything(page: Page) {
  return page.evaluate(() => {
    const attrs = [...document.querySelectorAll("[aria-label],[title],[alt],[placeholder]")].flatMap((e) => ["aria-label", "title", "alt", "placeholder"].map((a) => e.getAttribute(a) ?? ""));
    const metas = [...document.querySelectorAll("meta[name=description],meta[property^='og:']")].map((m) => m.getAttribute("content") ?? "");
    return [document.title, document.body.innerText, ...attrs, ...metas].join("\n");
  });
}

async function check(page: Page, path: string) {
  const res = await page.goto(path);
  expect(res?.status(), path).toBeLessThan(400);
  const text = await everything(page);
  const words = (GAME.test(path) ? OURS : [...OURS, ...ALSO]).filter((w) => !(path.startsWith("/guide") && GUIDE_PLAYS.some((g) => g.source === w.source)));
  for (const w of words) expect(text, `${path} says ${w}`).not.toMatch(w);
}

const VISITOR = ["/", "/characters", "/characters?run=1", "/b/e2eazrem22", `/b/${KYRIA_BUILD_ID}`, `/u/${TEST_USER_HANDLE}`, "/quests", "/places", "/people", "/map", "/search?q=riften", "/changes", "/guide", "/gear"];
const SIGNED_IN = ["/", "/characters", "/me", `/b/${KYRIA_BUILD_ID}`, `/b/${KYRIA_BUILD_ID}/edit`, `/b/${KYRIA_BUILD_ID}/guide`, `/b/${KYRIA_BUILD_ID}/setup?step=name`, "/new", "/new?step=name"];

test.describe("playthroughs off: the pages", () => {
  test("a visitor finds no trace", async ({ page }) => {
    for (const path of VISITOR) await check(page, path);
  });

  test("a quest, a place and a person, found from their lists", async ({ page }) => {
    for (const list of ["/quests", "/places", "/people"]) {
      await page.goto(list);
      const href = await page.locator(`main a[href^="${list}/"]`).first().getAttribute("href");
      expect(href, list).toBeTruthy();
      await check(page, href!);
    }
  });

  test("a signed-in author finds no trace", async ({ page, context }) => {
    await signIn(context);
    for (const path of SIGNED_IN) await check(page, path);
  });

  test("every address that exists for playthroughs is not found", async ({ request, context }) => {
    await signIn(context);
    const id = KYRIA_PLAYTHROUGH_ID;
    for (const path of [
      `/p/${id}`,
      `/p/${id}/tale`,
      `/p/${id}/build`,
      `/p/${id}/edit`,
      `/p/${id}/edit/play`,
      "/playthroughs",
      "/playthroughs/new",
      `/b/${KYRIA_BUILD_ID}/play`,
      `/b/${KYRIA_BUILD_ID}/run`,
      `/b/${KYRIA_BUILD_ID}/edit/play`,
      `/b/${KYRIA_BUILD_ID}/story`,
      `/b/${KYRIA_BUILD_ID}/story/1`,
      `/b/${KYRIA_BUILD_ID}/edit/story`,
      `/b/${KYRIA_BUILD_ID}/story/edit`,
      `/api/playthroughs/${id}/images`,
      "/api/map/characters",
      `/api/map/character?id=${id}`,
    ])
      expect((await request.get(path)).status(), path).toBe(404);
    // A character's own page and editor still work.
    for (const path of [`/b/${KYRIA_BUILD_ID}`, `/b/${KYRIA_BUILD_ID}/edit`]) expect((await request.get(path)).status(), path).toBe(200);
  });

  test("a character is its build: Build and Guide, nothing about a run", async ({ page, context }) => {
    await signIn(context);
    await page.goto(`/b/${KYRIA_BUILD_ID}`);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Kyria");
    await expect(page.getByRole("button", { name: /Playthrough/ })).toHaveCount(0);
    await expect(page.getByRole("link", { name: /Plan a playthrough/ })).toHaveCount(0);
    await page.goto(`/b/${KYRIA_BUILD_ID}?tab=playthrough`);
    await expect(page.getByRole("tab", { name: /Playthrough/ })).toHaveCount(0);
    const tabs = page.getByRole("navigation", { name: "Edit tabs" });
    await page.goto(`/b/${KYRIA_BUILD_ID}/edit`);
    await expect(tabs.getByRole("link")).toHaveText([/^Build/, /^Guide/, /^Character/]);
    // WO-182 Part 5: the old tab addresses open the editor's Build tab, not a 404.
    for (const tab of ["playthrough", "story"]) {
      const res = await page.goto(`/b/${KYRIA_BUILD_ID}/edit?tab=${tab}`);
      expect(res?.status(), tab).toBe(200);
      await expect(page).toHaveURL(new RegExp(`/b/${KYRIA_BUILD_ID}/edit\\?tab=${tab}$`));
      await expect(tabs.getByRole("link").first()).toContainText("Build");
    }
  });

  test("a playthrough address is the site's own not found: its tab says Nothing here and its words fit a page", async ({ page }) => {
    for (const path of ["/playthroughs", "/p/abc", `/b/${KYRIA_BUILD_ID}/play`]) {
      const res = await page.goto(path);
      expect(res?.status(), path).toBe(404);
      await expect(page).toHaveTitle(/Nothing here/);
      await expect(page.getByRole("heading", { level: 1, name: "Nothing here" })).toBeVisible();
      await expect(page.locator("main")).not.toContainText(/That build doesn't exist/);
    }
  });

  test("a new character ends at Details with Finish, in seven steps", async ({ page, context }) => {
    await signIn(context);
    await page.goto("/new");
    await expect(page.getByRole("banner")).toContainText("New character");
    await expect(page.getByLabel("Setup steps").getByRole("listitem")).toHaveCount(7);
    await expect(page.getByLabel("Setup steps")).not.toContainText("What next");
  });

  test("the cards say no more than the character", async ({ page, context }) => {
    await signIn(context);
    await page.goto("/me");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("My characters");
    await expect(page.getByRole("main").getByText(/^\d+ characters?$/)).toBeVisible();
    await expect(page.getByText(/Is this the same character as/)).toHaveCount(0);
    await page.goto("/characters");
    await expect(page.getByRole("combobox", { name: /Playthrough/ })).toHaveCount(0);
    await expect(page.getByText(/Act \w+ of \d+|with a run/)).toHaveCount(0);
  });

  test("the map takes no character or act route, and keeps a quest's", async ({ page }) => {
    await page.goto("/map?character=anyone&stops=riften,whiterun&route=Her%20route");
    await expect(page.getByText("Her route")).toHaveCount(0);
    await check(page, "/map?character=anyone&stops=riften,whiterun");
  });
});

/* ---------- The door ---------- */

const PLAYTHROUGH_TOOLS = [
  "create_playthrough", "get_playthrough", "list_my_playthroughs", "set_playthrough", "finish_draft_playthrough", "add_act", "set_act", "move_act", "remove_act", "add_objective",
  "set_objective", "move_objective", "remove_objective", "suggest_objective", "set_status", "set_snapshot", "set_theme", "get_quest_log",
];
/** The tools that read quests and places: an objective or a chapter in them is the game's. */
const QUEST_TOOLS = /^(get_quest|get_quest_start|suggest_quests|suggest_places|search_facts|get_person|report_quest)$/;

async function rpc(request: APIRequestContext, method: string, params: object = {}) {
  const res = await request.post("/api/mcp", {
    headers: { "content-type": "application/json", accept: "application/json, text/event-stream", "mcp-protocol-version": "2025-06-18", "x-forwarded-for": ip() },
    data: { jsonrpc: "2.0", id: 1, method, params },
  });
  const text = await res.text();
  const data = JSON.parse(text.startsWith("{") ? text : (text.split("\n").find((l) => l.startsWith("data: "))?.slice(6) ?? "{}"));
  return { status: res.status(), data };
}

test("a character is made to Finish without a What next step", async ({ page, context }) => {
  await signIn(context);
  await page.goto("/new");
  await page.getByRole("article").filter({ hasText: "Nord" }).getByText("+15").click();
  await page.getByRole("button", { name: "Next: Birthsign" }).click();
  await page.getByRole("article").filter({ hasText: "The Lord" }).getByRole("button", { name: "Choose" }).click();
  await page.getByRole("button", { name: "Next: Skills" }).click();
  for (const sk of ["Heavy Armor", "Block", "One-Handed"]) await page.getByRole("group", { name: sk }).getByRole("button", { name: "Major" }).click();
  for (const sk of ["Smithing", "Alchemy"]) await page.getByRole("group", { name: sk }).getByRole("button", { name: "Minor" }).click();
  await page.getByRole("button", { name: "Next: Traits" }).click();
  await page.getByLabel("Search 69 traits").fill("standing still");
  await page.getByRole("article").filter({ hasText: "Bulwark" }).getByRole("button", { name: "Choose" }).click();
  await page.getByRole("button", { name: "Next: Deity" }).click();
  await page.getByRole("button", { name: "Next: Mode and start" }).click();
  await page.getByRole("article").filter({ hasText: "Konahrik" }).getByRole("heading", { name: "Konahrik" }).click();
  await page.getByLabel("Out in the Wilderness").check();
  await page.getByLabel("Hold").selectOption("Falkreath");
  await page.getByRole("button", { name: "Next: Details" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Details");
  await page.getByLabel("Name", { exact: true }).fill("Wren Launchday");
  await expect(page.getByRole("button", { name: /What next/ })).toHaveCount(0);
  await expect(page.getByText(/playthrough/i)).toHaveCount(0);
  await page.screenshot({ path: "test-results/wo182-new-finish-1440.png", fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: "test-results/wo182-new-finish-390.png", fullPage: true });
  await page.getByRole("button", { name: "Finish" }).click();
  await page.waitForURL(/\/b\/[23456789abcdefghjkmnpqrstuvwxyz]{10}\/edit/);
});

/** The screens Dave and Bob look at, as a visitor and signed in, at a desktop and a phone width (WO-182 Part 4). */
test.describe("screenshots", () => {
  const WIDTHS = [
    { name: "1440", width: 1440, height: 900 },
    { name: "390", width: 390, height: 844 },
  ];
  test("signed out", async ({ page }) => {
    await page.goto("/quests");
    const quest = await page.locator('main a[href^="/quests/"]').first().getAttribute("href");
    const shots: [string, string][] = [["home", "/"], ["characters", "/characters"], ["kyria", `/b/${KYRIA_BUILD_ID}`], ["quest", quest!]];
    for (const w of WIDTHS) {
      await page.setViewportSize({ width: w.width, height: w.height });
      for (const [name, path] of shots) {
        await page.goto(path);
        await page.waitForTimeout(500);
        await page.screenshot({ path: `test-results/wo182-out-${name}-${w.name}.png`, fullPage: true });
      }
    }
  });
  test("signed in", async ({ page, context }) => {
    await signIn(context);
    await page.goto("/quests");
    const quest = await page.locator('main a[href^="/quests/"]').first().getAttribute("href");
    const shots: [string, string][] = [["home", "/"], ["characters", "/characters"], ["me", "/me"], ["kyria", `/b/${KYRIA_BUILD_ID}`], ["kyria-editor", `/b/${KYRIA_BUILD_ID}/edit`], ["quest", quest!]];
    for (const w of WIDTHS) {
      await page.setViewportSize({ width: w.width, height: w.height });
      for (const [name, path] of shots) {
        await page.goto(path);
        await page.waitForTimeout(500);
        await page.screenshot({ path: `test-results/wo182-in-${name}-${w.name}.png`, fullPage: true });
      }
    }
  });
});

test.describe("a character made only by a run", () => {
  test.beforeAll(addRunMadeCharacter);
  test.afterAll(removeRunMadeCharacter);

  test("is on no list, and its page is not found for a visitor or for its owner", async ({ page, request, context }) => {
    expect((await request.get(`/b/${RUN_MADE_BUILD_ID}`)).status()).toBe(404);
    await page.goto("/characters");
    await expect(page.getByText("Rhea Runmade")).toHaveCount(0);
    await page.goto(`/u/${TEST_USER_HANDLE}`);
    await expect(page.getByText("Rhea Runmade")).toHaveCount(0);
    await signIn(context);
    expect((await page.goto(`/b/${RUN_MADE_BUILD_ID}`))?.status()).toBe(404);
    expect((await page.goto(`/b/${RUN_MADE_BUILD_ID}/edit`))?.status()).toBe(404);
    for (const path of ["/me", "/"]) {
      await page.goto(path);
      await expect(page.getByText("Rhea Runmade")).toHaveCount(0);
    }
    await page.goto("/me");
    // And the count doesn't include it: the page says how many it lists.
    const n = await page.getByRole("main").getByRole("article").count();
    await expect(page.getByText(new RegExp(`^${n} characters?$`))).toBeVisible();
  });
});

test.describe("playthroughs off: the door", () => {
  test("lists no playthrough tool, and no playthrough or act input anywhere", async ({ request }) => {
    const { data } = await rpc(request, "tools/list");
    const tools = data.result.tools as { name: string; title?: string; description?: string; inputSchema?: { properties?: Record<string, { description?: string }> } }[];
    const names = tools.map((t) => t.name);
    for (const n of PLAYTHROUGH_TOOLS) expect(names, n).not.toContain(n);
    // The quest and place suggestions and the build tools stay.
    for (const n of ["suggest_quests", "suggest_places", "get_quest", "set_details", "get_style_guide", "create_build", "list_my_builds"]) expect(names, n).toContain(n);
    for (const t of tools) {
      const props = t.inputSchema?.properties ?? {};
      for (const k of ["playthrough", "act", "answers", "never"]) expect(Object.keys(props), `${t.name} takes ${k}`).not.toContain(k);
      const said = [t.title, t.description, ...Object.entries(props).flatMap(([k, v]) => [k, v.description])].join("\n");
      for (const w of OURS) expect(said, `${t.name} says ${w}`).not.toMatch(w);
      if (!QUEST_TOOLS.test(t.name)) for (const w of ALSO) expect(said, `${t.name} says ${w}`).not.toMatch(w);
    }
  });

  // WO-182 Part 5: suggest_places is a tool that stays, and it still said "a stored act" and "a playthrough and an act".
  test("suggest_places says nothing of acts or playthroughs, in what it lists or in what it answers", async ({ request }) => {
    const { data } = await rpc(request, "tools/list");
    const tools = data.result.tools as { name: string; title?: string; description?: string; inputSchema?: { properties?: Record<string, { description?: string }> } }[];
    for (const t of tools) {
      const props = t.inputSchema?.properties ?? {};
      const said = [t.title, t.description, ...Object.entries(props).flatMap(([k, v]) => [k, v.description])].join("\n");
      // "act" as a word, outside a quest's own name, and "playthrough".
      expect(said, `${t.name} says act`).not.toMatch(/\bacts?\b(?!\s+of\b)/i);
      expect(said, `${t.name} says playthrough`).not.toMatch(/playthrough/i);
    }
    const { data: called } = await rpc(request, "tools/call", { name: "suggest_places", arguments: {} });
    const text = JSON.stringify(called.result ?? called);
    expect(text).toMatch(/Give where/);
    expect(text).not.toMatch(/\bacts?\b|playthrough/i);
  });

  test("answers a playthrough tool as no such tool, and starts no sign-in", async ({ request }) => {
    const { status, data } = await rpc(request, "tools/call", { name: "create_playthrough", arguments: { name: "Anyone" } });
    expect(status).not.toBe(401);
    expect(JSON.stringify(data)).not.toMatch(/sign in/i);
    expect(data.result?.isError ?? !!data.error).toBeTruthy();
  });

  test("the style guide has no Playthroughs or Who she is section, and no rule about acts, objectives, saves or ticking", async ({ request }) => {
    const { data } = await rpc(request, "tools/call", { name: "get_style_guide", arguments: {} });
    // The one line that mentions them says they aren't there (question 41).
    const guide = (data.result.content[0].text as string).split("\n").filter((l) => !/has no playthroughs yet/.test(l)).join("\n");
    expect(guide).toContain("## Before you design");
    expect(guide).toContain("27. Will this character be the Dragonborn?");
    expect(guide).toContain("28. How do they fight");
    expect(guide).not.toMatch(/^## (Playthroughs|Who she is)/m);
    for (const w of [...OURS, /\bacts?\b/i, /objective/i, /\btale\b/i, /\btick/i, /progress tracking/i, /set_theme|set_snapshot|set_status|create_playthrough/]) expect(guide, String(w)).not.toMatch(w);
    // The rules a build cites are still numbered as they were.
    for (const n of [1, 2, 3, 7, 8, 9, 10, 11, 22, 23, 24, 25, 26]) expect(guide, `rule ${n}`).toMatch(new RegExp(`^${n}\\. `, "m"));
  });

  test("a client that asks to write playthroughs is not offered it", async ({ request }) => {
    const meta = await (await request.get("/oauth/metadata/authorization-server")).json();
    expect(meta.scopes_supported).toEqual(["facts", "builds:write"]);
  });
});
