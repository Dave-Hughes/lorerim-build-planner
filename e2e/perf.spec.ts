/**
 * WO-71: the editor stays fast on a long build. Opens Sevari (100 levels, skipping ahead from 5;
 * src/lib/rules/__fixtures__/sevari.json) with the CPU slowed 4× as a mid-range laptop, and reads
 * the browser's Event Timing for each step: the time from the input to the next paint. Prints the
 * worst for each step and fails above the order's targets.
 */
import { expect, test, type Locator, type Page } from "@playwright/test";
import { signIn } from "./helpers";
import { SEVARI_BUILD_ID } from "./seed";

test.use({ viewport: { width: 1440, height: 1000 } });

/** The order's targets, in ms (WO-71 point 4). */
const CLICK = 200;
const KEYSTROKE = 50;
const NAV = 100;
const SLOWDOWN = 4;

declare global {
  interface Window {
    __events: { name: string; duration: number; id: number }[];
  }
}

/** Collects every Event Timing entry from the page's first script on. */
async function observe(page: Page) {
  await page.addInitScript(() => {
    window.__events = [];
    new PerformanceObserver((list) => {
      for (const e of list.getEntries() as (PerformanceEventTiming & { interactionId?: number })[]) window.__events.push({ name: e.name, duration: e.duration, id: e.interactionId ?? 0 });
    }).observe({ type: "event", buffered: true, durationThreshold: 16 } as PerformanceObserverInit);
  });
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: SLOWDOWN });
}

/**
 * The worst Event Timing duration while `run` runs (entries arrive after the paint, so it waits for
 * them). `hover` is moved over first and left to settle: a real pointer reaches a button frames
 * before it clicks, while Playwright's click moves, presses and releases within one frame.
 */
async function worst(page: Page, run: () => Promise<void>, hover?: Locator): Promise<number> {
  if (hover) {
    await hover.hover();
    await page.waitForTimeout(300);
  }
  await page.evaluate(() => (window.__events = []));
  await run();
  await page.waitForTimeout(800);
  return page.evaluate(() => window.__events.reduce((m, e) => Math.max(m, e.duration), 0));
}

const results: [string, number, number][] = [];
function record(step: string, ms: number, target: number) {
  results.push([step, ms, target]);
  console.log(`${step.padEnd(34)} worst ${String(Math.round(ms)).padStart(5)} ms  (target under ${target})`);
}

test.afterAll(() => {
  const over = results.filter(([, ms, target]) => ms >= target);
  if (over.length) console.log(`Over target: ${over.map(([s]) => s).join(", ")}`);
});

test("WO-71: the editor on a 100-level build answers within the targets", async ({ page, context }) => {
  test.setTimeout(240_000);
  await signIn(context);
  await observe(page);
  await page.goto(`/b/${SEVARI_BUILD_ID}/edit?level=100`);
  const levelBar = page.getByRole("region", { name: "Level", exact: true });
  await expect(levelBar).toContainText("Levels 76 to");
  // Let the page settle (fonts, the items index, the guide editor) before measuring.
  await page.waitForTimeout(1500);

  // A skill + on levels 76 to 100: three raises of a skill that can still rise.
  const raise = page.getByRole("button", { name: "Raise Marksman" });
  let skill = 0;
  for (let i = 0; i < 3; i++) skill = Math.max(skill, await worst(page, () => raise.click(), raise));
  record("Skill + (levels 76 to 100)", skill, CLICK);

  // A perk star and Confirm, in One-Handed (the tree the editor opens on).
  const star = page.locator('[data-perk="One-Handed:Powerful Strike"]');
  const starMs = await worst(page, () => star.click(), star);
  const card = page.getByRole("complementary", { name: "Perk details" }).first();
  await expect(card.getByRole("button", { name: "Confirm" })).toBeVisible();
  const confirm = card.getByRole("button", { name: "Confirm" });
  const confirmMs = await worst(page, () => confirm.click(), confirm);
  await expect(page.getByRole("status").filter({ hasText: "Powerful Strike" })).toBeVisible();
  record("Perk star click", starMs, CLICK);
  record("Perk Confirm", confirmMs, CLICK);

  // 20 characters in the level's notes.
  const notes = page.getByRole("region", { name: "Notes for levels 76 to 100" }).locator("[contenteditable=true]");
  await notes.click();
  await page.keyboard.press("ControlOrMeta+End");
  const notesMs = await worst(page, () => page.keyboard.type(" Twenty characters!!", { delay: 60 }));
  record("Typing in the level notes", notesMs, KEYSTROKE);

  // 10 characters in the gear search.
  const gear = page.getByRole("region", { name: "Gear" });
  await gear.getByRole("button", { name: "Add gear" }).click();
  const item = gear.getByRole("combobox", { name: "Item" });
  await item.click();
  const searchMs = await worst(page, () => page.keyboard.type("Ebony dagg", { delay: 60 }));
  record("Typing in the gear search", searchMs, KEYSTROKE);
  await page.keyboard.press("Escape");
  await page.keyboard.press("Escape");

  // ‹ › on the editor's level nav.
  let editorNav = 0;
  for (const name of ["Previous level", "Previous level", "Next level", "Next level"]) {
    const button = levelBar.getByRole("button", { name, exact: true });
    editorNav = Math.max(editorNav, await worst(page, () => button.click(), button));
  }
  record("Level nav, editor", editorNav, NAV);

  // ‹ › on the build page.
  await page.goto(`/b/${SEVARI_BUILD_ID}?level=50`);
  await page.waitForTimeout(1500);
  let viewNav = 0;
  for (const name of ["Previous level (←)", "Previous level (←)", "Next level (→)", "Next level (→)"]) {
    const button = page.getByRole("button", { name }).first();
    viewNav = Math.max(viewNav, await worst(page, () => button.click(), button));
  }
  record("Level nav, build page", viewNav, NAV);

  for (const [step, ms, target] of results) expect.soft(ms, `${step}: ${Math.round(ms)} ms`).toBeLessThan(target);
});
