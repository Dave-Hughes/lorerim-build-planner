import fs from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";
import { IRIEL_BUILD_ID } from "./seed";

const file = fs.readFileSync(path.join(process.cwd(), "content", "faq", "gameplay.md"), "utf8");
const SECTIONS = file.match(/^## /gm)!.length;
const QUESTIONS = file.match(/^### /gm)!.length;

test.use({ viewport: { width: 1440, height: 900 } });

test("the FAQ has every section and question in the file, with tables, lists and code", async ({ page }) => {
  await page.goto("/faq");
  await expect(page).toHaveTitle("FAQ | LoreRim Build Planner");
  await expect(page.getByRole("heading", { level: 1, name: "FAQ" })).toBeVisible();
  await expect(page.getByText("For LoreRim 5.0.4.8", { exact: true })).toBeVisible();
  const main = page.getByRole("main");
  expect(SECTIONS).toBe(9);
  expect(QUESTIONS).toBe(44);
  await expect(main.getByRole("heading", { level: 2 })).toHaveCount(SECTIONS);
  await expect(main.getByRole("heading", { level: 3 })).toHaveCount(QUESTIONS);
  await expect(main.locator("table").first()).toBeVisible();
  await expect(main.locator("ol").first()).toBeAttached();
  await expect(main.locator("code").first()).toBeAttached();
  // The structured data: one Question per ###.
  const ld = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!);
  expect(ld["@type"]).toBe("FAQPage");
  expect(ld.mainEntity).toHaveLength(QUESTIONS);
});

test("a question's own link: /faq#id lands on it below the top; Copy puts the full URL on the clipboard", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/faq#why-cant-i-fast-travel");
  const q = page.getByRole("heading", { level: 3, name: "Why can't I fast travel?" });
  await expect(q).toBeInViewport();
  expect((await q.boundingBox())!.y).toBeGreaterThanOrEqual(0);
  await q.hover();
  await q.getByRole("button", { name: /^Copy a link to/ }).click();
  await expect(q).toContainText("Copied");
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toMatch(/^http:\/\/localhost:\d+\/faq#why-cant-i-fast-travel$/);
});

test("the filter keeps only matching questions and hides empty sections; Clear brings all back", async ({ page }) => {
  await page.goto("/faq");
  const main = page.getByRole("main");
  const filter = page.getByPlaceholder("Filter questions");
  await filter.fill("vampire");
  await expect(main.getByRole("heading", { level: 3, name: "Do vampires get thirsty?" })).toBeVisible();
  await expect(main.getByRole("heading", { level: 3, name: "Playing as a vampire" })).toBeVisible();
  const shown = await main.getByRole("heading", { level: 3 }).count();
  expect(shown).toBeLessThan(QUESTIONS);
  for (const h of await main.getByRole("heading", { level: 3 }).all()) {
    const text = (await h.locator("xpath=ancestor::article[1]").textContent())!.toLowerCase();
    expect(text).toContain("vampire");
  }
  await expect(main.getByRole("heading", { level: 2, name: "Starting out" })).toHaveCount(0);
  await filter.fill("zzqqxx");
  await expect(page.getByText('No questions match "zzqqxx".')).toBeVisible();
  await page.getByRole("button", { name: "Clear" }).click();
  await expect(main.getByRole("heading", { level: 3 })).toHaveCount(QUESTIONS);
});

test("the FAQ link is in the footer of every site page", async ({ page }) => {
  for (const url of ["/", `/b/${IRIEL_BUILD_ID}`, "/faq"]) {
    await page.goto(url);
    await expect(page.getByRole("contentinfo").getByRole("link", { name: "FAQ" })).toHaveAttribute("href", "/faq");
  }
});

test.describe("with scripts off", () => {
  test.use({ javaScriptEnabled: false });
  test("the page reads in full", async ({ page }) => {
    await page.goto("/faq");
    await expect(page.getByRole("main").getByRole("heading", { level: 3 })).toHaveCount(QUESTIONS);
    await expect(page.getByRole("main").locator("table").first()).toBeVisible();
  });
});
