import fs from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";
import { IRIEL_BUILD_ID } from "./seed";

const dir = path.join(process.cwd(), "content", "guide");
const files = fs
  .readdirSync(dir)
  .filter((f) => /^\d+-.+\.md$/.test(f))
  .sort();
const count = (text: string, re: RegExp) => text.match(re)?.length ?? 0;
const chapters = files.map((f) => {
  const text = fs.readFileSync(path.join(dir, f), "utf8");
  return {
    slug: f.replace(/^\d+-|\.md$/g, ""),
    title: /^title: (.+)$/m.exec(text)![1],
    sections: count(text, /^## /gm),
    more: count(text, /^:::more/gm),
    mods: count(text, /^:::mods/gm),
    asks: count(text, /^:::ask/gm),
  };
});
const ALL_ASKS = chapters.reduce((n, c) => n + c.asks, 0);

test.use({ viewport: { width: 1440, height: 900 } });

test("the guide lists 11 chapters, and each chapter renders every section, block and question in its file", async ({ page }) => {
  expect(chapters).toHaveLength(11);
  expect(ALL_ASKS).toBe(49);
  await page.goto("/guide");
  await expect(page).toHaveTitle("Guide | LoreRim Planner");
  await expect(page.getByRole("heading", { level: 1, name: "Guide" })).toBeVisible();
  await expect(page.getByText("For LoreRim 5.0.4.8", { exact: true })).toBeVisible();
  await expect(page.getByRole("main").getByRole("heading", { level: 2 })).toHaveCount(11);
  let tables = 0;
  let codes = 0;
  let keys = 0;
  for (const c of chapters) {
    await page.goto(`/guide/${c.slug}`);
    await expect(page).toHaveTitle(`${c.title} | LoreRim Guide`);
    const article = page.locator("article");
    await expect(article.getByRole("heading", { level: 1 })).toHaveText(c.title);
    await expect(article.locator("section > h2")).toHaveCount(c.sections);
    await expect(article.locator("details", { has: page.locator("summary", { hasText: "More detail" }) })).toHaveCount(c.more);
    await expect(article.locator("details", { has: page.locator("summary", { hasText: "Related Mods" }) })).toHaveCount(c.mods);
    await expect(article.locator("details[id]")).toHaveCount(c.asks);
    tables += await article.locator("table").count();
    codes += await article.locator("code").count();
    keys += await article.locator("kbd").count();
  }
  expect(tables).toBeGreaterThan(0);
  expect(codes).toBeGreaterThan(0);
  expect(keys).toBeGreaterThan(0);
});

test("More detail, Related Mods and questions start closed and open with a click or Enter", async ({ page }) => {
  await page.goto("/guide/fighting");
  const stances = page.locator("#stances");
  const mods = stances.locator("details", { has: page.locator("summary", { hasText: "Related Mods" }) });
  await expect(mods).not.toHaveAttribute("open");
  await expect(mods.locator("summary")).toContainText("2 mods");
  await mods.locator("summary").click();
  await expect(mods).toHaveAttribute("open");
  await expect(mods).toContainText("Stances - Dynamic Animation Sets");
  const more = page.locator("#enemies details").first();
  await expect(more).not.toHaveAttribute("open");
  await more.locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(more).toHaveAttribute("open");
  const ask = page.locator("#enemies details[id]").first();
  await expect(ask).not.toHaveAttribute("open");
  await ask.locator("summary").click();
  await expect(ask).toHaveAttribute("open");
});

test.describe("without scripts", () => {
  test.use({ javaScriptEnabled: false });
  test("a chapter reads in full", async ({ page }) => {
    await page.goto("/guide/fighting");
    await expect(page.locator("article section > h2")).toHaveCount(chapters.find((c) => c.slug === "fighting")!.sections);
    await expect(page.locator("#stances table")).toBeVisible();
    await expect(page.locator("details").first()).toBeAttached();
  });
});

test("links to a section or a question land below the header, the question open", async ({ page }) => {
  await page.goto("/guide/fighting#stances");
  const top = await page.locator("#stances").evaluate((el) => el.getBoundingClientRect().top);
  expect(top).toBeGreaterThanOrEqual(0);
  expect(top).toBeLessThan(120);
  await page.goto("/guide/questions#why-cant-i-fast-travel");
  // The FAQ's id for it; the guide's question is "I learned Apparition. Why can't I fast travel?".
  const q = page.locator("#i-learned-apparition-why-cant-i-fast-travel");
  await expect(q).toHaveAttribute("open");
  await expect(q).toBeInViewport();
});

test("All questions: the filter keeps matching questions and hides empty groups; Clear brings all 49 back", async ({ page }) => {
  await page.goto("/guide/questions");
  await expect(page).toHaveTitle("All questions | LoreRim Planner");
  const visible = page.locator("details[id]:visible");
  await expect(visible).toHaveCount(ALL_ASKS);
  await page.getByPlaceholder("Filter questions").fill("vampire");
  const n = await visible.count();
  expect(n).toBeGreaterThan(0);
  expect(n).toBeLessThan(ALL_ASKS);
  for (const s of await visible.allTextContents()) expect(s.length).toBeGreaterThan(0);
  await expect(page.locator("section[hidden]").first()).toBeAttached();
  await page.getByPlaceholder("Filter questions").fill("zzzz nothing");
  await expect(page.getByRole("status")).toContainText('No questions match "zzzz nothing".');
  await page.getByRole("button", { name: "Clear" }).click();
  await expect(visible).toHaveCount(ALL_ASKS);
  // The structured data: one Question per :::ask.
  const ld = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!);
  expect(ld["@type"]).toBe("FAQPage");
  expect(ld.mainEntity).toHaveLength(ALL_ASKS);
});

test("/faq redirects to All questions with a 308", async ({ request, page }) => {
  const r = await request.get("/faq", { maxRedirects: 0 });
  expect(r.status()).toBe(308);
  expect(r.headers().location).toBe("/guide/questions");
  await page.goto("/faq#anything");
  await expect(page).toHaveURL(/\/guide\/questions/);
});

test("Which mod runs what lists every mod named in the chapters, linked to its sections", async ({ page }) => {
  const names = new Set<string>();
  for (const f of files) for (const m of fs.readFileSync(path.join(dir, f), "utf8").matchAll(/^- \*\*(.+?)\*\*:/gm)) names.add(m[1]);
  await page.goto("/guide/mods");
  const entries = page.locator("main dl > div");
  await expect(entries).toHaveCount(names.size);
  const stances = entries.filter({ has: page.locator("dt", { hasText: /^Stances - Dynamic Animation Sets$/ }) });
  await stances.getByRole("link", { name: "Fighting: Stances" }).click();
  await expect(page).toHaveURL(/\/guide\/fighting#stances$/);
});

test("the header's Builds and Guide links and the footer's Guide link are on every site page", async ({ page }) => {
  for (const url of ["/", "/guide", "/guide/magic", `/b/${IRIEL_BUILD_ID}`]) {
    await page.goto(url);
    const nav = page.getByRole("navigation", { name: "Site" });
    await expect(nav.getByRole("link", { name: "Characters" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Guide" })).toBeVisible();
    await expect(page.getByRole("contentinfo").getByRole("link", { name: "Guide" })).toBeVisible();
  }
  await page.goto("/guide/magic");
  await expect(page.getByRole("navigation", { name: "Site" }).getByRole("link", { name: "Guide" })).toHaveAttribute("aria-current", "page");
});
