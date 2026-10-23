/**
 * WO-142: through the door, get_rules gives mounts, homes and level 1's rule; set_level 1 refuses skill points;
 * search_facts finds gear by name; suggest_quests finds the Solitude quests; A Lovely Letter is open in Riverwood; and
 * a chapter written with blank lines reads back with its paragraphs and shows them in the reader.
 */
import { expect, test } from "@playwright/test";
import { call, ip, signIn, tokenFor } from "./helpers";
import { SCRATCH_BUILD_ID } from "./seed";

test.describe.configure({ mode: "serial" });

const from = ip();

test("the door: rules, level 1, gear by name, Solitude and a quest open in a place", async ({ page, context, baseURL }) => {
  await signIn(context);
  const token = (await tokenFor(page, context, baseURL!, from)).access_token;
  const go = (name: string, args: object) => call(baseURL!, from, token, name, args);

  const rules = (await go("get_rules", {})).json();
  expect(rules.levelOne).toBe("Level 1 has no skill points to spend; its skills come from the race and the majors.");
  expect(rules.mounts[0]).toMatchObject({ way: "Buy a horse", costGold: 1500 });
  expect(rules.homes.map((h: { name: string }) => h.name)).toEqual(expect.arrayContaining(["Breezehome", "Proudspire Manor", "Severin Manor"]));
  expect(rules.homesNote).toContain("Creation Club");

  // Level 1 takes no points: refused, not saved and dropped.
  const level1 = await go("set_level", { build: SCRATCH_BUILD_ID, level: 1, skillPoints: { "One-Handed": 2 } });
  expect(level1.isError).toBe(true);
  expect(level1.text).toContain("Level 1 has no skill points to spend");

  const gear = (await go("search_facts", { query: "Thieves Guild Cuirass", kinds: ["item"] })).json();
  expect(gear.hits[0]).toMatchObject({ kind: "item", name: "Thieves Guild Cuirass" });

  const solitude = (await go("suggest_quests", { level: 12, where: "Solitude" })).json();
  expect(solitude.suggestions.map((s: { name: string }) => s.name)).toEqual(expect.arrayContaining(["The Bards College", "The Wolf Queen Awakened"]));

  const letter = (await go("get_quest", { name: "A Lovely Letter", level: 5 })).json();
  expect(letter.openForYou.says).toBe("open for you, in Riverwood");
  const running = (await go("get_quest", { name: "Running Wild", level: 5 })).json();
  expect(running.openForYou.says).toBe("open for you");
});

test("a chapter written with blank lines keeps its paragraphs, through the door and in the reader", async ({ page, context, baseURL }) => {
  await signIn(context);
  const token = (await tokenFor(page, context, baseURL!, from)).access_token;
  const go = (name: string, args: object) => call(baseURL!, from, token, name, args);

  const pid = (await go("create_playthrough", { name: "E2E Paragraphs" })).json().playthrough;
  const text = "She came down the road at dusk.\n\nThe inn was shut.\nA light burned upstairs.\n\nShe knocked twice.";
  const wrote = await go("write_chapter", { playthrough: pid, title: "At dusk", text });
  expect(wrote.isError, wrote.text).toBe(false);
  const read = (await go("get_playthrough", { playthrough: pid })).json();
  expect(read.chapters[0].text).toBe(text);
  const id = read.chapters[0].chapter;
  // What it gives back goes in again unchanged.
  expect((await go("set_chapter", { playthrough: pid, chapter: id, text: read.chapters[0].text })).isError).toBe(false);
  expect((await go("get_playthrough", { playthrough: pid })).json().chapters[0].text).toBe(text);

  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`/p/${pid}/story/${id}`);
    const reader = page.getByRole("region", { name: /^Reading: / });
    await expect(reader.getByText("She came down the road at dusk.")).toBeVisible();
    const paras = reader.locator("p", { hasText: /dusk|inn was shut|knocked/ });
    await expect(paras).toHaveCount(3);
    await page.screenshot({ path: `test-results/wo142-chapter-${width}.png`, fullPage: true });
  }
});
