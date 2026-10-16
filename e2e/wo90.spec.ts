/**
 * WO-90: an admin exports a build and imports it as a new one; the sample build carries an Example
 * tag on its page and its card.
 */
import { expect, test } from "@playwright/test";
import { signIn } from "./helpers";
import { AZREM_BUILD_ID, IRIEL_BUILD_ID, PURE_MAGE_BUILD_ID, deleteBuild } from "./seed";

const TIP = "A sample to show what a build page can look like, not a tested guide.";

test("a player who isn't an admin sees neither Export nor Import a build", async ({ page, context }) => {
  await signIn(context, "other");
  // Their own build: no Export anywhere, the More menu included when there is one.
  await page.goto(`/b/${IRIEL_BUILD_ID}`);
  await expect(page.getByRole("region", { name: "Build" }).getByRole("heading", { level: 1 })).toBeVisible();
  const more = page.getByRole("region", { name: "Build" }).getByRole("button", { name: "More" });
  if (await more.count()) await more.click();
  await expect(page.getByText("Export", { exact: true })).toHaveCount(0);
  expect((await page.request.get(`/api/builds/${IRIEL_BUILD_ID}/export`)).status()).toBe(403);
  const admin = await page.goto("/admin");
  expect(admin?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Import a build" })).toHaveCount(0);
});

test("an admin exports a build and imports it as a second one with the same levels and notes", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/b/${PURE_MAGE_BUILD_ID}`);
  await page.getByRole("region", { name: "Build" }).getByRole("button", { name: "More" }).click();
  const item = page.getByRole("menuitem", { name: /Export/ });
  await expect(item).toHaveAttribute("href", `/api/builds/${PURE_MAGE_BUILD_ID}/export`);
  const download = page.waitForEvent("download");
  await item.click();
  const file = await download;
  expect(file.suggestedFilename()).toMatch(/\.lorerim-build\.json$/);
  const text = await (await page.request.get(`/api/builds/${PURE_MAGE_BUILD_ID}/export`)).text();
  const exported = JSON.parse(text);
  expect(exported.format).toBe(1);
  expect(exported).not.toHaveProperty("ownerId");
  expect(exported).not.toHaveProperty("likeCount");

  await page.goto("/admin");
  const section = page.getByRole("region", { name: "Import a build" });
  await section.getByLabel("Build file").setInputFiles({ name: file.suggestedFilename(), mimeType: "application/json", buffer: Buffer.from(text) });
  await section.getByRole("button", { name: "Import" }).click();
  await page.waitForURL(/\/b\/[23456789a-z]{10}\?imported=1/);
  const id = new URL(page.url()).pathname.split("/").pop()!;
  try {
    expect(id).not.toBe(PURE_MAGE_BUILD_ID);
    await expect(page.getByRole("status").filter({ hasText: "Imported." })).toContainText(id);
    await expect(page.getByRole("region", { name: "Build" }).getByRole("heading", { level: 1 })).toHaveText(exported.name);
    const copy = JSON.parse(await (await page.request.get(`/api/builds/${id}/export`)).text());
    expect(copy.plan.levels).toEqual(exported.plan.levels);
    expect(copy.plan.notes ?? null).toEqual(exported.plan.notes ?? null);
    expect(copy.tags).toEqual(exported.tags);
    expect(copy.guides).toEqual(exported.guides);
    expect(copy.visibility).toBe(exported.visibility);
  } finally {
    await deleteBuild(id);
  }
});

test("the sample build shows Example with its tooltip on its page and its card; other builds don't", async ({ page }) => {
  await page.goto(`/b/${IRIEL_BUILD_ID}`);
  const hero = page.getByRole("region", { name: "Build" });
  await expect(hero.getByText("Example", { exact: true })).toBeVisible();
  await hero.getByRole("button", { name: "About the Example tag" }).hover();
  await expect(page.getByRole("tooltip")).toHaveText(TIP);

  await page.goto(`/b/${AZREM_BUILD_ID}`);
  await expect(page.getByRole("region", { name: "Build" }).getByText("Example", { exact: true })).toHaveCount(0);

  await page.goto("/");
  const card = page.getByRole("article").filter({ has: page.getByRole("link", { name: /^Iriel/ }) });
  await expect(card.getByText("Example", { exact: true })).toBeVisible();
  await card.getByRole("button", { name: "About the Example tag" }).hover();
  await expect(page.getByRole("tooltip")).toHaveText(TIP);
  await expect(page.getByRole("article").getByText("Example", { exact: true })).toHaveCount(1);
});
